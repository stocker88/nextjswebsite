const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),ts=require('typescript'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');const source=fs.readFileSync(path.join(root,'lib/earnings.ts'),'utf8');const m={exports:{}};vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports:m.exports,module:m,Intl,Date,Map,Set,Array,URL,AbortSignal,fetch});const {filterEvents,weekStart}=m.exports;
assert.equal(weekStart('2026-10-18'),'2026-10-12');const base={name:'Example',sector:'Technology',marketCap:20e9,session:'bmo',date:'2026-10-13'};
const events=[{...base,symbol:'AAA',research:{pe:10,beat:{rate:75}}},{...base,symbol:'BBB',marketCap:null,session:'amc'},{...base,symbol:'CCC',date:'2026-10-20'}];const f={from:'2026-10-12',to:'2026-10-18',query:'',session:'all',cap:'all',sector:'',sort:'date'};
assert.equal(filterEvents(events,f).length,2);assert.equal(filterEvents(events,{...f,cap:'small'}).length,0);assert.equal(filterEvents(events,{...f,query:'$AAA'})[0].symbol,'AAA');assert.equal(filterEvents(events,{...f,session:'amc'})[0].symbol,'BBB');assert.equal(filterEvents(events,{...f,sort:'pe'})[0].symbol,'AAA');
const data=JSON.parse(fs.readFileSync(path.join(root,'data/earnings-calendar.json')));assert.ok(data.items.length);assert.ok(data.items.every(i=>['NYSE','NASDAQ','AMEX'].includes(i.exchange)));assert.equal(new Set(data.items.map(i=>i.symbol+i.date)).size,data.items.length);
for(const s of data.detailSymbols){const d=JSON.parse(fs.readFileSync(path.join(root,'public/earnings-data',s+'.json')));assert.equal(d.symbol,s);assert.ok(d.beat.total<=8);assert.ok(d.beat.beats<=d.beat.total);assert.ok(d.prices.every(p=>p.close>0));}
for(const file of ['pages/earnings-calendar/index.tsx','pages/earnings-calendar/this-week.tsx','pages/earnings-calendar/next-week.tsx','pages/earnings-calendar/[symbol].tsx'])assert.ok(fs.existsSync(path.join(root,file)));
console.log('Earnings filters, data contracts, static routes and company snapshots passed.');

const caps=[{...base,symbol:'BIG',marketCap:9e9},{...base,symbol:'MISSING',marketCap:null},{...base,symbol:'SMALL',marketCap:1e9}];
assert.equal(filterEvents(caps,{...f,sort:'cap'}).map(i=>i.symbol).join(','),'BIG,SMALL,MISSING');
assert.equal(filterEvents(caps,{...f,sort:'cap-asc'}).map(i=>i.symbol).join(','),'SMALL,BIG,MISSING');

const {combinedBeatRate,beatRingColor}=m.exports;
const pair=(eps,rev,total=8)=>({research:{beat:{rate:eps,total},revenueBeat:{rate:rev,total}}});
assert.equal(combinedBeatRate(pair(100,50)),75);
assert.equal(combinedBeatRate(pair(0,0)),0);
for(const e of [pair(100,null),pair(100,75,0),pair(NaN,75),pair(101,75),{}])assert.equal(combinedBeatRate(e),null);
assert.equal(beatRingColor(0),'#ef6b73');assert.equal(beatRingColor(50),'#f2c94c');assert.equal(beatRingColor(100),'#42d39a');assert.equal(beatRingColor(75),'#9ace73');assert.equal(beatRingColor(null),'#778397');
console.log('Combined EPS/revenue rings: average, missing history and color scale passed.');

const periods={exports:{}};
vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(root,'lib/calendar-period.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports:periods.exports,module:periods,require:()=>m.exports,Date,Intl});
const windowFor=periods.exports.earningsSessionWindow;
for(const weekend of ['2026-10-31','2026-11-01']){
 const past=windowFor(weekend),incoming=windowFor(weekend,true);
 assert.equal(past.from,'2026-10-30');assert.equal(past.to,'2026-10-30');
 for(const session of ['bmo','amc']){assert.ok(past.matches({date:'2026-10-30',session}));assert.ok(incoming.matches({date:'2026-11-02',session}));}
 assert.equal(past.matches({date:'2026-10-29',session:'amc'}),false);
}
assert.ok(windowFor('2026-11-02').matches({date:'2026-10-30',session:'amc'}));
assert.ok(windowFor('2026-11-02').matches({date:'2026-11-02',session:'bmo'}));
assert.equal(windowFor('2026-11-02').matches({date:'2026-10-30',session:'bmo'}),false);
assert.ok(windowFor('2026-10-30',true).matches({date:'2026-11-02',session:'bmo'}));
console.log('Earnings session windows passed, including weekend and DST boundary.');

(async()=>{
 const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const detail={symbol:'APP',history:[],prices:[]};
 for(const first of ['missing','invalid','network','valid']){
  const calls=[],module={exports:{}};
  vm.runInNewContext(compiled,{exports:module.exports,module,Intl,Date,Map,Set,Array,URL,AbortSignal,fetch:async(url)=>{
   calls.push(url);
   if(calls.length===1){if(first==='network')throw new Error('offline');return {ok:first!=='missing',json:async()=>first==='valid'?detail:{symbol:'OTHER',history:[],prices:[]}};}
   assert.ok(url.endsWith('symbol=APP&cached=1'));return {ok:true,json:async()=>detail};
  }});
  assert.equal((await module.exports.getDetail('APP')).symbol,'APP');
  assert.equal(calls.length,first==='valid'?1:2);
  await module.exports.getDetail('APP');assert.equal(calls.length,first==='valid'?1:2);
 }
 console.log('Research static loading, cached-only fallback and memory cache passed.');
})().catch(error=>{console.error(error);process.exitCode=1;});
