import {allowsMoverHeadlines,contextSymbol,type MoverContextArticle} from './mover-context';
import {newsUrl,type Headline} from './market-news';
// Explicit ticker tags only: do not infer a company from a headline substring.
export function headlineSymbols(value:string):string[]{
 return String(value||'').split(/[,;\s]+/).map(v=>contextSymbol(v.split(':').pop()||'')).filter(v=>/^[A-Z0-9][A-Z0-9.-]{0,14}$/.test(v));
}
export function findMoverHeadline(items:Headline[],symbol:string,now:number,blocked:{research?:boolean;trade?:boolean}={},period='day'):MoverContextArticle|undefined{
 if(!allowsMoverHeadlines(period)||blocked.research||blocked.trade)return undefined;
 const item=items.filter(n=>headlineSymbols([n.symbol,...(n.symbols||[])].join(' ')).includes(contextSymbol(symbol))&&n.id&&n.title&&
  Number.isFinite(Date.parse(n.publishedAt))&&Date.parse(n.publishedAt)<=now&&Date.parse(n.publishedAt)>=now-7*86400000)
  .sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt)||(a.id<b.id?-1:a.id>b.id?1:0))[0];
 return item?{symbol,title:item.title,summary:'',href:newsUrl(item),publishedAt:item.publishedAt,kind:'headline',source:item.source}:undefined;
}
