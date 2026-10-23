const fs = require('node:fs'), path = require('node:path'), ts = require('typescript');
function researchHelpers() {
  const file = path.join(__dirname, '../lib/research.ts'), m = {exports:{}};
  new Function('module','exports',ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(m,m.exports);
  return m.exports;
}
function buildContext({movers=[],briefings=[],research=[]}, now=Date.now()) {
  const {researchPages,researchUrl} = researchHelpers();
  const items = movers.map(a => ({symbol:a.symbol,title:a.title,summary:a.catalyst||a.summary,href:'/news/'+a.slug+'/',publishedAt:a.publishedAt,
    kind:a.kind==='earnings_review'?'earnings':'mover',sessionDate:a.sessionDate,marketSession:a.marketSession||'intraday',direction:a.direction}));
  for (const a of briefings) {
    if (a.kind!=='earnings_preview'||a.symbols?.length!==1) continue;
    items.push({symbol:a.symbols[0],title:a.title,summary:a.summary,href:'/catalysts/'+a.slug+'/',publishedAt:a.publishedAt,kind:'preview',sessionDate:a.sessionDate});
  }
  const catalog = new Set([...require('../data/app-stock-catalog.json'),...require('../data/heatmap-stock-profiles.json')].map(a=>a.symbol.toUpperCase().replace(/\./g,'-')));
  // Recaps and multi-stock posts cannot establish an individual stock's cause.
  for (const a of researchPages(research)) {
    const symbols=[...new Set(a.symbols.map(s=>s.replace(/^[#$]/,'').toUpperCase().replace(/\./g,'-')).filter(s=>catalog.has(s)))];
    if (symbols.length!==1||!a.quickTake||/^(ai_market_recap_|briefing_premarket_)/.test(a.id)) continue;
    const time=a.time<1e12?a.time*1000:a.time;
    if (!Number.isFinite(time)||!a.time) continue;
    items.push({symbol:symbols[0],title:a.title.split(/\r?\n/)[0],summary:a.quickTake,href:researchUrl(a.id,a.title)+'/',publishedAt:new Date(time).toISOString(),kind:'news'});
  }
  return [...new Map(items.filter(a=>a.symbol&&a.title&&/^\/(news|catalysts|stock-market-news)\/[^/]+\/$/.test(a.href)&&Date.parse(a.publishedAt)<=now&&Date.parse(a.publishedAt)>=now-7*86400000)
    .sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt)).map(a=>[a.href,{...a,title:a.title.slice(0,240),summary:(a.summary||'').slice(0,900)}])).values()];
}
function build(root=path.join(__dirname,'..')) {
  const read=name=>JSON.parse(fs.readFileSync(path.join(root,'data',name+'.json'),'utf8'));
  const items=buildContext({movers:read('mover-research'),briefings:read('market-briefings'),research:read('research')});
  fs.writeFileSync(path.join(root,'data/mover-context.json'),JSON.stringify(items,null,2)+'\n');
  console.log('Saved',items.length,'recent stock article links for movers'); return items;
}
if (require.main===module) build();
module.exports={build,buildContext};
