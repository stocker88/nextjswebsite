// Keep pre-rendered translated HTML while fitting the host's asset-count limit.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{gzipSync}=require('node:zlib');
function pack(out){let pages=0,packs=0;for(const locale of ['es','de','fr','ja','ko']){
 const base=path.join(out,locale,'prediction');if(!fs.existsSync(base))continue;
 for(const stock of fs.readdirSync(base,{withFileTypes:true}).filter(e=>e.isDirectory())){
  const dir=path.join(base,stock.name),entries={};
  const overview=path.join(dir,'index.html');if(fs.existsSync(overview))entries.overview=fs.readFileSync(overview,'utf8');
  for(const period of fs.readdirSync(dir,{withFileTypes:true}).filter(e=>e.isDirectory()&&/^(today|tomorrow|next-week|next-month|2026|2027|2028|2029|2030)$/.test(e.name))){
   const file=path.join(dir,period.name,'index.html');if(fs.existsSync(file))entries[period.name]=fs.readFileSync(file,'utf8');
  }
  if(!Object.keys(entries).length)continue;
  const json=JSON.stringify(entries);assert(Buffer.byteLength(json)<25*1024*1024,'Localized stock pack exceeds host limit: '+stock.name);
  const target=path.join(out,'__localized',locale,stock.name+'.json.gz');fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,gzipSync(json));
  for(const period of Object.keys(entries)){fs.unlinkSync(period==='overview'?path.join(dir,'index.html'):path.join(dir,period,'index.html'));pages++;}packs++;
 }
}
fs.appendFileSync(path.join(out,'_headers'),'\n/__localized/*\n  X-Robots-Tag: noindex\n');
console.log('Packed translated prediction HTML:',pages,'pages in',packs,'assets');return {pages,packs};}
if(require.main===module)pack(path.resolve(__dirname,'../out'));module.exports={pack};
