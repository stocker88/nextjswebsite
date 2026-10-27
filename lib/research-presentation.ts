import type {MoverArticle} from './mover-research';
export function earningsRows(a:Pick<MoverArticle,'researchContentKind'|'earningsHighlights'>){
 if(a.researchContentKind!=='earnings_results'||!Array.isArray(a.earningsHighlights)||a.earningsHighlights.length!==3)return [];
 const labels=['EPS','Revenue','Guidance'];
 if(!a.earningsHighlights.every((v,i)=>typeof v==='string'&&new RegExp('^[🟢🔴🟡] '+labels[i]+'\\b','u').test(v)&&v.includes(' | ')))return [];
 return a.earningsHighlights.map(line=>{const [headline,...detail]=line.replace(/^[🟢🔴🟡]\s*/u,'').split(' | ');return {headline,detail:detail.join(' · '),tone:line.startsWith('🟢')?'positive':line.startsWith('🔴')?'negative':'neutral'};});
}
export function sessionPerformance(a:MoverArticle){
 const s=a.researchSessionSnapshot;
 const move=s?.move??a.move,quoteAsOf=s?.quoteAsOf??a.quoteAsOf,sessionDate=s?.sessionDate??a.sessionDate,session=s?.marketSession??a.marketSession??'intraday';
 if(!Number.isFinite(move)||move===null||!quoteAsOf||!Number.isFinite(Date.parse(quoteAsOf))||!/^\d{4}-\d{2}-\d{2}$/.test(sessionDate)||!['premarket','intraday','afterhours'].includes(session||''))return null;
 const date=new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(sessionDate+'T12:00:00Z'));
 return {move:move as number,date,session:session==='premarket'?'Before open':session==='afterhours'?'After close':'During trading',basis:session==='afterhours'?'Since the same-day regular close':'Since the previous regular close',tone:move!>0?'positive':move!<0?'negative':'neutral'};
}
export function newestFirst<T extends {id:string;publishedAt:string}>(items:T[]):T[]{
 return [...items].sort((a,b)=>(Date.parse(b.publishedAt)||0)-(Date.parse(a.publishedAt)||0)||a.id.localeCompare(b.id));
}
