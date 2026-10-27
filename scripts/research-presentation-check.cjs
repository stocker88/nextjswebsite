const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const site=path.resolve(__dirname,'..');const ts=require(site+'/node_modules/typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,f);
require.extensions['.tsx']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true,jsx:ts.JsxEmit.React}}).outputText.replace(/require\("react\/jsx-runtime"\)/g,`require('${site}/node_modules/react/jsx-runtime')`),f);
const {earningsRows,sessionPerformance,newestFirst}=require(site+'/lib/research-presentation.ts');
const a={symbol:'TEST',sessionDate:'2026-10-27',marketSession:'intraday',move:10,quoteAsOf:'2026-10-27T14:00:00Z',researchContentKind:'earnings_results',earningsHighlights:['🟢 EPS beat +8.2% | Actual: $0.18 | Cons.: $0.1663','🔴 Revenue miss -2% | Actual: $1B | Cons.: $1.02B','🟡 Guidance maintained | Revenue: $5B']};
assert.deepEqual(earningsRows(a).map(r=>r.tone),['positive','negative','neutral']);assert(earningsRows(a)[0].detail.includes('$0.1663'));assert.equal(earningsRows({...a,researchContentKind:undefined}).length,0);assert.equal(earningsRows({...a,earningsHighlights:['fake']}).length,0);
assert.equal(sessionPerformance(a).session,'During trading');assert.equal(sessionPerformance({...a,move:0}).tone,'neutral');assert.equal(sessionPerformance({...a,marketSession:'afterhours'}).basis,'Since the same-day regular close');assert.equal(sessionPerformance({...a,move:null}),null);

const mixed=[{id:'briefing',publishedAt:'2026-10-27T11:15:00Z'},{id:'mover',publishedAt:'2026-10-27T14:30:00Z'},{id:'earnings',publishedAt:'2026-10-27T13:05:00-04:00'}];assert.deepEqual(newestFirst(mixed).map(x=>x.id),['earnings','mover','briefing']);assert.equal(mixed[0].id,'briefing');

console.log('Research presentation: colored results, exact consensus precision, session bases and mixed publication-time ordering passed.');

for(const file of ['components/MoverNewsCard.tsx','pages/news/[slug].tsx']){const page=fs.readFileSync(path.join(site,file),'utf8');assert(page.includes('<SessionPerformanceCard article={a}/>'));assert(page.includes('<EarningsResultsCard article={a}/>'));}
const page=fs.readFileSync(path.join(site,'pages/news/index.tsx'),'utf8');assert(page.includes('const feed=newestFirst('));assert(!page.includes('<BriefingCards'));
