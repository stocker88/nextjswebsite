export type Period='day'|'week'|'month'|'quarter'|'halfyear'|'ytd'|'year'|'threeYears'|'fiveYears';
export const PERIOD_OPTIONS:{value:Period;label:string}[]=[{value:'day',label:'1 day'},{value:'week',label:'1 week'},{value:'month',label:'1 month'},{value:'quarter',label:'3 months'},{value:'halfyear',label:'6 months'},{value:'ytd',label:'YTD'},{value:'year',label:'1 year'},{value:'threeYears',label:'3 years'},{value:'fiveYears',label:'5 years'}];
export const periodLabel=(period:Period)=>PERIOD_OPTIONS.find(p=>p.value===period)!.label;
export const periodScale:Record<Period,number>={day:4,week:8,month:15,quarter:25,halfyear:40,ytd:40,year:60,threeYears:100,fiveYears:150};
export type HeatStock={symbol:string;weight?:number;name:string;sector:string;industry:string;marketCap:number;price:number;asOf:string;sourceUpdatedAt:string|null;periodDetails?:Partial<Record<Period,{basis:'weekly'|'monthly';basePeriod:string;targetDate:string}>>;changes:Record<Period,number|null>};
export type PulseQuote={price:number;previousClose:number;quotedAt:string;sourceSymbol?:string};
export type HeatSnapshot={overviewRows?:HeatStock[];preMarket?:import('./extended-hours').ExtendedSession;afterHours?:import('./extended-hours').ExtendedSession;pulse?:Record<string,PulseQuote>;version:number;universeAsOf?:string;weightSource?:string;weightCovered?:number;asOf:string;assembledAt:string;metadataUpdatedAt:string|null;source:string;priceBasis:string;refreshSchedule:string;rows:HeatStock[];coverage:{total:number;current:number;outdated:number};stale?:boolean};
export const heatmapEndpoint='https://us-central1-stocker-fcda2.cloudfunctions.net/marketHeatmap';
export const percent=(v:number|null)=>v===null?'Unavailable':`${v>0?'+':''}${v.toFixed(2)}%`;
export const dateLabel=(date:string)=>!date?'Unavailable':new Date(date+'T12:00:00Z').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'});
export function heatColor(value:number|null,maximum=4,colorblind=false){
 if(value===null)return '#303d50';
 const t=Math.min(Math.abs(value)/maximum,1),base=[40,52,64],end=colorblind?(value>=0?[35,117,191]:[193,104,25]):(value>=0?[17,137,98]:[193,48,69]);
 return `rgb(${base.map((v,i)=>Math.round(v+(end[i]-v)*t)).join(',')})`;
}
export type Tile<T>={item:T;x:number;y:number;width:number;height:number};
// A balanced, area-proportional treemap. Recursively split the longest axis.
export function tile<T>(items:T[],weight:(item:T)=>number,width:number,height:number):Tile<T>[]{
 const sorted=[...items].filter(i=>weight(i)>0).sort((a,b)=>weight(b)-weight(a));
 function split(rows:T[],x:number,y:number,w:number,h:number):Tile<T>[]{
  if(!rows.length)return [];if(rows.length===1)return [{item:rows[0],x,y,width:w,height:h}];
  const total=rows.reduce((s,r)=>s+weight(r),0);let sum=weight(rows[0]),index=1;
  while(index<rows.length-1&&Math.abs(sum+weight(rows[index])-total/2)<Math.abs(sum-total/2)){sum+=weight(rows[index++]);}
  const fraction=sum/total;
  return w>=h?[...split(rows.slice(0,index),x,y,w*fraction,h),...split(rows.slice(index),x+w*fraction,y,w*(1-fraction),h)]:[...split(rows.slice(0,index),x,y,w,h*fraction),...split(rows.slice(index),x,y+h*fraction,w,h*(1-fraction))];
 }
 return split(sorted,0,0,width,height);
}
export function validSnapshot(d:any):d is HeatSnapshot{return d?.version===1&&/^\d{4}-\d{2}-\d{2}$/.test(d.asOf)&&Array.isArray(d.rows)&&d.rows.length>0&&d.rows.every((r:any)=>typeof r.symbol==='string'&&Number.isFinite(r.marketCap)&&(r.marketCap>0||r.weight>0)&&r.changes&&PERIOD_OPTIONS.every(({value:p})=>r.changes[p]===null||Number.isFinite(r.changes[p])));}

export type TileSizing='weight'|'marketCap'|'equal';
export type HeatGrouping='sector'|'industry';
export const sizeLabels:Record<TileSizing,string>={weight:'Index weight',marketCap:'Market cap',equal:'Equal size'};
export function stockWeight(row:HeatStock,sizing:TileSizing,universe:HeatStock[]){
 if(sizing==='equal')return 1;
 if(sizing==='weight')return row.weight&&row.weight>0?row.weight:1;
 const shared=['GOOG','GOOGL'].includes(row.symbol)&&universe.some(r=>r.symbol==='GOOG')&&universe.some(r=>r.symbol==='GOOGL');
 return Math.max(1,row.marketCap/(shared?2:1));
}
export function stockGroups(rows:HeatStock[],grouping:HeatGrouping){
 return Array.from(new Set(rows.map(r=>r[grouping]||'Unclassified'))).sort().map(name=>({name,rows:rows.filter(r=>(r[grouping]||'Unclassified')===name)}));
}

export const returnColor=(value:number|null,colorblind=false)=>value===null?'#a5b2c6':value>=0?(colorblind?'#83bfff':'#74e4b6'):(colorblind?'#ffc184':'#ffa3ab');
export function sectorRankings(rows:HeatStock[],period:Period){
 return stockGroups(rows,'sector').map(group=>{
  const values=group.rows.map(r=>r.changes[period]).filter((v):v is number=>v!==null&&Number.isFinite(v));
  return {name:group.name,total:group.rows.length,available:values.length,average:values.length?values.reduce((sum,v)=>sum+v,0)/values.length:null};
 }).sort((a,b)=>(b.average??-Infinity)-(a.average??-Infinity)||a.name.localeCompare(b.name));
}
export function biggestMovers(rows:HeatStock[],period:Period){
 const valid=rows.filter(r=>r.changes[period]!==null);
 return {gainers:valid.filter(r=>r.changes[period]!>0).sort((a,b)=>b.changes[period]!-a.changes[period]!).slice(0,5),losers:valid.filter(r=>r.changes[period]!<0).sort((a,b)=>a.changes[period]!-b.changes[period]!).slice(0,5)};
}
// Fixed slots keep group coordinates unchanged when returns or tile sizing change.
// Groups occupy equal space; sizing remains proportional within each group.
export function fixedGroupTiles<T extends {name:string}>(groups:T[],names:string[],width:number,height:number):Tile<T>[]{
 const columns=Math.max(1,Math.min(names.length,Math.ceil(Math.sqrt(names.length*width/Math.max(1,height))))),rows=Math.max(1,Math.ceil(names.length/columns));
 return groups.flatMap(item=>{const index=names.indexOf(item.name);return index<0?[]:[{item,x:index%columns*width/columns,y:Math.floor(index/columns)*height/rows,width:width/columns,height:height/rows}]});
}
export function readWatchlist(value:string|null):string[]{
 try{const parsed=JSON.parse(value||'[]');return Array.isArray(parsed)?Array.from(new Set(parsed.filter((v):v is string=>typeof v==='string'&&/^[A-Z0-9.-]{1,12}$/.test(v)))).slice(0,100):[]}catch{return []}
}
