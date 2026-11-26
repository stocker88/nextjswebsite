const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,f);
const {cryptoProjection}=require('../lib/crypto-prediction.ts'),{scenario}=require('../lib/seo-tools.ts');
const points=Array.from({length:90},(_,i)=>[new Date(Date.UTC(2026,7,29+i)).toISOString().slice(0,10),100*Math.exp(i%2?.01:0)]);
const events=[{id:'cpi',kind:'macro',date:'2026-12-10',title:'CPI inflation'}];
for(const days of [7,30,90,365,1496])for(const selected of ['low','central','high']){
 const base=cryptoProjection(points,days,10,selected,events,false),stress=cryptoProjection(points,days,10,selected,events,true);
 assert.deepEqual(stress[0],points.at(-1));assert.deepEqual(stress.at(-1),base.at(-1));
 assert(Math.abs(base.at(-1)[1]-scenario(points,days,10,'crypto')[selected])<1e-8);
 assert(stress.every(p=>Number.isFinite(p[1])&&p[1]>0));assert.equal(new Set(stress.map(p=>p[0])).size,stress.length);
 if(days>=30){const trough=stress.find(p=>p[0]==='2026-12-09');assert(trough,'Inflation trough is rendered');}
}
assert.deepEqual(cryptoProjection(points.slice(0,5),30,10,'high',events,true),[]);
console.log('Crypto horizons, scenario endpoints, stress anchors, valid prices and insufficient-history guards passed.');

const edge=cryptoProjection(points,30,0,'high',[{id:'edge',kind:'macro',title:'CPI',date:'2026-12-23'}],true);assert(edge.some(p=>p[0]==='2026-12-22'));assert.equal(edge.at(-1)[1],scenario(points,30,0,'crypto').high);
