import {contextSymbol} from './mover-context';
export type MoverTrade={symbol:string;optionType?:'call'|'put';postId:string;isAIAdvisor:boolean;performancePct:number;contractCount:number;title:string;sessionDate:string;publishedAt:string;href:string};
export function findMoverTrade(items:MoverTrade[],symbol:string,now:number,match:{optionType?:'call'|'put';sessionDate?:string}={}):MoverTrade|undefined{
 return items.filter(item=>(!match.optionType||item.optionType===match.optionType)&&(!match.sessionDate||item.sessionDate===match.sessionDate)&&item.isAIAdvisor===true&&Number.isFinite(item.performancePct)&&item.performancePct>=-100&&contextSymbol(item.symbol)===contextSymbol(symbol)&&
  /^\/results\/[a-z0-9.-]+\/$/.test(item.href)&&Number.isFinite(Date.parse(item.publishedAt))&&
  Date.parse(item.publishedAt)<=now&&Date.parse(item.publishedAt)>=now-7*86400000&&
  Number.isFinite(Date.parse(item.sessionDate+'T12:00:00Z'))&&Date.parse(item.sessionDate+'T12:00:00Z')>=now-7*86400000)
  .sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt))[0];
}

export function formatOptionPerformance(value:number):string{
 const rounded=Math.sign(value)*Math.round(Math.abs(value));
 return `${rounded>0?'+':''}${rounded}%`;
}
