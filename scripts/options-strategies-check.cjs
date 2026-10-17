const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,f);
const o=require('../lib/options-strategies.ts');
const expected={
 'long-call':[500,Infinity,500,[105]],'long-put':[500,9500,500,[95]],
 'bull-call-spread':[500,500,500,[100]],'bear-put-spread':[500,500,500,[100]],
 'bull-put-spread':[-200,200,300,[93]],'bear-call-spread':[-200,200,300,[107]],
 'covered-call':[9700,800,9700,[97]],'protective-put':[10300,Infinity,800,[103]],
 'long-straddle':[1000,Infinity,1000,[90,110]],'long-strangle':[600,Infinity,600,[89,111]],
 'iron-condor':[-400,400,100,[91,109]],'call-butterfly':[300,700,300,[93,107]],
 'short-put':[-300,300,9200,[92]],'short-call':[-300,300,Infinity,[108]]};
for(const s of o.strategies){const m=o.expirationMetrics(s.legs),e=expected[s.id];assert.equal(o.validateLegs(s.legs),null);assert.deepEqual([m.cost,m.maxProfit,m.maxLoss,m.breakevens],e,s.id);for(const b of m.breakevens)assert.ok(Math.abs(o.expirationPnl(s.legs,b))<1e-7);for(let p=0;p<=500;p+=.5){const pnl=o.expirationPnl(s.legs,p);assert.ok(pnl<=m.maxProfit+1e-6&&pnl>=-m.maxLoss-1e-6)}console.log('PASS '+s.name)}
const call=o.strategies[0].legs;
assert.equal(o.expirationMetrics(call,.65).maxLoss,500.65);assert.equal(o.expirationPnl(call,110,.65),499.35);
const shortShares=[{type:'stock',side:'sell',premium:100,strike:0,quantity:100}];assert.equal(o.expirationMetrics(shortShares).maxLoss,Infinity);assert.equal(o.expirationMetrics(shortShares).maxProfit,10000);
const freeCall=[{...call[0],premium:0}];assert.deepEqual(o.expirationMetrics(freeCall).zeroRanges,[{from:0,to:100}]);
assert.deepEqual(o.expirationMetrics([...call,{...call[0],side:'sell'}]).zeroRanges,[{from:0,to:Infinity}]);
assert.ok(o.validateLegs([{...call[0],quantity:.5}]));assert.ok(o.validateLegs([{...call[0],premium:NaN}]));assert.ok(o.validateLegs([{...call[0],strike:0}]));assert.ok(o.validateLegs(call,-1));assert.ok(o.validateLegs([]));
const copied=o.copyLegs(o.strategies[0]);copied[0].strike=999;assert.equal(call[0].strike,100);
console.log('PASS fees, short stock, zero-payoff intervals, validation and template isolation');
