import { chromium, devices } from 'playwright';
const browser = await chromium.launch();
async function shoot(page, name, viewport){
  await page.screenshot({ path: `screenshots/${viewport}-${name}.png`, fullPage: false });
  console.log('shot', name);
}
async function dismiss(page){
  for (const sel of ['button:has-text("Akzeptieren")','.shopify-pc__banner__btn-accept']){
    try{ const e=page.locator(sel).first(); if(await e.isVisible({timeout:1000})){await e.click();await page.waitForTimeout(300);return;}}catch{}
  }
}
const URLS=[
  ['hersteller-hub','/pages/hersteller'],
];
for (const [tag, viewport] of [['1440', {width:1440,height:900}], ['mobile', null]]){
  const ctx = viewport ? await browser.newContext({ viewport, locale:'de-DE' }) : await browser.newContext({...devices['iPhone 13'], locale:'de-DE'});
  const page = await ctx.newPage();
  for (const [name,path] of URLS){
    await page.goto('https://blechziegel.de'+path+'?nv='+Date.now(),{waitUntil:'domcontentloaded',timeout:30000});
    await page.waitForTimeout(900);
    await dismiss(page);
    await page.waitForTimeout(300);
    await shoot(page, name+'-top', tag==='1440'?'desktop':'mobile');
    await page.evaluate(()=>window.scrollBy(0,window.innerHeight*1.0));
    await page.waitForTimeout(400);
    await shoot(page, name+'-mid', tag==='1440'?'desktop':'mobile');
    const meta = await page.evaluate(()=>{
      const $$=s=>Array.from(document.querySelectorAll(s));
      const linksToColl = $$('a[href*="/collections/"]').slice(0,30).map(a=>({href:a.getAttribute('href'),text:a.textContent.trim().slice(0,60)}));
      return {
        title:document.title,
        h1:$$('h1').map(h=>h.textContent.trim()),
        h2:$$('h2').map(h=>h.textContent.trim()).slice(0,8),
        sectionsCount:$$('section').length,
        linksToCollections: linksToColl.length,
        first10Links: linksToColl.slice(0,10),
        breadcrumbVisible: !!document.querySelector('.bz-col-breadcrumb,nav[aria-label*="readcrumb" i]'),
      };
    });
    console.log('META', tag, name, JSON.stringify(meta,null,2));
  }
  await ctx.close();
}
await browser.close();
