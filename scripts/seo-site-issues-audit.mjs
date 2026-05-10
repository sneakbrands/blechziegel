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
  'https://blechziegel.de/pages/datenschutzerklaerung',
  'https://blechziegel.de/pages/impressum',
  'https://blechziegel.de/pages/widerrufsbelehrung',
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

  if (head.robots && /noindex/i.test(head.robots)) issues.blockedByRobots.push({ url, robots: head.robots });

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

let md = `# SEO Site-Issues Audit\n\nGenerated: ${json.generatedAt}\nSeeds: ${SEEDS.length}\n\n## Summary\n\n`;
for (const [k,v] of Object.entries(summary)) md += `- ${k}: **${v}**\n`;
md += '\n';
for (const [k, v] of Object.entries(issues)) {
  if (v.length === 0) continue;
  md += `\n## ${k} (${v.length})\n\n`;
  for (const it of v.slice(0, 50)) md += `- ${JSON.stringify(it)}\n`;
  if (v.length > 50) md += `- ... +${v.length-50} more\n`;
}
fs.writeFileSync(path.join(outDir, 'latest-seo-issues.md'), md, 'utf8');

console.log('\n=== Summary ===');
for (const [k,v] of Object.entries(summary)) console.log(`  ${k.padEnd(32)} ${v}`);
console.log(`\nWrote audits/latest-seo-issues.json + .md`);
