// Live audit screenshots for collection pages.
// Re-uses playwright from ../nav-test/node_modules.
import { chromium, devices } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = 'https://blechziegel.de';
const OUT = new URL('./screenshots/', import.meta.url).pathname.replace(/^\//, '');
mkdirSync(OUT, { recursive: true });

const COLLS = [
  { handle: 'pv-dachziegel', label: 'pv-dachziegel' },
  { handle: 'braas',         label: 'braas' },
  { handle: 'bramac',        label: 'bramac' },
  { handle: 'creaton',       label: 'creaton' },
  { handle: 'nelskamp',      label: 'nelskamp' },
];

const log = (...a) => console.log('[coll]', ...a);

async function dismissCookieBanner(page) {
  for (const sel of [
    'button:has-text("Akzeptieren")',
    'button:has-text("Alle akzeptieren")',
    '.shopify-pc__banner__btn-accept',
    '#shopify-pc__banner__btn-accept',
  ]) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 1000 })) {
        await el.click({ timeout: 2000 });
        await page.waitForTimeout(300);
        return true;
      }
    } catch {}
  }
  return false;
}

async function captureFor(ctx, viewport, suffix) {
  for (const c of COLLS) {
    const page = await ctx.newPage();
    const url = `${BASE}/collections/${c.handle}?nv=${Date.now()}`;
    log('GET', viewport, url);
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(900);
      await dismissCookieBanner(page);
      await page.waitForTimeout(400);

      const fileTop = join(OUT, `${suffix}-${c.label}-01-top.png`);
      await page.screenshot({ path: fileTop, fullPage: false });
      log('shot ->', fileTop);

      // scroll a bit further to see the listing
      await page.evaluate(() => window.scrollBy(0, window.innerHeight * 1.1));
      await page.waitForTimeout(600);
      const fileMid = join(OUT, `${suffix}-${c.label}-02-listing.png`);
      await page.screenshot({ path: fileMid, fullPage: false });
      log('shot ->', fileMid);

      // probe SEO and listing details
      const meta = await page.evaluate(() => {
        const $ = (sel) => document.querySelector(sel);
        const $$ = (sel) => Array.from(document.querySelectorAll(sel));
        const head = document;
        const get = (sel, attr) => { const el = $(sel); return el ? (attr ? el.getAttribute(attr) : el.textContent.trim()) : null; };
        return {
          title: head.title,
          metaDescription: get('meta[name="description"]', 'content'),
          h1: $$('h1').map(h => h.textContent.trim()).slice(0, 3),
          h2Count: $$('h2').length,
          h3Count: $$('h3').length,
          productCount: $$('product-card, [data-product-card], .product-card, [class*="product-card"], [class*="ProductCard"]').length,
          productLinks: $$('a[href*="/products/"]').length,
          filterPresent: !!($('[class*="filter" i]') || $('[id*="filter" i]')),
          sortPresent: !!$('[class*="sort" i], [id*="sort" i], select[name*="sort" i]'),
          paginationPresent: !!$('[class*="pagination" i], a[href*="page="]'),
          breadcrumb: !!$('[class*="breadcrumb" i], nav[aria-label*="breadcrumb" i]'),
          jsonldTypes: $$('script[type="application/ld+json"]').map(s => {
            try { const x = JSON.parse(s.textContent); return Array.isArray(x['@graph']) ? x['@graph'].map(g => g['@type']).join('+') : x['@type']; } catch { return 'parse-error'; }
          }),
          firstProductTitle: ($('a[href*="/products/"] img') ? $('a[href*="/products/"] img').alt : null),
        };
      });
      log('meta', c.handle, JSON.stringify(meta));
    } catch (e) {
      log('FAIL', c.handle, e.message);
    } finally {
      await page.close();
    }
  }
}

(async () => {
  const browser = await chromium.launch();

  // Desktop
  const desk = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-DE' });
  await captureFor(desk, '1440', 'desktop');
  await desk.close();

  // Mobile
  const mob = await browser.newContext({ ...devices['iPhone 13'], locale: 'de-DE' });
  await captureFor(mob, 'mobile', 'mobile');
  await mob.close();

  await browser.close();
  log('DONE');
})().catch(e => { console.error('FATAL', e); process.exit(1); });
