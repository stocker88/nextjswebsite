import {makePeerCompany,industrySlug,quantile} from './peer-analysis';
import type {IndustrySummary} from './peer-analysis';
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
 const related=industry?catalog.filter((p:any)=>p.type==='EQUITY'&&p.industry===industry&&p.symbol!==symbol&&listingSuffix(p.symbol)===listingSuffix(symbol)).sort((a:any,b:any)=>(b.marketCap||0)-(a.marketCap||0)):[];
 const cohort=[{symbol,name:snapshot?.detail?.name||current?.name||symbol,industry,marketCap:current?.marketCap},...(related.length?related:(snapshot?.peers||[]))];
 const peerAnalysis=loadPeerCompanies(cohort,today,snapshot);
 return {snapshot,peerAnalysis,industries:loadIndustryDirectory(),macro,events,today};
}
export function loadStockEarnings(symbol:string):Calendar|null{
 const calendar:Calendar|null=read('data/earnings-calendar.json');if(!calendar)return null;
 const symbols=[symbol,...symbol==='GOOG'?['GOOGL']:symbol==='GOOGL'?['GOOG']:[]];
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 return {...calendar,today,detailSymbols:[symbol],items:calendar.items.filter(e=>symbols.includes(e.symbol))};
}

// All industry pages share the app's existing public U.S.-listing catalog and saved research.
function industryCatalog(){return (read('data/app-stock-catalog.json')||[]).filter((p:any)=>p.type==='EQUITY'&&p.industry?.trim()&&!p.symbol.includes('.'));}
function todayET(){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
function loadPeerCompanies(cohort:any[],today:string,snapshot:Snapshot|null=null){
 const saved=read('data/stock-research-snapshots.json')||{};
 const nested=Object.values(saved).flatMap((s:any)=>s.peers||[]);
 const valuations=read('data/stock-valuations.json')?.stocks||{};
 return cohort.map((p:any)=>{
  const cached=saved[p.symbol]||snapshot?.peers.find(peer=>peer.symbol===p.symbol)||nested.find((peer:any)=>peer.symbol===p.symbol);
  const cachedDetail=cached?.detail,publicDetail=read('public/earnings-data/'+p.symbol+'.json');
  const latest=cachedDetail&&(!publicDetail||cachedDetail.updatedAt>=publicDetail.updatedAt)?cachedDetail:publicDetail;
  const historyDetail=latest?{...latest,prices:latest.prices?.length?latest.prices:(cachedDetail?.prices?.length?cachedDetail.prices:publicDetail?.prices||[]),history:latest.history?.length?latest.history:(cachedDetail?.history?.length?cachedDetail.history:publicDetail?.history||[])}:null;
  const company=makePeerCompany(p.symbol,p.name,p.industry||snapshot?.detail?.industry||'Related companies',p.marketCap??null,historyDetail,cached?.financials||[],today);
  const valuation=valuations[p.symbol];
  // Keep the market-cap and ratio provenance; do not relabel old prices as new.
  const newer=valuation&&Date.parse(valuation.valuationAsOf)>=Date.parse(latest?.sourceUpdatedAt?.ratios||latest?.updatedAt||'1970-01-01');
  const metrics=newer?{marketCap:valuation.marketCap,pe:valuation.pe,ps:valuation.ps,valuationDate:valuation.valuationAsOf.slice(0,10)}:{};
  return {...company,...metrics,logo:fs.existsSync(path.join(process.cwd(),'public/assets/logo',p.symbol+'.webp'))?'/assets/logo/'+encodeURIComponent(p.symbol)+'.webp':null};
 });
}
let industryCache:{key:string;rows:IndustrySummary[]}|null=null;
export function loadIndustryDirectory():IndustrySummary[]{
 const stamp=(file:string)=>{try{return fs.statSync(path.join(process.cwd(),file)).mtimeMs}catch{return 0}};
 const key=[stamp('data/app-stock-catalog.json'),stamp('data/stock-research-snapshots.json'),stamp('data/stock-valuations.json'),stamp('public/earnings-data'),Math.floor(Date.now()/300000)].join(':');
 if(industryCache?.key===key)return industryCache.rows;
 const companies=loadPeerCompanies(industryCatalog(),todayET());
 const groups=new Map<string,typeof companies>();
 for(const c of companies){const group=groups.get(c.industry)||[];group.push(c);groups.set(c.industry,group);}
 const rows=Array.from(groups,([name,group])=>{const pe=group.map(c=>c.pe).filter((v):v is number=>v!=null&&v>0);return {name,slug:industrySlug(name),count:group.length,medianPE:quantile(pe,.5),peCount:pe.length}}).sort((a,b)=>a.name.localeCompare(b.name));
 industryCache={key,rows};return rows;
}
export function loadIndustryResearch(slug:string){
 const industries=loadIndustryDirectory(),industry=industries.find(i=>i.slug===slug);
 if(!industry)return null;
 const cohort=industryCatalog().filter((p:any)=>p.industry===industry.name).sort((a:any,b:any)=>(b.marketCap||0)-(a.marketCap||0));
 return {industry,industries,companies:loadPeerCompanies(cohort,todayET())};
}
