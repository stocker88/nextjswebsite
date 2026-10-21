const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),ts=require(process.cwd()+'/node_modules/typescript');
function load(file){const module={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,{module,exports:module.exports,require:(name)=>name==='./market-heatmap'?load('lib/market-heatmap.ts'):require(name),Intl,Date,Number,Object,Array});return module.exports;}
const {validSession,sessionRows,sessionTime}=load('lib/extended-hours.ts');
const saved=JSON.parse(fs.readFileSync('data/extended-hours.json'));
for(const kind of ['preMarket','afterHours']){
 assert(validSession(saved[kind],kind));assert(!validSession(saved[kind],kind==='preMarket'?'afterHours':'preMarket'));
 assert(!validSession({...saved[kind],quotedAt:'invalid'},kind));
 const rows=sessionRows(saved[kind],kind);assert.equal(rows.length,100);assert(rows.some(r=>r.changes.day!==null));assert(rows.every(r=>r.changes.year===null));
 const row=saved[kind].rows[0], fixture=changes=>({...saved[kind],rows:[{...row,...changes}]});
 assert.equal(sessionRows(fixture({quoteAsOf:null}),kind)[0].changes.day,null);
 assert.equal(sessionRows(fixture({quoteAsOf:'2026-10-20T13:00:00Z'}),kind)[0].changes.day,null);
 assert.equal(sessionRows(fixture({quoteAsOf:'2026-10-21T15:00:00Z'}),kind)[0].changes.day,null);
 assert.equal(sessionRows(fixture({quoteAsOf:kind==='preMarket'?'2026-10-21T13:25:00Z':'2026-10-21T20:05:00Z'}),kind)[0].changes.day,row.changes.day);
}
const early={...saved.afterHours,asOf:'2026-11-27',rows:[{...saved.afterHours.rows[0],quoteAsOf:'2026-11-27T18:05:00Z'}]};
assert.notEqual(sessionRows(early,'afterHours')[0].changes.day,null);
assert.match(sessionTime('2026-10-21T13:25:00Z'),/9:25 AM EDT/);assert.match(sessionTime('2026-11-27T18:05:00Z'),/1:05 PM EST/);
console.log('PASS: saved-session validation, missing/stale/regular-session quote exclusion, correct price basis, early close and DST timestamps.');
