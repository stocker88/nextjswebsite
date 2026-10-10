const ts=require('typescript');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const m={exports:{}};
new Function('module','exports',ts.transpileModule(fs.readFileSync('lib/news-layout.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(m,m.exports);
const {mobileNewsBatch}=m.exports;
const item=(id,education)=>({id,symbols:[education?'$EDUCATION':'NVDA']});
for(let n=0;n<30;n++)for(let e=0;e<30;e++){
 const news=Array.from({length:n},(_,i)=>item('n'+i,false));
 const education=Array.from({length:e},(_,i)=>item('e'+i,true));
 const batch=mobileNewsBatch([...news,...education]);
 assert.equal(batch.length,n+e);
 assert.equal(new Set(batch.map(i=>i.id)).size,n+e);
 assert.deepEqual(batch.filter(i=>i.id[0]==='n'),news);
 assert.deepEqual(batch.filter(i=>i.id[0]==='e'),education);
}
const first=mobileNewsBatch([...Array.from({length:10},(_,i)=>item('n'+i,false)),...Array.from({length:3},(_,i)=>item('e'+i,true))]);
assert.deepEqual(first.map(i=>i.id),['n0','n1','n2','e0','n3','n4','n5','e1','n6','n7','n8','n9','e2']);
const appended=[first,mobileNewsBatch([item('nextNews',false),item('nextEducation',true)])].flat();
assert.deepEqual(appended.slice(0,first.length),first);
console.log('Mobile feed distribution checks passed.');
