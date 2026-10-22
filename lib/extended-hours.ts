import {HeatStock, PERIOD_OPTIONS} from './market-heatmap';
export type SessionKind = 'preMarket' | 'afterHours';
export type ExtendedSession = {version:number;mode:string;asOf:string;assembledAt:string;quotedAt:string;priceBasis:string;source:string;rows:HeatStock[];pulse?:Record<string,{price:number;previousClose:number;quotedAt:string;sourceSymbol?:string}>;analyticsContext?:{treasury?:Record<string,{date:string;value:number}[]>}};
export const sessionInfo = {
 preMarket:{title:'Premarket stock heatmap',label:'Pre-Market',path:'/premarket-stock-heatmap/',basis:'previous regular-session close',description:'See premarket stock movers and a free heatmap of the largest S&P 500 holdings before the opening bell.'},
 afterHours:{title:'After-hours stock heatmap',label:'After-Hours',path:'/after-hours-stock-heatmap/',basis:'same-day regular-session close',description:'Explore after-hours stock movers and a free heatmap of the largest S&P 500 holdings after the closing bell.'}
};
export function validSession(value:any,kind:SessionKind):value is ExtendedSession {
 return value?.version===1 && value.mode===(kind==='preMarket'?'premarket':'afterhours') && /^\d{4}-\d{2}-\d{2}$/.test(value.asOf) && Number.isFinite(Date.parse(value.quotedAt)) && Number.isFinite(Date.parse(value.assembledAt)) && Array.isArray(value.rows) && value.rows.length>0 && value.rows.every((r:any)=>typeof r.symbol==='string' && typeof r.name==='string' && typeof r.sector==='string' && Number.isFinite(r.price) && r.changes && (r.changes.day===null||Number.isFinite(r.changes.day)) && (r.weight>0||r.marketCap>0));
}
export function sessionRows(session:ExtendedSession,kind:SessionKind):HeatStock[] {
 const formatter=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
 return session.rows.slice(0,100).map(row=>{
  const time=(row as HeatStock & {quoteAsOf?:string}).quoteAsOf;
  const parts=time&&Number.isFinite(Date.parse(time))?Object.fromEntries(formatter.formatToParts(new Date(time)).map(p=>[p.type,p.value])):null;
  const minutes=parts?Number(parts.hour)*60+Number(parts.minute):-1;
  const date=new Date(session.asOf+'T12:00:00Z'), month=date.getUTCMonth(),dom=date.getUTCDate();
  const close=(month===10&&date.getUTCDay()===5&&dom>=23&&dom<=29)||(month===11&&dom===24)||(month===6&&dom===3)?780:960;
  const current=parts && `${parts.year}-${parts.month}-${parts.day}`===session.asOf && (kind==='preMarket'?minutes>=240&&minutes<570:minutes>=close&&minutes<=1200);
  return {...row,changes:Object.fromEntries(PERIOD_OPTIONS.map(({value})=>[value,value==='day'&&current?row.changes.day:null])) as HeatStock['changes']};
 });
}
export type SessionClock={locale:string;timeZone:string};
// Stable Eastern fallback for static HTML and first hydration render.
// After mounting, callers pass the browser’s detected locale and timezone.
export const sessionTime=(value:string,clock:SessionClock={locale:'en-US',timeZone:'America/New_York'})=>new Intl.DateTimeFormat(clock.locale,{timeZone:clock.timeZone,month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'}).format(new Date(value));
