const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const languages=['en','es','de','fr','ja','ko'];
const digest=v=>crypto.createHash('sha256').update(v).digest('hex');
function state(root){
 const source=crypto.createHash('sha256'),localized=Object.fromEntries(languages.map(l=>[l,[]]));
 function walk(relative){const dir=path.join(root,relative);if(!fs.existsSync(dir))return;
  for(const e of fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){
   const rel=path.join(relative,e.name);if(e.isDirectory()){walk(rel);continue;}
   if(!/\.(?:[cm]?[jt]sx?|json|css|scss)$/.test(rel))continue;
   const text=fs.readFileSync(path.join(root,rel),'utf8');
   if(rel.startsWith('data/localization/')){
    const data=JSON.parse(text),single=e.name.match(/^(en|es|de|fr|ja|ko)-/);
    for(const lang of languages){
     if(single){if(single[1]===lang)localized[lang].push([rel,data]);}
     else if(['home.json','conversion.json'].includes(e.name))localized[lang].push([rel,Object.entries(data).map(([key,values])=>[key,values[lang]??key])]);
     else localized[lang].push([rel,data]);
    }
   }else{source.update(rel);source.update(text);}
  }
 }
 for(const dir of ['pages','components','lib','styles','data'])walk(dir);
 for(const file of ['package.json','yarn.lock','next.config.js','tsconfig.json'])if(fs.existsSync(path.join(root,file))){source.update(file);source.update(fs.readFileSync(path.join(root,file)));}
 return {source:source.digest('hex'),languages:Object.fromEntries(languages.map(l=>[l,digest(JSON.stringify(localized[l]))]))};
}
function sameLanguage(current,previous,template){const lang=template.match(/^\/(es|de|fr|ja|ko)(?:\/|$)/)?.[1]||'en';return !!previous&&current.source===previous.source&&current.languages[lang]===previous.languages?.[lang];}
module.exports={state,sameLanguage};
