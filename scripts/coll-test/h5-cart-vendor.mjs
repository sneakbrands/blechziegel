import { chromium, devices } from 'playwright';

const PRODUCT_COLLECTION = 'https://blechziegel.de/collections/braas';
const CART_URL = 'https://blechziegel.de/cart';
const VENDOR_NEEDLES = ['BHE Metalle', 'BHE metalle', 'bhe metalle'];

async function runOnDevice(label, contextOpts, screenshotBase) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...contextOpts, bypassCSP: true });
  const page = await ctx.newPage();

  await page.goto(PRODUCT_COLLECTION + '?nv=' + Date.now(), { waitUntil: 'networkidle', timeout: 45000 });
  try { await page.locator('button:has-text("Akzeptieren")').first().click({ timeout: 3000 }); await page.waitForTimeout(400); } catch {}

  // Pick first product card -> PDP
  const firstCardLink = await page.locator('a[href*="/products/"]').first();
  const pdpHref = await firstCardLink.getAttribute('href');
  await page.goto('https://blechziegel.de' + pdpHref + '?nv=' + Date.now(), { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(800);

  // Add to cart via Shopify AJAX API (robust, bypasses UI state)
  const addResult = await page.evaluate(async () => {
    const variantInput = document.querySelector('input[name="id"]') || document.querySelector('[data-variant-id]');
    const vid = variantInput ? (variantInput.value || variantInput.getAttribute('data-variant-id')) : null;
    if (!vid) return { ok: false, reason: 'no variant id on PDP' };
    const r = await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ id: vid, quantity: 1 })
    });
    return { ok: r.ok, status: r.status, vid };
  });

  await page.goto(CART_URL + '?nv=' + Date.now(), { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(800);

  const html = await page.content();
  const vendorHits = VENDOR_NEEDLES.filter(n => html.includes(n));
  const itemsCount = await page.locator('tr.cart-items__table-row, .cart-items__table-row').count().catch(() => 0);
  const titleVisible = await page.locator('.cart-items__title').first().isVisible().catch(() => false);

  await page.screenshot({ path: `screenshots/h5-cart-${screenshotBase}.png`, fullPage: true });

  await browser.close();
  return { label, addResult, vendorHits, itemsCount, titleVisible };
}

const desktop = await runOnDevice('desktop', { viewport: { width: 1440, height: 900 } }, 'desktop');
const mobile  = await runOnDevice('mobile',  { ...devices['iPhone 13'] }, 'mobile');

console.log(JSON.stringify({ desktop, mobile }, null, 2));
