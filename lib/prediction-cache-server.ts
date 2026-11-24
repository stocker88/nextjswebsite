import fs from 'fs';
import path from 'path';
import {predictionStocks} from './stock-predictions';
import type {Detail} from './earnings';
import type {Catalyst} from './stock-research';
type Stock=typeof predictionStocks[number];
let saved:Map<string,Detail>|null=null;
function read(file:string){try{return JSON.parse(fs.readFileSync(path.join(process.cwd(),file),'utf8'));}catch{return null;}}
function cachedDetails(){
 if(saved)return saved;
 const result=new Map<string,Detail>();
 const accept=(d:Detail|null)=>{if(!d?.symbol||!d.name||!Number.isFinite(d.price)||!(d.price!>0)||!d.priceDate||!Number.isFinite(Date.parse(d.priceDate))||!Array.isArray(d.prices)||!d.prices.some(p=>Number.isFinite(p.close)&&p.close>0))return;const old=result.get(d.symbol);if(!old||d.updatedAt>old.updatedAt)result.set(d.symbol,d);};
 const snapshots=read('data/stock-research-snapshots.json')||{};
 Object.values(snapshots).forEach((s:any)=>accept(s.detail));
 let files:string[]=[];try{files=fs.readdirSync(path.join(process.cwd(),'public/earnings-data'));}catch{}
 files.filter(f=>f.endsWith('.json')).forEach(f=>accept(read('public/earnings-data/'+f)));
 saved=result;return result;
}
export function cachedPredictionDetail(symbol:string){return cachedDetails().get(symbol)||null;}
export function predictionCatalog():Stock[]{
 const existing=new Set(predictionStocks.map(s=>s.ticker));
 return [...predictionStocks,...Array.from(cachedDetails().values()).filter(d=>!existing.has(d.symbol)).map(d=>({ticker:d.symbol,slug:'cached-'+d.symbol.toLowerCase(),name:d.name,investorUrl:'',earningsUrl:'',overview:`Explore ${d.name} (${d.symbol}) price history, earnings and conditional scenarios${d.industry?' in '+d.industry:''}.`,drivers:['Revenue growth and demand','Operating margins and cash generation','Investment spending and financing needs','Competition and industry conditions','Valuation and share dilution']}))];
}
export function cachedPredictionStocks(){return predictionCatalog().filter(s=>cachedDetails().has(s.ticker));}
export function predictionToday(){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
export function predictionEvents(today:string):Catalyst[]{const end=new Date(Date.parse(today)+14*86400000).toISOString().slice(0,10);return (read('data/market-calendar.json')?.events||[]).filter((e:Catalyst)=>e.date>=today&&e.date<=end).sort((a:Catalyst,b:Catalyst)=>a.date.localeCompare(b.date)).slice(0,8);}
