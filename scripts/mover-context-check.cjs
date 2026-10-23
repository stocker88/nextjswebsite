const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,f);
const {findMoverContext,isSessionExplanation}=require('../lib/mover-context.ts');
const {buildContext}=require('./build-mover-context.cjs');
const now=Date.parse('2026-10-23T16:40:00Z');
const current={symbol:'CCI',title:'CCI move',summary:'Dated catalyst',href:'/news/cci/',publishedAt:'2026-10-23T15:00:00Z',sessionDate:'2026-10-23',direction:'up',kind:'mover'};
const preview={...current,title:'Earnings preview',href:'/catalysts/cci-preview/',kind:'preview',publishedAt:'2026-10-23T16:00:00Z'};
const pick=(items,symbol='CCI',period='day',change=5,session='intraday')=>findMoverContext(items,symbol,now,period,'2026-10-23',change,session);
assert.equal(pick([preview,current]).href,current.href); // Matching session report beats newer preview.
assert.equal(pick([preview,current],'CCI','year').href,preview.href);
assert.equal(pick([current],'CI'),undefined); // Exact symbol, never a substring.
assert.equal(pick([{...current,symbol:'BRK.B'}],'brk-b').symbol,'BRK.B');
for(const publishedAt of ['invalid','2026-10-23T16:40:01Z','2026-10-16T16:39:59Z'])assert.equal(pick([{...current,publishedAt}]),undefined);
assert(pick([{...current,publishedAt:'2026-10-16T16:40:00Z'}]));
assert.equal(pick([{...current,href:'//external.example/'}]),undefined);
assert(isSessionExplanation(current,'day','2026-10-23',5));
for(const args of [['year','2026-10-23',5],['day','2026-10-22',5],['day','2026-10-23',-5],['day','2026-10-23',null],['day','2026-10-23',5,'premarket']])assert(!isSessionExplanation(current,...args));
assert(!isSessionExplanation(preview,'day','2026-10-23',5));
const mover={...current,slug:'cci',catalyst:'Source checked context'};
const stockPost={id:'stock-post',title:'CCI update',time:now/1000-3600,symbols:['cci','earnings'],quickTake:'New company results.'};
const recap={...preview,slug:'recap',kind:'premarket',postId:'briefing_premarket_20261023',symbols:['CCI','TMUS'],sections:[{heading:'Wireless carriers',text:'TMUS reported a premarket decline.'}]};
const result=buildContext({movers:[mover],briefings:[{...preview,slug:'cci-preview',kind:'earnings_preview',symbols:['CCI']},recap],research:[stockPost,{...stockPost,id:'multi-stock',symbols:['CCI','SLB']},{...stockPost,id:recap.postId},{...stockPost,id:'options_results_CCI_20261023'},{...stockPost,id:'no-summary',quickTake:undefined}]},now);
assert.equal(result.length,8);assert(result.some(a=>a.href==='/news/cci/'&&a.summary==='Source checked context'));
assert(result.some(a=>a.href==='/catalysts/cci-preview/'&&a.kind==='preview'));
assert(result.some(a=>a.href==='/stock-market-news/cci-update--stock-post/'));
const tmus=pick(result,'TMUS');assert.equal(tmus.kind,'recap');assert.equal(tmus.href,'/news/briefings/recap/');assert.equal(tmus.summary,'TMUS reported a premarket decline.');
assert(!isSessionExplanation(tmus,'day','2026-10-23',-5));
assert(result.some(a=>a.symbol==='SLB'&&a.kind==='coverage'));
assert(result.some(a=>a.href.endsWith('--no-summary/')&&a.summary==='CCI update'));
assert(!result.some(a=>a.href.includes('options_results_')||a.href.includes('--briefing_premarket_')));
assert.equal(pick(result).kind,'mover'); // Dedicated reports retain priority over recap mentions.
assert.equal(buildContext({movers:[{...mover,publishedAt:'2020-01-01'}]},now).length,0);
assert(fs.readFileSync('scripts/sync-market-briefings.cjs','utf8').includes("require('./build-mover-context.cjs').build()"));
console.log('PASS: stock/date/session matching, canonical links, recap/explicit feed coverage fallback, missing summaries, dedicated-report priority and result-post exclusion.');
