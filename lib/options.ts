export const OPTIONS_SYMBOLS = ['SPY','QQQ'] as const;
export type Contract = {
 id:string; symbol:string; expiry:string; type:'call'|'put'; strike:number;
 volume:number|null; oi:number|null; priorOi:number|null; averageVolume:number|null;
 bid:number|null; ask:number|null; last:number|null; iv:number|null; multiplier:number|null;
 spot:number|null; asOf:string|null; delta?:number|null;
};
export type OptionSnapshot = {
 status:'ready'|'unavailable'; source:string; mode:'example'|'delayed'|'real-time';
 retrievedAt:string; asOf:string|null; partial:boolean; symbol:string; contracts:Contract[];
 message?:string; publicSymbols?:string[]; batchDay?:string; coverage?:{referencePrice:number|null;referencePriceAsOf:string|null};
};
export type OptionTrade={id:string;time:string;price:number;size:number;premium:number|null;conditions:number[];side:'unknown'};
export const numberOrNull=(v:unknown):number|null=> typeof v==='number'&&Number.isFinite(v)?v:null;
const nonnegative=(v:unknown)=>{const n=numberOrNull(v);return n!==null&&n>=0?n:null};
export const ratio=(a:number|null,b:number|null)=>a!==null&&b!==null&&b>0?a/b:null;
export const validExpiry=(value:string)=>/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;
export const isoFromNanoseconds=(value:unknown)=>{const n=numberOrNull(value);if(n===null||n<=0)return null;const d=new Date(n/1e6);return Number.isFinite(d.getTime())?d.toISOString():null};
export const validDelta=(v:unknown,type:'call'|'put'):number|null=>typeof v==='number'&&Number.isFinite(v)&&(type==='call'?v>=0&&v<=1:v>=-1&&v<=0)?v:null;
export function normalizeContract(raw:any,symbol:string):Contract|null {
 const d=raw?.details;if(!d||!['call','put'].includes(d.contract_type)||typeof d.ticker!=='string'||!d.ticker.startsWith('O:'+symbol)||!validExpiry(d.expiration_date)||typeof d.strike_price!=='number'||!Number.isFinite(d.strike_price)||!(d.strike_price>0))return null;
 return {id:d.ticker,symbol,expiry:d.expiration_date,type:d.contract_type,strike:d.strike_price,
 volume:nonnegative(raw.day?.volume),oi:nonnegative(raw.open_interest),priorOi:null,averageVolume:null,
 bid:nonnegative(raw.last_quote?.bid),ask:nonnegative(raw.last_quote?.ask),last:nonnegative(raw.last_trade?.price),iv:nonnegative(raw.implied_volatility),delta:validDelta(raw.greeks?.delta,d.contract_type),
 multiplier:nonnegative(d.shares_per_contract),spot:nonnegative(raw.underlying_asset?.price),asOf:isoFromNanoseconds(raw.day?.last_updated)};
}
export function activity(c:Contract){
 const volOi=ratio(c.volume,c.oi),relativeVolume=ratio(c.volume,c.averageVolume);
 return {volOi,relativeVolume,oiChange:c.oi!==null&&c.priorOi!==null?c.oi-c.priorOi:null,
 elevated:(relativeVolume!==null&&relativeVolume>=3)||(volOi!==null&&volOi>=2)};
}
export function aggregate(rows:Contract[]){
 const sum=(type:'call'|'put',key:'oi'|'volume')=>{const present=rows.filter(c=>c.type===type&&c[key]!==null);return present.length?present.reduce((n,c)=>n+(c[key]||0),0):null};
 const callOi=sum('call','oi'),putOi=sum('put','oi');
 return {callOi,putOi,callVolume:sum('call','volume'),putVolume:sum('put','volume'),putCallOi:ratio(putOi,callOi)};
}
// Gross magnitude, not net dealer exposure: OI has both a long and a short.
export function oiTotals(rows:Contract[]){
 const side=(type:'call'|'put')=>{
 const selected=rows.filter(c=>c.type===type),known=selected.filter(c=>typeof c.oi==='number'&&Number.isFinite(c.oi)&&c.oi>=0);
 const eligible=known.filter(c=>validDelta(c.delta,type)!==null||c.oi===0);
 const oi=known.length?known.reduce((sum,c)=>sum+c.oi!,0):null;
 const covered=eligible.reduce((sum,c)=>sum+c.oi!,0);
 const weighted=eligible.length&&(oi===0||covered>0)?eligible.reduce((sum,c)=>sum+c.oi!*Math.abs(validDelta(c.delta,type)??0),0):null;
 const complete=known.length>0&&known.length===selected.length&&eligible.length===known.length;
 return {oi,weighted,complete,coverage:oi===null?null:oi===0?1:covered/oi};
 };
 const calls=side('call'),puts=side('put');
 const total=(a:number|null,b:number|null)=>a===null&&b===null?null:(a??0)+(b??0);
 return {calls,puts,total:total(calls.oi,puts.oi),weightedTotal:total(calls.weighted,puts.weighted),
 weightedComplete:rows.length>0&&rows.every(c=>typeof c.oi==='number'&&Number.isFinite(c.oi)&&c.oi>=0&&(c.oi===0||validDelta(c.delta,c.type)!==null)),
 weightedRatio:calls.complete&&puts.complete?ratio(puts.weighted,calls.weighted):null};
}
export function evidence(c:Contract){
 const a=activity(c);const facts:string[]=[];
 if(a.relativeVolume!==null)facts.push(`Volume is ${a.relativeVolume.toFixed(1)}× its prior-session average.`);
 if(a.volOi!==null)facts.push(`Session volume / prior end-of-day open interest is ${a.volOi.toFixed(1)}×. This does not identify new opening positions.`);
 if(a.oiChange!==null)facts.push(`Open interest changed by ${a.oiChange.toLocaleString('en-US')} contracts between snapshots; this is a net change, not a trade classification.`);
 if(!facts.length)facts.push('There is not enough comparable data to assess unusual activity.');
 return facts;
}
export function payoff(c:Pick<Contract,'type'|'strike'|'multiplier'>,premium:number,spot:number,quantity:number){
 if(c.multiplier!==100||!Number.isFinite(premium)||premium<0||!Number.isFinite(spot)||spot<0||!Number.isInteger(quantity)||quantity<1)return null;
 const intrinsic=Math.max(0,c.type==='call'?spot-c.strike:c.strike-spot);
 return (intrinsic-premium)*100*quantity;
}
// Deliberately synthetic examples: never used as a fallback for a failed feed.
export function exampleSnapshot(symbol:string):OptionSnapshot {
 const spot=({SPY:600,QQQ:500,AAPL:220,NVDA:140,TSLA:350,AMD:150,META:600} as Record<string,number>)[symbol]||600;
 const contracts:Contract[]=[];
 ['2026-11-20','2026-12-18','2027-01-15'].forEach((expiry,e)=>{
  [-2,-1,0,1,2].forEach((offset,i)=>{(['call','put'] as const).forEach((type,t)=>{
   const strike=spot+offset*5,seed=1+e*10+i*2+t;
   const oi=600+seed*130,volume=seed%7===0?oi*3:140+seed*80;
   const premium=Math.max(1,8-Math.abs(offset)*1.1+e*2);
   contracts.push({id:`O:${symbol}${expiry.slice(2).replace(/-/g,'')}${type==='call'?'C':'P'}${String(strike*1000).padStart(8,'0')}`,symbol,expiry,type,strike,oi,volume,priorOi:oi-(seed%3)*120,averageVolume:400+seed*35,bid:premium-.15,ask:premium+.15,last:premium,iv:.28+seed/250,multiplier:100,spot,asOf:'2026-10-16T20:00:00Z'});
  })})});
 return {status:'ready',source:'Illustrative dataset — not market observations',mode:'example',retrievedAt:'2026-10-16T20:00:00Z',asOf:'2026-10-16T20:00:00Z',partial:false,symbol,contracts};
}
