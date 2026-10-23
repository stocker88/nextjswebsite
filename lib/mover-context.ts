export type MoverContextArticle = {
  symbol: string; title: string; summary: string; href: string; publishedAt: string;
  kind: 'mover' | 'earnings' | 'preview' | 'news' | 'recap' | 'coverage'; sessionDate?: string;
  marketSession?: 'intraday' | 'premarket' | 'afterhours'; direction?: 'up' | 'down' | 'flat';
};
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
  return items.filter(a => contextSymbol(a.symbol) === contextSymbol(symbol) && a.href.startsWith('/') && !a.href.startsWith('//') &&
    Number.isFinite(Date.parse(a.publishedAt)) && Date.parse(a.publishedAt) <= now && Date.parse(a.publishedAt) >= now - WEEK)
    .sort((a,b) => Number(isSessionExplanation(b,period,sessionDate,change,marketSession)) - Number(isSessionExplanation(a,period,sessionDate,change,marketSession)) ||
      Number(['recap','coverage'].includes(a.kind)) - Number(['recap','coverage'].includes(b.kind)) ||
      Date.parse(b.publishedAt) - Date.parse(a.publishedAt))[0];
}
