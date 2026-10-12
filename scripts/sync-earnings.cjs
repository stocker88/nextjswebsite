const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const endpoint='https://us-central1-stocker-fcda2.cloudfunctions.net/earningsCalendar';
async function json(url){const r=await fetch(url,{signal:AbortSignal.timeout(90000)});if(!r.ok)throw new Error('Earnings endpoint returned '+r.status);return r.json();}
(async()=>{
 let data;
 try{data=await json(endpoint);if(data.schemaVersion!==1||!Array.isArray(data.items)||!data.items.length)throw new Error('Invalid earnings snapshot');}
 catch(e){const file=path.join(root,'data/earnings-calendar.json');if(!fs.existsSync(file))throw e;const old=JSON.parse(fs.readFileSync(file,'utf8'));if(Date.now()-Date.parse(old.updatedAt)>7*86400000)throw new Error('Earnings snapshot is over seven days old. Restore the scheduled refresh.');console.warn('Keeping last earnings snapshot:',e.message);return;}
 const oldPath=path.join(root,'data/earnings-calendar.json');const previous=fs.existsSync(oldPath)?JSON.parse(fs.readFileSync(oldPath,'utf8')).detailSymbols||[]:[];
 const upcoming=[...new Set(data.items.filter(i=>i.research&&i.date>=data.today).sort((a,b)=>(b.marketCap||0)-(a.marketCap||0)).map(i=>i.symbol))].slice(0,60);
 const candidates=[...new Set([...upcoming,...previous])];
 const dir=path.join(root,'public/earnings-data');fs.mkdirSync(dir,{recursive:true});const symbols=[];let index=0;
 await Promise.all(Array.from({length:3},async()=>{while(index<candidates.length){const symbol=candidates[index++];if(!/^[A-Z0-9.-]{1,15}$/.test(symbol))continue;try{const d=await json(endpoint+'?cached=1&symbol='+encodeURIComponent(symbol));if(d.symbol!==symbol||!Array.isArray(d.history)||!Array.isArray(d.prices))throw new Error('Invalid stock research');fs.writeFileSync(path.join(dir,symbol+'.json'),JSON.stringify(d));symbols.push(symbol);}catch(e){const p=path.join(dir,symbol+'.json');if(fs.existsSync(p))symbols.push(symbol);console.warn('Stock snapshot unavailable:',symbol);}}}));
 // Keep the published company-route set stable across static builds; other stocks use shareable calendar query links.
 data.detailSymbols=(previous.length?previous:symbols).filter(s=>/^[A-Z0-9.-]{1,15}$/.test(s)&&fs.existsSync(path.join(dir,s+'.json'))).sort();
 fs.writeFileSync(oldPath,JSON.stringify(data));fs.writeFileSync(path.join(root,'public/earnings-calendar.json'),JSON.stringify(data));
 console.log('Synced earnings:',data.items.length,'reports;',data.detailSymbols.length,'company research pages');
})().catch(e=>{console.error(e.message);process.exit(1)});
