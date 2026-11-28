const fs=require('node:fs'),path=require('node:path');
const {embedded}=require('./select.cjs');
function merge(stage,out,baseline){
 const buildId=fs.readFileSync(path.join(stage,'.next/BUILD_ID'),'utf8').trim();
 if(baseline){
  const reports=path.join(stage,'.incremental-routes'),allowed=new Map();let reused=0,rendered=0;
  for(const file of fs.existsSync(reports)?fs.readdirSync(reports):[]){const r=JSON.parse(fs.readFileSync(path.join(reports,file),'utf8'));allowed.set(r.template,new Set(r.reused));reused+=r.reused.length;rendered+=r.rendered.length;}
  // Only re-use HTML explicitly selected by the current build. Removed paths disappear.
  function copy(dir,relative=''){for(const e of fs.readdirSync(dir,{withFileTypes:true})){
   const rel=path.join(relative,e.name),src=path.join(dir,e.name),dest=path.join(out,rel);
   if(e.isDirectory()){if(rel===path.join('_next','data'))continue;copy(src,rel);continue;}
   if(fs.existsSync(dest))continue;
   if((reused>0&&rel.startsWith('_next'+path.sep+'static'+path.sep))||/\.(?:png|jpe?g|webp|svg|gif|woff2?|ttf|mp4|pdf)$/i.test(rel)){fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(src,dest);continue;}
   if(e.name!=='index.html')continue;
   const html=fs.readFileSync(src,'utf8'),data=embedded(html);if(!data)continue;
   if(!allowed.get(data.page)?.has('/'+relative.split(path.sep).map(encodeURIComponent).join('/')))continue;
   fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(src,dest);
  }}copy(baseline);
  console.log(`Incremental merge: ${rendered} dynamic pages rendered; ${reused} retained. Static hubs are refreshed.`);
 }
 const signatureFile=path.join(stage,'.incremental-signatures.json');
 const signatures=fs.existsSync(signatureFile)?JSON.parse(fs.readFileSync(signatureFile,'utf8')):require('./signatures.cjs').state(stage);
 fs.writeFileSync(path.join(out,'__deployment.json'),JSON.stringify({buildId,signatures}));
 // Navigation data is embedded in HTML. The Worker serves it for current or retained pages.
 if(baseline)fs.rmSync(path.join(out,'_next/data'),{recursive:true,force:true});
}
module.exports={merge};
