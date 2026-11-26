// Bounded refresh through the existing backend cache. No browser/provider API keys.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const universe=require('../data/iwv-universe.json');
const dir=process.env.IWV_CACHE_DIR||path.join(root,'.cache/iwv');
const published=path.join(root,'public/earnings-data');
const endpoint='https://us-central1-stocker-fcda2.cloudfunctions.net/iwvResearchSnapshot';
const financialDir=path.join(root,'public/company-financials');
const read=f=>{try{return JSON.parse(fs.readFileSync(f,'utf8'));}catch{return null;}};
function valid(d,s){
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 if(d?.symbol!==s||typeof d.name!=='string'||!d.name||!Number.isFinite(d.price)||d.price<=0||!/^\d{4}-\d{2}-\d{2}$/.test(d.priceDate||'')||d.priceDate>today||!Number.isFinite(Date.parse(d.updatedAt))||!Array.isArray(d.history)||!Array.isArray(d.prices))return false;
 const usable=d.prices.filter(p=>p.close>0&&Number.isFinite(p.close)&&/^\d{4}-\d{2}-\d{2}$/.test(p.date)&&p.date<=d.priceDate);
 return new Set(usable.map(p=>p.date)).size>=31;
}
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function main(){
 fs.mkdirSync(dir,{recursive:true});fs.mkdirSync(published,{recursive:true});fs.mkdirSync(financialDir,{recursive:true});
 function publish(snapshot){const {detail,...financial}=snapshot;fs.writeFileSync(path.join(published,snapshot.symbol+'.json'),JSON.stringify(detail));fs.writeFileSync(path.join(financialDir,snapshot.symbol+'.json'),JSON.stringify(financial));}
 const stateFile=path.join(dir,'state.json'),state=read(stateFile)||{};
 const limit=Math.max(0,Math.min(3000,Number(process.env.IWV_REFRESH_LIMIT||60)));
 const interval=Math.max(2500,Number(process.env.IWV_REFRESH_INTERVAL_MS||2500));
 const now=Date.now(),refreshAge=3*86400000,deadline=now+Number(process.env.IWV_REFRESH_BUDGET_MS||480000);
 // Prioritize stocks without a usable snapshot, then the oldest successful refresh.
 const work=universe.stocks.map(({symbol})=>{
  const local=read(path.join(dir,symbol+'.json'));
  const seedFinancial=read(path.join(financialDir,symbol+'.json')),seedDetail=read(path.join(published,symbol+'.json'));
  const seed=seedFinancial?{...seedFinancial,detail:seedDetail}:null;
  const snapshot=[local,seed].filter(v=>valid(v?.detail,symbol)&&Array.isArray(v?.financials)).sort((a,b)=>Date.parse(b.updatedAt||b.detail.updatedAt)-Date.parse(a.updatedAt||a.detail.updatedAt))[0]||null;
  if(snapshot){fs.writeFileSync(path.join(dir,symbol+'.json'),JSON.stringify(snapshot));publish(snapshot);}
  return {symbol,detail:snapshot?.detail,last:Math.max(state[symbol]?.success||0,Date.parse(snapshot?.updatedAt||'')||0)};
 }).filter(v=>(!v.detail||now-v.last>refreshAge)&&now-(state[v.symbol]?.snapshotAttempt||0)>86400000).sort((a,b)=>Number(!!a.detail)-Number(!!b.detail)||a.last-b.last).slice(0,limit);
 let completed=0,failed=0,bytes=0,nextStart=0;
 const queue=[...work];
 // Up to six concurrent HTTP requests, no more than 24 company starts/minute.
 // Each backend request shares cached source data and the existing provider limiter.
 await Promise.all(Array.from({length:Math.min(6,queue.length)},async()=>{
  while(queue.length&&Date.now()<deadline){
   const {symbol}=queue.shift();const start=Math.max(Date.now(),nextStart);nextStart=start+interval;await wait(Math.max(0,start-Date.now()));
   state[symbol]={...state[symbol],snapshotAttempt:Date.now()};
   try{
    const res=await fetch(endpoint+'?symbol='+encodeURIComponent(symbol),{signal:AbortSignal.timeout(185000)});
    if(!res.ok)throw new Error('HTTP '+res.status);
    const body=await res.text();bytes+=Buffer.byteLength(body);const snapshot=JSON.parse(body),d=snapshot.detail;
    if(!valid(d,symbol))throw new Error('Insufficient verified price history');
    fs.writeFileSync(path.join(dir,symbol+'.json'),JSON.stringify(snapshot));publish(snapshot);
    state[symbol]={snapshotAttempt:Date.now(),success:Date.now(),priceDate:d.priceDate,partial:!!(d.unavailable?.length||snapshot.unavailable?.length)};completed++;
   }catch(error){state[symbol].error=error.message;failed++;console.warn('IWV research unavailable:',symbol,error.message);}
   fs.writeFileSync(stateFile,JSON.stringify(state));
   if((completed+failed)%25===0)console.log('IWV progress',completed+failed,'/',work.length,'saved',completed,'unavailable',failed);
  }
 }));
 const available=universe.stocks.filter(s=>valid(read(path.join(published,s.symbol+'.json')),s.symbol)).map(s=>s.symbol);
 const report={source:universe.source,label:universe.label,asOf:universe.asOf,updatedAt:new Date().toISOString(),universe:universe.stocks.length,available:available.length,missing:universe.stocks.filter(s=>!available.includes(s.symbol)).map(s=>s.symbol),attempted:completed+failed,queued:work.length,completed,failed,responseBytes:bytes};
 fs.mkdirSync(path.join(root,'reports'),{recursive:true});fs.writeFileSync(path.join(root,'reports/iwv-research-coverage.json'),JSON.stringify(report,null,2));
 fs.writeFileSync(path.join(root,'public/iwv-coverage.json'),JSON.stringify({label:report.label,asOf:report.asOf,updatedAt:report.updatedAt,total:report.universe,available:report.available,missing:report.missing.length}));
 console.log(JSON.stringify({...report,missing:report.missing.length}));
}
if(require.main===module)main().catch(e=>{console.error(e.message);process.exitCode=1});
module.exports={valid};
