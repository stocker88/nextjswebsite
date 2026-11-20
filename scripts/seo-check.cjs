const assert=require('node:assert/strict');
const fs=require('fs');
const {validateArticle}=require('./publish-public-article.cjs');
const valid={postId:'test',summary:'Public summary',paragraphs:['Evidence.','Interpretation.'],sources:[{title:'Company release',url:'https://example.com/release'}],author:{name:'Author',url:'https://example.com/author'},reviewer:'Reviewer',publishedAt:'2025-01-01T00:00:00Z',updatedAt:'2025-01-01T00:00:00Z',aiAssisted:true,disclosure:'No position.',approved:true};
assert.equal(validateArticle(valid).summary,'Public summary');
assert.throws(()=>validateArticle({...valid,approved:false}));assert.throws(()=>validateArticle({...valid,sources:[]}));assert.throws(()=>validateArticle({...valid,updatedAt:'2039-01-01'}));
assert(!fs.existsSync('public/sitemap.xml'),'Static file conflicts with dynamic sitemap');
const hub=fs.readFileSync('pages/stock-market-news/index.tsx','utf8');assert(hub.includes('.slice(0,40)'));assert(hub.includes('/stock-market-news/page/'));
assert(!fs.readFileSync('lib/research.ts','utf8').includes('data/research.json'),'Archive must stay server-side');
const stocks=JSON.parse(fs.readFileSync('data/stocks.json','utf8'));assert.equal(new Set(stocks.map(s=>s.slug)).size,stocks.length);
console.log('SEO regression checks passed');

const config = require("../next.config");
config.redirects().then(rules => assert(rules.some(r => r.source === "/stocks-to-buy-now/:path*" && r.destination === "/stock-market-news/:path*" && r.permanent)));

// Related previews are used by static stock, catalyst and results pages.
const ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,f);
const {recentStockNews}=require('../lib/stock-related-research.ts');
const {isSerializableProps}=require('next/dist/lib/is-serializable-props');
const fixture={id:'excerpt-fixture',title:'Research headline',time:1,symbols:['NVDA'],likes:0,comments:0,shares:0};
for(const preview of [fixture,{...fixture,quickTake:'First line of research.'},{...fixture,educationPreview:'Public education preview.'}]){
 const items=recentStockNews([preview],'NVDA',new Date('2030-01-01'));
 assert(isSerializableProps('/stocks/nvda','getStaticProps',{items}));
 const result=items.find(item=>item.id===fixture.id);
 assert.equal(result.quickTake,preview.quickTake||'');
 assert.equal(result.educationPreview,preview.educationPreview||'');
}
console.log('Related research excerpts: optional summaries remain serializable for static export.');

const {catalog}=require('../lib/catalog.ts');
const {predictionStocks,predictionPath,stockPredictionHref}=require('../lib/stock-predictions.ts');
const equities=catalog.filter(item=>item.type==='EQUITY');
assert.equal(predictionStocks.length,equities.length);
assert.equal(new Set(predictionStocks.map(predictionPath)).size,predictionStocks.length,'Prediction URL collision');
for(const item of catalog)assert.equal(Boolean(stockPredictionHref(item.symbol)),item.type==='EQUITY','Prediction coverage: '+item.symbol);
for(const [ticker,slug] of [['NVDA','nvidia'],['SNDK','sandisk'],['GOOGL','google']])assert.equal(stockPredictionHref(ticker),'/prediction/'+slug+'-stock-price-prediction');
console.log(`Verified unique prediction URLs for all ${equities.length} equities.`);
