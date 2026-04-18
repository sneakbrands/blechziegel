// Stock-Monitor Bot — verarbeitet Telegram-Interaktionen zum Bestand-Nachpflegen.
//
// Fluss:
//   1) Benutzer klickt im Alert den "📦 Menge anpassen"-Button
//      → Bot antwortet im Gruppen-Chat mit ForceReply "Wieviele Stück?"
//   2) Benutzer antwortet mit einer Zahl
//      → Bot bucht per Shopify inventory_levels/adjust.json ein
//      → Bot bestätigt mit Name, Menge und neuem Bestand
//
// Wird alle 60 Sekunden vom Task Scheduler aufgerufen (kein Daemon nötig).
// Persistiert:
//   bot-offset.json   letzte verarbeitete update_id
//   bot-pending.json  prompt_message_id → Kontext (variant_id, location_id, user, …)
//
// Exit-Codes: 0 = OK, 1 = Fehler (Netzwerk, Konfiguration)

import fs from 'node:fs';

const ENV_PATH = 'c:/Users/Administrator/blechziegel-admin-tools/.env';
const ANTHROPIC_ENV_PATH = 'C:/Users/Administrator/MCP-Wordpress/blechziegel-chatbot/.env.local';
function readEnvFile(p) {
  if (!fs.existsSync(p)) return {};
  return Object.fromEntries(fs.readFileSync(p, 'utf8')
    .split('\n').filter(l => l && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }));
}
const fileEnv = { ...readEnvFile(ANTHROPIC_ENV_PATH), ...readEnvFile(ENV_PATH) };
const env = (k, def = '') => process.env[k] ?? fileEnv[k] ?? def;

const SHOP = env('SHOP_DOMAIN', 'blechziegel-de.myshopify.com');
const TOK = env('SHOPIFY_ADMIN_TOKEN');
const BASE = `https://${SHOP}/admin/api/2025-01`;
const TG_TOKEN = env('TELEGRAM_BOT_TOKEN');
const PENDING_TTL_MIN = parseInt(env('BOT_PENDING_TTL_MIN', '30'), 10);
const ALLOWED_USERS = new Set(
  (env('ALLOWED_TELEGRAM_USERS', '') || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .map(Number)
    .filter(n => Number.isFinite(n))
);
const ADMIN_GROUP_ID = Number(env('TELEGRAM_CHAT_ID', '')) || null;
const ANTHROPIC_KEY = env('ANTHROPIC_API_KEY', '');
const CLAUDE_MODEL = env('CLAUDE_MODEL', 'claude-haiku-4-5-20251001');
const BOT_USERNAME = (env('BOT_USERNAME', 'Stock_bz_bot') || '').toLowerCase().replace(/^@/, '');
const LOW_STOCK_THRESHOLD = parseInt(env('STOCK_THRESHOLD', '20'), 10);

const OFFSET_PATH = new URL('./bot-offset.json', import.meta.url);
const PENDING_PATH = new URL('./bot-pending.json', import.meta.url);

const log = (...a) => console.log(new Date().toISOString(), ...a);
const errLog = (...a) => console.error(new Date().toISOString(), ...a);

if (!TOK || !TG_TOKEN) {
  errLog('FEHLER: SHOPIFY_ADMIN_TOKEN oder TELEGRAM_BOT_TOKEN fehlt.');
  process.exit(1);
}

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function loadJson(path, def) {
  try { return fs.existsSync(path) ? JSON.parse(fs.readFileSync(path, 'utf8')) : def; }
  catch (e) { errLog('Konnte', String(path), 'nicht lesen:', e.message); return def; }
}
function saveJson(path, obj) { fs.writeFileSync(path, JSON.stringify(obj, null, 2)); }

function cleanExpired(pending) {
  const now = Date.now();
  let removed = 0;
  for (const k of Object.keys(pending)) {
    if ((pending[k].expires_at || 0) < now) { delete pending[k]; removed++; }
  }
  if (removed) log(`${removed} abgelaufene pending-Einträge entfernt`);
  return pending;
}

async function tg(method, body) {
  const r = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await r.text();
  if (!r.ok) throw new Error(`Telegram ${method} ${r.status}: ${text.slice(0, 300)}`);
  return JSON.parse(text);
}

async function shopify(path, init = {}) {
  const r = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'X-Shopify-Access-Token': TOK,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  const text = await r.text();
  let parsed = null;
  try { parsed = text ? JSON.parse(text) : null; } catch {}
  if (!r.ok) {
    const msg = parsed?.errors ? JSON.stringify(parsed.errors) : text.slice(0, 300);
    throw new Error(`Shopify ${r.status}: ${msg}`);
  }
  return parsed;
}

async function isGroupAdmin(userId) {
  if (!ADMIN_GROUP_ID || !userId) return false;
  try {
    const r = await tg('getChatMember', { chat_id: ADMIN_GROUP_ID, user_id: userId });
    const status = r?.result?.status;
    return status === 'creator' || status === 'administrator';
  } catch (e) {
    errLog('getChatMember fehlgeschlagen:', e.message);
    return false;
  }
}

function parseBuchen(text) {
  const m = text.match(/^\/buchen(?:@\w+)?\s+([\s\S]+?)\s+([+-]?\d+)\s*$/i);
  if (!m) return null;
  const query = m[1].trim();
  const amount = parseInt(m[2], 10);
  if (!query || !amount) return null;
  return { query, amount };
}

async function findVariants(query) {
  const pr = await shopify('/products.json?limit=250&fields=id,handle,title,variants');
  const out = [];
  for (const p of pr.products) {
    for (const v of p.variants) {
      out.push({
        variant_id: v.id,
        inventory_item_id: v.inventory_item_id,
        sku: v.sku || '',
        qty: v.inventory_quantity ?? 0,
        name: p.title + (v.title && v.title !== 'Default Title' ? ' — ' + v.title : ''),
      });
    }
  }
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const exactSku = out.filter(r => r.sku.toLowerCase() === q);
  if (exactSku.length) return exactSku;
  const words = q.split(/\s+/).filter(Boolean);
  return out.filter(r => {
    const hay = (r.sku + ' ' + r.name).toLowerCase();
    return words.every(w => hay.includes(w));
  });
}

async function executeAdjust(target, locId, amount, chatId, replyToMsgId, from) {
  let newQty;
  try {
    const resp = await shopify('/inventory_levels/adjust.json', {
      method: 'POST',
      body: JSON.stringify({
        location_id: locId,
        inventory_item_id: target.inventory_item_id,
        available_adjustment: amount,
      }),
    });
    newQty = resp?.inventory_level?.available ?? ((target.qty ?? 0) + amount);
  } catch (e) {
    errLog('Shopify-Adjust fehlgeschlagen:', e.message);
    await tg('sendMessage', {
      chat_id: chatId,
      text: `✗ Shopify-Buchung fehlgeschlagen: ${esc(e.message)}`,
      parse_mode: 'HTML',
      reply_to_message_id: replyToMsgId,
    });
    return null;
  }
  const who = from?.first_name || from?.username || 'User';
  const sign = amount >= 0 ? '+' : '';
  await tg('sendMessage', {
    chat_id: chatId,
    text: `✅ <b>${sign}${amount} Stück</b> gebucht für <b>${esc(target.name)}</b> durch <b>${esc(who)}</b>.\nNeuer Bestand: <b>${newQty}</b>`,
    parse_mode: 'HTML',
    reply_to_message_id: replyToMsgId,
  });
  log(`Adjust ${sign}${amount} durch ${who} → neu ${newQty} (variant ${target.variant_id})`);
  return newQty;
}

async function handleCommand(msg, pending) {
  const text = (msg.text || '').trim();
  if (!text.startsWith('/')) return false;

  const chatId = msg.chat.id;
  const userId = msg.from?.id;

  if (/^\/(help|start|buchen_help)(@\w+)?\s*$/i.test(text)) {
    await tg('sendMessage', {
      chat_id: chatId,
      text: '<b>Befehle:</b>\n<code>/buchen SKU +N</code>  → N Stück hinzufügen\n<code>/buchen SKU -N</code>  → Abzug (JA/NEIN bestätigen)\n<code>/bestand SKU|Name</code>  → aktuellen Bestand anzeigen\n<code>/niedrig</code>  → alle Varianten unter Schwelle (20)\n<code>/help</code>  → diese Hilfe\n\n<b>Nach 📦-Button-Klick:</b> pure Zahl als Antwort reicht — kein Reply nötig, wenn nur 1 Prompt offen ist.\n\n<b>Beispiele:</b>\n<code>/buchen Anthrazit Haken Privat +25</code>\n<code>/bestand Ziegelrot</code>',
      parse_mode: 'HTML',
      reply_to_message_id: msg.message_id,
    });
    return true;
  }

  if (/^\/bestand(@\w+)?\b/i.test(text)) {
    const query = text.replace(/^\/bestand(@\w+)?\s*/i, '').trim();
    if (!query) {
      await tg('sendMessage', { chat_id: chatId, text: '⚠️ Format: <code>/bestand SKU oder Name</code>', parse_mode: 'HTML', reply_to_message_id: msg.message_id });
      return true;
    }
    let hits;
    try { hits = await findVariants(query); }
    catch (e) {
      await tg('sendMessage', { chat_id: chatId, text: `✗ Shopify-Suche fehlgeschlagen: ${esc(e.message)}`, parse_mode: 'HTML', reply_to_message_id: msg.message_id });
      return true;
    }
    if (!hits.length) {
      await tg('sendMessage', { chat_id: chatId, text: `❓ Keine Variante für „${esc(query)}" gefunden.`, parse_mode: 'HTML', reply_to_message_id: msg.message_id });
      return true;
    }
    const lines = hits.slice(0, 15).map(h => `• <b>${h.qty}</b> · ${esc(h.name)}${h.sku ? ' · <code>' + esc(h.sku) + '</code>' : ''}`).join('\n');
    const more = hits.length > 15 ? `\n… und ${hits.length - 15} weitere` : '';
    await tg('sendMessage', { chat_id: chatId, text: `📦 <b>Bestand</b> für „${esc(query)}":\n${lines}${more}`, parse_mode: 'HTML', reply_to_message_id: msg.message_id });
    return true;
  }

  if (/^\/niedrig(@\w+)?\s*$/i.test(text)) {
    let pr;
    try { pr = await shopify('/products.json?limit=250&fields=id,title,variants'); }
    catch (e) {
      await tg('sendMessage', { chat_id: chatId, text: `✗ Shopify-Abruf fehlgeschlagen: ${esc(e.message)}`, parse_mode: 'HTML', reply_to_message_id: msg.message_id });
      return true;
    }
    const low = [];
    for (const p of pr.products) for (const v of p.variants) {
      if (typeof v.inventory_quantity === 'number' && v.inventory_quantity < 20) {
        low.push({ sku: v.sku || '', qty: v.inventory_quantity, name: p.title + (v.title && v.title !== 'Default Title' ? ' — ' + v.title : '') });
      }
    }
    low.sort((a, b) => a.qty - b.qty);
    if (!low.length) {
      await tg('sendMessage', { chat_id: chatId, text: '✅ Keine Variante unter Schwelle (20).', reply_to_message_id: msg.message_id });
      return true;
    }
    const lines = low.slice(0, 20).map(h => `• <b>${h.qty}</b> · ${esc(h.name)}${h.sku ? ' · <code>' + esc(h.sku) + '</code>' : ''}`).join('\n');
    const more = low.length > 20 ? `\n… und ${low.length - 20} weitere` : '';
    await tg('sendMessage', { chat_id: chatId, text: `🔻 <b>${low.length}</b> Varianten unter Schwelle (20):\n${lines}${more}`, parse_mode: 'HTML', reply_to_message_id: msg.message_id });
    return true;
  }

  if (!/^\/buchen(@\w+)?\b/i.test(text)) return false;

  const allowed = ALLOWED_USERS.has(userId) || await isGroupAdmin(userId);
  if (!allowed) {
    await tg('sendMessage', {
      chat_id: chatId,
      text: '⛔ Nicht berechtigt für Inventory-Buchungen. Bitte an einen Admin der Blechziegel-Gruppe wenden.',
      reply_to_message_id: msg.message_id,
    });
    log(`Unautorisierter /buchen von ${userId} (${msg.from?.first_name})`);
    return true;
  }

  const parsed = parseBuchen(text);
  if (!parsed) {
    await tg('sendMessage', {
      chat_id: chatId,
      text: '⚠️ Format: <code>/buchen SKU +N</code> oder <code>/buchen SKU -N</code>\nBeispiel: <code>/buchen BZ-FP-RED +100</code>',
      parse_mode: 'HTML',
      reply_to_message_id: msg.message_id,
    });
    return true;
  }

  let hits;
  try {
    hits = await findVariants(parsed.query);
  } catch (e) {
    errLog('findVariants fehlgeschlagen:', e.message);
    await tg('sendMessage', {
      chat_id: chatId,
      text: `✗ Shopify-Suche fehlgeschlagen: ${esc(e.message)}`,
      parse_mode: 'HTML',
      reply_to_message_id: msg.message_id,
    });
    return true;
  }

  if (hits.length === 0) {
    await tg('sendMessage', {
      chat_id: chatId,
      text: `❓ Keine Variante für „${esc(parsed.query)}" gefunden.`,
      parse_mode: 'HTML',
      reply_to_message_id: msg.message_id,
    });
    return true;
  }
  if (hits.length > 1) {
    const preview = hits.slice(0, 10).map(h => `• <code>${esc(h.sku || '—')}</code> — ${esc(h.name)} (${h.qty})`).join('\n');
    const more = hits.length > 10 ? `\n… und ${hits.length - 10} weitere` : '';
    await tg('sendMessage', {
      chat_id: chatId,
      text: `🔎 ${hits.length} Treffer für „${esc(parsed.query)}" — bitte mit vollem SKU wiederholen:\n${preview}${more}`,
      parse_mode: 'HTML',
      reply_to_message_id: msg.message_id,
    });
    return true;
  }

  const target = hits[0];

  let locId;
  try {
    const locs = await shopify('/locations.json');
    locId = locs.locations[0]?.id;
    if (!locId) throw new Error('Keine Location gefunden');
  } catch (e) {
    await tg('sendMessage', {
      chat_id: chatId,
      text: `✗ Location laden fehlgeschlagen: ${esc(e.message)}`,
      parse_mode: 'HTML',
      reply_to_message_id: msg.message_id,
    });
    return true;
  }

  if (parsed.amount < 0) {
    const promptText = `⚠️ Negative Buchung: <b>${parsed.amount} Stück</b> für <b>${esc(target.name)}</b> (aktuell ${target.qty}).\nAntworte auf diese Nachricht mit <code>JA</code> zur Bestätigung oder <code>NEIN</code> zum Abbrechen.`;
    const prompt = await tg('sendMessage', {
      chat_id: chatId,
      text: promptText,
      parse_mode: 'HTML',
      reply_to_message_id: msg.message_id,
      reply_markup: { force_reply: true, selective: true, input_field_placeholder: 'JA / NEIN' },
    });
    const key = `cmd:${chatId}:${prompt.result.message_id}`;
    pending[key] = {
      kind: 'confirm_cmd',
      variant_id: target.variant_id,
      inventory_item_id: target.inventory_item_id,
      location_id: locId,
      variant_name: target.name,
      current_qty: target.qty,
      amount: parsed.amount,
      chat_id: chatId,
      prompt_message_id: prompt.result.message_id,
      initiator_id: userId,
      initiator_name: msg.from?.first_name || 'User',
      expires_at: Date.now() + PENDING_TTL_MIN * 60 * 1000,
    };
    log(`Negative Buchung wartet auf Bestätigung: ${parsed.amount} für variant ${target.variant_id}`);
    return true;
  }

  await executeAdjust(target, locId, parsed.amount, chatId, msg.message_id, msg.from);
  return true;
}

function isBotMentioned(msg) {
  if (!msg.entities || !msg.text || !BOT_USERNAME) return false;
  for (const e of msg.entities) {
    if (e.type === 'mention') {
      const mention = msg.text.substring(e.offset, e.offset + e.length).toLowerCase();
      if (mention === '@' + BOT_USERNAME) return true;
    }
  }
  return false;
}

function looksLikeQuery(text) {
  if (!text) return false;
  if (text.includes('?')) return true;
  return /^(wie|was|wo|welche|wann|warum|zeig|zeige|gibt|hab|ist|sind|haben|kannst|magst|bitte)\b/i.test(text.trim());
}

function stripBotMention(text) {
  if (!BOT_USERNAME) return text;
  return text.replace(new RegExp('@' + BOT_USERNAME, 'gi'), '').trim();
}

const CLAUDE_TOOLS = [
  {
    name: 'list_variants',
    description: 'Sucht Produktvarianten im Shopify-Store (blechziegel.de) per Substring-Match auf SKU oder Produktname. Gibt maximal 20 passende Varianten mit aktuellem Bestand zurück.',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Suchbegriff (Teil eines SKU oder Produktnamens, z. B. "Anthrazit mit Haken")' },
      },
      required: ['query'],
    },
  },
  {
    name: 'list_low_stock',
    description: 'Listet alle Varianten mit Bestand unter einem Schwellenwert, aufsteigend nach Bestand sortiert.',
    input_schema: {
      type: 'object',
      properties: {
        threshold: { type: 'number', description: 'Schwellenwert. Standard ist ' + LOW_STOCK_THRESHOLD + '.' },
        limit: { type: 'number', description: 'Maximalzahl zurückgegebener Einträge (Standard 30).' },
      },
    },
  },
];

async function runClaudeTool(name, input) {
  if (name === 'list_variants') {
    const hits = await findVariants(String(input.query || ''));
    return hits.slice(0, 20).map(h => ({ variant_id: h.variant_id, sku: h.sku, name: h.name, qty: h.qty }));
  }
  if (name === 'list_low_stock') {
    const thr = Number.isFinite(input.threshold) ? input.threshold : LOW_STOCK_THRESHOLD;
    const limit = Number.isFinite(input.limit) ? Math.min(input.limit, 100) : 30;
    const pr = await shopify('/products.json?limit=250&fields=id,title,variants');
    const low = [];
    for (const p of pr.products) for (const v of p.variants) {
      if (typeof v.inventory_quantity === 'number' && v.inventory_quantity < thr) {
        low.push({ variant_id: v.id, sku: v.sku || '', name: p.title + (v.title && v.title !== 'Default Title' ? ' — ' + v.title : ''), qty: v.inventory_quantity });
      }
    }
    low.sort((a, b) => a.qty - b.qty);
    return { threshold: thr, count: low.length, items: low.slice(0, limit) };
  }
  throw new Error('Unbekanntes Tool: ' + name);
}

async function askClaude(userText, chatId, replyToMsgId, fromName) {
  if (!ANTHROPIC_KEY) {
    await tg('sendMessage', { chat_id: chatId, text: '⚠️ Claude-API nicht konfiguriert (ANTHROPIC_API_KEY fehlt).', reply_to_message_id: replyToMsgId });
    return;
  }
  const system = `Du bist ein Inventory-Assistent für den Shopify-Shop blechziegel.de (PV-Dachziegel).
- Beantworte Fragen zu Lagerbeständen, Varianten und Produkten kurz und präzise auf Deutsch.
- Nutze die Tools für aktuelle Daten, rate nicht.
- Buchungen (Bestandsanpassungen) darfst du NICHT selbst ausführen. Verweise darauf: "Nutze /buchen SKU +N" bzw. "-N".
- Antworte geschäftsmäßig, ohne Emojis am Satzanfang. Für wichtige Zahlen oder Namen nutze <b>...</b>.
- Bei Zahlen nenne den aktuellen Bestand und — wenn relevant — die Schwelle (${LOW_STOCK_THRESHOLD}).
- Nutzer: ${fromName || 'Admin'}.`;

  const messages = [{ role: 'user', content: userText }];

  for (let i = 0; i < 5; i++) {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: CLAUDE_MODEL, max_tokens: 1024, system, tools: CLAUDE_TOOLS, messages }),
    });
    const j = await r.json();
    if (j.error) throw new Error('Claude ' + j.error.type + ': ' + j.error.message);

    messages.push({ role: 'assistant', content: j.content });

    if (j.stop_reason === 'tool_use') {
      const toolBlocks = j.content.filter(b => b.type === 'tool_use');
      const results = [];
      for (const b of toolBlocks) {
        try {
          const out = await runClaudeTool(b.name, b.input || {});
          results.push({ type: 'tool_result', tool_use_id: b.id, content: JSON.stringify(out) });
          log(`Claude tool ${b.name}(${JSON.stringify(b.input).slice(0,80)}) → ${JSON.stringify(out).length} bytes`);
        } catch (e) {
          results.push({ type: 'tool_result', tool_use_id: b.id, content: 'ERROR: ' + e.message, is_error: true });
          errLog(`Claude tool ${b.name} Fehler:`, e.message);
        }
      }
      messages.push({ role: 'user', content: results });
      continue;
    }

    const answer = j.content.filter(b => b.type === 'text').map(b => b.text).join('\n').trim() || '(keine Antwort von Claude)';
    await tg('sendMessage', { chat_id: chatId, text: answer, parse_mode: 'HTML', reply_to_message_id: replyToMsgId });
    log(`Claude-Antwort (${j.usage?.input_tokens}/${j.usage?.output_tokens} tokens) an ${fromName || chatId}`);
    return;
  }
  await tg('sendMessage', { chat_id: chatId, text: '⚠️ Zu viele Tool-Iterationen — Abfrage abgebrochen.', reply_to_message_id: replyToMsgId });
}

async function maybeAskClaude(msg) {
  const text = (msg.text || '').trim();
  if (!text || text.startsWith('/')) return false;

  const query = stripBotMention(text).trim();
  if (!query) return false;

  const userId = msg.from?.id;
  const allowed = ALLOWED_USERS.has(userId) || await isGroupAdmin(userId);
  if (!allowed) {
    if (isBotMentioned(msg) || msg.chat?.type === 'private') {
      await tg('sendMessage', { chat_id: msg.chat.id, text: '⛔ Nicht berechtigt. Bitte an einen Admin der Blechziegel-Gruppe wenden.', reply_to_message_id: msg.message_id });
    }
    return true;
  }

  log(`Claude-Anfrage von ${msg.from?.first_name || userId}: "${query.slice(0, 80)}"`);
  try {
    await askClaude(query, msg.chat.id, msg.message_id, msg.from?.first_name);
  } catch (e) {
    errLog('askClaude Fehler:', e.message);
    await tg('sendMessage', { chat_id: msg.chat.id, text: `⚠️ Claude-Antwort fehlgeschlagen: ${esc(e.message)}`, parse_mode: 'HTML', reply_to_message_id: msg.message_id });
  }
  return true;
}

async function tryAutoMatchNumber(msg, pending) {
  const text = (msg.text || '').trim();
  if (!/^[+-]?\d+$/.test(text)) return false;
  const userId = msg.from?.id;
  const matches = [];
  for (const [key, p] of Object.entries(pending)) {
    if (!p || p.kind === 'confirm_cmd') continue;
    if (p.chat_id === msg.chat.id && p.initiator_id === userId) {
      matches.push({ key, p });
    }
  }
  if (matches.length === 0) return false;
  if (matches.length > 1) {
    await tg('sendMessage', {
      chat_id: msg.chat.id,
      text: `⚠️ Es sind <b>${matches.length}</b> offene Prompts von dir. Bitte nutze bei der gewünschten Bot-Nachricht die <b>"Antworten/Reply"</b>-Geste, damit ich weiß welche gemeint ist.`,
      parse_mode: 'HTML',
      reply_to_message_id: msg.message_id,
    });
    return true;
  }
  const fakeMsg = { ...msg, reply_to_message: { message_id: matches[0].p.prompt_message_id } };
  log(`Auto-match: Zahl "${text}" → pending ${matches[0].key}`);
  await handleReply(fakeMsg, pending);
  return true;
}

async function handleConfirmCommand(msg, pending, key) {
  const p = pending[key];
  const text = (msg.text || '').trim().toUpperCase();
  if (text === 'JA' || text === 'YES' || text === 'Y') {
    await executeAdjust(
      { variant_id: p.variant_id, inventory_item_id: p.inventory_item_id, qty: p.current_qty, name: p.variant_name },
      p.location_id,
      p.amount,
      msg.chat.id,
      msg.message_id,
      msg.from,
    );
    delete pending[key];
  } else if (text === 'NEIN' || text === 'NO' || text === 'N') {
    await tg('sendMessage', {
      chat_id: msg.chat.id,
      text: `✗ Abgebrochen (Buchung <b>${p.amount}</b> für <b>${esc(p.variant_name)}</b>).`,
      parse_mode: 'HTML',
      reply_to_message_id: msg.message_id,
    });
    delete pending[key];
  } else {
    await tg('sendMessage', {
      chat_id: msg.chat.id,
      text: '⚠️ Bitte nur <code>JA</code> oder <code>NEIN</code> antworten.',
      parse_mode: 'HTML',
      reply_to_message_id: msg.message_id,
    });
  }
}

async function handleCallback(q, pending) {
  const data = q.data || '';
  if (!data.startsWith('a|')) return;
  const [, variantId, invItemId, locId] = data.split('|');
  if (!variantId || !invItemId || !locId) {
    await tg('answerCallbackQuery', { callback_query_id: q.id, text: 'Ungültige Button-Daten', show_alert: true });
    return;
  }

  let name = 'Variante';
  let currentQty = null;
  try {
    const vr = await shopify(`/variants/${variantId}.json`);
    const v = vr.variant;
    currentQty = v.inventory_quantity;
    const pr = await shopify(`/products/${v.product_id}.json?fields=id,title`);
    name = `${pr.product.title}${v.title && v.title !== 'Default Title' ? ' — ' + v.title : ''}`;
  } catch (e) {
    errLog('Variante laden fehlgeschlagen:', e.message);
    await tg('answerCallbackQuery', { callback_query_id: q.id, text: 'Variante konnte nicht geladen werden', show_alert: true });
    return;
  }

  const promptText = `💬 Wieviele Stück für <b>${esc(name)}</b> hinzufügen?\n<i>Aktuell ${currentQty} Stück. Antworte auf diese Nachricht mit einer positiven Zahl (z. B. 25).</i>`;
  const prompt = await tg('sendMessage', {
    chat_id: q.message.chat.id,
    text: promptText,
    parse_mode: 'HTML',
    reply_to_message_id: q.message.message_id,
    reply_markup: {
      force_reply: true,
      selective: true,
      input_field_placeholder: 'Anzahl Stück (z. B. 25)',
    },
  });

  const key = `${q.message.chat.id}:${prompt.result.message_id}`;
  pending[key] = {
    variant_id: Number(variantId),
    inventory_item_id: Number(invItemId),
    location_id: Number(locId),
    variant_name: name,
    current_qty: currentQty,
    chat_id: q.message.chat.id,
    prompt_message_id: prompt.result.message_id,
    action_message_id: q.message.message_id,
    initiator_id: q.from.id,
    initiator_name: q.from.first_name || q.from.username || 'User',
    expires_at: Date.now() + PENDING_TTL_MIN * 60 * 1000,
  };

  await tg('answerCallbackQuery', { callback_query_id: q.id, text: 'Antworte mit einer Zahl.' });
  log(`Prompt gesendet für ${name} (variant ${variantId})`);
}

async function handleReply(msg, pending) {
  const replyId = msg.reply_to_message?.message_id;
  if (!replyId) return false;

  const cmdKey = `cmd:${msg.chat.id}:${replyId}`;
  if (pending[cmdKey]?.kind === 'confirm_cmd') {
    await handleConfirmCommand(msg, pending, cmdKey);
    return true;
  }

  const key = `${msg.chat.id}:${replyId}`;
  const p = pending[key];
  if (!p) return false;

  const text = (msg.text || '').trim();
  const num = parseInt(text, 10);
  if (isNaN(num) || num <= 0 || num > 100000 || String(num) !== text.replace(/^\+/, '')) {
    await tg('sendMessage', {
      chat_id: msg.chat.id,
      text: `⚠️ Bitte nur eine positive Ganzzahl antworten (z. B. <code>25</code>). Erhalten: „${esc(text)}"`,
      parse_mode: 'HTML',
      reply_to_message_id: msg.message_id,
    });
    return true; // pending bleibt, damit User korrigieren kann
  }

  let newQty;
  try {
    const resp = await shopify('/inventory_levels/adjust.json', {
      method: 'POST',
      body: JSON.stringify({
        location_id: p.location_id,
        inventory_item_id: p.inventory_item_id,
        available_adjustment: num,
      }),
    });
    newQty = resp?.inventory_level?.available ?? ((p.current_qty ?? 0) + num);
  } catch (e) {
    errLog('Shopify-Adjust fehlgeschlagen:', e.message);
    await tg('sendMessage', {
      chat_id: msg.chat.id,
      text: `✗ Shopify-Buchung fehlgeschlagen: ${esc(e.message)}`,
      parse_mode: 'HTML',
      reply_to_message_id: msg.message_id,
    });
    return true;
  }

  const who = msg.from?.first_name || msg.from?.username || 'User';
  await tg('sendMessage', {
    chat_id: msg.chat.id,
    text: `✅ <b>+${num} Stück</b> eingebucht für <b>${esc(p.variant_name)}</b> durch <b>${esc(who)}</b>.\nNeuer Bestand: <b>${newQty}</b>`,
    parse_mode: 'HTML',
    reply_to_message_id: msg.message_id,
  });
  log(`Adjust +${num} durch ${who} → neu ${newQty} (variant ${p.variant_id})`);
  delete pending[key];
  return true;
}

async function main() {
  const offsetFile = loadJson(OFFSET_PATH, { offset: 0 });
  const pending = cleanExpired(loadJson(PENDING_PATH, {}));

  try {
    const u = await tg('getUpdates', {
      offset: (offsetFile.offset || 0) + 1,
      timeout: 1, // kurze Long-Poll-Zeit — Task-Runner bleibt schlank
      allowed_updates: ['message', 'callback_query'],
    });
    const updates = u.result || [];
    if (updates.length) log(`Verarbeite ${updates.length} Update(s)`);
    for (const upd of updates) {
      try {
        if (upd.callback_query) await handleCallback(upd.callback_query, pending);
        else if (upd.message) {
          const handled = await handleCommand(upd.message, pending);
          if (!handled) {
            let routed = false;
            if (upd.message.reply_to_message) {
              routed = await handleReply(upd.message, pending);
            } else {
              routed = await tryAutoMatchNumber(upd.message, pending);
            }
            if (!routed) await maybeAskClaude(upd.message);
          }
        }
      } catch (e) {
        errLog('Update', upd.update_id, 'Fehler:', e.message);
      }
      if (typeof upd.update_id === 'number' && upd.update_id > (offsetFile.offset || 0)) {
        offsetFile.offset = upd.update_id;
      }
    }
  } catch (e) {
    errLog('getUpdates fehlgeschlagen:', e.message);
    process.exitCode = 1;
  } finally {
    saveJson(OFFSET_PATH, offsetFile);
    saveJson(PENDING_PATH, pending);
  }
}

await main();
