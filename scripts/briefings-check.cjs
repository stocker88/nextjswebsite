const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,f);
const {briefings,briefingUrl,briefingSchema,isMarketBriefing}=require('../lib/market-briefings.ts');const seen=new Set();
for(const a of briefings){assert.equal(a.id,a.postId);assert(a.sections.length>=3);assert(a.symbols.length>0);assert(!seen.has(briefingUrl(a)));seen.add(briefingUrl(a));const s=briefingSchema(a);assert.equal(s['@type'],'NewsArticle');assert.equal(s.mainEntityOfPage,'https://www.stockstobuynow.ai'+briefingUrl(a));assert(Number.isFinite(Date.parse(s.datePublished)));assert(s.articleBody.length>200);assert(a.sources.every(s=>s.url.startsWith('https://')));if(a.images){const titles=a.kind==='post_close'?['1D heatmap, market pulse and movers','Recent and upcoming earnings and market events','Market heatmap & movers']:a.kind==='premarket'?['Pre-market heatmap, market pulse and movers','Recent and upcoming earnings and market events',...(a.images.length===3?['Market heatmap & movers']:[])]:['Financials','Technicals','Earnings & Peers'];assert.equal(a.images.length,titles.length);assert.deepEqual(a.images.map(i=>i.title),titles);assert.equal(s.image.length,titles.length+(a.leadImage?1:0));}}
const meta=fs.readFileSync('components/StockSearchMetadata.tsx','utf8');assert(meta.includes('key="canonical"'));assert(meta.includes("'/stocks/[ticker]'"));assert(meta.includes('stockPageHref(symbol)'));assert(meta.includes('noindex,follow'));assert(fs.readFileSync('components/ResearchPage.tsx','utf8').includes('key="canonical"'));
console.log('Briefing routes, article metadata, unique URLs, source evidence and stock canonical guards passed.');

const page=fs.readFileSync('components/MarketBriefingPage.tsx','utf8');assert(page.includes('<ResearchImages appOnly={false}'));assert(page.includes('a.images.map'));

const closing={kind:'post_close',slug:'closing-market-recap-2026-10-23'};
assert(isMarketBriefing(closing));assert.equal(briefingUrl(closing),'/news/briefings/closing-market-recap-2026-10-23/');
assert(!isMarketBriefing({kind:'earnings_preview'}));
assert(fs.readFileSync('components/MarketInsightCard.tsx','utf8').includes("a.images[2],title:'After-hours heatmap & movers'"));
