import { chromium, devices } from 'playwright';

const COLLECTION_URL = 'https://blechziegel.de/collections/braas';
const CART_URL = 'https://blechziegel.de/cart';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, bypassCSP: true });
const page = await ctx.newPage();

// Track all outbound analytics/tracking requests
const trackingHits = [];
page.on('request', (req) => {
  const url = req.url();
  if (/googletagmanager|google-analytics|analytics\.google|facebook\.com\/tr|facebook\.net|doubleclick|klaviyo|tiktok|pinterest|criteo|bing\.com\/bat|hotjar|clarity|fullstory|mouseflow|segment|snap\.licdn|linkedin/i.test(url)) {
    let postData = req.postData() || '';
    const hasVendorRef = /vendor|BHE/i.test(url) || /vendor|BHE/i.test(postData);
    trackingHits.push({ method: req.method(), url: url.slice(0, 250), hasVendorRef, postSample: postData ? postData.slice(0, 400) : null });
  }
});

// Gather installed third-party scripts (apps.shopifycdn + external hosts)
const externalScripts = [];
page.on('response', async (res) => {
  const u = res.url();
  if (/\.shopifycdn\.com|\.shopifyapps\.com|cdn\.shopify\.com\/extensions/i.test(u) && /\.js(\?|$)/i.test(u)) {
    externalScripts.push(u);
  }
});

// === 1) Collection page — check for visible Vendor filter ===
await page.goto(COLLECTION_URL + '?nv=' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
try { await page.locator('button:has-text("Akzeptieren")').first().click({ timeout: 3000 }); await page.waitForTimeout(500); } catch {}

const collectionAudit = await page.evaluate(() => {
  const txt = (document.body.innerText || '').toLowerCase();
  const sidebar = Array.from(document.querySelectorAll('[class*="filter" i], [class*="facet" i], form[action*="collection"] fieldset, aside'))
    .map(el => (el.innerText || '').trim()).filter(Boolean).slice(0, 20);
  const vendorFilterLabel = sidebar.some(s => /\bvendor\b|anbieter|hersteller/i.test(s));
  // Specifically look for Shopify's filter.v.vendor query param in links
  const vendorParamLinks = Array.from(document.querySelectorAll('a[href*="filter.v.vendor"]')).map(a => a.href).slice(0, 5);
  return { vendorFilterLabel, vendorParamLinks, sidebarPreview: sidebar.slice(0, 5) };
});

// Pick first product
const pdpHref = await page.locator('a[href*="/products/"]').first().getAttribute('href');

// === 2) PDP — inspect dataLayer + Shopify analytics.subscribe payloads ===
await page.goto('https://blechziegel.de' + pdpHref + '?nv=' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(1500);

const pdpDataLayer = await page.evaluate(() => {
  const dl = (window.dataLayer || []).slice(0, 40);
  const str = JSON.stringify(dl);
  return {
    events: dl.map(e => (e && typeof e === 'object' ? Object.keys(e).slice(0, 10) : typeof e)),
    vendorInDataLayer: /vendor/i.test(str),
    bheInDataLayer: /BHE/i.test(str),
    brandInDataLayer: /"brand"/i.test(str),
    sample: str.slice(0, 1500)
  };
});

// Inspect Shopify web pixel / customer_events payload in the HTML source
const pdpHtml = await page.content();
const pdpShopifyPixel = {
  vendorKeyCount: (pdpHtml.match(/"vendor":"BHE Metalle"/g) || []).length,
  brandKeyCount:  (pdpHtml.match(/"brand":\s*"[^"]+"/g) || []).length,
  brandSamples:   (pdpHtml.match(/"brand":\s*"[^"]+"/g) || []).slice(0, 6)
};

// === 3) Cart page — same dataLayer + pixel check ===
await page.evaluate(async () => {
  const vid = document.querySelector('input[name="id"]')?.value;
  if (vid) await fetch('/cart/add.js', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: vid, quantity: 1 }) });
});
await page.goto(CART_URL + '?nv=' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(1500);

const cartDataLayer = await page.evaluate(() => {
  const dl = (window.dataLayer || []).slice(0, 60);
  const str = JSON.stringify(dl);
  return {
    eventCount: dl.length,
    vendorInDataLayer: /vendor/i.test(str),
    bheInDataLayer: /BHE/i.test(str),
    brandInDataLayer: /"brand"/i.test(str)
  };
});

const cartHtml = await page.content();
const cartShopifyPixel = {
  vendorKeyCount: (cartHtml.match(/"vendor":"BHE Metalle"/g) || []).length,
  brandKeyCount:  (cartHtml.match(/"brand":\s*"[^"]+"/g) || []).length,
  brandSamples:   (cartHtml.match(/"brand":\s*"[^"]+"/g) || []).slice(0, 6)
};

// === 4) Aggregate tracking request summary ===
const trackingSummary = {
  totalHits: trackingHits.length,
  byHost: trackingHits.reduce((acc, h) => {
    const host = (h.url.match(/https?:\/\/([^\/]+)/) || [])[1] || 'unknown';
    acc[host] = (acc[host] || 0) + 1;
    return acc;
  }, {}),
  withVendorRef: trackingHits.filter(h => h.hasVendorRef).length,
  samples: trackingHits.filter(h => h.hasVendorRef).slice(0, 5)
};

const externalScriptsSummary = {
  count: externalScripts.length,
  byHost: externalScripts.reduce((acc, u) => {
    const host = (u.match(/https?:\/\/([^\/]+)/) || [])[1] || 'unknown';
    acc[host] = (acc[host] || 0) + 1;
    return acc;
  }, {}),
  samples: externalScripts.slice(0, 10).map(u => u.slice(0, 200))
};

console.log(JSON.stringify({
  collectionAudit,
  pdpDataLayer,
  pdpShopifyPixel,
  cartDataLayer,
  cartShopifyPixel,
  trackingSummary,
  externalScriptsSummary
}, null, 2));

await browser.close();
