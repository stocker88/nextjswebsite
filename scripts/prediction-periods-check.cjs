const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,f);
const p=require('../lib/prediction-periods.ts');
const detail={price:100,priceDate:'2026-11-23',prices:Array.from({length:61},(_,i)=>({date:new Date(Date.UTC(2026,8,23+i)).toISOString().slice(0,10),close:100*Math.exp(i%2?.01:0)}))};
assert.equal(p.horizonEnd('tomorrow','2026-11-25'),'2026-11-27');
assert.equal(p.horizonEnd('tomorrow','2026-12-24'),'2026-12-28');
assert.equal(p.horizonEnd('tomorrow','2027-12-30'),'2027-12-31');
assert.equal(p.scenarioStocks.length,4);assert.equal(p.periods.length,9);
assert.equal(p.growthPrice(100,2,10,-3),100*1.1**2*.97**2);
assert.equal(p.projection(detail,'today','2026-11-24'),null);
assert.equal(p.projection({...detail,priceDate:'2026-10-01'},'2030','2026-11-24'),null);
assert.equal(p.projection({...detail,priceDate:'2026-11-25'},'2030','2026-11-24'),null);
assert.equal(p.projection(detail,'2026','2027-01-01'),null);
assert.equal(p.volatility({...detail,prices:detail.prices.slice(0,5)},'2026-11-23'),null);
assert.equal(p.volatility({...detail,prices:detail.prices.map((v,i)=>({...v,close:i===40?500:v.close}))},'2026-11-23'),null);
const short=p.projection(detail,'next-month','2026-11-24');assert(short&&!short.long);assert.equal(short.values[1],100);assert(short.values[0]<100&&short.values[2]>100);
const long=p.projection(detail,'2030','2026-11-24');assert(long.long);assert.equal(long.points[0].central,100);assert.equal(long.points.at(-1).central,long.values[1]);
assert(long.values[0]<long.values[1]&&long.values[1]<long.values[2]);
assert.equal(p.projection(detail,'2030','2026-11-24',0,0).values[1],100);
const urls=p.scenarioStocks.flatMap(s=>p.periods.map(h=>p.periodPath(s,h.id)));assert.equal(new Set(urls).size,36);
assert(urls.every(u=>/^\/prediction\/.+-stock-price-prediction\/(today|tomorrow|next-week|next-month|20\d\d)\/$/.test(u)));
console.log('Prediction periods: 36 unique routes; model math, stale/future dates, insufficient history and possible split guards passed.');

for(const [symbol,target] of Object.entries(p.upside2030)){const m=p.projection({...detail,symbol},'2030','2026-11-24');assert(Math.abs(m.values[1]-target)<1e-6);assert(m.values[0]<detail.price,'Upside goal must not become a floor');assert(m.values[2]>target);assert.equal(m.labels[1],'Upside scenario');assert.equal(p.projection({...detail,symbol},'2030','2026-11-24',0,0).values[1],100);}
console.log('2030 upside goals: reverse-calculated growth, independent downside, stretch and slider overrides passed.');
