import fs from 'fs';
import {toolAssets} from './seo-tools-server';
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
 // History-only coverage retains missing financial fields rather than inventing estimates.
 for(const asset of toolAssets().filter(a=>a.kind==='stock'&&a.currency==='USD')){
  const last=asset.points.at(-1)!;const old=result.get(asset.symbol);
  if(old)continue; // Preserve the longer company history and its consistent price basis.
  result.set(asset.symbol,{symbol:asset.symbol,name:asset.name,currency:asset.currency,price:last[1],priceDate:last[0],marketCap:null,sector:'',industry:asset.industry,history:[],prices:asset.points.map(([date,close])=>({date,close,volume:null})),pe:null,ps:null,forwardPe:null,forwardPs:null,estimatePeriod:null,beat:{beats:0,total:0,rate:null},oneYear:null,updatedAt:last[0],technical:{sma50:null,sma200:null,rsi14:null,support:null,resistance:null,low52:null,high52:null,relativeVolume:null,oneYear:null},peers:[],unavailable:['Financial results are not available for this company yet.']});
 }
 saved=result;return result;
}
export function cachedPredictionDetail(symbol:string){return cachedDetails().get(symbol)||null;}
export function predictionCatalog():Stock[]{
 const existing=new Set(predictionStocks.map(s=>s.ticker));
 return [...predictionStocks,...Array.from(cachedDetails().values()).filter(d=>!existing.has(d.symbol)).map(d=>({ticker:d.symbol,slug:'cached-'+d.symbol.toLowerCase(),name:d.name,investorUrl:'',earningsUrl:'',overview:`Explore ${d.name} (${d.symbol}) price history, earnings and conditional scenarios${d.industry?' in '+d.industry:''}.`,drivers:['Revenue growth and demand','Operating margins and cash generation','Investment spending and financing needs','Competition and industry conditions','Valuation and share dilution']}))];
}
export function cachedPredictionStocks(){return predictionCatalog().filter(s=>cachedDetails().has(s.ticker));}
export function predictionToday(){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
export function predictionEvents(today:string):Catalyst[]{return (read('data/market-calendar.json')?.events||[]).filter((e:Catalyst)=>e.date>=today).sort((a:Catalyst,b:Catalyst)=>a.date.localeCompare(b.date));}
