import { chromium, devices } from 'playwright';

const PRODUCT_COLLECTION = 'https://blechziegel.de/collections/braas';
const CART_URL = 'https://blechziegel.de/cart';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, bypassCSP: true });
const page = await ctx.newPage();

await page.goto(PRODUCT_COLLECTION + '?nv=' + Date.now(), { waitUntil: 'networkidle', timeout: 45000 });
try { await page.locator('button:has-text("Akzeptieren")').first().click({ timeout: 3000 }); } catch {}

const firstCardLink = await page.locator('a[href*="/products/"]').first();
const pdpHref = await firstCardLink.getAttribute('href');
await page.goto('https://blechziegel.de' + pdpHref, { waitUntil: 'networkidle', timeout: 45000 });

await page.evaluate(async () => {
  const vid = document.querySelector('input[name="id"]')?.value;
  await fetch('/cart/add.js', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: vid, quantity: 1 }) });
});
await page.goto(CART_URL, { waitUntil: 'networkidle', timeout: 45000 });
await page.waitForTimeout(500);

// 1) Is the text visually rendered on the page?
const visibleText = await page.evaluate(() => document.body.innerText);
const visiblyRendered = visibleText.includes('BHE Metalle');

// 2) Full HTML – where does it appear?
const html = await page.content();
const contexts = [];
let idx = 0;
while ((idx = html.indexOf('BHE Metalle', idx)) !== -1) {
  contexts.push({ pos: idx, snippet: html.slice(Math.max(0, idx - 120), idx + 120) });
  idx += 1;
}

// 3) Is any visible DOM node containing the string?
const domVisibleHits = await page.evaluate(() => {
  const results = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    if (n.nodeValue && n.nodeValue.includes('BHE Metalle')) {
      const el = n.parentElement;
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      const visible = rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
      results.push({
        tag: el.tagName, cls: el.className, text: n.nodeValue.trim().slice(0, 80),
        visible, rect: { w: rect.width, h: rect.height, x: rect.x, y: rect.y }
      });
    }
  }
  return results;
});

console.log(JSON.stringify({ visiblyRendered, contextCount: contexts.length, contexts, domVisibleHits }, null, 2));

await browser.close();
