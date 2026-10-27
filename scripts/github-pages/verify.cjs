const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const out=path.resolve(process.argv[2]||'out');
const html=route=>fs.readFileSync(path.join(out,route,'index.html'),'utf8');
const sitemap=fs.readFileSync(path.join(out,'sitemap.xml'),'utf8');
const newsSitemap=fs.readFileSync(path.join(out,'news-sitemap.xml'),'utf8');
const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1].replace(/&amp;/g,'&'));
const newsUrls=[...newsSitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1].replace(/&amp;/g,'&'));
assert(urls.length>100,'Sitemap missing content');
assert.equal(new Set(urls).size,urls.length,'Duplicate canonical URLs');
assert(newsSitemap.includes('xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"'),'Google News namespace missing');
assert(newsSitemap.includes('<news:name>Stocks To Buy Now AI</news:name>'),'Google News publication name missing');
assert.equal(new Set(newsUrls).size,newsUrls.length,'Duplicate Google News URLs');
assert(newsUrls.length<=1000,'Google News sitemap exceeds 1,000 URLs');
for(const url of urls){
 const parsed=new URL(url);assert.equal(parsed.host,'www.stockstobuynow.ai');assert.equal(parsed.search,'');
 const route=decodeURIComponent(parsed.pathname).replace(/^\//,'');
 assert(fs.existsSync(path.join(out,route,'index.html')),`Sitemap target missing: ${url}`);
}
for(const url of newsUrls){
 const parsed=new URL(url);assert.equal(parsed.host,'www.stockstobuynow.ai');
 const route=decodeURIComponent(parsed.pathname).replace(/^\//,'');
 assert(fs.existsSync(path.join(out,route,'index.html')),`Google News target missing: ${url}`);
}
for(const match of newsSitemap.matchAll(/<news:publication_date>(.*?)<\/news:publication_date>/g)){
 const published=Date.parse(match[1]);assert(Number.isFinite(published),'Invalid Google News publication date');
 assert(published>=Date.now()-48*60*60*1000-5*60*1000,'Google News sitemap contains an article older than two days');
 assert(published<=Date.now()+5*60*1000,'Google News sitemap contains a future article');
}
assert(fs.readFileSync(path.join(out,'robots.txt'),'utf8').includes('https://www.stockstobuynow.ai/news-sitemap.xml'),'robots.txt does not advertise the Google News sitemap');
console.log(`Google News sitemap verified with ${newsUrls.length} fresh public articles.`);
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

// Result cards must resolve to individually exported reports, including after feed refreshes.
const optionReports=require(path.resolve(out,'../.github-pages-build/data/option-results.json'));
for(const report of optionReports){
 const route='results/'+report.id.toLowerCase().replace(/_/g,'-');
 const canonical='https://www.stockstobuynow.ai/'+route+'/';
 assert(html('results').includes('data-app-post-id="'+report.id+'"'),'Direct Results archive must render public previews');
 assert(html('results').includes('href="/'+route+'/"'),'Result preview links must remain crawlable');
 assert(html('results').includes('data-account-required="true"'),'Result clicks must use the account prompt');
 assert(html(route).includes(canonical),'Missing result canonical: '+report.id);
 assert(sitemap.includes(canonical),'Missing result sitemap entry: '+report.id);
 assert(!html(route).includes('What happened'),'Anonymous result HTML must not contain the protected section: '+report.id);
 const pageData=JSON.parse(html(route).match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)[1]);
 assert(!Object.hasOwn(pageData.props.pageProps.result,'recap')&&!Object.hasOwn(pageData.props.pageProps.result,'text'),'Protected report copy leaked into static props');
 for(const image of report.images)assert(html(route).includes(image.url.replace(/&/g,'&amp;')),'Full result image missing: '+report.id);
}
console.log(`Verified ${optionReports.length} individual result pages and archive links.`);

const closingRecaps=require(path.resolve(out,'../.github-pages-build/data/market-briefings.json')).filter(a=>a.kind==='post_close');
for(const recap of closingRecaps){
 const route='news/briefings/'+recap.slug,canonical='https://www.stockstobuynow.ai/'+route+'/';
 assert(html('news').includes('href="/'+route+'/"'),'Missing closing recap in Movers');
 assert(html(route).includes(canonical),'Missing closing recap canonical');
 assert(!html(route).includes('Checking your access'),'Direct recap URLs must render without a login gate');
 assert(html(route).includes('<article'),'Direct recap must render its article body');
 assert(html(route).includes(recap.sections[0].heading),'Recap section headings must be server-rendered');
 const recapData=JSON.parse(html(route).match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)[1]).props.pageProps.article;
 assert.equal(recapData.kind,'post_close','Missing closing session classification');
 assert.equal(recapData.postId,recap.postId,'Closing recap identity changed');
 assert(html(route).includes(recap.postId),'Missing original app recap identity');
 assert(sitemap.includes(canonical),'Missing closing recap sitemap entry');
 for(const image of recap.images)assert(recapData.images.some(item=>item.url===image.url),'Missing original closing recap image');
}
console.log(`Verified ${closingRecaps.length} closing recaps, original galleries and Movers archive links.`);

for(const route of ['login','membership','account','continue'])assert(fs.existsSync(path.join(out,route,'index.html')),'Missing account/access route: '+route);
console.log('Verified login, membership, account and desktop continuation exports.');
