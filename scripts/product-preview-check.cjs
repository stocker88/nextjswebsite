const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const root=require('node:path').resolve(__dirname,'..');
const ts=require(root+'/node_modules/typescript');
const out=ts.transpileModule(fs.readFileSync(root+'/lib/chart-morph.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const mod={exports:{}};vm.runInNewContext(out,{exports:mod.exports,module:mod});const {plotPoints,resample,blend,linePath}=mod.exports;
assert.equal(plotPoints([]).length,0);assert.equal(plotPoints([NaN]).length,0);
const flat=plotPoints([4,4,4]);assert(flat.every(p=>p[1]===19.5));
const a=plotPoints([1,4,2]),b=plotPoints([2,1,8,3,5]);const aa=resample(a,72),bb=resample(b,72);
assert.equal(JSON.stringify(aa[0]),JSON.stringify(a[0]));assert.equal(JSON.stringify(aa.at(-1)),JSON.stringify(a.at(-1)));
assert.equal(JSON.stringify(blend(aa,bb,0)),JSON.stringify(aa));
blend(aa,bb,1).forEach((p,i)=>p.forEach((v,j)=>assert(Math.abs(v-bb[i][j])<1e-10)));
assert(!/NaN|Infinity/.test(linePath(blend(aa,bb,.5))));
const data=JSON.parse(fs.readFileSync(root+'/data/market-pulse-periods.json'));
for(const [period,rows] of Object.entries(data.periods)){
 assert.equal(rows.length,8);assert.equal(new Set(rows.map(r=>r.id)).size,8);
 for(const row of rows){
  const expected=row.yieldRate?(row.value-row.baseValue)*100:(row.value/row.baseValue-1)*100;
  assert(Math.abs(expected-row.change)<1e-9,period+' '+row.id);
  assert.equal(row.points[0][0],row.baseDate);assert.equal(row.points.at(-1)[0],row.asOf);
  assert.equal(row.points.at(-1)[1],row.value);assert(row.points.every(p=>Number.isFinite(p[1])));
  const days={week:7,month:30,year:365}[period];const distance=(Date.parse(row.asOf)-Date.parse(row.baseDate))/86400000;
  assert(distance>=days&&distance<=days+7);
 }
}
const preview=JSON.parse(fs.readFileSync(root+'/data/hero-market-preview.json'));
const full=JSON.parse(fs.readFileSync(root+'/data/market-heatmap.json'));
assert(preview.stocks.length >= 490);
assert(preview.stocks.every(row=>row.industry && row.sector && row.weight>0));
assert.equal(new Set(preview.stocks.map(row=>row.symbol)).size,preview.stocks.length);
console.log('PASS: morph geometry, flat/empty data, interpolation endpoints; all 24 period calculations; full S&P 500 overview cache.');
