import { chromium } from 'playwright';

const COLLECTION_URL = 'https://blechziegel.de/collections/braas';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, bypassCSP: true });
const page = await ctx.newPage();

await page.goto(COLLECTION_URL, { waitUntil: 'networkidle', timeout: 60000 });
try { await page.locator('button:has-text("Akzeptieren")').first().click({ timeout: 3000 }); } catch {}

const pdpHref = await page.locator('a[href*="/products/"]').first().getAttribute('href');
await page.goto('https://blechziegel.de' + pdpHref, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(1500);

const html = await page.content();

// Find every occurrence of "brand":"BHE..." and dump the enclosing context
const results = [];
let idx = 0;
const needle = '"brand":"BHE Metalle"';
while ((idx = html.indexOf(needle, idx)) !== -1) {
  results.push({
    pos: idx,
    before: html.slice(Math.max(0, idx - 400), idx),
    match: html.slice(idx, idx + needle.length),
    after: html.slice(idx + needle.length, idx + needle.length + 200)
  });
  idx += needle.length;
}

// Also look for the parent <script> block each occurrence sits in
const blocks = await page.evaluate(() => {
  const out = [];
  document.querySelectorAll('script').forEach((s, i) => {
    const txt = s.textContent || '';
    if (txt.includes('"brand":"BHE Metalle"')) {
      out.push({
        idx: i,
        id: s.id || null,
        type: s.type || null,
        src: s.src || null,
        dataAttrs: Array.from(s.attributes).filter(a => a.name.startsWith('data-')).map(a => `${a.name}="${a.value}"`),
        nearMarker: txt.slice(Math.max(0, txt.indexOf('"brand":"BHE Metalle"') - 300), txt.indexOf('"brand":"BHE Metalle"') + 120)
      });
    }
  });
  return out;
});

console.log(JSON.stringify({ htmlMatches: results.length, contexts: results, scriptBlocks: blocks }, null, 2));

await browser.close();
