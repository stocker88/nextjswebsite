export type Beat={beats:number;total:number;rate:number|null};
// Equal weight for EPS and revenue, regardless of their individual sample counts.
export function combinedBeatRate(event:Event):number|null {
 const eps=event.research?.beat,rev=event.research?.revenueBeat;
 const valid=(b:Beat|undefined)=>!!b&&b.total>0&&typeof b.rate==='number'&&Number.isFinite(b.rate)&&b.rate>=0&&b.rate<=100;
 return valid(eps)&&valid(rev)?(eps!.rate!+rev!.rate!)/2:null;
}
export function beatRingColor(rate:number|null):string {
 if(rate===null||!Number.isFinite(rate))return '#778397';
 const stops=[[239,107,115],[242,201,76],[66,211,154]],v=Math.max(0,Math.min(100,rate))/50;
 const a=stops[v<=1?0:1],b=stops[v<=1?1:2],t=v<=1?v:v-1;
 return '#'+a.map((c,i)=>Math.round(c+(b[i]-c)*t).toString(16).padStart(2,'0')).join('');
}
export type Summary={pe:number|null;ps:number|null;forwardPe:number|null;forwardPs:number|null;estimatePeriod:string|null;beat:Beat;revenueBeat?:Beat;oneYear:number|null;updatedAt:string};
export type Event={symbol:string;name:string;date:string;session:string;marketCap:number|null;price:number|null;sector:string;industry:string;exchange:string;epsEstimate:number|null;epsActual:number|null;revenueEstimate:number|null;revenueActual:number|null;research?:Summary};
export type Calendar={updatedAt:string;today:string;from:string;to:string;items:Event[];detailSymbols?:string[]};
export type Point={date:string;close:number;volume:number|null};
export type Report={date:string;actual:number|null;estimate:number|null;surprise:number|null;outcome:string;revenueActual:number|null;revenueEstimate:number|null;windowChange:number|null;fiveSessionChange:number|null};
export type Detail=Summary & {symbol:string;name:string;currency:string|null;price:number|null;marketCap:number|null;priceDate:string|null;sector:string;industry:string;history:Report[];prices:Point[];technical:{sma50:number|null;sma200:number|null;rsi14:number|null;support:number|null;resistance:number|null;low52:number|null;high52:number|null;relativeVolume:number|null;oneYear:number|null};peers:{symbol:string;name:string}[];unavailable:string[];stale?:boolean};
export const endpoint='https://us-central1-stocker-fcda2.cloudfunctions.net/earningsCalendar';
export const money=(v:number|null|undefined)=>v==null?'—':new Intl.NumberFormat('en-US',{notation:'compact',maximumFractionDigits:2}).format(v);
export const decimal=(v:number|null|undefined)=>v==null?'—':v.toLocaleString('en-US',{maximumFractionDigits:2,minimumFractionDigits:2});
export const multiple=(v:number|null|undefined)=>v==null?'—':v.toFixed(1)+'×';
export const percent=(v:number|null|undefined)=>v==null?'—':(v>0?'+':'')+v.toFixed(1)+'%';
export const day=(d:string,n:number)=>new Date(new Date(d+'T12:00:00Z').getTime()+n*86400000).toISOString().slice(0,10);
export const shortDate=(d:string)=>new Date(d+'T12:00:00Z').toLocaleDateString('en-US',{month:'short',day:'numeric',timeZone:'UTC'});
export const weekStart=(d:string)=>day(d,-((new Date(d+'T12:00:00Z').getUTCDay()+6)%7));
export const sessionName=(s:string)=>s==='bmo'?'Before open':s==='amc'?'After close':'Time unconfirmed';
const cache=new Map<string,Detail>();
export async function getDetail(symbol:string):Promise<Detail>{
 if(cache.has(symbol))return cache.get(symbol)!;
 let fallback:Detail|null=null;
 // Same-origin snapshots make popular research quick even inside social browsers.
 for(const url of ['/earnings-data/'+encodeURIComponent(symbol)+'.json',endpoint+'?symbol='+encodeURIComponent(symbol)]){
  try{const r=await fetch(url,{signal:AbortSignal.timeout(25000)});if(!r.ok)continue;const d=await r.json();if(d.symbol===symbol&&Array.isArray(d.history)&&Array.isArray(d.prices)){if(url.startsWith('/')&&Date.now()-Date.parse(d.updatedAt)>7*86400000){fallback=d;continue;}cache.set(symbol,d);return d;}}catch{}
 }
 if(fallback)return {...fallback,stale:true};
 throw new Error('Could not load this company’s research. Please try again.');
}
export function filterEvents(items:Event[],filters:{from:string;to:string;query:string;session:string;cap:string;sector:string;sort:string}){
 const q=filters.query.trim().replace(/^\$/,'').toLowerCase();
 return items.filter(i=>i.date>=filters.from&&i.date<=filters.to&&(!q||i.symbol.toLowerCase().includes(q)||i.name.toLowerCase().includes(q))&&(filters.session==='all'||i.session===filters.session)&&(!filters.sector||i.sector===filters.sector)&&(filters.cap==='all'||filters.cap==='mega'&&(i.marketCap??-1)>=200e9||filters.cap==='large'&&(i.marketCap??-1)>=10e9||filters.cap==='mid'&&(i.marketCap??-1)>=2e9&&(i.marketCap??Infinity)<10e9||filters.cap==='small'&&(i.marketCap??Infinity)<2e9)).sort((a,b)=>{
  if(filters.sort==='cap'||filters.sort==='cap-asc'){if(a.marketCap==null&&b.marketCap==null)return a.date.localeCompare(b.date);if(a.marketCap==null)return 1;if(b.marketCap==null)return -1;return (filters.sort==='cap'?b.marketCap-a.marketCap:a.marketCap-b.marketCap)||a.date.localeCompare(b.date);}
  if(filters.sort==='beat')return(b.research?.beat.rate??-1)-(a.research?.beat.rate??-1)||a.date.localeCompare(b.date);
  if(filters.sort==='pe'){const av=a.research?.pe??Infinity,bv=b.research?.pe??Infinity;return av===bv?a.date.localeCompare(b.date):av-bv;}
  return a.date.localeCompare(b.date)||(b.marketCap??-1)-(a.marketCap??-1);
 });
}
