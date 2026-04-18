// Stock-Monitor für blechziegel.de
//
// Prüft alle aktiven Produktvarianten auf Lagerbestand < STOCK_THRESHOLD
// und benachrichtigt per E-Mail (SMTP) + Telegram (Bot API).
//
// Nutzung:
//   cd c:/Users/Administrator/blechziegel-theme/scripts/stock-monitor
//   node index.mjs                 # echter Run — holt Produkte, alarmiert bei Unterschreitung
//   node index.mjs --dry-run       # listet betroffene Varianten in STDOUT, sendet nichts
//   node index.mjs --test          # sendet Dummy-Alert an beide Kanäle (kein Shopify-Call)
//
// Credentials:
//   Lokal:         c:/Users/Administrator/blechziegel-admin-tools/.env
//   GitHub Actions: environment variables (siehe README.md)
//
// Exit-Codes:
//   0 = OK (auch wenn Alerts gesendet wurden)
//   1 = Konfigurations-/Netzwerkfehler

import fs from 'node:fs';
// nodemailer wird dynamisch importiert (siehe sendEmail), damit Dry-Run/Test ohne async-Handles sauber exitet

const args = new Set(process.argv.slice(2));
const DRY = args.has('--dry-run');
const TEST = args.has('--test');

// Env-Loading: zuerst process.env (GitHub Actions), dann .env-File (lokal)
const ENV_PATH = 'c:/Users/Administrator/blechziegel-admin-tools/.env';
const fileEnv = fs.existsSync(ENV_PATH)
  ? Object.fromEntries(fs.readFileSync(ENV_PATH, 'utf8')
      .split('\n').filter(l => l && !l.startsWith('#'))
      .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }))
  : {};
const env = (k, def = '') => process.env[k] ?? fileEnv[k] ?? def;

const SHOP = env('SHOP_DOMAIN', 'blechziegel-de.myshopify.com');
const TOK = env('SHOPIFY_ADMIN_TOKEN');
const VER = '2025-01';
const BASE = `https://${SHOP}/admin/api/${VER}`;
const THRESHOLD = parseInt(env('STOCK_THRESHOLD', '20'), 10);

const EMAIL_FROM = env('ALERT_EMAIL_FROM');
const EMAIL_TO = env('ALERT_EMAIL_TO');
const SMTP_HOST = env('ALERT_SMTP_HOST');
const SMTP_PORT = parseInt(env('ALERT_SMTP_PORT', '587'), 10);
const SMTP_USER = env('ALERT_SMTP_USER');
const SMTP_PASS = env('ALERT_SMTP_PASS');
const SMTP_SECURE = env('ALERT_SMTP_SECURE', 'false') === 'true';

const TG_TOKEN = env('TELEGRAM_BOT_TOKEN');
const TG_CHAT = env('TELEGRAM_CHAT_ID');

// Optional: fix gesetzte Location-ID; wenn leer, wird beim Run auto-detected
const LOCATION_ID_ENV = env('STOCK_LOCATION_ID', '').trim();

// Dedupe-Fenster: eine Variante, die einmal alarmiert wurde, wird erst wieder gemeldet,
// wenn REALERT_HOURS vergangen sind. Default 24h. Override via STOCK_REALERT_HOURS.
const REALERT_HOURS = parseFloat(env('STOCK_REALERT_HOURS', '24'));
const REALERT_MS = Math.round(REALERT_HOURS * 3600 * 1000);
const STATE_PATH = new URL('./state.json', import.meta.url);

// Tageszeit-Fenster: außerhalb dieses Fensters wird erkannt, aber NICHT gesendet
// und der State NICHT aktualisiert. So werden Alerts, die über Nacht entstehen,
// erst am nächsten Morgen gebündelt verschickt. Zeitzone default Europe/Berlin.
const ALERT_START_HOUR = parseInt(env('STOCK_ALERT_START_HOUR', '8'), 10);
const ALERT_END_HOUR = parseInt(env('STOCK_ALERT_END_HOUR', '17'), 10);
const ALERT_TZ = env('STOCK_ALERT_TZ', 'Europe/Berlin');

function currentHourInTz(tz) {
  const parts = new Intl.DateTimeFormat('de-DE', { timeZone: tz, hour: '2-digit', hour12: false }).formatToParts(new Date());
  return parseInt(parts.find(p => p.type === 'hour').value, 10);
}

function isWithinAlertWindow() {
  const h = currentHourInTz(ALERT_TZ);
  return h >= ALERT_START_HOUR && h <= ALERT_END_HOUR;
}

const log = (...a) => console.log(...a);
const err = (...a) => console.error(...a);

function preflight() {
  const problems = [];
  // Shopify-Token nur für echte Runs (inkl. Dry-Run) Pflicht, nicht für --test
  if (!TEST && !TOK) problems.push('SHOPIFY_ADMIN_TOKEN fehlt');
  // Für --test bleiben fehlende Notifier-Kanäle weich — der einzelne Send überspringt dann mit Hinweis.
  // Nur beim echten Run müssen beide Kanäle vollständig konfiguriert sein.
  if (!TEST && !DRY) {
    if (!EMAIL_FROM || !EMAIL_TO || !SMTP_HOST || !SMTP_USER || !SMTP_PASS)
      problems.push('E-Mail-Konfiguration unvollständig (ALERT_EMAIL_FROM, ALERT_EMAIL_TO, ALERT_SMTP_HOST, ALERT_SMTP_USER, ALERT_SMTP_PASS)');
    if (!TG_TOKEN || !TG_CHAT)
      problems.push('Telegram-Konfiguration unvollständig (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID)');
  }
  return problems;
}

async function fetchLowStockVariants() {
  let url = `${BASE}/products.json?limit=250&status=active&fields=id,title,handle,status,variants`;
  const low = [];
  let pageCount = 0;
  const maxPages = 50; // Safety: 50 * 250 = 12500 Produkte

  while (url && pageCount < maxPages) {
    pageCount++;
    const r = await fetch(url, { headers: { 'X-Shopify-Access-Token': TOK, 'Accept': 'application/json' } });
    if (!r.ok) throw new Error(`Shopify ${r.status}: ${(await r.text()).slice(0, 300)}`);
    const j = await r.json();
    for (const p of j.products || []) {
      for (const v of p.variants || []) {
        if (v.inventory_management !== 'shopify') continue; // ungetrackte Varianten überspringen
        if (typeof v.inventory_quantity !== 'number') continue;
        if (v.inventory_quantity >= THRESHOLD) continue;
        low.push({
          product_id: p.id,
          product_title: p.title,
          product_handle: p.handle,
          variant_id: v.id,
          variant_title: v.title,
          sku: v.sku || '',
          qty: v.inventory_quantity,
          inventory_item_id: v.inventory_item_id,
        });
      }
    }
    // Link-Header-Pagination: `Link: <...>; rel="next"`
    const link = r.headers.get('link') || '';
    const nextMatch = link.match(/<([^>]+)>;\s*rel="next"/);
    url = nextMatch ? nextMatch[1] : null;
  }

  return { low, pageCount };
}

function adminLink(productId, variantId) {
  const shopSlug = SHOP.replace(/\.myshopify\.com$/, '');
  return `https://admin.shopify.com/store/${shopSlug}/products/${productId}/variants/${variantId}`;
}

function loadState() {
  try {
    if (!fs.existsSync(STATE_PATH)) return { version: 1, updated_at: null, variants: {} };
    const j = JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
    return { version: j.version || 1, updated_at: j.updated_at || null, variants: j.variants || {} };
  } catch (e) {
    err('State-File unleserlich, starte bei Null:', e.message);
    return { version: 1, updated_at: null, variants: {} };
  }
}

function saveState(variants) {
  const payload = { version: 1, updated_at: new Date().toISOString(), variants };
  fs.writeFileSync(STATE_PATH, JSON.stringify(payload, null, 2));
}

// Filtert aktuell niedrige Varianten gegen State:
//   toAlert  = Varianten, die NEU oder außerhalb des REALERT-Fensters sind → werden gesendet
//   cooldown = Varianten, die wir erst kürzlich gemeldet haben → unterdrückt
// Gibt zusätzlich die neue State-Map zurück (nur noch aktuell niedrige Varianten, Recovery wird so auto-bereinigt).
function partitionByState(low, state, nowMs) {
  const toAlert = [];
  const cooldown = [];
  const nextVariants = {};
  const nowIso = new Date(nowMs).toISOString();
  for (const v of low) {
    const key = String(v.variant_id);
    const prev = state.variants[key];
    const prevMs = prev ? new Date(prev.last_alerted_at).getTime() : 0;
    const dueForReAlert = !prev || (nowMs - prevMs) >= REALERT_MS;
    if (dueForReAlert) {
      toAlert.push({ ...v, isReminder: !!prev, firstSeenQty: prev?.first_seen_qty ?? v.qty });
      nextVariants[key] = {
        last_alerted_at: nowIso,
        last_qty: v.qty,
        first_seen_at: prev?.first_seen_at || nowIso,
        first_seen_qty: prev?.first_seen_qty ?? v.qty,
      };
    } else {
      cooldown.push(v);
      nextVariants[key] = prev; // beibehalten, Timer läuft weiter
    }
  }
  return { toAlert, cooldown, nextVariants };
}

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function buildTelegramHtml(items, runTs) {
  const newCount = items.filter(v => !v.isReminder).length;
  const remindCount = items.length - newCount;
  const headParts = [];
  if (newCount) headParts.push(`<b>${newCount} neu</b>`);
  if (remindCount) headParts.push(`<b>${remindCount} Erinnerung${remindCount === 1 ? '' : 'en'} (${REALERT_HOURS}h+)</b>`);
  const header = `⚠️ <b>Stock Alert blechziegel.de</b>\n${headParts.join(' · ')} — Schwelle ${THRESHOLD}:\n`;
  const lines = items.slice(0, 40).map(v => {
    const sku = v.sku ? ` <code>(SKU: ${esc(v.sku)})</code>` : '';
    const vt = v.variant_title && v.variant_title !== 'Default Title' ? ` — ${esc(v.variant_title)}` : '';
    const icon = v.isReminder ? '🔁' : '🆕';
    return `${icon} <a href="${adminLink(v.product_id, v.variant_id)}">${esc(v.product_title)}</a>${vt}${sku} — <b>${v.qty}</b> verbleibend`;
  });
  const more = items.length > 40 ? `\n<i>… und ${items.length - 40} weitere (gekürzt).</i>` : '';
  return `${header}\n${lines.join('\n')}${more}\n\n<i>Run: ${runTs}</i>`;
}

function buildEmailHtml(items, runTs) {
  const newCount = items.filter(v => !v.isReminder).length;
  const remindCount = items.length - newCount;
  const rows = items.map(v => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center" title="${v.isReminder ? 'Erinnerung (seit ' + REALERT_HOURS + 'h+ nicht korrigiert)' : 'Neue Unterschreitung'}">${v.isReminder ? '🔁' : '🆕'}</td>
      <td style="padding:8px;border-bottom:1px solid #eee"><a href="${adminLink(v.product_id, v.variant_id)}" style="color:#0c6;text-decoration:none">${esc(v.product_title)}</a></td>
      <td style="padding:8px;border-bottom:1px solid #eee">${esc(v.variant_title && v.variant_title !== 'Default Title' ? v.variant_title : '—')}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;font-family:monospace">${esc(v.sku || '—')}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;font-weight:bold;color:${v.qty <= 0 ? '#c00' : v.qty < 10 ? '#e90' : '#666'}">${v.qty}</td>
    </tr>`).join('');
  const headline = [
    newCount ? `<b>${newCount} neu</b>` : '',
    remindCount ? `<b>${remindCount} Erinnerung${remindCount === 1 ? '' : 'en'}</b> (seit ${REALERT_HOURS}h+ nicht korrigiert)` : '',
  ].filter(Boolean).join(' · ');
  return `<!doctype html><html><body style="font-family:-apple-system,Segoe UI,Arial,sans-serif;background:#f6f6f6;margin:0;padding:24px">
    <div style="max-width:760px;margin:0 auto;background:#fff;padding:24px;border-radius:8px">
      <h2 style="margin:0 0 8px">⚠️ Stock Alert blechziegel.de</h2>
      <p style="color:#666;margin:0 0 16px">${headline} · Schwelle ${THRESHOLD} · Run: ${runTs}</p>
      <table style="width:100%;border-collapse:collapse">
        <thead><tr style="background:#fafafa;text-align:left">
          <th style="padding:8px;border-bottom:2px solid #ddd;width:32px"></th>
          <th style="padding:8px;border-bottom:2px solid #ddd">Produkt</th>
          <th style="padding:8px;border-bottom:2px solid #ddd">Variante</th>
          <th style="padding:8px;border-bottom:2px solid #ddd">SKU</th>
          <th style="padding:8px;border-bottom:2px solid #ddd;text-align:right">Bestand</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="color:#999;font-size:12px;margin-top:24px">Stock-Monitor · 🆕 = neu erkannt · 🔁 = Erinnerung, da seit ${REALERT_HOURS}h+ unter Schwelle · <a href="https://admin.shopify.com/store/${SHOP.replace(/\.myshopify\.com$/, '')}/products">Shopify Admin</a></p>
    </div></body></html>`;
}

async function tgSend(method, payload) {
  const r = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await r.text();
  if (!r.ok) throw new Error(`Telegram ${method} ${r.status}: ${body.slice(0, 300)}`);
  return JSON.parse(body);
}

async function sendTelegram(html, reply_markup) {
  const payload = { chat_id: TG_CHAT, text: html, parse_mode: 'HTML', disable_web_page_preview: true };
  if (reply_markup) payload.reply_markup = reply_markup;
  return tgSend('sendMessage', payload);
}

async function getPrimaryLocationId() {
  if (LOCATION_ID_ENV) return parseInt(LOCATION_ID_ENV, 10);
  const r = await fetch(`${BASE}/locations.json`, { headers: { 'X-Shopify-Access-Token': TOK, 'Accept': 'application/json' } });
  if (!r.ok) throw new Error(`Locations ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const j = await r.json();
  const loc = (j.locations || []).find(x => x.active && x.primary) || (j.locations || []).find(x => x.active) || j.locations?.[0];
  if (!loc) throw new Error('Keine Shopify-Location gefunden');
  return loc.id;
}

// Kompakte Aktionsnachricht pro Variante mit Button "Menge anpassen".
// callback_data bleibt unter 64 Byte: "a|<variantId>|<invItemId>|<locId>"
function buildActionMessage(v, locationId) {
  const cb = `a|${v.variant_id}|${v.inventory_item_id}|${locationId}`;
  if (cb.length > 64) throw new Error('callback_data zu lang: ' + cb.length);
  const skuPart = v.sku ? ` <code>(${esc(v.sku)})</code>` : '';
  const vt = v.variant_title && v.variant_title !== 'Default Title' ? ` — ${esc(v.variant_title)}` : '';
  const icon = v.isReminder ? '🔁' : '🆕';
  const text = `${icon} <a href="${adminLink(v.product_id, v.variant_id)}">${esc(v.product_title)}</a>${vt}${skuPart}\nAktuell <b>${v.qty}</b> Stück (Schwelle ${THRESHOLD})`;
  const reply_markup = {
    inline_keyboard: [[
      { text: '📦 Menge anpassen', callback_data: cb },
    ]],
  };
  return { text, reply_markup };
}

async function sendEmail(subject, html) {
  const { default: nodemailer } = await import('nodemailer');
  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  try {
    return await transport.sendMail({ from: EMAIL_FROM, to: EMAIL_TO, subject, html });
  } finally {
    transport.close();
  }
}

// ─── main ─────────────────────────────────────────────────────
async function main() {
  const problems = preflight();
  if (problems.length) {
    err('Konfigurations-Probleme:');
    problems.forEach(p => err('  -', p));
    process.exitCode = 1;
    return;
  }

  log(`Stock-Monitor · SHOP=${SHOP} · THRESHOLD=${THRESHOLD} · DRY=${DRY} · TEST=${TEST}`);

  const runTs = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';

  if (TEST) {
    const dummy = [
      { product_id: 1, product_title: '[TEST] Demo-Ziegel', product_handle: 'demo',
        variant_id: 1, variant_title: 'Rot', sku: 'TEST-R', qty: 3, isReminder: false },
      { product_id: 2, product_title: '[TEST] Demo-Ziegel', product_handle: 'demo',
        variant_id: 2, variant_title: 'Blau', sku: 'TEST-B', qty: 7, isReminder: true },
    ];
    log('TEST-Modus: sende Dummy-Alert an konfigurierte Kanäle...');
    if (TG_TOKEN && TG_CHAT) {
      try {
        await sendTelegram(buildTelegramHtml(dummy, runTs));
        log('✓ Telegram gesendet');
      } catch (e) { err('✗ Telegram:', e.message); }
    } else {
      log('- Telegram übersprungen (nicht konfiguriert)');
    }
    if (EMAIL_FROM && EMAIL_TO && SMTP_HOST && SMTP_USER && SMTP_PASS) {
      try {
        await sendEmail('[TEST] Stock Alert blechziegel.de', buildEmailHtml(dummy, runTs));
        log('✓ E-Mail gesendet');
      } catch (e) { err('✗ E-Mail:', e.message); }
    } else {
      log('- E-Mail übersprungen (nicht konfiguriert)');
    }
    return;
  }

  try {
    const { low, pageCount } = await fetchLowStockVariants();
    log(`Geprüft: ${pageCount} Seiten · Varianten unter ${THRESHOLD}: ${low.length}`);

    if (low.length === 0) {
      log('✓ Alle getrackten Varianten ≥', THRESHOLD);
      // Recovery: leeren State persistieren (alle Varianten wieder OK)
      if (!DRY) saveState({});
      return;
    }

    // Sortieren: kritisch zuerst
    low.sort((a, b) => a.qty - b.qty);

    // State anwenden: NEU/fällig vs. im 24h-Cooldown (noch nicht korrigiert, aber schon gemeldet)
    const state = loadState();
    const { toAlert, cooldown, nextVariants } = partitionByState(low, state, Date.now());
    log(`  davon zu alarmieren: ${toAlert.length} · im ${REALERT_HOURS}h-Cooldown: ${cooldown.length}`);

    // Tageszeit-Fenster prüfen. Außerhalb → detektieren, aber nicht senden und State nicht ändern.
    const inWindow = isWithinAlertWindow();
    const hourNow = currentHourInTz(ALERT_TZ);
    if (!inWindow && !DRY) {
      log(`⏸ Außerhalb Alert-Fenster ${ALERT_START_HOUR}-${ALERT_END_HOUR} Uhr (${ALERT_TZ}, aktuell ${hourNow}h). Keine Benachrichtigung, State unverändert.`);
      return;
    }

    if (DRY) {
      log(`\nDRY-RUN — keine Benachrichtigung wird gesendet, State wird NICHT aktualisiert.  Fenster ${ALERT_START_HOUR}-${ALERT_END_HOUR} (${ALERT_TZ}): ${inWindow ? 'AKTIV' : 'INAKTIV (aktuell ' + hourNow + 'h)'}\n`);
      for (const v of toAlert.slice(0, 50)) {
        const tag = v.isReminder ? '🔁' : '🆕';
        log(`  ${tag} ${String(v.qty).padStart(4)}  ${v.product_title}${v.variant_title && v.variant_title !== 'Default Title' ? ' / ' + v.variant_title : ''}${v.sku ? '  (' + v.sku + ')' : ''}`);
      }
      if (toAlert.length > 50) log(`  … und ${toAlert.length - 50} weitere`);
      if (cooldown.length) log(`\n  (${cooldown.length} weitere sind unter Schwelle, aber noch im Cooldown-Fenster.)`);
      return;
    }

    if (toAlert.length === 0) {
      log('✓ Keine neuen oder fälligen Alerts — alle niedrigen Varianten wurden bereits innerhalb der letzten', REALERT_HOURS, 'h gemeldet.');
      saveState(nextVariants); // Timer weiterlaufen lassen, keine Änderung an Entries
      return;
    }

    const newCount = toAlert.filter(v => !v.isReminder).length;
    const remindCount = toAlert.length - newCount;
    const subjectBits = [];
    if (newCount) subjectBits.push(`${newCount} neu`);
    if (remindCount) subjectBits.push(`${remindCount} Erinnerung${remindCount === 1 ? '' : 'en'}`);
    const subject = `⚠️ Stock Alert blechziegel.de — ${subjectBits.join(', ')} unter ${THRESHOLD}`;

    // Location einmal holen (für die Action-Buttons)
    let locationId = null;
    try { locationId = await getPrimaryLocationId(); }
    catch (e) { err('Location-Ermittlung fehlgeschlagen (Action-Buttons werden ausgelassen):', e.message); }

    // 1) Summary an Telegram + 2) E-Mail parallel
    const results = await Promise.allSettled([
      sendTelegram(buildTelegramHtml(toAlert, runTs)),
      sendEmail(subject, buildEmailHtml(toAlert, runTs)),
    ]);
    const [tg, mail] = results;
    if (tg.status === 'fulfilled') log('✓ Telegram-Summary gesendet'); else err('✗ Telegram:', tg.reason?.message);
    if (mail.status === 'fulfilled') log('✓ E-Mail gesendet'); else err('✗ E-Mail:', mail.reason?.message);

    // 3) Pro-Varianten-Aktionsnachricht mit "Menge anpassen"-Button
    if (tg.status === 'fulfilled' && locationId) {
      let okCount = 0, failCount = 0;
      for (const v of toAlert) {
        try {
          const { text, reply_markup } = buildActionMessage(v, locationId);
          await sendTelegram(text, reply_markup);
          okCount++;
          await new Promise(r => setTimeout(r, 120)); // Rate-Limit Puffer (< 20 msg/min in groups)
        } catch (e) {
          err(`✗ Action-Nachricht für Variante ${v.variant_id}:`, e.message);
          failCount++;
        }
      }
      log(`✓ Aktions-Buttons gesendet: ${okCount}/${toAlert.length}${failCount ? ` (${failCount} Fehler)` : ''}`);
    }

    // State erst nach erfolgreichem Alert-Versand speichern — wenn BEIDE Kanäle fehlschlagen,
    // State unverändert lassen, damit beim nächsten Run nochmal versucht wird.
    if (tg.status === 'fulfilled' || mail.status === 'fulfilled') {
      saveState(nextVariants);
    } else {
      err('Beide Kanäle fehlgeschlagen — State wird NICHT aktualisiert, nächster Run versucht erneut.');
      process.exitCode = 1;
    }
  } catch (e) {
    err('FEHLER:', e.message);
    process.exitCode = 1;
  }
}

await main();
