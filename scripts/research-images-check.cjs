const fs=require('node:fs');
const assert=require('node:assert/strict');
const ts=require('typescript');
const React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');
const m={exports:{}};
const source=ts.transpileModule(fs.readFileSync('components/ResearchImages.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.React,target:ts.ScriptTarget.ES2019}}).outputText;
new Function('require','module','exports','React',source)((id)=>id==='./ResearchCTA'?{default:()=>null}:require(id),m,m.exports,React);
const Gallery=m.exports.default;
const images=['financial','technical','earnings'].map(name=>({url:`https://example.com/${name}.png`,filename:`${name}.png`,width:1200,height:1500}));
for(const compact of [false,true])for(const count of [1,2,3]){
 const html=renderToStaticMarkup(React.createElement(Gallery,{images:images.slice(0,count),compact}));
 assert.equal((html.match(/aria-label="Get the app to view /g)||[]).length,count);
 for(const image of images.slice(0,count))assert.ok(html.includes(`src="${image.url}"`));
}
console.log('Article and attached-thread galleries render all one, two or three provided pictures.');
