// Render social thumbnails with the exact canvas drawing function used by Save Image.
// Runs after earnings sync in both server and static builds; no browser or account needed.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const ts=require('typescript'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const {QRCodeSVG}=require('qrcode.react'),{createCanvas,loadImage,GlobalFonts}=require('@napi-rs/canvas');
const root=path.resolve(__dirname,'..'),cache=new Map();
function loadTs(file){
 file=path.resolve(file);if(cache.has(file))return cache.get(file);
 const module={exports:{}};cache.set(file,module.exports);
 const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
 vm.runInNewContext(code,{module,exports:module.exports,require:id=>id.startsWith('.')?loadTs(path.resolve(path.dirname(file),id+'.ts')):require(id),Intl,Date,Blob,setTimeout,clearTimeout},{filename:file});
 return module.exports;
}
async function main(){
 // Linux canvas does not reliably resolve CSS generic fallbacks. Register the
 // Arial-compatible system family explicitly to match browser exports.
 if(process.platform==='linux'){
  let registered=false;
  for(const dir of ['/usr/share/fonts/truetype/liberation2','/usr/share/fonts/truetype/liberation']){
   const regular=path.join(dir,'LiberationSans-Regular.ttf');
   if(!fs.existsSync(regular))continue;
   for(const weight of ['Regular','Bold','Italic','BoldItalic']){
    const file=path.join(dir,`LiberationSans-${weight}.ttf`);
    if(fs.existsSync(file))GlobalFonts.registerFromPath(file,'Arial');
   }
   registered=true;break;
  }
  if(!registered)GlobalFonts.registerFromPath(path.join(root,'public/web/packages/language_picker/assets/fonts/Roboto/Roboto-Regular.ttf'),'Arial');
 }

 const data=JSON.parse(fs.readFileSync(path.join(root,'data/earnings-calendar.json'),'utf8'));
 const {day,shortDate}=loadTs(path.join(root,'lib/earnings.ts'));
 const {defaultCalendarWeek,marketToday}=loadTs(path.join(root,'lib/calendar-period.ts'));
 const {createEarningsImage,snapshotShareUrl}=loadTs(path.join(root,'lib/earnings-image.ts'));
 const qrSource=renderToStaticMarkup(React.createElement(QRCodeSVG,{value:snapshotShareUrl,size:164,level:'M',includeMargin:true}));
 const qrModules=Number(qrSource.match(/viewBox="0 0 (\d+)/)[1]);
 const output=path.join(root,'public/social/earnings');fs.mkdirSync(output,{recursive:true});
 const manifest={},rendered=new Map();
 for(const mode of ['this-week','next-week','calendar']){
  const week=defaultCalendarWeek(marketToday(),mode),end=day(week,6);
  if(!rendered.has(week)){
   const events=data.items.filter(e=>e.date>=week&&e.date<=end&&e.session!=='unknown').sort((a,b)=>(b.marketCap??-1)-(a.marketCap??-1)||a.symbol.localeCompare(b.symbol));
   const dates=Array.from({length:7},(_,n)=>day(week,n)).filter(date=>events.some(e=>e.date===date));
   const canvas=createCanvas(1200,1200);canvas.toBlob=callback=>canvas.encode('png').then(buffer=>callback(new Blob([buffer],{type:'image/png'})));
   const image=await createEarningsImage(events,dates,week,null,end,true,true,{canvas,qrSource,qrModules,loadImage:async src=>{
    try{return await loadImage(src.startsWith('/')?path.join(root,'public',src):Buffer.from(decodeURIComponent(src.split(',').slice(1).join(','))));}catch{return null;}
   }});
   const bytes=Buffer.from(await image.arrayBuffer()),hash=crypto.createHash('sha256').update(bytes).digest('hex').slice(0,12);
   const name=`week-${week}-${hash}.png`;fs.writeFileSync(path.join(output,name),bytes);
   rendered.set(week,{url:`https://www.stockstobuynow.ai/social/earnings/${name}`,alt:`Weekly earnings calendar: ${shortDate(week)} – ${shortDate(end)}, ${week.slice(0,4)}. Company logos, before-open and after-close reports, EPS and revenue beat rates.`,week,end});
   console.log(`Earnings social preview: ${week}, ${events.length} reports, ${bytes.length} bytes`);
  }
  manifest[mode]=rendered.get(week);
 }
 fs.writeFileSync(path.join(root,'data/earnings-social.json'),JSON.stringify(manifest,null,2)+'\n');
}
main().catch(error=>{console.error(error);process.exitCode=1});
