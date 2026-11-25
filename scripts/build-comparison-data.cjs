const fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,f);
const {comparisonChoices,comparisonData}=require('../lib/comparison-data-server.ts');
fs.mkdirSync('public/comparison-data',{recursive:true});
for(const c of comparisonChoices())fs.writeFileSync('public/comparison-data/'+c.slug+'.json',JSON.stringify(comparisonData(c.symbol)));
console.log('Selectable comparison stocks:',comparisonChoices().length);
