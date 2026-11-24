const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {normalize,date,sync}=require('./sync-ipo-calendar.cjs');
assert.equal(date('11/20/2026'),'2026-11-20');assert.equal(date('02/30/2026'),null);assert.equal(date(null),null);
assert.throws(()=>normalize({data:null}));
const fixture={data:{upcoming:{upcomingTable:{rows:[{dealID:'a',companyName:'Example',expectedPriceDate:'11/21/2026',proposedSharePrice:'10 - 12'}]}},priced:{rows:null},filed:{rows:[{dealID:'a',companyName:'Example',filedDate:'11/01/2026'}]}}};
assert.equal(normalize(fixture)[0].symbol,null);
(async()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'ipo-check-'));let calls=0;
 const now=Date.parse('2026-11-20T12:00:00Z'),fetcher=async()=>{calls++;return {ok:true,json:async()=>fixture}};
 const a=await sync({root,now,fetcher,recover:false});assert.equal(calls,3);assert.equal(a.items.length,1);assert.equal(a.items[0].status,'expected');
 await sync({root,now:now+86400000,fetcher,recover:false});assert.equal(calls,3);
 const b=await sync({root,now:now+8*86400000,fetcher:async()=>{throw Error('offline')},recover:false});assert.equal(b.updatedAt,a.updatedAt);
 const c=await sync({root,now:now+8*86400000+1000,fetcher,recover:false});assert.equal(c.updatedAt,a.updatedAt);assert.equal(calls,3);
 const d=await sync({root,now:now+9*86400000,fetcher:async()=>({ok:true,json:async()=>({data:{upcoming:null,priced:null,filed:null}})}),recover:false});assert.equal(d.items.length,0);
 fs.rmSync(root,{recursive:true,force:true});console.log('IPO normalization, deduplication, weekly refresh, failure retention, retry limit and genuine empty data passed.');
})().catch(e=>{console.error(e);process.exitCode=1});
