import {OptionSnapshot,OptionTrade,validExpiry} from './options';
// Only this server talks to the private snapshot service. No browser request calls Massive.
export function optionsConfigured(env=process.env){return !!env.OPTIONS_BACKEND_URL&&!!env.OPTIONS_BACKEND_TOKEN&&(env.OPTIONS_DISPLAY_LICENSE_CONFIRMED==='true'||(env.NODE_ENV!=='production'&&env.OPTIONS_PRIVATE_PREVIEW==='true'));}
async function backend(symbol:string,method='GET'){
 const url=new URL(process.env.OPTIONS_BACKEND_URL!);if(url.protocol!=='https:')throw new Error('Invalid backend URL');if(method==='GET')url.searchParams.set('symbol',symbol);
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);
 try{const r=await fetch(url.toString(),{method,redirect:'error',headers:{Authorization:`Bearer ${process.env.OPTIONS_BACKEND_TOKEN}`,'Content-Type':'application/json'},...(method==='POST'?{body:JSON.stringify({symbol})}:{}),signal:controller.signal});const data=await r.json();if(!r.ok)throw new Error(data.error||'Saved data unavailable');return data}finally{clearTimeout(timer)}
}
export async function chain(symbol:string,expiry?:string):Promise<OptionSnapshot>{
 if(!/^[A-Z][A-Z0-9.-]{0,9}$/.test(symbol))throw new Error('Invalid symbol');if(expiry&&!validExpiry(expiry))throw new Error('Invalid expiration');
 if(!optionsConfigured())return {status:'unavailable',source:'Massive',mode:'delayed',symbol,contracts:[],partial:false,asOf:null,retrievedAt:new Date().toISOString(),message:'Options coverage is not available here yet. View the research links below.'};
 const data=await backend(symbol);
 // Explicit public response: never forward the private collection universe or signal order.
 return {status:data.status,source:data.source,mode:data.mode,symbol:data.symbol,
 retrievedAt:data.retrievedAt,asOf:data.asOf,partial:data.partial,batchDay:data.batchDay,
 message:data.message,publicSymbols:data.publicSymbols||['SPY','QQQ'],
 coverage:data.coverage?{referencePrice:data.coverage.referencePrice,referencePriceAsOf:data.coverage.referencePriceAsOf}:undefined,
 contracts:expiry?data.contracts.filter((c:any)=>c.expiry===expiry):data.contracts};
}
export async function queueSymbol(symbol:string){if(!optionsConfigured())return {message:'New coverage requests are not available here yet.'};return backend(symbol,'POST');}
export async function trades(_symbol:string,_contractId:string):Promise<{trades:OptionTrade[];partial:boolean;message:string}>{return {trades:[],partial:false,message:'Individual trade records are not included in this daily snapshot. View the research links for more context.'};}
