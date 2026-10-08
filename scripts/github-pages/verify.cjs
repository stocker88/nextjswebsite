const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const out=path.resolve(process.argv[2]||'out');
const html=route=>fs.readFileSync(path.join(out,route,'index.html'),'utf8');
const sitemap=fs.readFileSync(path.join(out,'sitemap.xml'),'utf8');
const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1].replace(/&amp;/g,'&'));
assert(urls.length>100,'Sitemap missing content');
assert.equal(new Set(urls).size,urls.length,'Duplicate canonical URLs');
for(const url of urls){
 const parsed=new URL(url);assert.equal(parsed.host,'www.stockstobuynow.ai');assert.equal(parsed.search,'');
 const route=decodeURIComponent(parsed.pathname).replace(/^\//,'');
 assert(fs.existsSync(path.join(out,route,'index.html')),`Sitemap target missing: ${url}`);
}
assert(html('stocks').includes('NVDA'),'Stock directory is not pre-rendered');
assert(html('stocks/page/2').replace(/<!--.*?-->/g,'').includes('Page 2'),'Directory pagination missing');
assert(html('stock-market-news').includes('EDUCATION'),'Education previews missing');
assert(html('stocks-to-buy-now').includes('http-equiv="refresh"'),'Old hub redirect missing');
const article=urls.find(url=>url.includes('/stock-market-news/')&&url.includes('--'));
const articlePath=new URL(article).pathname;
assert(html(decodeURIComponent(articlePath)).includes(article),'Article canonical missing');
const id=articlePath.split('--').pop();
assert(html('stock-market-news/'+id).includes('http-equiv="refresh"'),'Old ID redirect missing');
assert(html('stocks-to-buy').includes('Earnings per Share'),'Signal metric preview missing');
assert(fs.existsSync(path.join(out,'404.html'))||fs.existsSync(path.join(out,'404/index.html')));
assert(fs.existsSync(path.join(out,'.nojekyll')));
console.log(`Static deployment checks passed: ${urls.length} sitemap URLs resolve to exported HTML.`);
