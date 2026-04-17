/**
 * H7 Enterprise Audit — Playwright E2E
 * Prüft: Startseite, Hersteller-Hub, Collections, PDP, Finder, Cart
 * Desktop (1440x900) + Mobile (iPhone 13)
 */
import { chromium, devices } from 'playwright';
import fs from 'node:fs';

const BASE = 'https://blechziegel.de';
const SS = 'scripts/coll-test/screenshots';
const TS = Date.now();
const results = [];

function log(test, device, status, detail = '') {
  const r = { test, device, status, detail };
  results.push(r);
  const icon = status === 'OK' ? '✓' : status === 'FAIL' ? '✗' : '!';
  console.log(`[${icon}] ${device.padEnd(8)} ${test} ${detail}`);
}

async function screenshot(page, name) {
  const path = `${SS}/${name}`;
  await page.screenshot({ path, fullPage: false });
  console.log(`  📸 ${path}`);
  return path;
}

async function screenshotFull(page, name) {
  const path = `${SS}/${name}`;
  await page.screenshot({ path, fullPage: true });
  console.log(`  📸 ${path}`);
  return path;
}

async function runAudit(context, deviceName) {
  const page = await context.newPage();
  const dev = deviceName;

  // ── 1. Startseite ──
  console.log(`\n── Startseite (${dev}) ──`);
  await page.goto(`${BASE}/?nv=${TS}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  const title = await page.title();
  log('Startseite laden', dev, title ? 'OK' : 'FAIL', title);

  if (dev === 'Desktop') await screenshot(page, 'h7-desktop-home.png');
  else await screenshot(page, 'h7-mobile-home.png');

  // ── 2. Hersteller-Hub ──
  console.log(`\n── Hersteller-Hub (${dev}) ──`);
  await page.goto(`${BASE}/pages/hersteller?nv=${TS}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  const herstellerH1 = await page.$eval('h1', el => el?.textContent?.trim()).catch(() => null);
  log('Hersteller H1', dev, herstellerH1 ? 'OK' : 'FAIL', herstellerH1 || 'kein H1');

  const herstellerLinks = await page.$$eval('a[href*="/collections/"]', els => els.length);
  log('Hersteller-Links', dev, herstellerLinks > 0 ? 'OK' : 'FAIL', `${herstellerLinks} Links`);

  if (dev === 'Desktop') await screenshot(page, 'h7-desktop-hersteller.png');
  else await screenshot(page, 'h7-mobile-hersteller.png');

  // ── 3. Collections ──
  for (const coll of ['braas', 'bramac']) {
    console.log(`\n── Collection /${coll} (${dev}) ──`);
    await page.goto(`${BASE}/collections/${coll}?nv=${TS}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);

    const collH1 = await page.$eval('h1', el => el?.textContent?.trim()).catch(() => null);
    log(`Collection ${coll} H1`, dev, collH1 ? 'OK' : 'FAIL', collH1 || 'kein H1');

    const productCards = await page.$$eval('[class*="product-card"], .grid__item, .collection-product-list a[href*="/products/"]', els => els.length);
    log(`Collection ${coll} Produkte`, dev, productCards > 0 ? 'OK' : 'FAIL', `${productCards} Produkte`);

    // Hero/Banner check
    const hero = await page.$('[class*="hero"], [class*="banner"], [class*="collection-header"], .collection__description');
    log(`Collection ${coll} Hero`, dev, hero ? 'OK' : 'WARN', hero ? 'vorhanden' : 'nicht gefunden');

    if (dev === 'Desktop') await screenshot(page, `h7-desktop-coll-${coll}.png`);
    else await screenshot(page, `h7-mobile-coll-${coll}.png`);
  }

  // ── 4. PDP ──
  console.log(`\n── PDP (${dev}) ──`);
  await page.goto(`${BASE}/products/pv-dachziegel-frankfurter-pfanne?nv=${TS}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Top screenshot
  if (dev === 'Desktop') await screenshot(page, 'h7-desktop-pdp-top.png');
  else await screenshot(page, 'h7-mobile-pdp-top.png');

  // Multi-Brand-Pill
  const brandPill = await page.$('[class*="brand-link--multi"], [class*="brand-pill"], .bz-product-brand-link--multi');
  const brandPillText = brandPill ? await brandPill.textContent() : null;
  log('PDP Multi-Brand-Pill', dev, brandPill ? 'OK' : 'FAIL', brandPillText?.trim() || 'nicht gefunden');

  if (brandPill) {
    const brandLinks = await page.$$eval('[class*="brand-link--multi"] a, .bz-product-brand-link--multi a', els =>
      els.map(e => ({ text: e.textContent.trim(), href: e.href }))
    );
    log('PDP Brand-Links', dev, brandLinks.length > 1 ? 'OK' : 'WARN', `${brandLinks.length} Links: ${brandLinks.map(l => l.text).join(', ')}`);
  }

  // Product title + price
  const pdpTitle = await page.$eval('h1, [class*="product__title"]', el => el?.textContent?.trim()).catch(() => null);
  log('PDP Titel', dev, pdpTitle ? 'OK' : 'FAIL', pdpTitle || 'kein Titel');

  const pdpPrice = await page.$eval('[class*="price"], .product__price', el => el?.textContent?.trim()).catch(() => null);
  log('PDP Preis', dev, pdpPrice ? 'OK' : 'FAIL', pdpPrice?.substring(0, 30) || 'kein Preis');

  // Add-to-cart button
  const atcBtn = await page.$('button[name="add"], [class*="add-to-cart"], form[action*="/cart/add"] button[type="submit"]');
  log('PDP Add-to-Cart Button', dev, atcBtn ? 'OK' : 'FAIL', atcBtn ? 'vorhanden' : 'nicht gefunden');

  // Zubehör-Block
  const addonBlock = await page.$('[class*="addon"], [class*="zubehoer"], .bz-addon-block, [class*="accessory"]');
  let addonCount = 0;
  if (addonBlock) {
    addonCount = await page.$$eval('[class*="addon"] [class*="product"], .bz-addon-block [class*="item"], [class*="addon"] button', els => els.length).catch(() => 0);
    log('PDP Zubehör-Block', dev, 'OK', `${addonCount} Elemente`);

    // Scroll to addon block and screenshot
    await addonBlock.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    if (dev === 'Desktop') await screenshot(page, 'h7-desktop-pdp-addon.png');
    else await screenshot(page, 'h7-mobile-pdp-addon.png');
  } else {
    log('PDP Zubehör-Block', dev, 'WARN', 'nicht gefunden — alternatives Selektor-Matching');
    // Try broader selectors
    const sections = await page.$$eval('section, [class*="block"]', els =>
      els.filter(e => /zubeh|addon|accessory|ergänz/i.test(e.className + e.id + e.textContent.substring(0, 200)))
        .map(e => ({ cls: e.className, id: e.id, text: e.textContent.substring(0, 100) }))
    );
    if (sections.length > 0) {
      log('PDP Zubehör (breit)', dev, 'OK', JSON.stringify(sections[0]).substring(0, 120));
    }
  }

  // Vendor visibility check (should NOT show BHE Metalle)
  const bodyText = await page.$eval('body', el => el.textContent);
  const bheVisible = /BHE\s*Metalle/i.test(bodyText);
  log('PDP Vendor "BHE Metalle" sichtbar', dev, bheVisible ? 'WARN' : 'OK', bheVisible ? 'BHE Metalle im Body!' : 'nicht sichtbar');

  // ── 5. Add-to-Cart Test ──
  console.log(`\n── Add-to-Cart Test (${dev}) ──`);
  try {
    // Get current cart count
    const cartBefore = await page.evaluate(() =>
      fetch('/cart.json').then(r => r.json()).then(c => c.item_count)
    );
    log('Cart vor ATC', dev, 'OK', `${cartBefore} Items`);

    // Click ATC
    if (atcBtn) {
      await atcBtn.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await atcBtn.click();
      await page.waitForTimeout(2000);

      const cartAfter = await page.evaluate(() =>
        fetch('/cart.json').then(r => r.json()).then(c => c.item_count)
      );
      log('ATC Ergebnis', dev, cartAfter > cartBefore ? 'OK' : 'FAIL', `${cartBefore} → ${cartAfter} Items`);
    }
  } catch (e) {
    log('ATC Test', dev, 'FAIL', e.message.substring(0, 100));
  }

  // ── 6. Cart ──
  console.log(`\n── Cart (${dev}) ──`);
  await page.goto(`${BASE}/cart?nv=${TS}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  const cartItems = await page.$$eval('[class*="cart-item"], [class*="cart__item"], .line-item', els => els.length).catch(() => 0);
  log('Cart Items', dev, cartItems > 0 ? 'OK' : 'WARN', `${cartItems} Items`);

  // Check for vendor visibility in cart
  const cartBody = await page.$eval('body', el => el.textContent).catch(() => '');
  const bheInCart = /BHE\s*Metalle/i.test(cartBody);
  log('Cart Vendor "BHE Metalle"', dev, bheInCart ? 'WARN' : 'OK', bheInCart ? 'sichtbar!' : 'nicht sichtbar');

  // Cart prices
  const cartTotal = await page.$eval('[class*="total"], [class*="cart__total"]', el => el?.textContent?.trim()).catch(() => null);
  log('Cart Total', dev, cartTotal ? 'OK' : 'WARN', cartTotal?.substring(0, 50) || 'nicht gefunden');

  if (dev === 'Desktop') await screenshot(page, 'h7-desktop-cart.png');
  else await screenshot(page, 'h7-mobile-cart.png');

  // ── 7. Finder ──
  console.log(`\n── Finder (${dev}) ──`);
  // Try common finder URLs
  let finderFound = false;
  for (const path of ['/pages/ziegel-finder', '/pages/finder', '/pages/dachziegel-finder', '/pages/konfigurator']) {
    const resp = await page.goto(`${BASE}${path}?nv=${TS}`, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => null);
    if (resp && resp.status() === 200) {
      const h1 = await page.$eval('h1', el => el?.textContent?.trim()).catch(() => null);
      log('Finder Seite', dev, 'OK', `${path} — ${h1 || 'kein H1'}`);
      finderFound = true;

      // Check for CTA
      const cta = await page.$('a[href*="/products/"], button[class*="cta"], [class*="finder"] a, [class*="result"] a');
      log('Finder CTA', dev, cta ? 'OK' : 'WARN', cta ? 'vorhanden' : 'nicht gefunden');

      if (dev === 'Desktop') await screenshot(page, 'h7-desktop-finder.png');
      else await screenshot(page, 'h7-mobile-finder.png');
      break;
    }
  }
  if (!finderFound) {
    log('Finder Seite', dev, 'WARN', 'keine Finder-URL erreichbar');
  }

  await page.close();
}

// ── Main ──
(async () => {
  console.log('=== H7 Enterprise Audit ===');
  console.log(`Timestamp: ${TS}\n`);

  const browser = await chromium.launch({ headless: true });

  // Desktop
  console.log('\n═══ DESKTOP (1440x900) ═══');
  const desktopCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'
  });
  await runAudit(desktopCtx, 'Desktop');
  await desktopCtx.close();

  // Clear cart between runs
  const clearCtx = await browser.newContext();
  const clearPage = await clearCtx.newPage();
  await clearPage.goto(`${BASE}/cart/clear`, { waitUntil: 'domcontentloaded', timeout: 10000 }).catch(() => {});
  await clearCtx.close();

  // Mobile
  console.log('\n═══ MOBILE (iPhone 13) ═══');
  const iPhone = devices['iPhone 13'];
  const mobileCtx = await browser.newContext({ ...iPhone });
  await runAudit(mobileCtx, 'Mobile');
  await mobileCtx.close();

  await browser.close();

  // Summary
  console.log('\n\n═══ ZUSAMMENFASSUNG ═══');
  console.log(`Gesamt: ${results.length} Tests`);
  console.log(`  OK:   ${results.filter(r => r.status === 'OK').length}`);
  console.log(`  WARN: ${results.filter(r => r.status === 'WARN').length}`);
  console.log(`  FAIL: ${results.filter(r => r.status === 'FAIL').length}`);

  // Write JSON
  fs.writeFileSync(`${SS}/h7-results.json`, JSON.stringify(results, null, 2));
  console.log(`\nErgebnisse: ${SS}/h7-results.json`);
})();
