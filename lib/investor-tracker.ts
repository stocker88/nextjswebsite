import {getSiteAuth} from './site-auth';

export type TrackerProfile={id:string;name:string;kind:'funds'|'politicians'};
export type TrackerRow={id:string;symbol:string;company?:string;value?:number|null;shares?:number|null;weight?:number|null;period?:string;filedDate?:string;eventDate?:string;rawAction?:string;owner?:string;securityType?:string;amount?:string;sourceUrl?:string};
export type TrackerDetail=TrackerProfile&{rows:TrackerRow[];history:{period:string;rows:TrackerRow[]}[];updatedAt:string;stale:boolean;following:boolean;disclosure:string;methodology:string;performance:{symbols:string[];reason?:string;points:{date:string;value:number;benchmark:number|null}[]}};
// Use the app's callable. Detail access is checked on the server, not in the UI.
// Never persist paid holdings to a public static asset or a shared browser cache.
export async function trackerRequest<T>(action:'list'|'detail'|'follow'|'unfollow',id?:string):Promise<T>{
 const auth=await getSiteAuth();
 const {getFunctions,httpsCallable}=await import('firebase/functions');
 const result=await httpsCallable<{action:string;id?:string},T>(getFunctions(auth.app,'us-central1'),'smartMoneyTracker',{timeout:60000})({action,...(id?{id}:{})});
 return result.data;
}
export function trackerRows(data:TrackerDetail,period:string):TrackerRow[]{
 if(data.history?.length)return [...(data.history.find(h=>h.period===period)||data.history[0]).rows].sort((a,b)=>(b.value||0)-(a.value||0));
 return data.rows.filter(r=>!period||r.filedDate?.startsWith(period));
}
export function portfolioHoldings(rows:TrackerRow[]){
 const amounts=new Map<string,number>();
 for(const row of rows)if(row.symbol&&typeof row.value==='number'&&Number.isFinite(row.value)&&row.value>0)amounts.set(row.symbol,(amounts.get(row.symbol)||0)+row.value);
 return Array.from(amounts).map(([symbol,value])=>({symbol,value})).sort((a,b)=>b.value-a.value);
}
export const portfolioColors=['#b59af7','#6bdcc0','#5caff1','#f2c777','#f28ca8','#7989eb','#50b8b7','#c4cf89','#d69ce0','#ebab76','#44516b'];
export const trackerMoney=(value:number)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',notation:'compact',maximumFractionDigits:1}).format(value);
export function trackerDate(value?:string){return value&&Number.isFinite(Date.parse(value))?new Date(value.slice(0,10)+'T12:00:00Z').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}):'Date unavailable';}
export function safeFiling(value?:string){try{const url=new URL(value||'');return url.protocol==='https:'?url.href:undefined}catch{return undefined}}
