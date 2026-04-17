// COLL-1 deep verification.
import { chromium, devices } from 'playwright';

const SITE = 'https://blechziegel.de';
const COLLS = ['pv-dachziegel', 'braas', 'bramac', 'creaton', 'nelskamp'];

async function dismiss(page) {
  for (const sel of ['button:has-text("Akzeptieren")', '.shopify-pc__banner__btn-accept']) {
    try { const el = page.locator(sel).first(); if (await el.isVisible({ timeout: 1000 })) { await el.click(); await page.waitForTimeout(300); return; } } catch {}
  }
}

async function probe(page, handle) {
  const url = `${SITE}/collections/${handle}?nv=${Date.now()}`;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(900);
  await dismiss(page);
  await page.waitForTimeout(300);

  return await page.evaluate(() => {
    const $$ = (s) => Array.from(document.querySelectorAll(s));
    const metaDesc = $$('meta[name="description"]').map(m => m.getAttribute('content'));
    const ogDesc = $$('meta[property="og:description"]').map(m => m.getAttribute('content'));
    const h1 = $$('h1').map(h => h.textContent.trim());
    const breadcrumbEl = document.querySelector('.bz-col-breadcrumb');
    let breadcrumb = null;
    if (breadcrumbEl) {
      const r = breadcrumbEl.getBoundingClientRect();
      breadcrumb = { text: breadcrumbEl.textContent.trim().replace(/\s+/g, ' '), top: Math.round(r.top), height: Math.round(r.height), width: Math.round(r.width) };
    }
    const jsonLds = $$('script[type="application/ld+json"]').map(s => {
      try { return JSON.parse(s.textContent); } catch { return null; }
    }).filter(Boolean);
    const types = jsonLds.flatMap(j => Array.isArray(j['@graph']) ? j['@graph'].map(g => g['@type']) : [j['@type']]);
    const hasCollPage = types.includes('CollectionPage');
    const hasBreadcrumbList = types.includes('BreadcrumbList');
    const collPage = jsonLds.flatMap(j => Array.isArray(j['@graph']) ? j['@graph'] : [j]).find(o => o && o['@type'] === 'CollectionPage');
    const bcList = jsonLds.flatMap(j => Array.isArray(j['@graph']) ? j['@graph'] : [j]).find(o => o && o['@type'] === 'BreadcrumbList');
    return {
      title: document.title,
      metaDescCount: metaDesc.length,
      metaDesc,
      ogDescCount: ogDesc.length,
      h1,
      breadcrumb,
      jsonLdTypes: types,
      hasCollPage,
      hasBreadcrumbList,
      collPageName: collPage && collPage.name,
      collPageDesc: collPage && collPage.description,
      collPageAbout: collPage && collPage.about && collPage.about.name,
      bcItems: bcList && (bcList.itemListElement || []).map(i => ({ pos: i.position, name: i.name, item: i.item })),
    };
  });
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-DE' });
  const page = await ctx.newPage();
  for (const h of COLLS) {
    const r = await probe(page, h);
    console.log('=== ' + h + ' ===');
    console.log(JSON.stringify(r, null, 2));
  }
  await browser.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
