import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto('https://blechziegel.de/collections/braas?nv=' + Date.now(), { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1500);
try { await page.locator('button:has-text("Akzeptieren")').first().click(); await page.waitForTimeout(400); } catch {}
const probe = await page.evaluate(() => {
  const el = document.querySelector('.bz-col-hero-hublink');
  if (!el) return { found: false };
  const r = el.getBoundingClientRect();
  return { found: true, text: el.textContent.trim(), href: el.getAttribute('href'), top: Math.round(r.top), height: Math.round(r.height) };
});
console.log('PROBE', JSON.stringify(probe));
await page.screenshot({ path: 'screenshots/desktop-braas-hero-full.png', clip: { x: 0, y: 0, width: 1440, height: 400 } });
await browser.close();
