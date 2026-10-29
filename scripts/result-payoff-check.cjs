const fs=require('fs'),assert=require('node:assert/strict'),ts=require('typescript');
function load(file,dependencies={}) {
 const m={exports:{}};
 new Function('module','exports','require',ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText)(m,m.exports,name=>name in dependencies?dependencies[name]:require(name));
 return m.exports;
}
const axisModule=load('lib/result-stock-axis.ts');
for (const [before,after] of [[22.74,21.07],[240.26,258.77]]) {
 const axis=axisModule.resultStockAxis(before,after);
 assert.equal(axis.fraction(Math.min(before,after)),0);
 assert.equal(axis.fraction(Math.max(before,after)),1);
 assert.equal(axis.comparisonFraction(axis.fraction(before)),0);
 assert.equal(axis.comparisonFraction(axis.fraction(after)),1);
}
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const Card=load('components/OptionResultPayoff.tsx',{
 '../lib/result-stock-axis':axisModule,'../lib/options-strategies':{usd:n=>`$${n.toFixed(2)}`},
 '../styles/OptionResults.module.css':{default:{}},
}).default;
const html=renderToStaticMarkup(React.createElement(Card,{result:{symbol:'T',stock:{previousClose:22.74,price:21.07},moves:[{optionType:'put',strike:22,previousClose:.46,sessionClose:1.26,sessionPct:173.91,expiry:'2026-11-27',sessionDay:'2026-10-23'}]}}));
assert.match(html,/>\$21\.07<\/text>.*>\$22\.74<\/text>/);
assert.match(html,/<path d="M60 50[^\"]* L212 112" fill="none" stroke="#c7b5e8"/);
assert.match(html,/<circle cx="60" cy="28" r="3.5"/);
assert.match(html,/\$21.54/);
console.log('Call/put axes, put expiry curve, recorded values and breakeven verified.');

for(const [before,after,strike,premium] of [[16.06,18.24,18.5,.05],[251.65,220.47,210,.14],[321.89,281.24,270,.1],[20,20,20,.2]]){
 const axis=axisModule.resultStockAxis(before,after,strike,premium);
 assert.ok(axis.minimum<strike&&axis.maximum>strike,'strike and bend are visible');
 assert.equal(axis.comparisonFraction(axis.fraction(before)),0);
 if(before!==after)assert.equal(axis.comparisonFraction(axis.fraction(after)),1);
 for(const f of [-1,0,.5,1,2])assert.ok(axis.comparisonFraction(f)>=0&&axis.comparisonFraction(f)<=1);
}
console.log('Out-of-the-money calls/puts extend beyond strike; recorded prices remain bounded.');
