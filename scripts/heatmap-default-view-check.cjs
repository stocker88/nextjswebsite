const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),ts=require('typescript');
const cache=new Map();
function load(file){file=path.resolve(file);if(cache.has(file))return cache.get(file);const module={exports:{}};cache.set(file,module.exports);const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText;vm.runInNewContext(code,{module,exports:module.exports,require:name=>name.endsWith('.json')?require(path.resolve(path.dirname(file),name)):name.startsWith('.')?load(path.resolve(path.dirname(file),name+'.ts')):require(name),Intl,Date,Set,Map,Number,Object,Array});return module.exports;}
const {heatmapDefaultView}=load('lib/heatmap-default-view.ts');
const sessions=JSON.parse(fs.readFileSync('data/extended-hours.json'));
function fixture(kind,date,quote){const source=sessions[kind];return {[kind]:{...source,asOf:date,quotedAt:quote,rows:source.rows.map(row=>({...row,asOf:date,quoteAsOf:quote}))}};}
const pre=fixture('preMarket','2026-10-23','2026-10-23T12:00:00Z');
const after=fixture('afterHours','2026-10-23','2026-10-23T21:00:00Z');
assert.equal(heatmapDefaultView(Date.parse('2026-10-23T12:30:00Z'),pre),'preMarket');
assert.equal(heatmapDefaultView(Date.parse('2026-10-23T15:00:00Z'),pre),'day');
assert.equal(heatmapDefaultView(Date.parse('2026-10-23T21:30:00Z'),after),'afterHours');
assert.equal(heatmapDefaultView(Date.parse('2026-10-24T12:30:00Z'),pre),'day');
assert.equal(heatmapDefaultView(Date.parse('2026-10-26T12:30:00Z'),pre),'day');
assert.equal(heatmapDefaultView(Date.parse('2026-10-23T12:30:00Z'),{}),'day');
const missing=JSON.parse(JSON.stringify(pre));missing.preMarket.rows.forEach(r=>r.changes.day=null);
assert.equal(heatmapDefaultView(Date.parse('2026-10-23T12:30:00Z'),missing),'day');
assert.equal(heatmapDefaultView(Date.parse('2026-10-23T11:30:00Z'),pre),'day');
console.log('PASS: heatmap defaults use Eastern session time and current usable data; weekends, normal hours, missing, stale and future quotes fall back to 1D.');
