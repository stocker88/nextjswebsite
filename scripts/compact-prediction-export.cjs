// Next embeds each static page's navigation payload in HTML. Keep one copy.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
function compact(out){
 const dataRoot=path.join(out,'_next/data');let count=0,bytes=0;
 for(const build of fs.readdirSync(dataRoot)){
  for(const locale of ['', 'es', 'de', 'fr', 'ja', 'ko']){
  const base=path.join(dataRoot,build,locale,'prediction');if(!fs.existsSync(base))continue;
  function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){
   const file=path.join(dir,e.name);if(e.isDirectory()){walk(file);continue;}if(!e.name.endsWith('.json'))continue;
   const route=path.relative(base,file).replace(/\.json$/,'').split(path.sep).join('/');
   const html=fs.readFileSync(path.join(out,locale,'prediction',route,'index.html'),'utf8');
   const match=html.match(/<script\b[^>]*\bid="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
   assert(match,'Missing hydration data for '+route);const embedded=JSON.parse(match[1]);
   assert.equal(embedded.buildId,build);assert.deepEqual(embedded.props,JSON.parse(fs.readFileSync(file,'utf8')),'Navigation payload mismatch: '+route);
   bytes+=fs.statSync(file).size;fs.unlinkSync(file);count++;
  }}walk(base);
  }
 }
 console.log('Compacted prediction export:',count,'duplicate data files;',bytes,'bytes');return {count,bytes};
}
if(require.main===module)compact(path.resolve(__dirname,'../out'));
module.exports={compact};
