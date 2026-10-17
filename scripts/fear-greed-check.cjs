const fs=require('fs'),path=require('path'),ts=require('typescript'),Module=require('module'),assert=require('assert');
const filename=path.join(__dirname,'../lib/fear-greed.ts');const m=new Module(filename,module);m._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,filename);
const {normalizeFearGreed,score}=m.exports;
for(const v of [null,'50',-1,101,NaN,Infinity])assert.equal(score(v),null);
assert.equal(score(0),0);assert.equal(normalizeFearGreed({}),null);
assert.equal(normalizeFearGreed({fear_and_greed:{score:50,timestamp:'bad'}}),null);
const d=normalizeFearGreed({fear_and_greed:{score:50,timestamp:'2026-10-16T20:00:00Z',previous_close:0},market_momentum_sp500:{score:60},fear_and_greed_historical:{data:[{x:1720000000000,y:0},{x:1720000000001,y:101}]}});
assert.equal(d.previousClose,0);assert.equal(d.indicators[0].score,60);assert.equal(d.indicators[1].score,null);assert.equal(d.history.length,1);
console.log('Snapshot validation and missing-data checks passed.');
