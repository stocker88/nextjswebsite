const ts = require('typescript');
const fs = require('node:fs');
const assert = require('node:assert/strict');
function load(file, imports = {}) {
  const m = {exports:{}};
  const output = ts.transpileModule(fs.readFileSync(file,'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText;
  new Function('module','exports','require',output)(m,m.exports,id => {
    if (!(id in imports)) throw Error('Unexpected import: '+id);
    return imports[id];
  });
  return m.exports;
}
const research = load('lib/research.ts');
const saved = JSON.parse(fs.readFileSync('data/featured-research.json','utf8'));
const {featuredResearch,overnightOptionsResult,resolveResearchArticle} = load('lib/featured-research.ts', {'../data/featured-research.json':saved,'./research':research});
(async () => {
  assert.equal(overnightOptionsResult.title,'30X! BOOM! Overnight!');
  assert(overnightOptionsResult.symbols.includes('SNOW'));
  assert(overnightOptionsResult.time > 0);
  assert.equal(new Set(featuredResearch.map(i=>i.id)).size,featuredResearch.length);
  let feedCalls=0;
  const unavailable=async()=>{feedCalls++;throw Error('Rolling research unavailable');};
  const route=decodeURIComponent(research.researchUrl(overnightOptionsResult.id,overnightOptionsResult.title).split('/').pop());
  for (const key of [route,overnightOptionsResult.id,'previous-headline--'+overnightOptionsResult.id]) {
    assert.equal((await resolveResearchArticle(key,unavailable)).id,overnightOptionsResult.id);
    assert.equal((await resolveResearchArticle(key,async()=>[])).title,overnightOptionsResult.title);
  }
  assert.equal(feedCalls,0,'Pinned article must not depend on rotating feed/network');
  const ordinary={id:'ordinary',title:'Current research',time:1,symbols:[],likes:0,comments:0,shares:0};
  assert.equal(await resolveResearchArticle('ordinary',async()=>[ordinary]),ordinary);
  const parent={...ordinary,id:'parent',attachedThreads:[ordinary]};
  assert.equal((await resolveResearchArticle('ordinary',async()=>[parent])).title,ordinary.title);
  assert.equal(await resolveResearchArticle('missing',async()=>[]),undefined);
  assert.equal(await resolveResearchArticle('prefix'+overnightOptionsResult.id,async()=>[]),undefined);
  console.log('Featured results passed: retained snapshot, empty/offline feed, canonical/legacy URLs, current/attached articles and missing routes.');
})().catch(error=>{console.error(error);process.exitCode=1;});
