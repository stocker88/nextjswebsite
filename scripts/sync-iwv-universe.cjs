// IWV holdings are a Russell 3000 proxy, not an official index membership feed.
const fs=require('node:fs'),path=require('node:path');
const SOURCE='https://www.ishares.com/us/products/239714/ishares-russell-3000-etf/latest-holdings.csv';
function csv(text){const rows=[];let row=[],cell='',quoted=false;for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}else if(!quoted&&(c===','||c==='\n')){row.push(cell.replace(/\r$/,''));cell='';if(c==='\n'){rows.push(row);row=[];}}else cell+=c;}if(cell||row.length){row.push(cell.replace(/\r$/,''));rows.push(row);}if(quoted)throw Error('Unclosed CSV field');return rows;}
function parse(text,now=Date.now()){
 const rows=csv(text.replace(/^\uFEFF/,''));const stamp=rows.find(r=>r[0]==='Fund Holdings as of')?.[1];const parsed=Date.parse((stamp||'')+' 12:00:00 GMT');if(!Number.isFinite(parsed)||parsed>now||now-parsed>35*86400000)throw Error('Missing or stale IWV holdings date');
 const start=rows.findIndex(r=>r[0]==='Ticker'&&r.includes('Asset Class'));if(start<0)throw Error('Missing holdings header');const head=rows[start],stocks=new Map(),excluded=[];
 for(const row of rows.slice(start+1)){const d=Object.fromEntries(head.map((h,i)=>[h,row[i]||'']));if(d['Asset Class']!=='Equity')continue;
  const symbol=d.Ticker.trim().replace(/[ .]/g,'-');
  if(/\bCVR\s*$|CONTINGENT VALUE RIGHT/i.test(d.Name)){excluded.push({ticker:d.Ticker,name:d.Name,reason:'Contingent value right, not a common stock'});continue;}
  if(!/^[A-Z]{1,6}(?:-[A-Z])?$/.test(symbol)||/UNLISTED|Non-Nms/i.test(d.Exchange)||!d.Name){excluded.push({ticker:d.Ticker,name:d.Name,reason:'No supported listed common-stock symbol'});continue;}
  if(stocks.has(symbol))throw Error('Duplicate equity ticker '+symbol);
  stocks.set(symbol,{symbol,name:d.Name,sector:d.Sector,exchange:d.Exchange});
 }
 if(stocks.size<2000||stocks.size>3500)throw Error('Unexpected IWV equity count');
 return {source:SOURCE,label:'IWV holdings — Russell 3000 proxy',isOfficialIndexMembership:false,asOf:new Date(parsed).toISOString().slice(0,10),stocks:[...stocks.values()],excluded};
}
async function main(){const root=path.resolve(__dirname,'..'),file=path.join(root,'data/iwv-universe.json');let text;if(process.argv[2])text=fs.readFileSync(process.argv[2],'utf8');else{const r=await fetch(SOURCE,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error('Holdings HTTP '+r.status);text=await r.text();}const data=parse(text);fs.writeFileSync(file+'.tmp',JSON.stringify(data,null,2)+'\n');fs.renameSync(file+'.tmp',file);console.log(JSON.stringify({asOf:data.asOf,stocks:data.stocks.length,excluded:data.excluded.length}));}
module.exports={csv,parse};if(require.main===module)main().catch(e=>{console.error(e.message);process.exitCode=1;});
