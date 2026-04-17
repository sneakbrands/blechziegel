import { chromium } from 'playwright';

const COLLECTIONS = [
  'https://blechziegel.de/collections/braas',
  'https://blechziegel.de/collections/bramac',
  'https://blechziegel.de/collections/creaton',
  'https://blechziegel.de/collections/nelskamp',
  'https://blechziegel.de/collections/pv-dachziegel',
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, bypassCSP: true });
const page = await ctx.newPage();
try { await page.goto('https://blechziegel.de/', { waitUntil: 'networkidle', timeout: 45000 }); await page.locator('button:has-text("Akzeptieren")').first().click({ timeout: 3000 }); } catch {}

const productHandles = new Set();
for (const url of COLLECTIONS) {
  await page.goto(url + '?nv=' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
  const hrefs = await page.$$eval('a[href*="/products/"]', as => as.map(a => a.getAttribute('href')));
  hrefs.filter(Boolean).forEach(h => {
    const m = h.match(/\/products\/([^?#]+)/);
    if (m) productHandles.add(m[1]);
  });
}

// For each product, fetch /products/<handle>.json (Shopify storefront JSON)
const products = [];
for (const handle of productHandles) {
  try {
    const res = await page.evaluate(async (h) => {
      const r = await fetch('/products/' + h + '.json');
      if (!r.ok) return { ok: false, status: r.status };
      const j = await r.json();
      const p = j.product;
      return {
        ok: true,
        handle: p.handle,
        title: p.title,
        vendor: p.vendor,
        type: p.product_type,
        tags: p.tags,
        variantCount: (p.variants || []).length,
        options: (p.options || []).map(o => ({ name: o.name, values: o.values }))
      };
    }, handle);
    products.push(res);
  } catch (e) { products.push({ handle, error: e.message }); }
}

// Check PDP HTML of first product per brand tag for "Frankfurter Pfanne" hardcoding
const brandSamples = {};
const brands = ['braas','bramac','creaton','nelskamp'];
for (const brand of brands) {
  const candidate = products.find(p => p.ok && Array.isArray(p.tags) && p.tags.map(t => t.toLowerCase()).includes(brand));
  if (!candidate) { brandSamples[brand] = null; continue; }
  await page.goto('https://blechziegel.de/products/' + candidate.handle + '?nv=' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
  const html = await page.content();
  const checks = {
    handle: candidate.handle,
    title: candidate.title,
    tags: candidate.tags,
    hardcoded_frankfurter: (html.match(/Frankfurter Pfanne/g) || []).length,
    dynamic_typ_visible: false,
    brand_pill_text: null,
  };
  // Check brand pill content
  try { checks.brand_pill_text = await page.locator('.bz-product-brand-link').first().innerText({ timeout: 2000 }); } catch {}
  brandSamples[brand] = checks;
}

console.log(JSON.stringify({
  collectionsScanned: COLLECTIONS,
  productHandleCount: productHandles.size,
  products: products.map(p => ({ handle: p.handle, title: p.title, tags: p.tags, variantCount: p.variantCount, options: p.options && p.options.map(o => o.name + '=' + o.values.join('|')) })),
  brandSamples
}, null, 2));

await browser.close();
