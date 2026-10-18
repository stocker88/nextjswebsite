// One-time import of CNN daily history. Existing saved readings win overlapping dates.
// Usage: node scripts/backfill-fear-greed.cjs /path/to/fear-greed.csv <pinned-source-url>
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
function backfill(root,csv,source){
 if(!source?.startsWith('https://raw.githubusercontent.com/whit3rabbit/fear-greed-data/'))throw Error('Supply the pinned public archive URL');
 const file=path.join(root,'data/fear-greed.json');const saved=JSON.parse(fs.readFileSync(file,'utf8'));
 const end=saved.timestamp.slice(0,10),start=new Date(Date.parse(end)-380*86400000).toISOString().slice(0,10);
 const lines=csv.trim().split(/\r?\n/);if(lines.shift()!=='Date,Fear Greed,Rating')throw Error('Unexpected CSV columns');
 const points=new Map();
 for(const line of lines){
  const [day,raw]=line.split(',');if(day<start||day>end)continue;
  const value=Number(raw),ms=Date.parse(day+'T00:00:00Z');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||!Number.isFinite(ms)||new Date(ms).toISOString().slice(0,10)!==day||!raw||!Number.isFinite(value)||value<0||value>100||points.has(day))throw Error('Invalid or duplicate archive row: '+day);
  points.set(day,value);
 }
 let overlaps=0;
 for(const p of saved.history){const day=p.date.slice(0,10);if(points.has(day)){overlaps++;if(Math.round(points.get(day))!==Math.round(p.value))throw Error('Archive disagrees with saved reading on '+day);}}
 if(overlaps<5||points.size<240||!points.has(end))throw Error('Insufficient verified one-year coverage');
 const imported=points.size;
 for(const p of saved.history)points.set(p.date.slice(0,10),p.value);
 const history=Array.from(points,([day,value])=>({date:day+'T00:00:00.000Z',value})).sort((a,b)=>a.date.localeCompare(b.date));
 const target=Date.parse(end)-365*86400000;
 const year=[...history].reverse().find(p=>Date.parse(p.date)<=target);
 if(!year||target-Date.parse(year.date)>4*86400000)throw Error('Missing year-ago reading');
 const next={...saved,history,yearAgo:saved.yearAgo??year.value};
 for(const relative of ['data/fear-greed.json','public/data/fear-greed.json'])fs.writeFileSync(path.join(root,relative),JSON.stringify(next)+'\n');
 fs.writeFileSync(path.join(root,'data/fear-greed-history-provenance.json'),JSON.stringify({source,sha256:crypto.createHash('sha256').update(csv).digest('hex'),importedReadings:imported,verifiedOverlaps:overlaps,from:history[0].date,through:history.at(-1).date,policy:'Older missing dates imported; existing saved daily readings preserved.'},null,2)+'\n');
 console.log(`Saved ${history.length} readings, ${history[0].date.slice(0,10)} through ${end}; ${overlaps} matching overlaps.`);
 return next;
}
module.exports={backfill};
if(require.main===module)backfill(path.join(__dirname,'..'),fs.readFileSync(process.argv[2],'utf8'),process.argv[3]);
