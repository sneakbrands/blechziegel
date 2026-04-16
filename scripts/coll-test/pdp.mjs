import { chromium, devices } from 'playwright';
const browser = await chromium.launch();
const PDP = 'https://blechziegel.de/products/pv-dachziegel-frankfurter-pfanne?nv=' + Date.now();

async function dismiss(page) {
  for (const sel of ['button:has-text("Akzeptieren")', '.shopify-pc__banner__btn-accept']) {
    try { const el = page.locator(sel).first(); if (await el.isVisible({ timeout: 1000 })) { await el.click(); await page.waitForTimeout(300); return; } } catch {}
  }
}

async function probe(ctx, suffix) {
  const page = await ctx.newPage();
  await page.goto(PDP, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(900);
  await dismiss(page);
  await page.waitForTimeout(400);
  await page.screenshot({ path: `screenshots/${suffix}-pdp-top.png`, clip: { x: 0, y: 0, width: ctx._options.viewport?.width ?? 390, height: 340 } });
  const probeData = await page.evaluate(() => {
    const bc = document.querySelector('.bz-pdp-breadcrumb');
    const items = bc ? Array.from(bc.querySelectorAll('.bz-pdp-breadcrumb__item')).map(i => ({ text: i.textContent.trim(), href: i.querySelector('a')?.getAttribute('href') || null })) : [];
    const bcListScript = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
      .map(s => { try { return JSON.parse(s.textContent); } catch { return null; } })
      .filter(Boolean)
      .find(o => o['@type'] === 'BreadcrumbList');
    return {
      bcVisible: !!bc,
      bcItems: items,
      bcListItems: bcListScript ? bcListScript.itemListElement.map(i => ({ pos: i.position, name: i.name, item: i.item })) : null,
      title: document.title,
    };
  });
  console.log('PROBE', suffix, JSON.stringify(probeData, null, 2));
  await page.close();
}

{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-DE' });
  await probe(ctx, 'desktop');
  await ctx.close();
}
{
  const ctx = await browser.newContext({ ...devices['iPhone 13'], locale: 'de-DE' });
  await probe(ctx, 'mobile');
  await ctx.close();
}

await browser.close();
