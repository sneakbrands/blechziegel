/**
 * H7.1 Fix Verification — Playwright
 * Tests: Brand-Links, Addon-Block, Cart-Texte, Cart-Empfehlungen
 */
import { chromium, devices } from 'playwright';

const BASE = 'https://blechziegel.de';
const SS = 'scripts/coll-test/screenshots';
const TS = Date.now();
const results = [];

function log(test, device, status, detail = '') {
  results.push({ test, device, status, detail });
  const icon = status === 'OK' ? '\u2713' : status === 'FAIL' ? '\u2717' : '!';
  console.log(`[${icon}] ${device.padEnd(8)} ${test} ${detail}`);
}

async function ss(page, name) {
  await page.screenshot({ path: `${SS}/${name}` });
  console.log(`  \uD83D\uDCF8 ${name}`);
}

async function testPDP(page, dev) {
  console.log(`\n\u2550\u2550 PDP (${dev}) \u2550\u2550`);
  await page.goto(`${BASE}/products/pv-dachziegel-frankfurter-pfanne?nv=${TS}`, {
    waitUntil: 'domcontentloaded', timeout: 30000
  });
  await page.waitForTimeout(3000);

  // Dismiss cookie banner
  const accept = await page.$('#shopify-pc__banner button[data-action="accept"], #shopify-pc__banner .shopify-pc__banner__btn-accept');
  if (accept) { try { await accept.click({ timeout: 3000 }); await page.waitForTimeout(1000); } catch(e) {} }

  // Multi-Brand-Pill
  const pill = await page.$('.bz-product-brand-link--multi');
  log('Multi-Brand-Pill', dev, pill ? 'OK' : 'FAIL', pill ? 'vorhanden' : 'nicht gefunden');

  // Brand-Links innerhalb der Pill
  const brandLinks = await page.$$eval('.bz-product-brand-link--multi a[href*="/collections/"]', els =>
    els.map(e => ({ text: e.textContent.trim(), href: e.getAttribute('href') }))
  );
  log('Brand-Links klickbar', dev, brandLinks.length > 1 ? 'OK' : 'FAIL',
    `${brandLinks.length} Links: ${brandLinks.map(l => l.text).join(', ')}`);

  // Each link valid?
  for (const link of brandLinks) {
    log(`Link "${link.text}"`, dev, link.href.includes('/collections/') ? 'OK' : 'FAIL', link.href);
  }

  // Addon block
  const addon = await page.$('.bz-addon-block');
  if (addon) {
    const addonItems = await page.$$('.bz-addon-card');
    log('Zubehoer-Block', dev, 'OK', `${addonItems.length} Karten`);
    await addon.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
  } else {
    log('Zubehoer-Block', dev, 'WARN', 'nicht gerendert — Addon-Produkte evtl. unavailable');
  }

  await ss(page, `h71-pdp-${dev.toLowerCase()}.png`);
}

async function testCart(page, dev) {
  console.log(`\n\u2550\u2550 Cart (${dev}) \u2550\u2550`);

  // Add product to cart first
  await page.goto(`${BASE}/products/pv-dachziegel-frankfurter-pfanne?nv=${TS}`, {
    waitUntil: 'domcontentloaded', timeout: 30000
  });
  await page.waitForTimeout(2000);
  const accept = await page.$('#shopify-pc__banner button[data-action="accept"]');
  if (accept) { try { await accept.click({ timeout: 3000 }); await page.waitForTimeout(1000); } catch(e) {} }

  const atc = await page.$('button[name="add"], form[action*="/cart/add"] button[type="submit"]');
  if (atc) {
    await atc.scrollIntoViewIfNeeded();
    await atc.click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(2000);
  }

  // Go to cart
  await page.goto(`${BASE}/cart?nv=${TS}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Cart title
  const bodyText = await page.$eval('body', el => el.textContent);
  const hasWarenkorb = /Warenkorb/i.test(bodyText);
  const hasCart = /\bCart\b/.test(bodyText);
  log('Cart-Titel "Warenkorb"', dev, hasWarenkorb ? 'OK' : 'FAIL', hasWarenkorb ? 'gefunden' : 'nicht gefunden');
  log('Englisch "Cart" entfernt', dev, !hasCart ? 'OK' : 'WARN', hasCart ? 'noch vorhanden' : 'nicht mehr vorhanden');

  // "Das könnte dir auch gefallen"
  const hasGefallen = /Das könnte dir auch gefallen|könnte dir auch/i.test(bodyText);
  const hasMayAlso = /You may also like/i.test(bodyText);
  log('Empfehlung deutsch', dev, hasGefallen ? 'OK' : 'WARN', hasGefallen ? 'gefunden' : 'nicht gefunden');
  log('"You may also like" entfernt', dev, !hasMayAlso ? 'OK' : 'WARN', hasMayAlso ? 'noch vorhanden' : 'entfernt');

  // Ausverkaufte Empfehlungen
  const soldOutInRecs = await page.$$eval('.resource-list__item', items => {
    return items.filter(el => /ausverkauft|sold out/i.test(el.textContent)).length;
  }).catch(() => -1);
  log('Ausverkaufte Empfehlungen', dev, soldOutInRecs === 0 ? 'OK' : 'WARN',
    soldOutInRecs === 0 ? 'keine' : `${soldOutInRecs} gefunden`);

  await ss(page, `h71-cart-${dev.toLowerCase()}.png`);
}

(async () => {
  console.log('=== H7.1 Fix Verification ===\n');
  const browser = await chromium.launch({ headless: true });

  // Desktop
  const dCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const dPage = await dCtx.newPage();
  await testPDP(dPage, 'Desktop');
  await testCart(dPage, 'Desktop');
  await dCtx.close();

  // Mobile
  const iPhone = devices['iPhone 13'];
  const mCtx = await browser.newContext({ ...iPhone });
  const mPage = await mCtx.newPage();
  await testPDP(mPage, 'Mobile');
  await testCart(mPage, 'Mobile');
  await mCtx.close();

  await browser.close();

  console.log('\n\u2550\u2550\u2550 ZUSAMMENFASSUNG \u2550\u2550\u2550');
  console.log(`Gesamt: ${results.length} Tests`);
  console.log(`  OK:   ${results.filter(r => r.status === 'OK').length}`);
  console.log(`  WARN: ${results.filter(r => r.status === 'WARN').length}`);
  console.log(`  FAIL: ${results.filter(r => r.status === 'FAIL').length}`);
})();
