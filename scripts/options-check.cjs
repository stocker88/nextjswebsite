// Offline regression checks: no provider credentials or network calls required.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText, file);
const o = require('../lib/options.ts');
const limiter = require('../lib/options-rate-limit.ts');
// All HTTP below is mocked. Test the actual queue separately with a fake clock.
limiter.massiveRequestGate.run = operation => operation();
const s = require('../lib/options-server.ts');
const handler = require('../pages/api/options/index.ts').default;
let passed = 0;
async function check(name, fn) { await fn(); passed++; console.log('PASS '+name); }
const raw = (symbol='SPY',type='call') => ({details:{ticker:`O:${symbol}261120${type==='call'?'C':'P'}00600000`,expiration_date:'2026-11-20',contract_type:type,strike_price:600,shares_per_contract:100},open_interest:100,day:{volume:300,last_updated:1792180800000000000},last_quote:{bid:2,ask:2.2},last_trade:{price:2.1}});
(async()=>{
await check('concurrent and failed attempts respect four calls per rolling minute',async()=>{let clock=100000;const starts=[];const gate=limiter.createMassiveRequestGate(()=>clock,async ms=>{clock+=ms});const results=await Promise.allSettled(Array.from({length:7},(_,i)=>gate.run(async()=>{starts.push(clock);if(i===1)throw new Error('test failure');return i})));assert.equal(results[1].status,'rejected');for(let i=1;i<starts.length;i++)assert.ok(starts[i]-starts[i-1]>=16000);for(let i=4;i<starts.length;i++)assert.ok(starts[i]-starts[i-4]>60000)});
await check('missing observations remain missing, zero is preserved',()=>{const c=o.normalizeContract({details:raw().details,open_interest:0},'SPY');assert.equal(c.oi,0);assert.equal(c.volume,null);assert.equal(c.averageVolume,null);assert.equal(c.spot,null);assert.equal(o.ratio(20,0),null);assert.equal(o.ratio(null,2),null);assert.equal(o.ratio(0,2),0)});
await check('invalid provider values and dates are rejected',()=>{assert.equal(o.normalizeContract({...raw(),details:{...raw().details,strike_price:'600'}},'SPY'),null);assert.equal(o.normalizeContract({...raw(),details:{...raw().details,expiration_date:'2026-02-30'}},'SPY'),null);assert.equal(o.isoFromNanoseconds(1e99),null);assert.equal(o.normalizeContract(raw('AAPL'),'SPY'),null)});
await check('put/call aggregation and screening evidence',()=>{const c=o.normalizeContract(raw(),'SPY'),p=o.normalizeContract({...raw('SPY','put'),open_interest:250},'SPY');assert.equal(o.aggregate([c,p]).putCallOi,2.5);assert.equal(o.aggregate([]).callOi,null);assert.equal(o.activity(c).elevated,true);assert.equal(o.activity(c).relativeVolume,null);assert.ok(o.evidence(c).join(' ').includes('does not identify new opening positions'))});
await check('call/put payoff, quantity and adjusted-contract safeguards',()=>{assert.equal(o.payoff({type:'call',strike:100,multiplier:100},5,110,2),1000);assert.equal(o.payoff({type:'put',strike:100,multiplier:100},5,80,1),1500);assert.equal(o.payoff({type:'call',strike:100,multiplier:100},5,90,1),-500);assert.equal(o.payoff({type:'call',strike:100,multiplier:50},5,90,1),null)});
await check('delta weighting uses magnitude, preserves zero and exposes missing coverage',()=>{
 const call=o.normalizeContract({...raw(),greeks:{delta:.5}},'SPY'),put=o.normalizeContract({...raw('SPY','put'),open_interest:200,greeks:{delta:-.25}},'SPY');
 let t=o.oiTotals([call,put]);assert.equal(t.total,300);assert.equal(t.calls.weighted,50);assert.equal(t.puts.weighted,50);assert.equal(t.weightedTotal,100);assert.equal(t.weightedRatio,1);assert.equal(t.weightedComplete,true);
 t=o.oiTotals([call,{...put,delta:null}]);assert.equal(t.weightedTotal,50);assert.equal(t.weightedComplete,false);assert.equal(t.weightedRatio,null);assert.equal(t.puts.coverage,0);assert.equal(t.puts.weighted,null);
 t=o.oiTotals([{...call,delta:0}]);assert.equal(t.weightedTotal,0);assert.equal(t.weightedComplete,true);
 t=o.oiTotals([{...call,oi:0,delta:null}]);assert.equal(t.weightedTotal,0);assert.equal(t.weightedComplete,true);
 assert.equal(o.oiTotals([{...call,delta:undefined}]).weightedTotal,null);assert.equal(o.oiTotals([{...call,delta:null},{...put,oi:0,delta:null}]).calls.weighted,null);assert.equal(o.oiTotals([]).total,null);
 assert.equal(o.normalizeContract({...raw('SPY','put'),greeks:{delta:-.4}},'SPY').delta,-.4);
 for(const d of [NaN,Infinity,2,-.1,'0.5'])assert.equal(o.validDelta(d,'call'),null);
 assert.equal(o.validDelta(.1,'put'),null);assert.equal(o.oiTotals([{...call,oi:null}]).weightedTotal,null);
});
await check('synthetic examples are explicit',()=>{const d=o.exampleSnapshot('SPY');assert.equal(d.mode,'example');assert.match(d.source,/not market observations/);assert.equal(new Set(d.contracts.map(c=>c.id)).size,d.contracts.length)});
const keys=['OPTIONS_BACKEND_URL','OPTIONS_BACKEND_TOKEN','OPTIONS_DISPLAY_LICENSE_CONFIRMED','OPTIONS_PRIVATE_PREVIEW','NODE_ENV'];const old=keys.map(k=>process.env[k]);const originalFetch=global.fetch;
try {
 keys.forEach(k=>delete process.env[k]);let calls=0;
 global.fetch=async()=>{calls++;throw new Error('Unexpected network call')};
 await check('public feed remains off without display configuration',async()=>{assert.equal((await s.chain('SPY')).status,'unavailable');assert.equal(calls,0);assert.equal(s.optionsConfigured({NODE_ENV:'production',OPTIONS_PRIVATE_PREVIEW:'true',OPTIONS_BACKEND_URL:'https://backend.test',OPTIONS_BACKEND_TOKEN:'test'}),false)});
 Object.assign(process.env,{NODE_ENV:'development',OPTIONS_PRIVATE_PREVIEW:'true',OPTIONS_BACKEND_URL:'https://backend.test/snapshots',OPTIONS_BACKEND_TOKEN:'offline-test-token'});
 const urls=[];global.fetch=async(url,opts)=>{urls.push(url);assert.equal(opts.headers.Authorization,'Bearer offline-test-token');assert.ok(!url.includes('offline-test-token'));assert.equal(new URL(url).host,'backend.test');return {ok:true,json:async()=>({status:'ready',mode:'delayed',coveredSymbols:['PRIVATE_SIGNAL'],signals:['PRIVATE_SIGNAL'],publicSymbols:['SPY','QQQ','NVDA','AAPL'],contracts:[o.normalizeContract(raw(),'SPY')],partial:true})}};
 await check('chain filtering reads only saved backend data',async()=>{const data=await s.chain('SPY','2026-11-20');assert.equal(data.contracts.length,1);assert.equal(data.partial,true);assert.deepEqual(data.publicSymbols,['SPY','QQQ','NVDA','AAPL']);assert.ok(!JSON.stringify(data).includes('PRIVATE_SIGNAL'));assert.equal(data.coveredSymbols,undefined);assert.equal((await s.chain('SPY','2026-12-18')).contracts.length,0);assert.equal(urls.length,2)});
 await check('trade inspection never makes extra provider calls',async()=>{const before=urls.length;const d=await s.trades('SPY',raw().details.ticker);assert.equal(d.trades.length,0);assert.equal(urls.length,before)});
 await check('explicit ticker requests go to the private queue',async()=>{await s.queueSymbol('TSLA');assert.equal(new URL(urls.at(-1)).host,'backend.test')});
 const invoke=async(query={},method='GET',body={},headers={})=>{const res={code:200,body:null,headers:{},setHeader(k,v){this.headers[k]=v},status(code){this.code=code;return this},json(body){this.body=body;return this}};await handler({method,query,body,headers:{host:'localhost',...headers},socket:{remoteAddress:'test'}},res);return res};
 await check('API validates requests, cross-origin queueing and hides provider errors',async()=>{assert.equal((await invoke({},'DELETE')).code,405);assert.equal((await invoke({symbol:'BAD?'})).code,400);assert.equal((await invoke({symbol:['SPY','QQQ']})).code,400);assert.equal((await invoke({expiry:'2026-02-30'})).code,400);assert.equal((await invoke({},'POST',{symbol:'TSLA'},{origin:'https://evil.test'})).code,403);global.fetch=async()=>{throw new Error('secret provider body')};const r=await invoke({symbol:'TSLA'});assert.equal(r.code,503);assert.ok(!JSON.stringify(r.body).includes('secret'))});
} finally {global.fetch=originalFetch;keys.forEach((k,i)=>old[i]===undefined?delete process.env[k]:process.env[k]=old[i]);}
console.log(`${passed} options checks passed`);
})().catch(e=>{console.error(e);process.exitCode=1});
