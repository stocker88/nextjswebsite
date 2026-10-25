// Read the shared all-stock valuation cache. No per-visitor provider requests.
const fs=require('node:fs'),path=require('node:path');
const file=path.join(__dirname,'../data/stock-valuations.json');
async function sync(){
 let previous={version:1,stocks:{}};if(fs.existsSync(file))previous=JSON.parse(fs.readFileSync(file,'utf8'));
 try{
  const response=await fetch('https://us-central1-stocker-fcda2.cloudfunctions.net/stockValuationSnapshot',{signal:AbortSignal.timeout(30000)});
  if(!response.ok)throw Error('HTTP '+response.status);
  const next=await response.json();
  if(next.version!==1||!next.stocks||!Object.keys(next.stocks).length)throw Error('Empty valuation snapshot');
  const stocks={...previous.stocks};
  for(const [symbol,row] of Object.entries(next.stocks)){
   if(row.symbol!==symbol||!Number.isFinite(Date.parse(row.valuationAsOf))||!(row.marketCap>0)||['marketCap','pe','ps'].some(k=>row[k]!=null&&(!Number.isFinite(row[k])||row[k]<=0)))throw Error('Invalid valuation row');
   if(!stocks[symbol]||Date.parse(row.valuationAsOf)>=Date.parse(stocks[symbol].valuationAsOf))stocks[symbol]=row;
  }
  fs.writeFileSync(file+'.tmp',JSON.stringify({...next,stocks}));fs.renameSync(file+'.tmp',file);
  console.log('Saved valuations for '+Object.keys(stocks).length+' stocks');
 }catch(e){if(!Object.keys(previous.stocks).length)throw e;console.warn('Keeping last good valuations:',e.message);}
}
sync().catch(e=>{console.error(e.message);process.exitCode=1});
