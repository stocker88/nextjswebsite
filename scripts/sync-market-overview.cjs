const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
async function main(){
 const response=await fetch('https://us-central1-stocker-fcda2.cloudfunctions.net/marketHeatmap',{signal:AbortSignal.timeout(60000)});
 if(!response.ok)throw Error(`Market feed: ${response.status}`);
 const data=await response.json(),rows=data.overviewRows;
 if(!Array.isArray(rows)||rows.length<490||new Set(rows.map(r=>r.symbol)).size!==rows.length)throw Error('Full S&P 500 overview unavailable; keeping existing cache.');
 if(!rows.every(r=>typeof r.name==='string'&&typeof r.sector==='string'&&typeof r.industry==='string'&&r.weight>0&&['day','week','month','year'].every(p=>r.changes[p]===null||Number.isFinite(r.changes[p]))))throw Error('Invalid overview rows; keeping existing cache.');
 const snapshot={asOf:data.asOf,assembledAt:data.assembledAt,universeAsOf:data.universeAsOf,source:data.source,stocks:rows};
 const file=path.join(root,'data/hero-market-preview.json');
 fs.writeFileSync(file+'.tmp',JSON.stringify(snapshot,null,2)+'\n');fs.renameSync(file+'.tmp',file);
 const profiles=rows.map(({symbol,name,sector,industry,marketCap})=>({symbol,name,sector,industry,type:'EQUITY',marketCap}));
 fs.writeFileSync(path.join(root,'data/heatmap-stock-profiles.json'),JSON.stringify(profiles)+'\n');
 const sessions={}; for(const key of ['preMarket','afterHours']){const value=data[key];if(value?.version===1&&Array.isArray(value.rows)&&value.rows.length&&value.quotedAt){sessions[key]=Object.fromEntries(['version','mode','asOf','assembledAt','quotedAt','priceBasis','source','rows','pulse'].map(k=>[k,value[k]]));}}
 const extended=path.join(root,'data/extended-hours.json');const previous=fs.existsSync(extended)?JSON.parse(fs.readFileSync(extended,'utf8')):{};fs.writeFileSync(extended+'.tmp',JSON.stringify({...previous,...sessions})+'\n');fs.renameSync(extended+'.tmp',extended);
 console.log(`Saved ${rows.length} S&P 500 holdings across ${new Set(rows.map(r=>r.industry)).size} industries, as of ${data.asOf}.`);
}
main().catch(error=>{console.error(error.message);process.exitCode=1});
