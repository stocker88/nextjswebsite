import {contextSymbol} from './mover-context';
export type MoverTrade={symbol:string;postId:string;isAIAdvisor:boolean;title:string;sessionDate:string;publishedAt:string;href:string};
export function findMoverTrade(items:MoverTrade[],symbol:string,now:number):MoverTrade|undefined{
 return items.filter(item=>item.isAIAdvisor===true&&contextSymbol(item.symbol)===contextSymbol(symbol)&&
  /^\/results\/[a-z0-9.-]+\/$/.test(item.href)&&Number.isFinite(Date.parse(item.publishedAt))&&
  Date.parse(item.publishedAt)<=now&&Date.parse(item.publishedAt)>=now-7*86400000&&
  Number.isFinite(Date.parse(item.sessionDate+'T12:00:00Z'))&&Date.parse(item.sessionDate+'T12:00:00Z')>=now-7*86400000)
  .sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt))[0];
}
