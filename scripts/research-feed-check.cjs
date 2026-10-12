const ts=require('typescript'),fs=require('node:fs'),assert=require('node:assert/strict');
const m={exports:{}};
new Function('exports',ts.transpileModule(fs.readFileSync('lib/research-feed.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(m.exports);
const {loadRecentResearch,recentResearch}=m.exports;
const now=Date.now(),item=id=>({id,title:id,time:Math.floor(now/1000),symbols:[]});
const response=payload=>({ok:true,headers:new Headers({date:new Date(now).toUTCString()}),json:async()=>payload});
(async()=>{
 let calls=0;
 const local=await loadRecentResearch(new AbortController().signal,()=>{},async url=>{calls++;assert.equal(url,'/research-previews.json');return response({kind:'recent-research',items:[item('same-origin')]});});
 assert.equal(calls,1);assert.equal(local[0].id,'same-origin');
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
 console.log('Research recovery passed: same-origin snapshot, per-page timeout, progressive results, repeated cursors, cancellation and recent-date filtering.');
})().catch(e=>{console.error(e);process.exitCode=1;});
