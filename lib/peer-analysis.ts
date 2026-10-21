import type {Detail} from './earnings';
import type {Financial} from './stock-research';
export type IndustrySummary = {slug:string;name:string;count:number;medianPE:number|null;peCount:number};
export const industrySlug=(name:string)=>name.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/&/g,' and ').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export const periods = ['1D','1W','3M','1Y','2Y','5Y'] as const;
export type Period = typeof periods[number];
export type ChangeMetric = 'eps'|'revenue'|'netIncome';
export type Metric = 'marketCap'|'pe'|'forwardPe'|'ps'|'oneYear'|'rsi'|'netMargin'|'debtToEquity';
export type Observation = {value:number|null;from:string|null;to:string|null};
export type ComparisonChange = {price:Observation;eps:Observation;revenue:Observation;netIncome:Observation};
export type PeerCompany = {logo?:string|null;symbol:string;name:string;industry:string;marketCap:number|null;pe:number|null;forwardPe:number|null;ps:number|null;oneYear:number|null;rsi:number|null;netMargin:number|null;debtToEquity:number|null;priceDate:string|null;financialDate:string|null;updatedAt:string|null;changes:Record<Period,ComparisonChange>};
export const finite = (value:unknown):value is number => typeof value==='number'&&Number.isFinite(value);
export const quantile=(values:number[],q:number):number|null=>{if(!values.length)return null;const a=[...values].sort((a,b)=>a-b),i=(a.length-1)*q;return a[Math.floor(i)]+(a[Math.ceil(i)]-a[Math.floor(i)])*(i-Math.floor(i))};
const empty=():Observation=>({value:null,from:null,to:null});
type Dated={date:string;value:number|null};
export function observationChange(source:Dated[],period:Period,asOf:string,financial=false):Observation{
 const rows=source.filter(p=>p.date<=asOf&&finite(p.value)).sort((a,b)=>a.date.localeCompare(b.date));
 if(!rows.length)return empty();
 const last=rows[rows.length-1];
 // Do not label a stale price as a current daily/weekly comparison.
 if(!financial&&(Date.parse(asOf)-Date.parse(last.date))/86400000>7)return empty();
 let first:Dated|undefined;
 if(period==='1D'&&!financial)first=rows[rows.length-2];
 else{
  const target=new Date(asOf+'T12:00:00Z');
  if(period==='1D'||period==='1W')target.setUTCDate(target.getUTCDate()-(period==='1D'?1:7));
  else {const day=target.getUTCDate();target.setUTCDate(1);target.setUTCMonth(target.getUTCMonth()-({'3M':3,'1Y':12,'2Y':24,'5Y':60}[period]));const lastDay=new Date(Date.UTC(target.getUTCFullYear(),target.getUTCMonth()+1,0)).getUTCDate();target.setUTCDate(Math.min(day,lastDay));}
  const cutoff=target.toISOString().slice(0,10);
  first=rows.filter(p=>p.date<=cutoff).at(-1);
  if(first&&(Date.parse(cutoff)-Date.parse(first.date))/86400000>(financial?140:10))return empty();
 }
 if(!first||!finite(first.value)||first.value===0||!finite(last.value))return empty();
 const value=(last.value-first.value)/Math.abs(first.value)*100;
 return finite(value)?{value,from:first.date,to:last.date}:empty();
}
export function makePeerCompany(symbol:string,name:string,industry:string,cap:number|null,detail:Detail|null,financials:Financial[],asOf:string):PeerCompany{
 const financial=[...financials].filter(f=>f.date<=asOf).sort((a,b)=>a.date.localeCompare(b.date)).at(-1);
 const prices=(detail?.prices||[]).map(p=>({date:p.date,value:p.close}));
 const eps=(detail?.history||[]).map(p=>({date:p.date,value:p.actual}));
 const revenue=financials.some(f=>finite(f.revenue))?financials.map(f=>({date:f.date,value:f.revenue})):(detail?.history||[]).map(p=>({date:p.date,value:p.revenueActual}));
 const income=financials.map(f=>({date:f.date,value:f.netIncome}));
 const comparisonDate=detail?.priceDate&&detail.priceDate<asOf?detail.priceDate:asOf;
 const changes=Object.fromEntries(periods.map(p=>[p,{price:observationChange(prices,p,comparisonDate),eps:observationChange(eps,p,comparisonDate,true),revenue:observationChange(revenue,p,comparisonDate,true),netIncome:observationChange(income,p,comparisonDate,true)}])) as Record<Period,ComparisonChange>;
 const num=(v:unknown)=>finite(v)?v:null;
 return {symbol,name,industry,marketCap:num(detail?.marketCap??cap),pe:detail?.pe&&detail.pe>0?num(detail.pe):null,forwardPe:detail?.forwardPe&&detail.forwardPe>0?num(detail.forwardPe):null,ps:num(detail?.ps),oneYear:num(detail?.technical?.oneYear),rsi:num(detail?.technical?.rsi14),netMargin:finite(financial?.netMargin)?financial!.netMargin!*100:null,debtToEquity:num(financial?.debtToEquity),priceDate:detail?.priceDate||null,financialDate:financial?.date||null,updatedAt:detail?.updatedAt||null,changes};
}
export function peHistogram(companies:PeerCompany[],all=false){
 const values=companies.map(c=>c.pe).filter((n):n is number=>finite(n)&&n>0).sort((a,b)=>a-b);
 const q1=quantile(values,.25),q3=quantile(values,.75),fence=q3==null?Infinity:Math.max(q3+1.5*(q3-q1!),q3*1.25);
 const included=all||values.length<5?values:values.filter(v=>v<=fence);
 const low=Math.max(0,(included[0]??0)*.9),high=Math.max(low+1,(included.at(-1)??1)*1.05);
 const binFor=(pe:number|null)=>!finite(pe)||pe<=0||pe<low||pe>(included.at(-1)??high)?-1:Math.min(9,Math.max(0,Math.floor((pe-low)/(high-low)*10)));
 const bins=Array.from({length:10},(_,i)=>({low:low+(high-low)*i/10,high:low+(high-low)*(i+1)/10,companies:companies.filter(c=>binFor(c.pe)===i)}));
 return {values,low,high,bins,hidden:values.length-included.length,median:quantile(values,.5),q1,q3};
}
