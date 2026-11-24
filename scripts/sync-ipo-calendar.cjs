const fs=require('node:fs'),path=require('node:path');
const SOURCE='https://www.nasdaq.com/market-activity/ipos';
const WEEK=7*86400000;
function date(value){if(!value)return null;const m=String(value).match(/^(\d{2})\/(\d{2})\/(\d{4})$/);if(!m)return null;const iso=`${m[3]}-${m[1]}-${m[2]}`;return new Date(iso+'T12:00:00Z').toISOString().slice(0,10)===iso?iso:null;}
const text=v=>v==null||v==='N/A'||v==='--'?null:String(v).trim()||null;
function normalize(payload){
 if(!payload?.data||!Object.hasOwn(payload.data,'upcoming')||!Object.hasOwn(payload.data,'priced'))throw Error('Unexpected IPO response');
 const d=payload.data,rows=[];
 for(const [status,group,field] of [['expected',d.upcoming?.upcomingTable,'expectedPriceDate'],['priced',d.priced,'pricedDate'],['filed',d.filed,'filedDate'],['withdrawn',d.withdrawn,'withdrawnDate']]){
  if(group?.rows!=null&&!Array.isArray(group.rows))throw Error('Invalid IPO rows');
  for(const x of group?.rows||[]){if(!text(x.companyName))throw Error('IPO company missing');rows.push({id:text(x.dealID)||[x.companyName,x.proposedTickerSymbol,status].join('|'),company:text(x.companyName),symbol:text(x.proposedTickerSymbol),exchange:text(x.proposedExchange),priceRange:text(x.proposedSharePrice),shares:text(x.sharesOffered),offerAmount:text(x.dollarValueOfSharesOffered),date:date(x[field]),status,sourceUrl:SOURCE});}
 }
 return rows;
}
const read=p=>{try{return JSON.parse(fs.readFileSync(p,'utf8'));}catch{return null;}};
function write(p,v){fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p+'.tmp',JSON.stringify(v,null,2)+'\n');fs.renameSync(p+'.tmp',p);}
async function sync({root=path.resolve(__dirname,'..'),fetcher=fetch,now=Date.now(),force=false,recover=true}={}){
 const cache=path.join(root,'.cache/ipo/state.json'),file=path.join(root,'data/ipo-calendar.json'),pub=path.join(root,'public/data/ipo-calendar.json');
 let state=read(cache)||{};
 const valid=s=>s?.version===1&&Array.isArray(s.items)&&Number.isFinite(Date.parse(s.updatedAt));
 let saved=[state.snapshot,read(file)].filter(valid).sort((a,b)=>Date.parse(b.updatedAt)-Date.parse(a.updatedAt))[0]||null;
 // Recover the deployed snapshot when GitHub's cache has expired.
 if(recover&&(!saved||now-Date.parse(saved.updatedAt)>=WEEK))try{const res=await fetcher('https://www.stockstobuynow.ai/data/ipo-calendar.json',{signal:AbortSignal.timeout(12000)});const live=res.ok?await res.json():null;if(valid(live)&&(!saved||Date.parse(live.updatedAt)>Date.parse(saved.updatedAt)))saved=live;}catch{}
 const publish=()=>{if(saved){write(file,saved);write(pub,saved);}};
 publish();
 if(!force&&saved&&now-Date.parse(saved.updatedAt)<WEEK){console.log('IPO calendar: weekly snapshot current.');return saved;}
 if(!force&&state.lastAttempt&&now-state.lastAttempt<86400000){console.log('IPO calendar: retry deferred; retaining last good snapshot.');if(!saved)throw Error('No IPO snapshot');return saved;}
 state={lastAttempt:now,snapshot:saved};write(cache,state);
 try{
  const today=new Date(now),months=Array.from({length:3},(_,i)=>new Date(Date.UTC(today.getUTCFullYear(),today.getUTCMonth()+i,1)).toISOString().slice(0,7));
  const all=[];
  for(const month of months){const res=await fetcher(`https://api.nasdaq.com/api/ipo/calendar?date=${month}`,{headers:{'User-Agent':'Mozilla/5.0','Accept':'application/json'},signal:AbortSignal.timeout(25000)});if(!res.ok)throw Error('IPO provider HTTP '+res.status);all.push(...normalize(await res.json()));}
  const rank={expected:1,filed:0,priced:2,withdrawn:3},unique=new Map();
  for(const item of all){const prior=unique.get(item.id);if(!prior||rank[item.status]>rank[prior.status])unique.set(item.id,item);}
  saved={version:1,updatedAt:new Date(now).toISOString(),nextRefreshAt:new Date(now+WEEK).toISOString(),coverageMonths:months,source:'Nasdaq IPO calendar / EDGAR Online',sourceUrl:SOURCE,items:[...unique.values()].sort((a,b)=>(a.date||'9999').localeCompare(b.date||'9999')||a.company.localeCompare(b.company))};
  publish();write(cache,{lastAttempt:now,snapshot:saved});console.log(`IPO calendar refreshed: ${saved.items.length} offerings across ${months.join(', ')}.`);return saved;
 }catch(error){console.error('IPO refresh failed; last good data retained: '+error.message);if(!saved)throw error;return saved;}
}
module.exports={normalize,date,sync};
if(require.main===module)sync({force:process.argv.includes('--force')}).catch(()=>{process.exitCode=1;});
