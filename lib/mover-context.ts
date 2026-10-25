export type MoverContextArticle = {
  symbol: string; title: string; summary: string; href: string; publishedAt: string;
  kind: 'mover' | 'earnings' | 'preview' | 'news' | 'recap' | 'coverage' | 'headline' | 'signal'; isAIAdvisor?: boolean; sourceCollection?: string; postId?: string; source?: string; sessionDate?: string;
  marketSession?: 'intraday' | 'premarket' | 'afterhours'; direction?: 'up' | 'down' | 'flat';
};
const compareId=(a:string,b:string)=>a<b?-1:a>b?1:0;
const WEEK = 7 * 86400000;
export const contextSymbol = (symbol: string) => symbol.trim().replace(/^[#$]/, '').toUpperCase().replace(/\./g, '-');
// Only a matching, dated mover report explains this session. Older reports
// and earnings previews remain context, rather than a claimed cause.
export function isSessionExplanation(article: MoverContextArticle, period: string, sessionDate: string, change: number | null, marketSession = 'intraday') {
  return period === 'day' && article.kind === 'mover' && article.sessionDate === sessionDate &&
    (article.marketSession || 'intraday') === marketSession &&
    (change! > 0 ? article.direction === 'up' : change! < 0 && article.direction === 'down');
}
export function findMoverContext(items: MoverContextArticle[], symbol: string, now: number, period: string, sessionDate: string, change: number | null, marketSession = 'intraday') {
  const matches = items.filter(a => a.kind !== 'signal' && a.kind !== 'headline' && contextSymbol(a.symbol) === contextSymbol(symbol) && a.href.startsWith('/') && !a.href.startsWith('//') &&
    Number.isFinite(Date.parse(a.publishedAt)) && Date.parse(a.publishedAt) <= now && Date.parse(a.publishedAt) >= now - WEEK)
    .sort((a,b) => Number(isSessionExplanation(b,period,sessionDate,change,marketSession)) - Number(isSessionExplanation(a,period,sessionDate,change,marketSession)) ||
      Number(['recap','coverage'].includes(a.kind)) - Number(['recap','coverage'].includes(b.kind)) ||
      Date.parse(b.publishedAt) - Date.parse(a.publishedAt) || compareId(a.postId||a.href,b.postId||b.href));
  if(matches.length)return matches[0];
  const window=signalWindow(period,now);
  if(!window||change===null||!Number.isFinite(change)||change<=0)return undefined;
  const signals=items.filter(a=>a.kind==='signal'&&a.isAIAdvisor===true&&a.sourceCollection==='posts'&&contextSymbol(a.symbol)===contextSymbol(symbol)&&a.href.startsWith('/')&&!a.href.startsWith('//')&&Number.isFinite(Date.parse(a.publishedAt))&&Date.parse(a.publishedAt)<=now);
  const historical=signals.filter(a=>Date.parse(a.publishedAt)>=window[0]&&Date.parse(a.publishedAt)<=window[1])
    .sort((a,b)=>Date.parse(a.publishedAt)-Date.parse(b.publishedAt)||compareId(a.postId||a.href,b.postId||b.href))[0];
  return historical||signals.sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt)||compareId(a.postId||a.href,b.postId||b.href))[0];
}

export function allowsMoverHeadlines(period:string) {
 return period==='day'||period==='premarket'||period==='afterhours';
}
export function signalWindow(period:string,now:number):[number,number]|null {
 const d=new Date(now);
 if(period==='ytd'){const end=Date.UTC(d.getUTCFullYear(),0,1);return now-end>=28*86400000?[Date.UTC(d.getUTCFullYear()-1,0,1),end]:null;}
 const windows:Record<string,[number,number]>={month:[1,3],quarter:[3,6],halfyear:[6,12],year:[12,24],threeYears:[36,72],fiveYears:[60,120]};
 const range=windows[period];if(!range)return null;
 const before=(months:number)=>{const x=new Date(now),day=x.getUTCDate();x.setUTCDate(1);x.setUTCMonth(x.getUTCMonth()-months);x.setUTCDate(Math.min(day,new Date(Date.UTC(x.getUTCFullYear(),x.getUTCMonth()+1,0)).getUTCDate()));return x.getTime();};
 return [before(range[1]),before(range[0])];
}
