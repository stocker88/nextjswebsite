// Refresh the approved public company snapshots; retain dated data during outages.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
async function main(){
 const endpoint=process.env.STOCK_RESEARCH_SNAPSHOT_URL||'https://us-central1-stocker-fcda2.cloudfunctions.net/stockResearchSnapshot';
 if(!endpoint)throw new Error('Set STOCK_RESEARCH_SNAPSHOT_URL to the approved stock research endpoint.');
 const url=new URL(endpoint);if(url.protocol!=='https:'||!url.hostname.endsWith('.cloudfunctions.net'))throw new Error('Expected an HTTPS Cloud Functions endpoint.');
 const file=path.join(root,'data/stock-research-snapshots.json');let saved={};try{saved=JSON.parse(fs.readFileSync(file,'utf8'))}catch{}
 let updated=0;for(const stock of require(path.join(root,'data/stocks.json'))){
  try{url.searchParams.set('symbol',stock.ticker);const response=await fetch(url,{signal:AbortSignal.timeout(120000)});if(!response.ok)throw new Error('HTTP '+response.status);const data=await response.json();if(data.symbol!==stock.ticker||!Array.isArray(data.financials)||!Array.isArray(data.peers)||!data.updatedAt)throw new Error('Invalid snapshot');saved[stock.ticker]=data;updated++;}catch(error){console.warn(stock.ticker+': retaining dated snapshot ('+error.message+')');}
 }
 if(!updated){if(Object.keys(saved).length){console.warn('No snapshots refreshed; using existing dated research.');return;}throw new Error('No stock research is available.');}
 fs.writeFileSync(file+'.tmp',JSON.stringify(saved));fs.renameSync(file+'.tmp',file);console.log('Refreshed '+updated+' cached stock research pages.');
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
