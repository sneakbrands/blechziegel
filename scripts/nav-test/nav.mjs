// Live navigation smoke-test for blechziegel.de.
// Captures screenshots of header, each mega-menu hovered open, and mobile drawer.
import { chromium, devices } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const SITE = 'https://blechziegel.de/?nv=' + Date.now();
const OUT  = new URL('./screenshots/', import.meta.url).pathname.replace(/^\//, '');
mkdirSync(OUT, { recursive: true });

const log = (...a) => console.log('[nav]', ...a);

async function dismissCookieBanner(page) {
  // Best-effort: click any consent accept button (Shopify Customer Privacy / shopify-pc__banner)
  for (const sel of [
    'button:has-text("Akzeptieren")',
    'button:has-text("Alle akzeptieren")',
    '.shopify-pc__banner__btn-accept',
    '#shopify-pc__banner__btn-accept',
    'button:has-text("Accept")',
  ]) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 1000 })) {
        await el.click({ timeout: 2000 });
        await page.waitForTimeout(300);
        log('cookie banner: clicked', sel);
        return true;
      }
    } catch {}
  }
  return false;
}

async function shoot(page, name) {
  const path = join(OUT, name + '.png');
  await page.screenshot({ path, fullPage: false });
  log('shot ->', path);
}

async function deskTest() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-DE' });
  const page = await ctx.newPage();
  log('opening', SITE, 'desktop 1440x900');
  await page.goto(SITE, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(800);
  await dismissCookieBanner(page);
  await page.waitForTimeout(300);

  // 0) header at rest
  await shoot(page, 'desktop-00-header-rest');

  // 1) For each top-level: move mouse off, then hover the title's bbox center via page.mouse
  const tops = ['Ziegel finden', 'Produkte', 'Anfrage', 'Für Profis', 'Ratgeber'];
  for (let i = 0; i < tops.length; i++) {
    const label = tops[i];
    try {
      await page.mouse.move(10, 600); // park cursor far away to dismiss prev
      await page.waitForTimeout(250);
      const box = await page.evaluate((title) => {
        const links = Array.from(document.querySelectorAll('.menu-list__link'));
        const link = links.find(a => {
          const t = a.querySelector('.menu-list__link-title');
          return t && t.textContent.trim() === title;
        });
        if (!link) return null;
        const r = link.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height };
      }, label);
      if (!box) { log('no box for', label); continue; }
      await page.mouse.move(box.x, box.y, { steps: 10 });
      await page.waitForTimeout(750);
      await shoot(page, `desktop-${String(i + 1).padStart(2, '0')}-hover-${label.replace(/\s+/g, '-')}`);
    } catch (e) {
      log('hover failed for', label, e.message);
    }
  }

  // 2) overflow probe: capture full header at narrower desktop too
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.waitForTimeout(300);
  await shoot(page, 'desktop-90-1280-overflow-probe');

  // 3) computed style of top-level title <span>s in the desktop bar (.menu-list__link)
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(200);
  const styleProbe = await page.evaluate(() => {
    function info(href) {
      const a = document.querySelector(`.menu-list__link[href$="${href}"]`);
      if (!a) return { href, missing: true };
      const span = a.querySelector('.menu-list__link-title') || a;
      const before = window.getComputedStyle(span, '::before');
      const cs = window.getComputedStyle(span);
      return {
        href,
        text: a.textContent.trim().slice(0, 60),
        spanColor: cs.color,
        spanFontWeight: cs.fontWeight,
        beforeContent: before.content,
        beforeBg: before.backgroundColor,
        beforeWidth: before.width,
        beforeHeight: before.height,
      };
    }
    return ['/pages/ziegel-finder', '/pages/ratgeber', '/pages/ziegel-anfrage'].map(info);
  });
  log('top-level style probe:', JSON.stringify(styleProbe, null, 2));

  await browser.close();
}

async function mobileTest() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    ...devices['iPhone 13'],
    locale: 'de-DE',
  });
  const page = await ctx.newPage();
  log('opening', SITE, 'mobile iPhone 13');
  await page.goto(SITE, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(800);
  await dismissCookieBanner(page);
  await page.waitForTimeout(300);

  await shoot(page, 'mobile-00-rest');

  // open hamburger drawer (Horizon: button with aria-haspopup="dialog" or label menu/Menü)
  const trigger = page.locator(
    'header :is(button, summary):is([aria-label*="Menü" i], [aria-label*="Menu" i], [aria-haspopup="dialog"])'
  ).first();
  try {
    await trigger.click({ timeout: 4000 });
    await page.waitForTimeout(600);
    await shoot(page, 'mobile-10-drawer-open');
  } catch (e) {
    log('drawer open failed:', e.message);
  }

  // try to expand "Ziegel finden" parent (accordion behavior probe)
  for (const label of ['Ziegel finden', 'Anfrage', 'Für Profis']) {
    try {
      const row = page.locator(`:is(summary, button, a):has-text("${label}")`).first();
      await row.click({ timeout: 3000 });
      await page.waitForTimeout(500);
      await shoot(page, `mobile-20-expand-${label.replace(/\s+/g, '-')}`);
    } catch (e) {
      log('expand failed for', label, e.message);
    }
  }

  await browser.close();
}

(async () => {
  await deskTest();
  await mobileTest();
  log('DONE');
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
