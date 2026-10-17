const fs=require('fs'),path=require('path'),ts=require('typescript'),Module=require('module'),assert=require('assert');
const filename=path.join(__dirname,'../lib/fear-greed.ts');const m=new Module(filename,module);m._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,filename);
const {normalizeFearGreed,score}=m.exports;
for(const v of [null,'50',-1,101,NaN,Infinity])assert.equal(score(v),null);
assert.equal(score(0),0);assert.equal(normalizeFearGreed({}),null);
assert.equal(normalizeFearGreed({fear_and_greed:{score:50,timestamp:'bad'}}),null);
const d=normalizeFearGreed({fear_and_greed:{score:50,timestamp:'2026-10-16T20:00:00Z',previous_close:0},market_momentum_sp500:{score:60},fear_and_greed_historical:{data:[{x:1720000000000,y:0},{x:1720000000001,y:101}]}});
assert.equal(d.previousClose,0);assert.equal(d.indicators[0].score,60);assert.equal(d.indicators[1].score,null);assert.equal(d.history.length,1);
console.log('Snapshot validation and missing-data checks passed.');
const {normalizeFinicaFearGreed}=m.exports;
const now=new Date('2026-10-18T00:00:00Z');
const fixture={score:18,previousClose:0,historical:[{date:'2026-10-09',value:46},{date:'2026-10-16',value:18},{date:'2026-10-16',value:18},{date:'2026-11-01',value:99},{date:'bad',value:40}],components:[{name:'Market Momentum',value:24}]};
const normalized=normalizeFinicaFearGreed(fixture,now);
assert.equal(normalized.history.length,2);assert.equal(normalized.weekAgo,46);assert.equal(normalized.yearAgo,null);assert.equal(normalized.previousClose,0);assert.equal(normalized.indicators[0].score,24);assert.equal(normalized.dateOnly,true);
assert.equal(normalizeFinicaFearGreed({...fixture,score:20},now),null);
assert.equal(normalizeFinicaFearGreed({score:18,historical:[]},now),null);
(async()=>{
 const os=require('os');const root=fs.mkdtempSync(path.join(os.tmpdir(),'sentiment-check-'));
 const {sync,TTL}=require('./sync-fear-greed.cjs');let calls=0;
 const fetcher=async()=>{calls++;return {ok:true,json:async()=>fixture};};
 const options={root,now:now.getTime(),fetcher,log:()=>{}};
 try{
  await sync(options);assert.equal(calls,1);
  // Simulate a fresh CI checkout with only the restored cache state.
  fs.unlinkSync(path.join(root,'data/fear-greed.json'));
  const restored=await sync({...options,now:options.now+TTL-1});
  assert.equal(calls,1);assert.equal(restored.snapshot.score,18);
  assert.equal(JSON.parse(fs.readFileSync(path.join(root,'data/fear-greed.json'))).score,18);
  const failure=async()=>{calls++;throw Error('offline');};
  const failed=await sync({...options,now:options.now+TTL,fetcher:failure});
  assert.equal(calls,2);assert.equal(failed.snapshot.score,18);
  await sync({...options,now:options.now+TTL+1000,fetcher:failure});assert.equal(calls,2);
  await sync({...options,now:options.now+TTL*2,fetcher});assert.equal(calls,3);
  console.log('Finica normalization, 48-hour throttle, CI restoration and failure retention passed.');
 }finally{fs.rmSync(root,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
