// One daily refresh; public exchange candles only, no credentials or trading APIs.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),file=path.join(root,'data/crypto-market-history.json'),cache=path.join(root,'.cache/crypto/history.json');
function read(p){try{return JSON.parse(fs.readFileSync(p,'utf8'));}catch{return {assets:{}};}}
function cleanCandles(rows,now=Date.now()){
 if(!Array.isArray(rows))return [];
 const days=new Map();for(const row of rows){if(!Array.isArray(row)||row.length<5)continue;const [time,low,high,open,close]=row;if(![time,low,high,open,close].every(Number.isFinite)||time<=0||time*1000+86400000>now||close<=0||low<=0||high<low||close<low||close>high||open<low||open>high)continue;days.set(new Date(time*1000).toISOString().slice(0,10),close);}
 return [...days].sort((a,b)=>a[0].localeCompare(b[0])).slice(-300);
}
async function main(){
 const tracked=read(file),saved=read(cache);const data=(saved.attemptedAt||'')>(tracked.attemptedAt||'')?saved:tracked;
 const names=read(path.join(root,'data/crypto-expansion.json')),targetsHash=crypto.createHash('sha256').update(JSON.stringify(names)).digest('hex');
 if(data.targetsHash===targetsHash&&Date.now()-Date.parse(data.attemptedAt||'')<86400000){fs.writeFileSync(file,JSON.stringify(data));console.log('Crypto daily cache reused');return;}
 data.attemptedAt=new Date().toISOString();data.source='Coinbase Exchange';data.assets||={};
 data.targetsHash=targetsHash;let added=0;
 for(const [ticker,name] of Object.entries(names)){
  const symbol=ticker+'-USD';try{const response=await fetch('https://api.exchange.coinbase.com/products/'+symbol+'/candles?granularity=86400',{signal:AbortSignal.timeout(15000),headers:{'User-Agent':'StocksToBuyNowResearch/1.0'}});if(response.status===429){console.warn('Crypto rate limit; retaining previous histories');break;}if(!response.ok)continue;
   const points=cleanCandles(await response.json());if(points.length<40||Date.now()-Date.parse(points.at(-1)[0]+'T23:59:59Z')>7*86400000)continue;
   data.assets[symbol]={name,points,sourceUrl:'https://api.exchange.coinbase.com/products/'+symbol+'/candles?granularity=86400'};added++;
  }catch(e){console.warn('Retaining crypto history:',symbol,e.message);}await new Promise(r=>setTimeout(r,300));
 }
 fs.mkdirSync(path.dirname(cache),{recursive:true});for(const p of [cache,file]){fs.writeFileSync(p+'.tmp',JSON.stringify(data));fs.renameSync(p+'.tmp',p);}console.log('Additional crypto histories refreshed:',added,'available:',Object.keys(data.assets).length);
}
module.exports={cleanCandles};if(require.main===module)main().catch(e=>{console.error(e);process.exitCode=1;});
