const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const calendarEndpoint='https://us-central1-stocker-fcda2.cloudfunctions.net/earningsCalendar';
const snapshotEndpoint='https://us-central1-stocker-fcda2.cloudfunctions.net/companyResearchSnapshots';
const cacheDir=process.env.EARNINGS_CACHE_DIR||path.join(root,'.cache/earnings');
const publicDir=path.join(root,'public/earnings-data');
const validSymbol=s=>/^[A-Z0-9.-]{1,15}$/.test(s);
async function json(url){const response=await fetch(url,{signal:AbortSignal.timeout(90000)});if(!response.ok)throw new Error('Earnings endpoint returned '+response.status);return response.json();}
function read(file,fallback=null){try{return JSON.parse(fs.readFileSync(file,'utf8'));}catch{return fallback;}}
function chunks(items,size){const result=[];for(let index=0;index<items.length;index+=size)result.push(items.slice(index,index+size));return result;}

(async()=>{
 const calendarFile=path.join(root,'data/earnings-calendar.json');
 const previous=read(calendarFile,{});let data;
 try{data=await json(calendarEndpoint);if(data.schemaVersion!==1||!Array.isArray(data.items)||!data.items.length)throw new Error('Invalid earnings snapshot');}
 catch(error){if(!fs.existsSync(calendarFile))throw error;console.warn('Keeping last earnings calendar:',error.message);data=previous;}
 fs.mkdirSync(cacheDir,{recursive:true});fs.mkdirSync(publicDir,{recursive:true});
 let manifest;
 try{manifest=await json(snapshotEndpoint);if(!manifest.version||!Array.isArray(manifest.symbols))throw new Error('Invalid company snapshot manifest');}
 catch(error){console.warn('Keeping last company snapshots:',error.message);manifest=null;}
 if(manifest){
  const cachedManifest=read(path.join(cacheDir,'manifest.json'),{});
  if(cachedManifest.version!==manifest.version){
   // Seed a new Actions cache from the repository's last successful files.
   for(const symbol of manifest.symbols.filter(validSymbol)){const source=path.join(publicDir,symbol+'.json'),target=path.join(cacheDir,symbol+'.json');if(!fs.existsSync(target)&&fs.existsSync(source))fs.copyFileSync(source,target);}
   for(const batch of chunks(manifest.symbols.filter(validSymbol),25)){
    try{const payload=await json(snapshotEndpoint+'?symbols='+encodeURIComponent(batch.join(',')));for(const [symbol,detail] of Object.entries(payload.items||{})){if(validSymbol(symbol)&&detail?.symbol===symbol&&Array.isArray(detail.history)&&Array.isArray(detail.prices))fs.writeFileSync(path.join(cacheDir,symbol+'.json'),JSON.stringify(detail));}}
    catch(error){console.warn('Company snapshot batch unavailable:',batch.join(','),error.message);}
   }
   fs.writeFileSync(path.join(cacheDir,'manifest.json'),JSON.stringify(manifest));
  }
  const published=[];
  for(const symbol of manifest.symbols.filter(validSymbol)){const source=path.join(cacheDir,symbol+'.json');if(!fs.existsSync(source))continue;fs.copyFileSync(source,path.join(publicDir,symbol+'.json'));published.push(symbol);}
  data.detailSymbols=published.sort();
 }else data.detailSymbols=(previous.detailSymbols||[]).filter(symbol=>validSymbol(symbol)&&fs.existsSync(path.join(publicDir,symbol+'.json'))).sort();
 fs.writeFileSync(calendarFile,JSON.stringify(data));fs.writeFileSync(path.join(root,'public/earnings-calendar.json'),JSON.stringify(data));
 console.log('Synced earnings:',data.items.length,'reports;',data.detailSymbols.length,'company research pages');
})().catch(error=>{console.error(error.message);process.exit(1)});
