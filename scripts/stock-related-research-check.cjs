const fs=require('node:fs'),ts=require('typescript'),assert=require('node:assert/strict');
function load(file,imports){const m={exports:{}};new Function('module','exports','require',ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText)(m,m.exports,id=>imports[id]);return m.exports;}
const research=load('lib/research.ts',{});
const d=Date.parse('2026-10-27T12:00Z');
const {recentStockNews}=load('lib/stock-related-research.ts',{
 './research':research,
 './mover-research':{moverArticles:[{id:'m',postId:'shared',symbol:'NBIS',title:'Mover',publishedAt:new Date(d).toISOString(),slug:'m'}],moverArticleUrl:a=>'/news/'+a.slug+'/'},
 './option-results':{optionResults:[{id:'option',symbol:'NBIS',title:'Option result',publishedAt:d/1000}],optionResultUrl:a=>'/results/'+a.id+'/'},
 './market-briefings':{briefings:[{postId:'earnings',symbols:['NBIS'],title:'Earnings',publishedAt:new Date(d-1000).toISOString(),slug:'earnings'}],briefingUrl:a=>'/catalysts/'+a.slug+'/'}
});
const row=(id,symbol='NBIS',time=d/1000-100)=>({id,title:id,time,symbols:[symbol],likes:0,comments:0,shares:0});
const items=[row('shared'),...Array.from({length:20},(_,i)=>row('research'+i)),row('wrong','NBISX'),row('old','NBIS',1),row('future','NBIS',(d+86400000)/1000),{...row('parent','OTHER'),attachedThreads:[row('attached','$nbis')]}];
const all=recentStockNews(items,'nbis',new Date(d));
assert.equal(all.length,25);assert.equal(all.filter(a=>a.id==='shared').length,1);assert.equal(all.find(a=>a.id==='shared').href,'/news/m/');assert(all.some(a=>a.category==='Options results'&&a.href==='/results/option/'));assert(all.some(a=>a.id==='earnings'));assert(all.some(a=>a.id==='attached'));assert(all.some(a=>a.id==='old'));assert(!all.some(a=>['wrong','future'].includes(a.id)));
assert.equal(recentStockNews([row('only','XYZ')],'XYZ',new Date(d)).length,1);
console.log('Related research passed: all sources, exact tickers, deduplication, attached threads, seconds/ms dates, no minimum or archive cap.');
