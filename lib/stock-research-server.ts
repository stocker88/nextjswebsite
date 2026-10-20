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
 return {snapshot,macro,events,today};
}
export function loadStockEarnings(symbol:string):Calendar|null{
 const calendar:Calendar|null=read('data/earnings-calendar.json');if(!calendar)return null;
 const symbols=[symbol,...symbol==='GOOG'?['GOOGL']:symbol==='GOOGL'?['GOOG']:[]];
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 return {...calendar,today,detailSymbols:[symbol],items:calendar.items.filter(e=>symbols.includes(e.symbol))};
}
