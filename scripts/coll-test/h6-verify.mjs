import { chromium, devices } from 'playwright';

const PDP = 'https://blechziegel.de/products/pv-dachziegel-frankfurter-pfanne';

async function run(label, contextOpts, screenshot) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...contextOpts, bypassCSP: true });
  const page = await ctx.newPage();

  await page.route('**', r => r.continue({ headers: { ...r.request().headers(), 'cache-control': 'no-cache', 'pragma': 'no-cache' }}));
  await page.goto(PDP + '?nv=' + Date.now() + '-' + Math.random(), { waitUntil: 'networkidle', timeout: 60000 });
  try { await page.locator('button:has-text("Akzeptieren")').first().click({ timeout: 3000 }); await page.waitForTimeout(400); } catch {}

  // 1) Multi-brand pill check
  const pill = await page.locator('.bz-product-brand-link').first();
  const pillVisible = await pill.isVisible().catch(() => false);
  const pillText = pillVisible ? (await pill.innerText()).trim().replace(/\s+/g, ' ') : null;
  const pillHref = pillVisible ? await pill.getAttribute('href') : null;
  const pillIsMulti = pillVisible ? await pill.evaluate(el => el.classList.contains('bz-product-brand-link--multi')) : false;

  // 2) Accessory block check
  const block = page.locator('.bz-addon-block');
  const blockVisible = await block.isVisible().catch(() => false);
  const cards = await page.locator('.bz-addon-card').count().catch(() => 0);
  const cardDetails = await page.$$eval('.bz-addon-card', cards => cards.map(c => ({
    handle: c.getAttribute('data-addon-handle'),
    name: c.querySelector('.bz-addon-name')?.innerText?.trim() || null,
    price: c.querySelector('.bz-addon-price')?.innerText?.trim() || null,
    variantId: c.querySelector('.bz-addon-btn')?.getAttribute('data-variant-id') || null,
    buttonLabel: c.querySelector('.bz-addon-btn-label')?.innerText?.trim() || null,
  })));

  // 3) Try add-to-cart on first addon (functional smoke test)
  let addResult = { tested: false };
  if (cards > 0) {
    try {
      const firstBtn = page.locator('.bz-addon-card .bz-addon-btn').first();
      await firstBtn.scrollIntoViewIfNeeded();
      const before = await page.evaluate(async () => {
        const r = await fetch('/cart.js'); const j = await r.json(); return j.item_count;
      });
      await firstBtn.click({ timeout: 5000 });
      await page.waitForTimeout(1800);
      const labelAfter = await firstBtn.locator('.bz-addon-btn-label').innerText().catch(() => null);
      const after = await page.evaluate(async () => {
        const r = await fetch('/cart.js'); const j = await r.json(); return j.item_count;
      });
      addResult = { tested: true, itemCountBefore: before, itemCountAfter: after, labelAfter };
    } catch (e) {
      addResult = { tested: true, error: e.message };
    }
  }

  // 4) Screenshot — scroll into the below-fold right column
  await page.locator('.bz-addon-block, .bz-product-brand-link').first().scrollIntoViewIfNeeded().catch(() => {});
  await page.screenshot({ path: `screenshots/h6-${screenshot}-full.png`, fullPage: true });

  // Targeted pill shot
  try {
    await page.locator('.bz-product-brand-link').first().screenshot({ path: `screenshots/h6-${screenshot}-pill.png`, scale: 'css' });
  } catch {}
  // Targeted addon-block shot
  try {
    await page.locator('.bz-addon-block').first().screenshot({ path: `screenshots/h6-${screenshot}-addons.png`, scale: 'css' });
  } catch {}

  await browser.close();
  return { label, pillVisible, pillText, pillHref, pillIsMulti, blockVisible, cards, cardDetails, addResult };
}

const desktop = await run('desktop', { viewport: { width: 1440, height: 900 } }, 'desktop');
const mobile  = await run('mobile',  { ...devices['iPhone 13'] }, 'mobile');

console.log(JSON.stringify({ desktop, mobile }, null, 2));
