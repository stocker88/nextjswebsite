import {Contract,aggregate,validExpiry} from './options';
import {Leg,validateLegs} from './options-strategies';
export const MOVES=[-10,-5,0,5,10];
export type Setup={version:1;name:string;symbol:string;expiry:string;asOf:string;reference:number;fee:number;legs:Leg[]};
export function readSetup(value:unknown,allowMissing=false):Setup|null{
 try{
 const s=typeof value==='string'?JSON.parse(value):value;
 if(!s||s.version!==1||!Array.isArray(s.legs)||s.legs.length<1||s.legs.length>8)return null;
 if(typeof s.symbol!=='string'||(s.symbol!==''&&!/^[A-Z][A-Z0-9.-]{0,9}$/.test(s.symbol)))return null;
 if(typeof s.expiry!=='string'||(s.expiry!==''&&!validExpiry(s.expiry)))return null;
 if(typeof s.name!=='string'||s.name.length>80||typeof s.asOf!=='string'||s.asOf.length>50)return null;
 const legs=s.legs.map((l:any)=>({...l,premium:allowMissing&&l.premium===null?NaN:l.premium}));
 if(legs.some((l:Leg)=>validateLegs([{...l,premium:allowMissing&&Number.isNaN(l.premium)?0:l.premium}])!==null))return null;
 const reference=allowMissing&&s.reference===null?NaN:s.reference;
 if(!(allowMissing&&Number.isNaN(reference))&&(typeof reference!=='number'||!Number.isFinite(reference)||reference<=0||reference>1e6))return null;
 if(typeof s.fee!=='number'||!Number.isFinite(s.fee)||s.fee<0||s.fee>1e6)return null;
 return {version:1,name:s.name,symbol:s.symbol,expiry:s.expiry,asOf:s.asOf,reference,fee:s.fee,legs};
 }catch{return null}
}
export const setupHref=(setup:Setup,compare=false)=>'/options-profit-calculator/?setup='+encodeURIComponent(JSON.stringify(setup))+(compare?'&compare=1':'');
export function contractSetup(c:Contract,contracts:Contract[],reference:number|null,spread=false):Setup{
 const leg:Leg={type:c.type,side:'buy',strike:c.strike,premium:NaN,quantity:1};
 const candidates=contracts.filter(r=>r.id!==c.id&&r.type===c.type&&r.expiry===c.expiry&&r.multiplier===100&&(c.type==='call'?r.strike>c.strike:r.strike<c.strike)).sort((a,b)=>Math.abs(a.strike-c.strike)-Math.abs(b.strike-c.strike));
 const next=candidates[0]?.strike??Math.max(.01,c.strike*(c.type==='call'?1.05:.95));
 return {version:1,name:spread?(c.type==='call'?'Call debit spread':'Put debit spread'):(c.type==='call'?'Long call':'Long put'),symbol:c.symbol,expiry:c.expiry,asOf:c.asOf||'',reference:reference??NaN,fee:0,legs:spread?[leg,{...leg,side:'sell',strike:next}]:[leg]};
}
export function expirationRows(contracts:Contract[]){
 const dates=Array.from(new Set(contracts.map(c=>c.expiry))).sort();
 return dates.map(expiry=>{const rows=contracts.filter(c=>c.expiry===expiry),ivs=rows.map(c=>c.iv).filter((v):v is number=>v!==null&&Number.isFinite(v)&&v>=0).sort((a,b)=>a-b),mid=Math.floor(ivs.length/2);
 return {expiry,count:rows.length,...aggregate(rows),ivCount:ivs.length,medianIv:ivs.length?(ivs.length%2?ivs[mid]:(ivs[mid-1]+ivs[mid])/2):null};});
}
export function participation(c:Contract){return [
 {label:'Session volume',value:c.volume===null?'Not available':c.volume.toLocaleString('en-US'),note:c.volume===null?'No volume supplied':c.volume===0?'No reported trading':c.volume<100?'Low activity: fewer than 100 contracts':'At least 100 contracts traded'},
 {label:'Open interest',value:c.oi===null?'Not available':c.oi.toLocaleString('en-US'),note:c.oi===null?'No OI supplied':c.oi===0?'No outstanding contracts reported':c.oi<100?'Small position base: fewer than 100 contracts':'At least 100 contracts outstanding'},
 ];}
