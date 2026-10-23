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

assert.match(sessionTime('2026-10-22T00:05:00Z',{locale:'en-GB',timeZone:'Asia/Dubai'}),/22 Oct 2026, 04:05 (GST|GMT\+4)/);
assert.match(sessionTime('2026-10-22T00:05:00Z',{locale:'en-US',timeZone:'America/Los_Angeles'}),/Oct 21, 2026, 5:05 PM PDT/);
assert.match(sessionTime('2026-11-27T18:05:00Z',{locale:'en-GB',timeZone:'Europe/London'}),/18:05 GMT/);
console.log('PASS: browser locale/timezone formatting, 12/24-hour preferences, local date rollover and DST.');

// Full movers universe is independent of the 100 heatmap tiles.
const {sessionMoverRows}=load('lib/extended-hours.ts');
const {biggestMovers}=load('lib/market-heatmap.ts');
for(const kind of ['preMarket','afterHours']){
 const base=saved[kind],stamp=base.rows.find(r=>r.changes.day!==null&&r.quoteAsOf)?.quoteAsOf;
 const rows=Array.from({length:503},(_,i)=>({...base.rows[0],symbol:`S${String(i).padStart(3,'0')}`,quoteAsOf:stamp,changes:{day:i-250}}));
 const full={...base,rows:rows.slice(200,300),moverRows:rows};
 assert.equal(sessionRows(full,kind).length,100);
 assert.equal(sessionMoverRows(full,kind).length,503);
 const ranked=biggestMovers(sessionMoverRows(full,kind),'day');
 assert.equal(ranked.gainers.length,10);assert.equal(ranked.losers.length,10);
 assert.equal(ranked.gainers[0].symbol,'S502');assert.equal(ranked.losers[0].symbol,'S000');
 assert.equal(sessionMoverRows({...full,moverRows:undefined},kind).length,100);
 const stale={...full,moverRows:[{...rows[502],quoteAsOf:'2020-01-01T12:00:00Z'}]};
 assert.equal(biggestMovers(sessionMoverRows(stale,kind),'day').gainers.length,0);
}
const tied=[{symbol:'B',changes:{day:5}},{symbol:'A',changes:{day:5}},{symbol:'Z',changes:{day:Infinity}}];
assert.equal(biggestMovers(tied,'day').gainers.map(r=>r.symbol).join(','),'A,B');
console.log('PASS: 503-stock movers, top ten, legacy fallback, invalid quotes and deterministic ties.');
