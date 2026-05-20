#!/usr/bin/env node
/**
 * SEO Site-Issues Audit
 *
 * Crawlt eine Seed-Liste, extrahiert je URL die wichtigsten SEO-Signale,
 * detektiert Probleme aus dem GSC-/Site-Audit-Katalog (ausser den separat
 * behandelten "Duplicate meta descriptions" und "Structured data markup errors")
 * und schreibt:
 *   - audits/latest-seo-issues.json
 *   - audits/latest-seo-issues.md
 *
 * Usage: node scripts/seo-site-issues-audit.mjs [--seed urls.txt]
 */
import fs from 'node:fs';
import path from 'node:path';

const SEEDS = [
  'https://blechziegel.de/',
  'https://blechziegel.de/pages/haendler',
  'https://blechziegel.de/pages/versand',
  'https://blechziegel.de/pages/montageanleitung-mit-dachhaken',
  'https://blechziegel.de/pages/montageanleitung-ohne-dachhaken',
  'https://blechziegel.de/pages/ziegel-finder',
  'https://blechziegel.de/pages/ratgeber',
  'https://blechziegel.de/pages/hersteller',
  'https://blechziegel.de/pages/ziegel-anfrage',
  'https://blechziegel.de/pages/contact',
  'https://blechziegel.de/pages/agb',
  'https://blechziegel.de/pages/datenschutz',
  'https://blechziegel.de/policies/refund-policy',
  'https://blechziegel.de/pages/impressum',
  'https://blechziegel.de/pages/zahlung',
  'https://blechziegel.de/pages/anfrage-erfolg',
  'https://blechziegel.de/collections/all',
  'https://blechziegel.de/collections/braas',
  'https://blechziegel.de/collections/bramac',
  'https://blechziegel.de/collections/creaton',
  'https://blechziegel.de/collections/nelskamp',
  'https://blechziegel.de/collections/pv-dachziegel',
  'https://blechziegel.de/collections/dachhaken',
  'https://blechziegel.de/collections/zubehoer',
  'https://blechziegel.de/products/pv-dachziegel-frankfurter-pfanne',
  'https://blechziegel.de/products/bogner-innovo-12',
  'https://blechziegel.de/blogs/news',
];

const HOST = 'blechziegel.de';
const NON_DESCRIPTIVE = new Set(['hier','mehr','weiter','klicken','klick','more','here','click','read more']);

function getMatch(html, re) { const m = html.match(re); return m ? m[1] : null; }
function getAllMatches(html, re) { return [...html.matchAll(re)].map(m=>m); }

function parseDocLevel(html) {
  const hasDoctype = /^\s*<!doctype/i.test(html.slice(0, 200));
  const langAttr = getMatch(html, /<html[^>]*\blang="([^"]*)"/i);
  const viewport = getMatch(html, /<meta[^>]+name="viewport"[^>]*content="([^"]*)"/i);
  return { hasDoctype, langAttr, viewport };
}

function parseHead(html) {
  const titleM = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleM ? titleM[1].replace(/\s+/g,' ').trim() : '';
  const desc = getMatch(html, /<meta\s+name="description"\s+content="([^"]*)"/i);
  const ogd  = getMatch(html, /<meta\s+property="og:description"\s+content="([^"]*)"/i);
  const robots = getMatch(html, /<meta\s+name="robots"\s+content="([^"]*)"/i);
  const canonical = getMatch(html, /<link\s+rel="canonical"\s+href="([^"]*)"/i);
  const hreflangs = getAllMatches(html, /<link\s+rel="alternate"[^>]*hreflang="([^"]+)"[^>]*href="([^"]+)"/g)
    .map(m => ({ hreflang: m[1], href: m[2] }));
  return { title, description: desc, ogDescription: ogd, robots, canonical, hreflangs };
}

function stripHtml(html) {
  // remove scripts/styles + tags, collapse whitespace
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseBody(html) {
  // h1 count + texts
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map(m=>stripHtml(m[1]));
  // text length (rough)
  const text = stripHtml(html);
  const wordCount = text ? text.split(/\s+/).length : 0;
  const htmlSize = html.length;
  const textRatio = htmlSize ? +(text.length / htmlSize * 100).toFixed(1) : 0;
  return { h1s, wordCount, htmlSize, textRatio };
}

function parseLinks(html, currentUrl) {
  // extract <a> tags with href + inner text
  const anchors = [];
  const re = /<a\s+([^>]*?)>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const attrs = m[1];
    const inner = m[2];
    const href = (attrs.match(/href="([^"]*)"/i) || [])[1];
    if (!href) continue;
    if (/^(mailto:|tel:|javascript:|#)/i.test(href)) continue;
    const ariaLabel = (attrs.match(/aria-label="([^"]*)"/i) || [])[1];
    const title = (attrs.match(/title="([^"]*)"/i) || [])[1];
    const innerText = stripHtml(inner);
    const innerHasImg = /<img\b/i.test(inner);
    let abs;
    try { abs = new URL(href, currentUrl).href; } catch { continue; }
    const isExternal = !abs.includes('://' + HOST) && !abs.includes('://www.' + HOST);
    anchors.push({ href: abs, isExternal, innerText, ariaLabel, title, innerHasImg });
  }
  return anchors;
}

async function fetchUrl(url) {
  try {
    const r = await fetch(url, { redirect: 'follow', headers:{'User-Agent':'BZ-SEO-Audit/1.0','Accept-Language':'de'} });
    const status = r.status;
    const finalUrl = r.url;
    const ct = r.headers.get('content-type') || '';
    const html = ct.includes('text/html') ? await r.text() : '';
    return { status, finalUrl, html };
  } catch (e) { return { status: 0, finalUrl: url, html: '', error: e.message }; }
}

const seedSet = new Set(SEEDS);
const audited = new Map();

console.log(`Crawling ${SEEDS.length} seed URLs...`);
for (const url of SEEDS) {
  const r = await fetchUrl(url);
  audited.set(url, r);
  process.stdout.write('.');
}
process.stdout.write('\n');

// Build issue records
const issues = {
  titleMissing: [],
  titleTooLong: [],
  descMissing: [],
  descTooLong: [],
  multipleH1: [],
  missingH1: [],
  doctypeMissing: [],
  viewportMissing: [],
  langMissing: [],
  hreflangMissing: [],
  hreflangBroken: [],   // pointing to 404 / non-existent locale
  lowWordCount: [],
  lowTextRatio: [],
  blockedByRobots: [],  // robots noindex on page
  brokenExternalLinks: [],
  linksNoAnchor: [],
  linksNonDescriptive: [],
  pagesWithFewInternalLinks: [],
  status404: [],
  // Erweiterte Checks (Phase 6 / Semrush-Mapping):
  canonicalEmpty: [],         // leerer / fehlender Canonical
  canonicalWithQuery: [],     // Canonical mit Query-Parameter (Filter-/UTM-Drift)
  internal4xx: [],            // intern verlinkte URL antwortet 4xx
  internal3xx: [],            // intern verlinkte URL antwortet 3xx (Redirect-Chain)
  noindexPages: [],           // Seite traegt robots noindex (informativ)
  ralLegacyMentions: [],      // 'RAL 7016' im HTML (sollte 'RAL 2021' sein)
  shippingThresholdLegacy: [],// '50 €' / '50,00 €' Versand-Wording (sollte '100 €' sein)
  shippingThresholdTarget: [],// '100 €' / '100,00 €' Versand-Wording (Soll-Zustand)
};

const externalLinks = new Map();   // dedupe across pages
const internalLinkCount = {};      // count incoming internal references (rough, only across audited)

for (const [url, r] of audited) {
  if (!r.html) {
    if (r.status >= 400) issues.status404.push({ url, status: r.status });
    continue;
  }
  const head = parseHead(r.html);
  const body = parseBody(r.html);
  const doc  = parseDocLevel(r.html);
  const links = parseLinks(r.html, url);

  // Doc-level
  if (!doc.hasDoctype) issues.doctypeMissing.push({ url });
  if (!doc.viewport) issues.viewportMissing.push({ url });
  if (!doc.langAttr) issues.langMissing.push({ url });

  // Head
  if (!head.title) issues.titleMissing.push({ url });
  else if (head.title.length > 60) issues.titleTooLong.push({ url, title: head.title, length: head.title.length });

  if (!head.description || head.description.trim().length === 0) issues.descMissing.push({ url });
  else if (head.description.length > 160) issues.descTooLong.push({ url, length: head.description.length });

  if (!head.hreflangs.length) issues.hreflangMissing.push({ url });

  if (head.robots && /noindex/i.test(head.robots)) {
    issues.blockedByRobots.push({ url, robots: head.robots });
    issues.noindexPages.push({ url, robots: head.robots });
  }

  // Canonical-Checks
  if (!head.canonical || head.canonical.trim() === '') {
    issues.canonicalEmpty.push({ url });
  } else if (head.canonical.includes('?')) {
    issues.canonicalWithQuery.push({ url, canonical: head.canonical });
  }

  // Content-Drift-Checks (RAL 7016 / Versand-Schwellenwert)
  // Anthrazit-Projektstandard: RAL 7021 (Schwarzgrau). Sowohl RAL 7016 als auch
  // die historisch falsche RAL-2021-Notation gelten als Legacy.
  if (/\bRAL\s*(7016|2021)\b/i.test(r.html)) {
    issues.ralLegacyMentions.push({ url, hint: 'sollte RAL 7021 sein' });
  }
  // Versand-Sprache: nur Treffer, die nah an Versand-/Shipping-Begriffen liegen,
  // damit zufaellige 50-€-Vorkommnisse (z. B. „ab 50 Stueck") nicht reinrutschen.
  const _shipCtx = /(versand[a-z]*|kostenlos[a-z]*|kostenfrei[a-z]*|gratis|shipping|mindestbestell[a-z]*).{0,80}(50\s*€|50,00\s*€|\b50\s*Euro)/i;
  if (_shipCtx.test(r.html)) {
    issues.shippingThresholdLegacy.push({ url, hint: 'sollte „ab 100 €" sein' });
  }
  const _shipCtx100 = /(versand[a-z]*|kostenlos[a-z]*|kostenfrei[a-z]*|gratis|shipping).{0,80}(100\s*€|100,00\s*€|\b100\s*Euro)/i;
  if (_shipCtx100.test(r.html)) {
    issues.shippingThresholdTarget.push({ url });
  }

  // Body
  if (body.h1s.length === 0) issues.missingH1.push({ url });
  else if (body.h1s.length > 1) issues.multipleH1.push({ url, count: body.h1s.length, samples: body.h1s.slice(0,3) });

  if (body.wordCount < 200) issues.lowWordCount.push({ url, wordCount: body.wordCount });
  if (body.textRatio < 5) issues.lowTextRatio.push({ url, ratio: body.textRatio, htmlSize: body.htmlSize });

  // Links
  let internalCount = 0;
  for (const a of links) {
    if (a.isExternal) externalLinks.set(a.href, (externalLinks.get(a.href)||{ pages:[], anchor:a.innerText }));
    else {
      internalCount++;
      const key = a.href.split('#')[0];
      internalLinkCount[key] = (internalLinkCount[key]||0) + 1;
    }
    const txt = (a.innerText || '').trim();
    const ariaOrTitle = (a.ariaLabel || a.title || '').trim();
    if (!txt && !ariaOrTitle && !a.innerHasImg) {
      issues.linksNoAnchor.push({ url, href: a.href });
    } else if (txt && NON_DESCRIPTIVE.has(txt.toLowerCase())) {
      issues.linksNonDescriptive.push({ url, href: a.href, text: txt });
    }
  }
}

// Probe interne Links (alle intern verlinkten URLs, deduped, HEAD-Check)
const internalLinks = new Set();
for (const [, r] of audited) {
  if (!r.html) continue;
  for (const a of parseLinks(r.html, r.finalUrl || '')) {
    if (a.isExternal) continue;
    const key = a.href.split('#')[0];
    if (audited.has(key)) continue; // bereits gecrawlt
    internalLinks.add(key);
  }
}
console.log(`\nProbing ${internalLinks.size} unique internal (non-seed) links...`);
let _i = 0;
for (const link of internalLinks) {
  try {
    const r = await fetch(link, { method: 'HEAD', redirect: 'manual', headers:{'User-Agent':'BZ-SEO-Audit/1.0'} });
    if (r.status >= 300 && r.status < 400) issues.internal3xx.push({ href: link, status: r.status, location: r.headers.get('location') || '' });
    else if (r.status >= 400) issues.internal4xx.push({ href: link, status: r.status });
  } catch (e) {
    issues.internal4xx.push({ href: link, error: e.message });
  }
  _i++;
  if (_i % 15 === 0) process.stdout.write('.');
}
process.stdout.write('\n');

// Probe external links (sample only)
console.log(`\nProbing ${externalLinks.size} unique external links...`);
let probed = 0;
for (const [link] of externalLinks) {
  try {
    const r = await fetch(link, { method: 'HEAD', redirect: 'follow', headers:{'User-Agent':'BZ-SEO-Audit/1.0'} });
    if (r.status >= 400) issues.brokenExternalLinks.push({ href: link, status: r.status });
  } catch (e) {
    issues.brokenExternalLinks.push({ href: link, error: e.message });
  }
  probed++;
  if (probed % 10 === 0) process.stdout.write('.');
}
process.stdout.write('\n');

// Internal-link-count: pages with <=1 incoming reference among the seed set
const oneOrFewerInternalRefs = Object.entries(internalLinkCount)
  .filter(([url, count]) => audited.has(url) && count <= 1)
  .map(([url, count]) => ({ url, incomingRefs: count }));
issues.pagesWithFewInternalLinks = oneOrFewerInternalRefs;

// Output
const outDir = path.join(process.cwd(), 'audits');
fs.mkdirSync(outDir, { recursive: true });
const summary = Object.fromEntries(Object.entries(issues).map(([k,v]) => [k, v.length]));
const json = { generatedAt: new Date().toISOString(), seeds: SEEDS.length, summary, issues };
fs.writeFileSync(path.join(outDir, 'latest-seo-issues.json'), JSON.stringify(json, null, 2), 'utf8');

// Datei-Hint aus URL ableiten (best-effort, hilft beim Lokalisieren im Repo)
function fileHint(u) {
  try {
    const p = new URL(u).pathname;
    if (p === '/' || p === '') return 'templates/index.json + sections/blechziegel-home.liquid';
    if (p.startsWith('/products/')) return 'templates/product.json + sections/blechziegel-product.liquid';
    if (p.startsWith('/collections/')) return 'templates/collection.json + sections/blechziegel-collection.liquid';
    if (p.startsWith('/pages/hersteller')) return 'snippets/blechziegel-hersteller.liquid';
    if (p.startsWith('/pages/ratgeber')) return 'snippets/blechziegel-ratgeber.liquid';
    if (p.startsWith('/pages/gewerbe')) return 'snippets/blechziegel-gewerbe.liquid';
    if (p.startsWith('/pages/versand')) return 'snippets/blechziegel-versand.liquid';
    if (p.startsWith('/pages/contact')) return 'sections/contact-blechziegel.liquid';
    if (p.startsWith('/pages/')) return 'sections/blechziegel-home.liquid (Page-Renderer) bzw. templates/page.*.json';
    if (p.startsWith('/blogs/')) return 'sections/main-blog.liquid / sections/main-article.liquid';
    if (p === '/search' || p.startsWith('/search')) return 'sections/search-results.liquid';
    return null;
  } catch { return null; }
}

let md = `# SEO Site-Issues Audit\n\nGenerated: ${json.generatedAt}\nSeeds: ${SEEDS.length}\n\n## Summary\n\n`;
for (const [k,v] of Object.entries(summary)) md += `- ${k}: **${v}**\n`;
md += '\n';
for (const [k, v] of Object.entries(issues)) {
  if (v.length === 0) continue;
  md += `\n## ${k} (${v.length})\n\n`;
  for (const it of v.slice(0, 50)) {
    const hint = it.url ? fileHint(it.url) : null;
    md += `- ${JSON.stringify(it)}${hint ? `\n  - Datei-Hinweis: \`${hint}\`` : ''}\n`;
  }
  if (v.length > 50) md += `- ... +${v.length-50} more\n`;
}
fs.writeFileSync(path.join(outDir, 'latest-seo-issues.md'), md, 'utf8');

console.log('\n=== Summary ===');
for (const [k,v] of Object.entries(summary)) console.log(`  ${k.padEnd(32)} ${v}`);
console.log(`\nWrote audits/latest-seo-issues.json + .md`);
