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
// The newest forty posts need not contain education after fresh reports publish.
// Check the exported page where an education post actually belongs.
const archive=require(path.resolve(out,'../.github-pages-build/data/research.json'));
const educationIndex=archive.findIndex(item=>(item.symbols||[]).some(symbol=>symbol.trim().replace(/^[#$]/,'').toLowerCase()==='education'));
if(educationIndex>=0){const page=Math.floor(educationIndex/40)+1;assert(html(page===1?'stock-market-news':'stock-market-news/page/'+page).includes('EDUCATION'),'Education preview missing from its archive page');}
const newsData=JSON.parse(html('stock-market-news').match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)[1]);
assert.equal(newsData.props.pageProps.items.length,Math.min(40,archive.length),'Latest news previews missing');
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

for(const route of ['premarket-stock-heatmap','after-hours-stock-heatmap']){const page=html(route);assert(page.includes('<table'),'Extended-hours quotes must be pre-rendered');assert(page.includes('NVDA'));assert(!page.includes('FREE SNAPSHOT'),'Removed snapshot badge must stay hidden');assert(page.includes('America/New_York')||page.includes('EDT')||page.includes('EST'));assert(sitemap.includes('/'+route+'/'));}

// Every overview tile and mover must lead to an exported company page.
const curated=require('../../data/stocks.json');
const profiles=require(path.resolve(out,'../.github-pages-build/data/heatmap-stock-profiles.json'));
const homepage=html('');
for(const stock of profiles){
 const match=curated.find(item=>item.ticker===stock.symbol);
 const route=match?'stocks/'+match.slug:'instruments/'+encodeURIComponent(stock.symbol);
 assert(fs.existsSync(path.join(out,route,'index.html')),`Missing heatmap company page: ${stock.symbol}`);
 assert(homepage.includes(`href="/${route}/"`),`Missing overview stock link: ${stock.symbol}`);
}
console.log(`Stock links verified for all ${profiles.length} heatmap companies.`);
