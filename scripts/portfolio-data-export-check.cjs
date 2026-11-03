const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,f);
const {portfolioDataCsv,portfolioDataFilename}=require('../lib/portfolio-data-export.ts');
const rows=Array.from({length:31},(_,i)=>({symbol:`TEST${i}`,value:i,weight:null,company:'Example, "Inc"'}));
const data={name:'Example Investor',kind:'funds',disclosure:'Reported holdings, not live positions.'};
const csv=portfolioDataCsv(data,rows,'2026-06-30');
assert.ok(csv.startsWith('\uFEFF'));
assert.equal(csv.split('\r\n').length,33);
assert.ok(csv.includes('"TEST30"')); // Not capped at the image top 10 or visible first 20.
assert.ok(csv.includes('"Example, ""Inc"""'));
assert.ok(csv.includes('"0","",""')); // Zero value preserved; missing shares/weight blank.
assert.ok(csv.includes('"2026-06-30"'));
const political=portfolioDataCsv({...data,kind:'politicians'},[{symbol:'ABC',amount:'$1,001–$15,000',rawAction:'Purchase',company:'=HYPERLINK("evil")'}],'');
assert.ok(political.includes('"$1,001–$15,000"'));
assert.ok(political.includes('"\'=HYPERLINK'));
assert.equal(portfolioDataFilename('../test',''), 'investor-tracker-..-test-all-disclosures.csv');
console.log('PASS CSV full rows, periods, ranges, zero/missing values, escaping and formula protection.');
