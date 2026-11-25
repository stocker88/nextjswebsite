import fs from 'fs';
import path from 'path';
import {toolAssets} from './seo-tools-server';
import {recentStockNews} from './stock-related-research';
import {researchUrl} from './research';
import type {ComparisonData} from './comparison-data';
const read=(file:string)=>{try{return JSON.parse(fs.readFileSync(path.join(process.cwd(),file),'utf8'));}catch{return {};}};
let sources:any=null;
export function comparisonChoices(){return toolAssets().filter(a=>a.kind==='stock'&&a.currency==='USD').map(({symbol,name,slug})=>({symbol,name,slug}));}
export function comparisonData(symbol:string):ComparisonData|null{
 const asset=toolAssets().find(a=>a.symbol===symbol&&a.kind==='stock'&&a.currency==='USD');if(!asset)return null;
 if(!sources){const snapshots=read('data/stock-research-snapshots.json');const peers:any={};for(const s of Object.values(snapshots) as any[])for(const p of s.peers||[])peers[p.symbol]=p;sources={snapshots,peers,valuations:read('data/stock-valuations.json').stocks||{},news:read('data/research.json')};}
 const saved=sources.snapshots[symbol]||sources.peers[symbol]||{},file=read('public/earnings-data/'+symbol+'.json');
 const detail=file.updatedAt>(saved.detail?.updatedAt||'')?file:saved.detail||file;
 const metrics:ComparisonData['metrics']=[];
 const add=(label:string,n:any,date:string|null,currency?:string,multiple=false)=>{if(typeof n!=='number'||!Number.isFinite(n))return;metrics.push({label,value:(currency?currency+' ':'')+new Intl.NumberFormat('en-US',{notation:multiple?'standard':'compact',maximumFractionDigits:2}).format(n)+(multiple?'×':''),date:date||null});};
 const v=sources.valuations[symbol]||{};
 const val=v.valuationAsOf>(detail.updatedAt||'')?v:detail;
 add('Market capitalization',v.marketCap??detail.marketCap,v.marketCapAsOf||detail.updatedAt,detail.currency||'USD');
 add('Price / earnings',val.pe,val.valuationAsOf||val.updatedAt,undefined,true);add('Price / sales',val.ps,val.valuationAsOf||val.updatedAt,undefined,true);
 const report=(detail.history||[]).filter((h:any)=>typeof h.revenueActual==='number').sort((a:any,b:any)=>b.date.localeCompare(a.date))[0];
 if(report)add('Reported revenue',report.revenueActual,report.date,detail.currency||'USD');
 const f=[...(saved.financials||[])].sort((a:any,b:any)=>b.date.localeCompare(a.date))[0];
 if(f){if(!report)add('Reported revenue',f.revenue,f.date,f.currency||'Currency unreported');add('Net income',f.netIncome,f.date,f.currency||'Currency unreported');add('Cash',f.cash,f.date,f.currency||'Currency unreported');add('Debt',f.debt,f.date,f.currency||'Currency unreported');}
 const news=recentStockNews(Array.isArray(sources.news)?sources.news:[],symbol).slice(0,5).map(n=>({title:n.title,href:n.href||researchUrl(n.id,n.title),date:n.time?new Date(n.time<1e12?n.time*1000:n.time).toISOString().slice(0,10):null}));
 return {asset,metrics,news};
}
