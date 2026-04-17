import { chromium, devices } from 'playwright';
const BASE = 'https://blechziegel.de';
const SS = 'scripts/coll-test/screenshots';
const TS = Date.now();

(async () => {
  const browser = await chromium.launch({ headless: true });

  // Desktop
  console.log('== Desktop ==');
  const dCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const dPage = await dCtx.newPage();
  await dPage.goto(`${BASE}/products/pv-dachziegel-frankfurter-pfanne?nv=${TS}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await dPage.waitForTimeout(3000);
  const acc = await dPage.$('#shopify-pc__banner button[data-action="accept"]');
  if (acc) try { await acc.click({ timeout: 3000 }); await dPage.waitForTimeout(1000); } catch {}

  const pill = await dPage.$('.bz-product-brand-link--multi');
  console.log('Pill:', pill ? 'OK' : 'FAIL');

  const links = await dPage.$$eval('.bz-product-brand-link--multi a[href*="/collections/"]', els =>
    els.map(e => ({ text: e.textContent.trim(), href: e.getAttribute('href') }))
  ).catch(() => []);
  console.log(`Links: ${links.length}`, links.map(l => `${l.text} -> ${l.href}`).join(' | '));

  await dPage.screenshot({ path: `${SS}/h71-pill-desktop.png` });
  await dCtx.close();

  // Mobile
  console.log('\n== Mobile ==');
  const mCtx = await browser.newContext({ ...devices['iPhone 13'] });
  const mPage = await mCtx.newPage();
  await mPage.goto(`${BASE}/products/pv-dachziegel-frankfurter-pfanne?nv=${TS}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await mPage.waitForTimeout(3000);
  const mAcc = await mPage.$('#shopify-pc__banner button[data-action="accept"]');
  if (mAcc) try { await mAcc.click({ timeout: 3000 }); await mPage.waitForTimeout(1000); } catch {}

  const mPill = await mPage.$('.bz-product-brand-link--multi');
  console.log('Pill:', mPill ? 'OK' : 'FAIL');
  const mLinks = await mPage.$$eval('.bz-product-brand-link--multi a[href*="/collections/"]', els => els.length).catch(() => 0);
  console.log('Links:', mLinks);

  const overflow = await mPage.evaluate(() => {
    const p = document.querySelector('.bz-product-brand-link--multi');
    if (!p) return 'no pill';
    return p.scrollWidth > p.parentElement.clientWidth ? 'OVERFLOW!' : 'OK';
  });
  console.log('Overflow:', overflow);

  await mPage.screenshot({ path: `${SS}/h71-pill-mobile.png` });
  await mCtx.close();
  await browser.close();
})();
