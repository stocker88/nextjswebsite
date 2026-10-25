const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript'),vm=require('node:vm');
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
function load(file,custom){const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText,{exports,require:custom||require,URL});return exports;}
const {signInContentKind}=load('lib/content-access.ts'),routes=load('lib/site-auth.ts');
for(const path of ['/results','/results/']){assert.equal(signInContentKind(path),'results');assert.equal(routes.accountDestination(path),'/results/');}
for(const path of ['/news/example/','/news/briefings/example/','/stock-market-news/example--post/','/catalysts/example/','/market-news/example/'])assert.equal(signInContentKind(path),'article');
for(const path of ['/news/','/stock-market-news/','/stock-market-news/page/2/','/results/options-results-crwd-2026-10-23/','/stocks/apple/'])assert.equal(signInContentKind(path),null);
assert.equal(routes.accountDestination('/stock-market-news/example--post'),'/stock-market-news/example--post/');
assert.equal(routes.accountDestination('/market-news/example'),'/market-news/example/');
assert.equal(routes.accountDestination('/stock-market-news/report--earnings_report_CRWD'),'/stock-market-news/report--earnings_report_CRWD/');
assert.equal(routes.accountDestination('/news/briefings/example/'),'/news/briefings/example/');
for(const path of ['https://bad.test/results/','//bad.test/results/','/results/../','/results/%2e%2e/'])assert.equal(routes.accountDestination(path),'/stock-market-heatmap/');
let account={ready:true,user:null,error:false};
const access=load('components/ContentAccess.tsx',name=>name==='react'?React:name==='react/jsx-runtime'?require(name):name==='next/link'?{__esModule:true,default:({href,children,...props})=>React.createElement('a',{href,...props},children)}:name==='./SiteAccount'?{useSiteAccount:()=>account}:name==='../lib/site-auth'?routes:{});
const child=React.createElement('p',null,'Protected reader content');
let html=renderToStaticMarkup(React.createElement(access.default,{destination:'/results/',kind:'results'},child));
assert(html.includes('Sign in to explore Results'));assert(html.includes('/login/?next=%2Fresults%2F'));assert(!html.includes('Protected reader content'));
account={ready:false,user:null,error:false};html=renderToStaticMarkup(React.createElement(access.default,{destination:'/news/example/'},child));assert(html.includes('Checking your access'));assert(!html.includes('Protected reader content'));
account={ready:true,user:{uid:'signed-in'},error:false};html=renderToStaticMarkup(React.createElement(access.default,{destination:'/news/example/'},child));assert(html.includes('Protected reader content'));
html=renderToStaticMarkup(React.createElement(access.ContentAccessPanel,{destination:'/results/report/',kind:'ultra',onRetry:()=>{}}));assert(html.includes('Go deeper with Ultra'));assert(html.includes('View membership'));assert(!html.includes('/login/'));
const {resultPreview}=require('./option-result-preview.cjs');
const original=require('../data/option-results.json');
for(const report of original){const preview=resultPreview({...report,privateSecret:'must-not-leak'});for(const field of ['recap','quickTake','text','privateSecret'])assert.equal(Object.hasOwn(preview,field),false);assert.equal(preview.id,report.id);assert.deepEqual(preview.images,report.images);assert.deepEqual(preview.moves,report.moves);assert(preview.previewSummary.length<=280)}
assert.deepEqual(require('../data/option-result-previews.json'),original.map(resultPreview));
console.log('PASS: reader/archive sign-in gates, safe return URLs, authenticated reader, Ultra upgrade prompt and public-only results projection.');
let stored=null,hook=0;
const resultLib=load('lib/option-results.ts',name=>name.endsWith('option-result-previews.json')?require('../data/option-result-previews.json'):require(name));
const {default:ResultCard}=load('components/OptionResultCard.tsx',name=>name==='react'?{...React,useState:()=>[hook++===0?0:stored,()=>{}]}:name==='react/jsx-runtime'?require(name):name==='./SiteAccount'?{useSiteAccount:()=>account,AccountLink:({destination,children})=>React.createElement('a',{href:destination},children)}:name==='./ContentAccess'?access:name==='../lib/option-results'?resultLib:name==='./ResearchImages'?{__esModule:true,default:({images})=>React.createElement('figure',null,images.map(image=>React.createElement('img',{key:image.url,src:image.url})))}:name==='./OptionResultPayoff'?{__esModule:true,default:()=>React.createElement('div',null,'Full payoff tool')}:name==='./ShareControl'?()=>null:{});
const preview=resultLib.optionResults[0],data={recap:['Verified member-only analysis'],quickTake:'Verified member-only take',accessUntil:null};
function renderCard(user,state){account={user,ready:true,error:false};stored=state;hook=0;return renderToStaticMarkup(React.createElement(ResultCard,{result:preview}))}
for(const state of [null,{uid:'reader',id:preview.id,denied:true},{uid:'reader',id:preview.id,error:true},{uid:'another-account',id:preview.id,data}]){
 const html=renderCard({uid:'reader'},state);assert(!html.includes('Verified member-only analysis'));assert(!html.includes('Full payoff tool'));assert(html.includes('<figure>'));
}
html=renderCard(null,{uid:'reader',id:preview.id,data});assert(html.includes('Sign in'));assert(!html.includes('Verified member-only analysis'));
html=renderCard({uid:'reader'},{uid:'reader',id:preview.id,data});assert(html.includes('Verified member-only analysis'));assert(html.includes('What happened'));assert(html.includes('Full payoff tool'));
console.log('PASS: signed-out, checking, non-Ultra, outage and account-switch states cannot render full analysis; verified Ultra renders it.');
