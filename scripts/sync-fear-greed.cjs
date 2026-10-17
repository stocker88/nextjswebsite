// One request per build. Preserve the last verified snapshot on failure.
const fs=require('node:fs');const path=require('node:path');const ts=require('typescript');
const filename=path.join(__dirname,'../lib/fear-greed.ts');
const Module=require('node:module');const compiled=new Module(filename,module);
compiled._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,filename);
(async()=>{try{
 const response=await fetch('https://production.dataviz.cnn.io/index/fearandgreed/graphdata',{signal:AbortSignal.timeout(12000)});
 if(!response.ok)throw Error(`HTTP ${response.status}`);
 const snapshot=compiled.exports.normalizeFearGreed(await response.json());
 if(!snapshot)throw Error('Invalid index response');
 const file=path.join(__dirname,'../data/fear-greed.json');
 fs.writeFileSync(file+'.tmp',JSON.stringify(snapshot)+'\n');fs.renameSync(file+'.tmp',file);
 console.log('Saved CNN Fear & Greed snapshot dated '+snapshot.timestamp);
}catch(error){console.warn('CNN snapshot unchanged: '+error.message);}})();
