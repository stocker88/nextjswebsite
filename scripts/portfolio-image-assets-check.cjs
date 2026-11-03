const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,f);
const {embedPortfolioImages}=require('../lib/portfolio-image-assets.ts');
const image=href=>({href,removed:false,getAttribute(){return this.href},setAttribute(_,value){this.href=value},remove(){this.removed=true}});
global.FileReader=class{readAsDataURL(){this.result='data:image/png;base64,AA==';this.onload()}};
global.fetch=async href=>{if(href==='cors')throw Error('CORS');return {ok:href!=='missing',blob:async()=>({type:href==='html'?'text/html':'image/png'})}};
(async()=>{
 const images=['logo','portrait','missing','cors','html'].map(image),clone={querySelectorAll:()=>images};
 const source={cloneNode:()=>clone};
 assert.equal(await embedPortfolioImages(source),clone);
 for(const item of images.slice(0,2))assert.match(item.href,/^data:image\/png;base64,/);
 for(const item of images.slice(2))assert.equal(item.removed,true);
 console.log('PASS portfolio export embeds raster assets and safely removes missing/CORS/non-image assets.');
})().catch(error=>{console.error(error);process.exitCode=1});
