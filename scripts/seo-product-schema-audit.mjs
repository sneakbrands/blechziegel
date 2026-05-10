#!/usr/bin/env node
/**
 * SEO Product Schema Audit
 * Fetches each URL, extracts every <script type="application/ld+json">,
 * walks @graph + standalone objects, finds every node with @type=Product,
 * and reports nodes missing offers/aggregateRating/review.
 *
 * Exit code 1 if any Product node is invalid; 0 if all pass.
 *
 * Usage:
 *   node scripts/seo-product-schema-audit.mjs <url1> <url2> ...
 *   node scripts/seo-product-schema-audit.mjs --file urls.txt
 *   (no args) -> uses DEFAULT_URLS below
 */
import fs from 'node:fs';

const DEFAULT_URLS = [
  'https://blechziegel.de/products/pv-dachziegel-frankfurter-pfanne',
  'https://blechziegel.de/en/products/pv-dachziegel-frankfurter-pfanne',
  'https://blechziegel.de/products/bogner-innovo-12',
  'https://blechziegel.de/en/products/bogner-innovo-12',
];

const args = process.argv.slice(2);
let urls = DEFAULT_URLS;
if (args[0] === '--file' && args[1]) {
  urls = fs.readFileSync(args[1],'utf8').split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
} else if (args.length) {
  urls = args;
}

function extractLdJson(html){
  const out = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const raw = m[1].trim();
    try { out.push(JSON.parse(raw)); }
    catch (e) { out.push({ __PARSE_ERROR: e.message, __raw: raw.slice(0,200) }); }
  }
  return out;
}

function walkProducts(node, acc){
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { node.forEach(n => walkProducts(n, acc)); return; }
  // @graph at root
  if (Array.isArray(node['@graph'])) node['@graph'].forEach(n => walkProducts(n, acc));
  const types = node['@type'];
  const isProduct = (Array.isArray(types) ? types.includes('Product') : types === 'Product');
  if (isProduct) acc.push(node);
  // recurse into nested values (in case Product nested in itemListElement etc.)
  for (const k of Object.keys(node)) {
    if (k === '@graph') continue;
    const v = node[k];
    if (v && typeof v === 'object') walkProducts(v, acc);
  }
}

function validate(p){
  const hasOffers = !!p.offers;
  const hasRating = !!p.aggregateRating;
  const hasReview = !!p.review;
  return {
    name: p.name || '(no name)',
    sku: p.sku || null,
    hasOffers,
    hasRating,
    hasReview,
    valid: hasOffers || hasRating || hasReview,
    parseError: p.__PARSE_ERROR || null,
  };
}

let totalProducts = 0;
let invalidCount = 0;
const results = [];

for (const url of urls) {
  let html;
  try {
    const r = await fetch(url, { redirect: 'follow', headers:{'User-Agent':'BZ-Schema-Audit/1.0'} });
    html = await r.text();
    if (!r.ok) {
      results.push({ url, status: r.status, error: `HTTP ${r.status}` });
      console.log(`\n[${r.status}] ${url} -- skipped`);
      continue;
    }
  } catch (e) {
    results.push({ url, error: e.message });
    console.log(`\n[FETCH-ERROR] ${url}: ${e.message}`);
    continue;
  }
  const blocks = extractLdJson(html);
  const products = [];
  blocks.forEach(b => walkProducts(b, products));
  const checks = products.map(validate);
  totalProducts += checks.length;
  const invalids = checks.filter(c => !c.valid);
  invalidCount += invalids.length;
  results.push({ url, ldjsonBlocks: blocks.length, productNodes: checks.length, invalids: invalids.length, checks });
  console.log(`\n=== ${url} ===`);
  console.log(`   ld+json blocks: ${blocks.length}, Product nodes: ${checks.length}, invalid: ${invalids.length}`);
  checks.forEach((c,i) => {
    const flags = [];
    if (c.hasOffers) flags.push('offers');
    if (c.hasRating) flags.push('aggregateRating');
    if (c.hasReview) flags.push('review');
    console.log(`   [${c.valid ? 'OK ':'BAD'}] #${i} "${c.name}" sku=${c.sku || '-'} -> ${flags.join(',') || 'NONE'}`);
  });
}

console.log(`\n---`);
console.log(`Total Product nodes: ${totalProducts}, invalid: ${invalidCount}`);
if (invalidCount === 0) {
  console.log('PASS: all Product JSON-LD nodes valid (have offers/aggregateRating/review)');
  process.exit(0);
} else {
  console.log('FAIL: at least one Product JSON-LD node is missing offers/aggregateRating/review');
  process.exit(1);
}
