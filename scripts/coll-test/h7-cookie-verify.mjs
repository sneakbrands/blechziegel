/**
 * H7 Cookie Banner Verify — prüft ob der Fix lokal funktioniert
 * Nutzt theme dev NICHT — prüft nur die CSS-Änderung per lokaler Datei-Injektion
 * Stattdessen: Live-Seite laden + CSS überschreiben
 */
import { chromium, devices } from 'playwright';
import fs from 'node:fs';

const BASE = 'https://blechziegel.de';
const SS = 'scripts/coll-test/screenshots';
const TS = Date.now();

// Read the new CSS from the liquid file
const liquidFile = fs.readFileSync('snippets/bz-cookie-banner.liquid', 'utf8');
const cssMatch = liquidFile.match(/{% style %}([\s\S]*?){% endstyle %}/);
const customCSS = cssMatch ? cssMatch[1] : '';

(async () => {
  console.log('=== H7 Cookie Banner Verify ===\n');

  const browser = await chromium.launch({ headless: true });
  const iPhone = devices['iPhone 13'];
  const ctx = await browser.newContext({ ...iPhone });
  const page = await ctx.newPage();

  // Inject our updated CSS on every page load
  await page.addStyleTag({ content: customCSS });

  // ── PDP Test ──
  console.log('── Mobile PDP ──');
  await page.goto(`${BASE}/products/pv-dachziegel-frankfurter-pfanne?nv=${TS}`, {
    waitUntil: 'domcontentloaded', timeout: 30000
  });
  await page.waitForTimeout(2000);

  // Re-inject CSS after navigation
  await page.addStyleTag({ content: customCSS });
  await page.waitForTimeout(500);

  await page.screenshot({ path: `${SS}/h7-mobile-pdp-cookie-fix.png` });
  console.log(`  📸 h7-mobile-pdp-cookie-fix.png`);

  // Check banner height vs viewport
  const bannerInfo = await page.evaluate(() => {
    const banner = document.querySelector('#shopify-pc__banner');
    if (!banner) return { found: false };
    const rect = banner.getBoundingClientRect();
    return {
      found: true,
      height: rect.height,
      viewportHeight: window.innerHeight,
      ratio: (rect.height / window.innerHeight * 100).toFixed(1),
      bodyVisible: document.querySelector('.shopify-pc__banner__body')
        ? getComputedStyle(document.querySelector('.shopify-pc__banner__body')).display
        : 'element-not-found'
    };
  });

  if (bannerInfo.found) {
    console.log(`  Banner Höhe: ${bannerInfo.height}px`);
    console.log(`  Viewport: ${bannerInfo.viewportHeight}px`);
    console.log(`  Anteil: ${bannerInfo.ratio}%`);
    console.log(`  Body-Text display: ${bannerInfo.bodyVisible}`);
    console.log(`  ${parseFloat(bannerInfo.ratio) <= 40 ? '✓ Banner ≤ 40%' : '✗ Banner > 40%!'}`);
  } else {
    console.log('  Banner nicht gefunden (ggf. bereits geschlossen)');
  }

  // Try ATC
  console.log('\n── Mobile ATC Test ──');
  const cartBefore = await page.evaluate(() =>
    fetch('/cart.json').then(r => r.json()).then(c => c.item_count)
  );

  const atcBtn = await page.$('button[name="add"], form[action*="/cart/add"] button[type="submit"]');
  if (atcBtn) {
    // First dismiss cookie banner if blocking
    const acceptBtn = await page.$('#shopify-pc__banner button[data-action="accept"], #shopify-pc__banner .shopify-pc__banner__btn-accept');
    if (acceptBtn) {
      try {
        await acceptBtn.click({ timeout: 3000 });
        console.log('  Cookie-Banner akzeptiert');
        await page.waitForTimeout(1000);
      } catch (e) {
        console.log('  Cookie-Banner Klick fehlgeschlagen, versuche ATC direkt');
      }
    }

    try {
      await atcBtn.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await atcBtn.click({ timeout: 5000 });
      await page.waitForTimeout(2000);
      const cartAfter = await page.evaluate(() =>
        fetch('/cart.json').then(r => r.json()).then(c => c.item_count)
      );
      console.log(`  Cart: ${cartBefore} → ${cartAfter} Items`);
      console.log(`  ${cartAfter > cartBefore ? '✓ ATC erfolgreich' : '✗ ATC fehlgeschlagen'}`);
    } catch (e) {
      console.log(`  ✗ ATC Timeout: ${e.message.substring(0, 80)}`);
    }
  }

  // ── Home Test ──
  console.log('\n── Mobile Home ──');
  await page.goto(`${BASE}/?nv=${TS}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);
  await page.addStyleTag({ content: customCSS });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${SS}/h7-mobile-home-cookie-fix.png` });
  console.log(`  📸 h7-mobile-home-cookie-fix.png`);

  await browser.close();
  console.log('\n=== Verify abgeschlossen ===');
})();
