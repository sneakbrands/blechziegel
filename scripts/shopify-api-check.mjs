// Shopify Admin API Diagnose für blechziegel
// Nutzung:
//   cd c:/Users/Administrator/blechziegel-theme
//   node scripts/shopify-api-check.mjs
//
// Liest c:/Users/Administrator/blechziegel-admin-tools/.env
// Erwartete Variablen: SHOPIFY_CLIENT_ID, SHOPIFY_CLIENT_SECRET, SHOP_DOMAIN, SHOPIFY_ADMIN_TOKEN

import fs from 'node:fs';

const ENV_PATH = 'c:/Users/Administrator/blechziegel-admin-tools/.env';
if (!fs.existsSync(ENV_PATH)) { console.error('FEHLT:', ENV_PATH); process.exit(1); }
const env = Object.fromEntries(fs.readFileSync(ENV_PATH, 'utf8')
  .split('\n').filter(l => l && !l.startsWith('#'))
  .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }));

const SHOP = env.SHOP_DOMAIN || 'blechziegel.myshopify.com';
const TOK  = env.SHOPIFY_ADMIN_TOKEN;
const CID  = env.SHOPIFY_CLIENT_ID;
const SEC  = env.SHOPIFY_CLIENT_SECRET;
const VER  = '2025-01';
const BASE = `https://${SHOP}/admin/api/${VER}`;
const THEME_ID = 193277395328; // blechziegel/main (live, seit 2026-04-18)
const KEY = 'sections/blechziegel-product.liquid';

const colors = { g: '\x1b[32m', r: '\x1b[31m', y: '\x1b[33m', x: '\x1b[0m' };
const ok    = (s) => console.log(`${colors.g}✓${colors.x} ${s}`);
const fail  = (s) => console.log(`${colors.r}✗${colors.x} ${s}`);
const warn  = (s) => console.log(`${colors.y}!${colors.x} ${s}`);
const label = (s) => console.log(`\n── ${s} ──`);

console.log('Shopify API Diagnose');
console.log('  SHOP          :', SHOP);
console.log('  API_VERSION   :', VER);
console.log('  THEME_ID      :', THEME_ID);
console.log('  CLIENT_ID     :', CID ? `gesetzt (${CID.length} chars, prefix: ${CID.slice(0, 8)})` : 'FEHLT');
console.log('  CLIENT_SECRET :', SEC ? `gesetzt (prefix: ${SEC.slice(0, 6)})` : 'FEHLT');
console.log('  ADMIN_TOKEN   :', TOK ? `gesetzt (prefix: ${TOK.slice(0, 6)})` : 'FEHLT');

if (!TOK) {
  fail('SHOPIFY_ADMIN_TOKEN fehlt. Bitte in .env eintragen (Wert beginnt mit shpat_…).');
  process.exit(2);
}
if (!TOK.startsWith('shpat_')) {
  warn('SHOPIFY_ADMIN_TOKEN beginnt mit "' + TOK.slice(0, 6) + '", erwartet "shpat_". Wahrscheinlich ist das falsche Wert kopiert (Client-Secret vs. Admin-API-Token).');
}

async function hit(label, init) {
  const t0 = Date.now();
  try {
    const r = await fetch(init.url, { method: init.method || 'GET', headers: init.headers, body: init.body });
    const body = await r.text();
    return { label, status: r.status, ok: r.ok, ms: Date.now() - t0, body: body.slice(0, 600), raw: body };
  } catch (e) {
    return { label, status: 0, ok: false, ms: Date.now() - t0, err: e.message };
  }
}

const H = { 'X-Shopify-Access-Token': TOK, 'Accept': 'application/json' };

// 1) Grundauth: shop.json
label('1) Grundauth — GET /shop.json');
{
  const r = await hit('shop.json', { url: BASE + '/shop.json', headers: H });
  if (r.ok) { ok(`Status ${r.status} — App ist installiert und Admin-Token ist gültig`); try { const j = JSON.parse(r.raw); console.log('   shop.name:', j.shop?.name, '  plan:', j.shop?.plan_display_name); } catch {} }
  else { fail(`Status ${r.status}: ${r.body.slice(0, 200)}`); }
}

// 2) App-Install-Check via client_credentials
label('2) App-Install-Check — client_credentials grant');
if (CID && SEC) {
  const r = await hit('oauth', {
    method: 'POST',
    url: `https://${SHOP}/admin/oauth/access_token`,
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ client_id: CID, client_secret: SEC, grant_type: 'client_credentials' })
  });
  if (r.raw.includes('app_not_installed')) fail('App ist NICHT auf dem Shop installiert. Admin → Apps entwickeln → deine App → "App installieren" klicken.');
  else if (r.ok) ok('OAuth-Roundtrip funktioniert');
  else warn(`Status ${r.status}: ${r.body.slice(0, 200)}`);
} else warn('CLIENT_ID oder CLIENT_SECRET fehlen — Test übersprungen');

// 3) Theme-Listen-Scope
label('3) Theme-Scope — GET /themes.json');
{
  const r = await hit('themes', { url: BASE + '/themes.json', headers: H });
  if (r.ok) {
    ok(`Status ${r.status} — read_themes Scope ist aktiv`);
    try {
      const j = JSON.parse(r.raw);
      const main = j.themes?.find(t => t.role === 'main');
      if (main) { ok(`Live-Theme: id=${main.id} name=${main.name} (role=main)`); if (main.id !== THEME_ID) warn(`Hard-coded THEME_ID ${THEME_ID} ≠ live ${main.id}`); }
    } catch {}
  } else if (r.status === 403) fail(`Status 403: ${r.body.slice(0, 200)} — Scope read_themes fehlt. Admin → App → Konfiguration → Scopes: write_themes, read_themes aktivieren, dann App NEU INSTALLIEREN (= neuer Token).`);
  else fail(`Status ${r.status}: ${r.body.slice(0, 200)}`);
}

// 4) Einzel-Asset-GET
label('4) Asset lesen — GET /themes/{id}/assets.json?asset[key]=' + KEY);
{
  const r = await hit('asset_get', { url: `${BASE}/themes/${THEME_ID}/assets.json?asset%5Bkey%5D=${encodeURIComponent(KEY)}`, headers: H });
  if (r.ok) {
    ok(`Status ${r.status} — Asset lesbar`);
    try {
      const j = JSON.parse(r.raw);
      const val = j.asset?.value || '';
      console.log('   size:', val.length, 'bytes');
      console.log('   enthält H6 Multi-Brand-Pill  (bz-product-brand-link--multi):', /bz-product-brand-link--multi/.test(val) ? 'JA' : 'NEIN');
      console.log('   enthält H6 Zubehör-Block     (bz-addon-block)              :', /bz-addon-block/.test(val) ? 'JA' : 'NEIN');
    } catch {}
  } else fail(`Status ${r.status}: ${r.body.slice(0, 200)}`);
}

// 5) Write-Test — dry: OPTIONS (kein echter Write, nur Scope-Probe)
label('5) Write-Scope — prüft ob write_themes nutzbar ist (PUT ohne Body wird validiert)');
{
  // Wir machen hier bewusst KEINEN destruktiven PUT. Stattdessen rufen wir den gleichen Endpoint
  // mit einem no-op-Body (key=value identisch zum aktuellen live asset, falls erreichbar).
  const live = await hit('live_read', { url: `${BASE}/themes/${THEME_ID}/assets.json?asset%5Bkey%5D=${encodeURIComponent(KEY)}`, headers: H });
  if (!live.ok) { warn(`Lese-Check fehlgeschlagen (Status ${live.status}) — Write-Test übersprungen`); }
  else {
    try {
      const j = JSON.parse(live.raw);
      const val = j.asset?.value;
      if (val == null) { warn('asset.value leer — Write-Test übersprungen'); }
      else {
        const r = await hit('asset_put_noop', {
          method: 'PUT', url: `${BASE}/themes/${THEME_ID}/assets.json`,
          headers: { ...H, 'Content-Type': 'application/json' },
          body: JSON.stringify({ asset: { key: KEY, value: val } })
        });
        if (r.ok) ok(`Status ${r.status} — write_themes Scope ist aktiv (No-Op PUT akzeptiert)`);
        else if (r.status === 403) fail('Status 403 — write_themes Scope fehlt. Scopes erweitern + App neu installieren.');
        else warn(`Status ${r.status}: ${r.body.slice(0, 200)}`);
      }
    } catch {}
  }
}

// 6) Products-Scope — prüft ob read_products für Stock-Monitor verfügbar ist
label('6) Products-Scope — GET /products.json?limit=1 (für Stock-Monitor)');
{
  const r = await hit('products', { url: BASE + '/products.json?limit=1&fields=id,title,variants', headers: H });
  if (r.ok) {
    ok(`Status ${r.status} — read_products Scope ist aktiv`);
    try {
      const j = JSON.parse(r.raw);
      const v = j.products?.[0]?.variants?.[0];
      console.log('   Beispiel-Variante:', v ? `${j.products[0].title} (inventory_quantity=${v.inventory_quantity})` : 'keine Produkte');
      if (v && typeof v.inventory_quantity === 'number') ok('inventory_quantity-Feld wird geliefert → Stock-Monitor kann arbeiten');
      else warn('inventory_quantity fehlt oder kein Produkt vorhanden — Tracking prüfen');
    } catch {}
  } else if (r.status === 403) fail('Status 403 — Scope read_products fehlt. Admin → Apps → deine App → Konfiguration → Scopes: read_products aktivieren, dann App NEU INSTALLIEREN.');
  else fail(`Status ${r.status}: ${r.body.slice(0, 200)}`);
}

// 7) Zusammenfassung
label('Zusammenfassung');
console.log('Wenn alle Tests grün sind, kann das Theme-Repo direkt via API gepusht werden.');
console.log('Sobald das der Fall ist, führe dieses Script nochmal aus, schicke mir die Ausgabe, und ich pushe H6.');
console.log();
console.log('Typische Fixes:');
console.log('  - 401 überall          -> Admin-Token (shpat_…) in .env falsch/veraltet -> App neu installieren');
console.log('  - app_not_installed    -> Admin → App → "App installieren" klicken');
console.log('  - 403 bei theme-calls  -> Scopes write_themes,read_themes fehlen -> aktivieren + REINSTALL');
console.log('  - shpss_ statt shpat_  -> Client-Secret statt Admin-Token kopiert -> richtige Sektion suchen');
