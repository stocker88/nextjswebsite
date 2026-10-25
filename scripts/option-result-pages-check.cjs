const fs=require('node:fs'),assert=require('node:assert/strict'),ts=require('typescript');
const mod={exports:{}};
new Function('require','module','exports',ts.transpileModule(fs.readFileSync('lib/option-results.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText)(name=>name.endsWith('option-result-previews.json')?require('../data/option-result-previews.json'):null,mod,mod.exports);
const {optionResultSlug,optionResultUrl,optionResultHighlight,findOptionResult,optionResults}=mod.exports;
const base=optionResults[0];
const mock={...base,id:'options_results_TEST_2026-10-23',moves:[{...base.moves[0],strike:100,sessionPct:10},{...base.moves[0],strike:110,sessionPct:25}],images:[{url:'https://example.com/first.png'},{url:'https://example.com/second.png'}]};
assert.equal(optionResultHighlight(mock).move.strike,110);assert.equal(optionResultHighlight(mock).image.url,'https://example.com/second.png');
assert.equal(optionResultHighlight({...mock,moves:mock.moves.map(m=>({...m,sessionPct:10}))}).image.url,'https://example.com/first.png');
assert.equal(optionResultUrl(mock),'/results/options-results-test-2026-10-23/');
assert.equal(findOptionResult(optionResultSlug(mock),[mock]),mock);assert.equal(findOptionResult('missing',[mock]),undefined);
assert.equal(new Set(optionResults.map(optionResultUrl)).size,optionResults.length);
for(const r of optionResults){
 assert.equal(findOptionResult(optionResultSlug(r)),r);
 const {move,image}=optionResultHighlight(r);
 assert(r.moves.includes(move)&&r.images.includes(image));
 assert.equal(image,r.images[r.moves.indexOf(move)]);
 assert(Math.abs(((move.sessionClose/move.previousClose)-1)*100-move.sessionPct)<.02,'Published result must match its premium endpoints');
}
assert(fs.readFileSync('components/OptionResultCard.tsx','utf8').includes('fetchResultMemberContent'));
for(const result of optionResults){assert.equal(result.recap,undefined);assert.equal(result.quickTake,undefined);assert.equal(result.text,undefined);}
assert(fs.readFileSync('pages/results/[slug].tsx','utf8').includes('fallback:false'));
console.log('PASS: unique result routes, exact report lookup, unknown IDs, premium calculations and matching highlighted-contract images.');
