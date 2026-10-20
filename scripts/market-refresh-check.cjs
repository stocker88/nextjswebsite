const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript');
const mod={exports:{}};
const source=fs.readFileSync('lib/scheduled-market-refresh.ts','utf8');
const output=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText;
vm.runInNewContext(output,{exports:mod.exports,module:mod,require:()=>require('../data/market-closed-dates.json'),Intl,Date,Set,Object,Math});
const {nextMarketRefresh}=mod.exports;
for(const [from,to]of [
 ['2026-10-19T14:00Z','2026-10-19T14:08:00Z'],
 ['2026-10-19T14:10Z','2026-10-19T14:26:30Z'],
 ['2026-11-02T15:00Z','2026-11-02T15:08:00Z'],
 ['2026-11-26T14:00Z','2026-11-27T12:39:30Z'],
 ['2026-11-27T18:00Z','2026-11-27T18:06:30Z'],
 ['2026-11-27T18:07Z','2026-11-27T18:10:30Z'],
 ['2026-10-20T20:07Z','2026-10-20T20:10:30Z'],
 ['2026-10-20T20:17Z','2026-10-20T20:45:30Z'],
 ['2026-10-21T00:00Z','2026-10-21T11:39:30Z'],
 ['2026-10-24T14:00Z','2026-10-26T11:39:30Z']
])assert.equal(new Date(nextMarketRefresh(Date.parse(from))).toISOString(),new Date(to).toISOString(),from);
for(const file of ['components/HeroProductReveal.tsx','components/HomeHeatmap.tsx','components/heatmap/StockHeatmap.tsx']){
 const s=fs.readFileSync(file,'utf8');assert(s.includes('scheduleMarketRefresh('),file);
 assert(!s.includes('new EventSource('),file);assert(!s.includes('setInterval('),file);
}
console.log('PASS: split 15/30-minute refresh timing, DST, holidays, early close, weekends; all website heatmaps use scheduled refresh without streaming.');
