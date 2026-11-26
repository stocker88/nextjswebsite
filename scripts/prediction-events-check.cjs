const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,f);
const {macroStressPath}=require('../lib/prediction-events.ts');
const points=[{date:'2026-12-01',close:100},{date:'2026-12-21',close:120}];
const event={id:'cpi',date:'2026-12-10',title:'CPI',kind:'macro'};
const result=macroStressPath(points,[event]);
assert.deepEqual(result[0],points[0]);assert.deepEqual(result.at(-1),points.at(-1));
assert.equal(result.find(p=>p.date==='2026-12-09').close,108*.96);
assert.equal(result.find(p=>p.date==='2026-12-12').close,111);
for(const title of ['CPI inflation','Core PCE','PPI inflation'])assert.equal(macroStressPath(points,[{...event,title}]).find(p=>p.date==='2026-12-09').close,108*.96);
assert.equal(macroStressPath(points,[{...event,title:'FOMC rate decision'}]).find(p=>p.date==='2026-12-09').close,108*.98);
assert.deepEqual(macroStressPath(points,[event],false),points);
assert.deepEqual(macroStressPath(points,[{...event,kind:'earnings'}]),points);
assert.deepEqual(macroStressPath(points,[{...event,date:'2026-12-02'}]),points);
const overlapping=macroStressPath(points,[event,{...event,id:'ppi',date:'2026-12-11'},event]);
for(const point of overlapping){const base=100+(Date.parse(point.date)-Date.parse(points[0].date))/86400000;assert(point.close>=base*.96-1e-9);assert(point.close<=base+1e-9);}
assert.equal(new Set(overlapping.map(p=>p.date)).size,overlapping.length);
assert.deepEqual(macroStressPath([], [event]),[]);
console.log('Macro stress: 4% inflation / 2% other macro relative dip, recovery, preserved endpoints, disabled mode, earnings exclusion and noncompounding overlap passed.');
