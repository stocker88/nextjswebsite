const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
const source=ts.transpileModule(fs.readFileSync('lib/member-content.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const storage=()=>{const values=new Map();return {values,getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)}};
const sessionStorage=storage(),localStorage=storage(),window={sessionStorage,localStorage};
function load({uid='reader',response}={}){
 const module={exports:{}},auth={currentUser:uid?{uid}:null};
 const sdk={getFunctions:()=>({}),httpsCallable:()=>async()=>({data:response})};
 const custom=id=>id==='./site-auth'?{getSiteAuth:async()=>auth}:id==='firebase/functions'?sdk:require(id);
 new Function('require','module','exports','window',source)(custom,module,module.exports,window);
 return {api:module.exports,auth};
}
(async()=>{
 const active={recap:['Verified cached Ultra analysis'],quickTake:'Cached quick take',accessUntil:'2099-01-01T00:00:00.000Z'};
 let loaded=load({response:active}),value=await loaded.api.fetchResultMemberContent('reader','result-one');
 assert.deepEqual(value,active);assert.deepEqual(loaded.api.lastKnownResultMemberContent('reader','result-one'),active);
 assert.equal(loaded.api.lastKnownResultMemberContent('another-reader','result-one'),null);
 assert.equal(loaded.api.lastKnownResultMemberContent('reader','another-result'),null);
 // A fresh module proves that browser storage, not only module memory, restores the result.
 loaded=load({response:active});assert.deepEqual(loaded.api.lastKnownResultMemberContent('reader','result-one'),active);
 loaded.api.clearResultMemberContent('reader','result-one');assert.equal(loaded.api.lastKnownResultMemberContent('reader','result-one'),null);
 assert.equal([...sessionStorage.values.keys(),...localStorage.values.keys()].some(key=>key.includes('result-one')),false);
 const expired={...active,accessUntil:'2020-01-01T00:00:00.000Z'};
 loaded=load({response:expired});value=await loaded.api.fetchResultMemberContent('reader','expired-result');assert.deepEqual(value,expired);
 assert.equal(loaded.api.lastKnownResultMemberContent('reader','expired-result'),null);
 await assert.rejects(load({response:{recap:'not-an-array',accessUntil:null}}).api.fetchResultMemberContent('reader','invalid-result'),/Invalid results response/);
 loaded=load({response:active});loaded.auth.currentUser={uid:'different-reader'};
 await assert.rejects(loaded.api.fetchResultMemberContent('reader','account-switched'),/Account changed/);
 console.log('PASS: Ultra result cache restores instantly, remains account/result bound, expires, clears and rejects invalid or switched-account data.');
})().catch(error=>{console.error(error);process.exitCode=1});
