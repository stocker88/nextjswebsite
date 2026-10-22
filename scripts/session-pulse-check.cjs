const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript');
function load(file){const module={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,{module,exports:module.exports,require:name=>name.startsWith('./')?load('lib/'+name.slice(2)+'.ts'):require(name),Intl,Date,Number,Object,Array});return module.exports;}
const {sessionPulseRows}=load('lib/session-pulse.ts'),{biggestMovers}=load('lib/market-heatmap.ts');
const saved=JSON.parse(fs.readFileSync('data/extended-hours.json'));
for(const kind of ['preMarket','afterHours']){
 const time=kind==='preMarket'?'2026-10-21T13:25:00Z':'2026-10-21T23:59:00Z';
 const session={...saved[kind],asOf:'2026-10-21',pulse:{'^SPX':{price:101,previousClose:100,quotedAt:time,sourceSymbol:'SPY'}}};
 let rows=sessionPulseRows(session,kind);assert(Math.abs(rows[0].change-1)<1e-8);assert.equal(rows[0].detail,'SPY ETF proxy');assert.equal(rows[1].change,null);
 for(const bad of [{price:NaN},{previousClose:0},{price:-2},{quotedAt:'bad'},{quotedAt:'2026-10-20T13:25:00Z'},{quotedAt:'2026-10-21T15:00:00Z'}])assert.equal(sessionPulseRows({...session,pulse:{'^SPX':{...session.pulse['^SPX'],...bad}}},kind)[0].change,null);
}
const stocks=[{symbol:'A',changes:{day:3,week:-5,month:null,year:8}},{symbol:'B',changes:{day:-2,week:10,month:4,year:-9}},{symbol:'C',changes:{day:0,week:null,month:-1,year:0}}];
for(const [period,gain,loss] of [['day','A','B'],['week','B','A'],['month','B','C'],['year','A','B']]){const ranks=biggestMovers(stocks,period);assert.equal(ranks.gainers[0].symbol,gain);assert.equal(ranks.losers[0].symbol,loss);assert.equal(ranks.gainers.length,1);assert.equal(ranks.losers.length,1);}
console.log('PASS: session pulse bases, missing/invalid/stale/wrong-session quotes, proxy labels and all four period rankings.');
