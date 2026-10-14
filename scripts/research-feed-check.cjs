const ts=require('typescript'),fs=require('node:fs'),assert=require('node:assert/strict');
const m={exports:{}};
new Function('exports',ts.transpileModule(fs.readFileSync('lib/research-feed.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(m.exports);
const {loadRecentResearch,recentResearch}=m.exports;
const now=Date.now(),item=id=>({id,title:id,time:Math.floor(now/1000),symbols:[]});
const response=payload=>({ok:true,headers:new Headers({date:new Date(now).toUTCString()}),json:async()=>payload});
(async()=>{
 let calls=[];
 const live=await loadRecentResearch(new AbortController().signal,()=>{},async url=>{
  calls.push(url);
  return response(url.startsWith('/') ? {kind:'recent-research',items:[item('yesterday')]} : {items:[item('today')],next:null});
 });
 assert.equal(calls.length,1);assert.ok(calls[0].includes('cloudfunctions.net'));assert.equal(live[0].id,'today');
 calls=[];
 const fallback=await loadRecentResearch(new AbortController().signal,()=>{},async url=>{
  calls.push(url);if(!url.startsWith('/'))throw Error('Live feed unavailable');
  return response({kind:'recent-research',items:[item('saved'),{...item('expired'),time:1}]});
 });
 assert.equal(calls.length,2);assert.deepEqual(fallback.map(i=>i.id),['saved']);
 const empty=await loadRecentResearch(new AbortController().signal,()=>{},async url=>{
  assert.ok(!url.startsWith('/'));return response({items:[],next:null});
 });
 assert.deepEqual(empty,[]);
 const timers=global.setTimeout;
 global.setTimeout=(fn,delay,...args)=>timers(fn,delay===15000?20:delay,...args);
 try {
  const progress=[];let page=0;
  const result=await loadRecentResearch(new AbortController().signal,items=>progress.push(items.length),async(url,{signal})=>{
   if(url.startsWith('/'))throw Error('Snapshot unavailable');
   await new Promise(resolve=>timers(resolve,5));
   if(signal.aborted)throw Error('Premature archive timeout');
   page++;return response({items:[item('page'+page)],next:page<8?'cursor'+page:null});
  });
  assert.equal(result.length,8);assert.deepEqual(progress,[1,2,3,4,5,6,7,8]);
 } finally {global.setTimeout=timers;}
 let attempts=0;
 await assert.rejects(loadRecentResearch(new AbortController().signal,()=>{},async url=>{
  if(url.startsWith('/'))throw Error('Missing snapshot');attempts++;return response({items:[item('a')],next:'same'});
 }),/Invalid research cursor/);
 assert.equal(attempts,2);
 const abort=new AbortController();abort.abort();
 await assert.rejects(loadRecentResearch(abort.signal,()=>{},async(_, {signal})=>{assert.equal(signal.aborted,true);throw Error('aborted');}),/aborted/);
 assert.deepEqual(recentResearch([item('a'),item('a'),{...item('old'),time:1}],now).map(i=>i.id),['a']);
 const weekEnd=Date.parse('2026-10-14T12:00:00Z');
 const dated=(id,ms)=>({...item(id),time:ms/1000});
 assert.deepEqual(recentResearch([
  dated('boundary',weekEnd-7*86400000),
  dated('too-old',weekEnd-7*86400000-1000),
  dated('eight-days',weekEnd-8*86400000),
  dated('future',weekEnd+1000),
  dated('today',weekEnd),
 ],weekEnd).map(i=>i.id),['today','boundary']);
 console.log('Research freshness passed: live feed wins, offline fallback, empty live results, per-page timeout, pagination, cancellation and date filtering.');
})().catch(e=>{console.error(e);process.exitCode=1;});
