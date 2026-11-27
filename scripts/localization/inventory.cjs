/** Read-only inventory. No API calls, translation charges or publication. */
const fs=require('node:fs');
const path=require('node:path');
const fields=new Set(['title','body','description','question','answer','explanation','category','label','intro','check','example']);
const sources=['data/learning/academy.json','data/search-question-guides.json','data/investing-guides.json','data/glossary.json'];
const report={language:'es',strategy:'Saved translations rendered in HTML; no per-visit translation API',excluded:['Research articles','News headlines'],deferredLanguages:['ko'],sources:[]};
for(const source of sources){
 const entries=[];
 function visit(value,pointer=''){
  if(Array.isArray(value))return value.forEach((item,i)=>visit(item,`${pointer}/${i}`));
  if(value&&typeof value==='object')for(const [key,item] of Object.entries(value)){
   const p=pointer+'/'+key.replace(/~/g,'~0').replace(/\//g,'~1');
   if(fields.has(key)&&typeof item==='string'&&item.trim())entries.push({pointer:p,words:item.trim().split(/\s+/).length});
   else visit(item,p);
  }
 }
 visit(JSON.parse(fs.readFileSync(source,'utf8')));
 report.sources.push({file:source,textFields:entries.length,words:entries.reduce((sum,e)=>sum+e.words,0),status:'pending',entries});
}
report.totalWords=report.sources.reduce((sum,s)=>sum+s.words,0);
console.log(JSON.stringify(report,null,2));
