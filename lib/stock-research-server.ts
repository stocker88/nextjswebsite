import {makePeerCompany} from './peer-analysis';
import fs from 'fs';
import path from 'path';
import type {ResearchBundle,Snapshot,Macro} from './stock-research';
import type {Detail,Calendar} from './earnings';
const files=new Map<string,{mtime:number;data:any}>();
function read(file:string):any{try{const full=path.join(process.cwd(),file),mtime=fs.statSync(full).mtimeMs;const old=files.get(file);if(old?.mtime===mtime)return old.data;const data=JSON.parse(fs.readFileSync(full,'utf8'));files.set(file,{mtime,data});return data}catch{return null}}
export function loadStockResearch(symbol:string):ResearchBundle{
 const saved=read('data/stock-research-snapshots.json')||{};
 const detail:Detail|null=read('public/earnings-data/'+symbol+'.json');
 const snapshot:Snapshot|null=saved[symbol]||(detail?{symbol,detail,updatedAt:detail.updatedAt,financials:[],technicals:{},shortInterest:null,peers:detail.peers.map(p=>({...p,detail:read('public/earnings-data/'+p.symbol+'.json'),financials:[]}))}:null);
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const end=new Date(Date.parse(today+'T12:00Z')+14*86400000).toISOString().slice(0,10);
 const calendar=read('data/market-calendar.json');
 const events=(calendar?.events||[]).filter((e:any)=>e.date>=today&&e.date<=end).sort((a:any,b:any)=>a.date.localeCompare(b.date)||(a.minutesET??1440)-(b.minutesET??1440)).slice(0,8);
 const source=read('data/macro-series.json');
 const macro:Macro[]=Object.values(source?.series||{}).map((s:any)=>({id:s.id,title:s.title,units:s.units,sourceUrl:s.sourceUrl,points:s.points.filter((p:any)=>p[0]<=today&&Number.isFinite(p[1])).slice(-60)}));
 // The analysis tool only combines already-public static snapshots. No per-visitor API calls.
 const catalog=read('data/app-stock-catalog.json')||[];
 const current=catalog.find((p:any)=>p.symbol===symbol);
 const industry=current?.industry||snapshot?.detail?.industry;
 const listingSuffix=(ticker:string)=>ticker.includes('.')?ticker.slice(ticker.indexOf('.')):'';
 const related=industry?catalog.filter((p:any)=>p.type==='EQUITY'&&p.industry===industry&&p.symbol!==symbol&&listingSuffix(p.symbol)===listingSuffix(symbol)).sort((a:any,b:any)=>(b.marketCap||0)-(a.marketCap||0)).slice(0,11):[];
 const cohort=[{symbol,name:snapshot?.detail?.name||current?.name||symbol,industry,marketCap:current?.marketCap},...(related.length?related:(snapshot?.peers||[]))];
 const peerAnalysis=cohort.map((p:any)=>{
  const cached=p.symbol===symbol?snapshot:saved[p.symbol]||snapshot?.peers.find(peer=>peer.symbol===p.symbol);
  const cachedDetail=cached?.detail;
  const publicDetail=read('public/earnings-data/'+p.symbol+'.json');
  // Keep the newest quote, while retaining dated history from a fuller public snapshot.
  const latest=cachedDetail&&(!publicDetail||cachedDetail.updatedAt>=publicDetail.updatedAt)?cachedDetail:publicDetail;
  const historyDetail=latest?{...latest,prices:latest.prices?.length?latest.prices:(cachedDetail?.prices||publicDetail?.prices||[]),history:latest.history?.length?latest.history:(cachedDetail?.history||publicDetail?.history||[])}:null;
  return makePeerCompany(p.symbol,p.name,industry||'Related companies',p.marketCap??null,historyDetail,cached?.financials||[],today);
 });
 return {snapshot,peerAnalysis,macro,events,today};
}
export function loadStockEarnings(symbol:string):Calendar|null{
 const calendar:Calendar|null=read('data/earnings-calendar.json');if(!calendar)return null;
 const symbols=[symbol,...symbol==='GOOG'?['GOOGL']:symbol==='GOOGL'?['GOOG']:[]];
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 return {...calendar,today,detailSymbols:[symbol],items:calendar.items.filter(e=>symbols.includes(e.symbol))};
}
