import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, bypassCSP: true });
const page = await ctx.newPage();
await page.route('**', r => r.continue({ headers: { ...r.request().headers(), 'cache-control': 'no-cache', 'pragma': 'no-cache' }}));
await page.goto('https://blechziegel.de/collections/braas?nv=' + Date.now() + Math.random(), { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(1000);
try { await page.locator('button:has-text("Akzeptieren")').first().click(); await page.waitForTimeout(400); } catch {}
const p = await page.evaluate(() => {
  const el = document.querySelector('.bz-col-hero-hublink');
  return el ? { found: true, text: el.textContent.trim(), href: el.href } : { found: false, html: document.querySelector('.bz-col-hero-trust')?.outerHTML?.slice(-200) };
});
console.log(JSON.stringify(p));
if (p.found) await page.screenshot({ path: 'screenshots/desktop-braas-hublink.png', clip: { x: 0, y: 0, width: 1440, height: 400 } });
await browser.close();
