const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,f);
const {findMoverHeadline,headlineSymbols}=require('../lib/mover-headlines.ts');
const {isSessionExplanation}=require('../lib/mover-context.ts');
const {newsUrl,savedNews}=require('../lib/market-news.ts');
const now=Date.parse('2026-10-24T00:00:00Z'),item={id:'headline-id',symbol:'NYSE:CAT, ETN',title:'Issuer headline',source:'Publisher',publishedAt:'2026-10-23T18:00:00Z'};
assert.deepEqual(headlineSymbols('NYSE:CAT; $ETN BRK.B'),['CAT','ETN','BRK-B']);
if(savedNews.items.length){const saved=savedNews.items[0];assert.equal(newsUrl({...saved,title:'Edited headline'}),newsUrl(saved));}
assert.equal(newsUrl({...item,id:'new&story'}),'/market-news/story/?id=new%26story');
const selected=findMoverHeadline([item],'CAT',now);
assert(selected);assert.equal(selected.kind,'headline');assert.equal(selected.source,'Publisher');assert.equal(selected.href,newsUrl(item));
assert.equal(findMoverHeadline([item],'CA',now),undefined);
assert.equal(findMoverHeadline([{...item,symbol:'ETN',title:'CAT appears only in the text'}],'CAT',now),undefined);
assert.equal(findMoverHeadline([item],'CAT',now,{research:true}),undefined);
assert.equal(findMoverHeadline([item],'CAT',now,{trade:true}),undefined);
for(const publishedAt of ['invalid',new Date(now+1).toISOString(),new Date(now-7*86400000-1).toISOString()])assert.equal(findMoverHeadline([{...item,publishedAt}],'CAT',now),undefined);
assert(findMoverHeadline([{...item,publishedAt:new Date(now-7*86400000).toISOString()}],'CAT',now));
assert.equal(findMoverHeadline([item,{...item,id:'newest',publishedAt:new Date(now-1000).toISOString()}],'CAT',now).href,newsUrl({...item,id:'newest'}));
assert(!isSessionExplanation(selected,'day','2026-10-23',5,'afterhours'));
// A page with many empty mover rows must still issue one shared feed request.
let calls=0;global.fetch=async()=>{calls++;await Promise.resolve();return {ok:true,json:async()=>({updatedAt:new Date(now).toISOString(),items:[item]})};};
(async()=>{
 const {loadHeadlines}=require('../lib/market-news.ts');
 const rows=await Promise.all(Array.from({length:20},()=>loadHeadlines()));
 assert.equal(calls,1);assert(rows.every(r=>r.items[0].id===item.id));await loadHeadlines();assert.equal(calls,1);
 const realNow=Date.now;Date.now=()=>realNow()+61000;global.fetch=async()=>{calls++;throw Error('offline');};
 try{const retained=await loadHeadlines();assert.equal(retained.items[0].id,item.id);await loadHeadlines();assert.equal(calls,2);}finally{Date.now=realNow;}
 console.log('PASS: exact headline tickers, coverage/trade precedence, newest recent story, no inferred move cause and one coalesced feed request.');
})().catch(e=>{console.error(e);process.exitCode=1;});
