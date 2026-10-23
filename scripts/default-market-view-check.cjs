const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,f);
const {defaultMarketView}=require('../lib/default-market-view.ts');
for(const [time,expected] of [
  ['2026-10-23T07:59:59Z','day'],['2026-10-23T08:00:00Z','preMarket'],
  ['2026-10-23T13:29:59Z','preMarket'],['2026-10-23T13:30:00Z','day'],
  ['2026-10-23T19:59:59Z','day'],['2026-10-23T20:00:00Z','afterHours'],
  ['2026-10-23T23:59:59Z','afterHours'],['2026-10-24T00:00:00Z','day'],
  // Winter timezone, holiday, weekend and US date rollover.
  ['2026-11-02T08:59:59Z','day'],['2026-11-02T09:00:00Z','preMarket'],
  ['2026-11-02T14:30:00Z','day'],['2026-11-02T21:00:00Z','afterHours'],
  ['2026-11-03T01:00:00Z','day'],['2026-11-26T12:00:00Z','day'],
  ['2026-10-24T12:00:00Z','day'],['2026-10-25T22:00:00Z','day'],
  ['2026-07-03T12:00:00Z','day'],
  // Early close begins at 13:00 ET and extended hours end at 17:00 ET.
  ['2026-11-27T17:59:59Z','day'],['2026-11-27T18:00:00Z','afterHours'],
  ['2026-11-27T21:59:59Z','afterHours'],['2026-11-27T22:00:00Z','day'],
  ['2026-12-24T18:00:00Z','afterHours'],['2028-07-03T17:00:00Z','afterHours'],
  ['2029-01-01T12:00:00Z','day'],
])assert.equal(defaultMarketView(Date.parse(time)),expected,time);
console.log('PASS: automatic market view, exact session boundaries, Eastern timezone/DST, holidays, weekends and early closes.');
