import {moverArticles,moverArticleUrl} from './mover-research';
import {optionResults,optionResultUrl} from './option-results';
import {briefings,briefingUrl} from './market-briefings';
import {researchPages,researchUrl} from './research';
import type {ResearchPreview} from './research';
// Merge all public article types by exact ticker and publication identity.
export function recentStockNews(items: ResearchPreview[], ticker: string, now = new Date()) {
  const normalize=(s:string)=>s.trim().replace(/^[#$]/,'').toUpperCase().replace(/\./g,'-');
  const timestamp=(n:number|null)=>n ? (n<1e12?n*1000:n) : 0;
  const empty={likes:0,comments:0,shares:0};
  const entries:ResearchPreview[]=[
    ...moverArticles.map(a=>({...empty,id:a.postId||a.id,title:a.title,time:Date.parse(a.publishedAt),symbols:[a.symbol],href:moverArticleUrl(a),category:a.kind==='earnings_review'?'Earnings':'Movers'})),
    ...optionResults.map(a=>({...empty,id:a.id,title:a.title,time:timestamp(a.publishedAt),symbols:[a.symbol],href:optionResultUrl(a),category:'Options results'})),
    ...briefings.map(a=>({...empty,id:a.postId,title:a.title,time:Date.parse(a.publishedAt),symbols:a.symbols,href:briefingUrl(a),category:'Earnings & market updates'})),
    ...researchPages(items).map(a=>({...empty,id:a.id,title:a.title,time:a.time,symbols:a.symbols,href:researchUrl(a.id,a.title),category:'Research'}))
  ];
  const seen=new Set<string>();
  return entries.filter(a=>a.symbols.some(s=>normalize(s)===normalize(ticker)) && timestamp(a.time)<=now.getTime()).filter(a=>{if(seen.has(a.id))return false;seen.add(a.id);return true;}).sort((a,b)=>timestamp(b.time)-timestamp(a.time)||a.id.localeCompare(b.id));
}
