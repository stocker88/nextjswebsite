const fs=require('node:fs'),assert=require('node:assert/strict'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,f);
const {comparisonChoices,comparisonData}=require('../lib/comparison-data-server.ts'),{cachedPredictionStocks,cachedPredictionDetail}=require('../lib/prediction-cache-server.ts'),{toolAssets}=require('../lib/seo-tools-server.ts'),{cleanCandles}=require('./sync-crypto-history.cjs');
const choices=comparisonChoices();assert(choices.length>1000);assert.equal(new Set(choices.map(c=>c.slug)).size,choices.length);assert.equal(comparisonData('NOT-A-STOCK'),null);
for(const symbol of ['NVDA','AMD','MU','SNDK']){const d=comparisonData(symbol);assert.equal(d.asset.symbol,symbol);assert(d.metrics.every(m=>m.value&&!/NaN|undefined/.test(m.value)));assert(d.news.every(n=>n.href.startsWith('/')));}
const all=toolAssets().filter(a=>a.kind==='stock'&&a.currency==='USD');for(const a of all){const d=cachedPredictionDetail(a.symbol);assert(d&&d.prices.length>=40);assert.equal(d.symbol,a.symbol);assert(d.price>0);}
const now=Date.UTC(2026,10,25),day=86400;const t=now/1000-day;
assert.deepEqual(cleanCandles([[t,1,4,2,3,20],[t+day,1,4,2,3,20],[t-day,4,1,2,3,20],[t-day*2,1,2,1,3,20]],now),[['2026-11-24',3]]);
console.log(JSON.stringify({selectableStocks:choices.length,stockPredictionCompanies:cachedPredictionStocks().length,stockPredictionPeriodPages:cachedPredictionStocks().length*9,cryptoPredictionPages:toolAssets().filter(a=>a.kind==='crypto').length}));
console.log('Coverage, metric serialization, shared news links and completed daily candle checks passed.');
