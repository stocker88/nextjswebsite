const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript'),vm=require('node:vm');
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
function load(file,custom){const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText,{exports,require:custom||require,URL});return exports;}
const content=load('lib/content-access.ts'),{signInContentKind,contentClickDestination}=content,routes=load('lib/site-auth.ts');
for(const path of ['/results','/results/']){assert.equal(signInContentKind(path),'results');assert.equal(routes.accountDestination(path),'/results/');}
for(const path of ['/news/example/','/news/briefings/example/','/stock-market-news/example--post/','/catalysts/example/','/market-news/example/','/posts/investing/','/insider-news/example/'])assert.equal(signInContentKind(path),'article');
for(const path of ['/news/','/stock-market-news/','/stock-market-news/page/2/','/posts/privacypolicy/','/stocks/apple/'])assert.equal(signInContentKind(path),null);
assert.equal(routes.accountDestination('/stock-market-news/example--post'),'/stock-market-news/example--post/');
assert.equal(routes.accountDestination('/market-news/example'),'/market-news/example/');
assert.equal(routes.accountDestination('/stock-market-news/report--earnings_report_CRWD'),'/stock-market-news/report--earnings_report_CRWD/');
assert.equal(routes.accountDestination('/news/briefings/example/'),'/news/briefings/example/');
for(const path of ['https://bad.test/results/','//bad.test/results/','/results/../','/results/%2e%2e/'])assert.equal(routes.accountDestination(path),'/stock-market-heatmap/');
let account={ready:true,user:null,error:false};
const access=load('components/ContentAccess.tsx',name=>name==='react'?React:name==='react/jsx-runtime'?require(name):name==='next/link'?{__esModule:true,default:({href,children,...props})=>React.createElement('a',{href,...props},children)}:name==='./SiteAccount'?{useSiteAccount:()=>account}:name==='../lib/site-auth'?routes:{});
const child=React.createElement('p',null,'Public article body for direct visitors and crawlers');
const Page=load('components/ResearchPage.tsx',name=>name==='react/jsx-runtime'?require(name):name==='next/link'||name==='next/head'?{__esModule:true,default:({children,...props})=>React.createElement(name==='next/link'?'a':React.Fragment,name==='next/link'?props:null,children)}:{__esModule:true,default:()=>null}).default;
let html;
for(const path of ['/news/example/','/stock-market-news/example/','/results/']){
 html=renderToStaticMarkup(React.createElement(Page,{title:'Research',path},child));
 assert(html.includes('Public article body for direct visitors and crawlers'));
 assert(!html.includes('Sign in to continue reading'));
 assert(html.includes('index,follow,max-image-preview:large'));
}
const accountModules=name=>name==='react'?React:name==='react/jsx-runtime'?require(name):name==='next/router'?{useRouter:()=>({})}:name==='../lib/content-access'?content:name==='../lib/site-auth'?routes:{};
const {AccountLink}=load('components/SiteAccount.tsx',accountModules);
html=renderToStaticMarkup(React.createElement(AccountLink,{destination:'/news/example/'},'Read full article'));
assert(html.includes('href="/news/example/"'));assert(html.includes('data-account-required="true"'));assert(!html.includes('/login/'));
const origin='https://www.stockstobuynow.ai';
for(const path of ['/results/','/results/options-results-crwd-2026-10-23/','/news/example/','/news/briefings/example/','/posts/investing/','/market-news/example/','/insider-news/example/']){
 assert(contentClickDestination(path,origin));
 assert(routes.accountLoginUrl(contentClickDestination(path,origin)).startsWith('/login/?next='));
}
for(const path of ['/posts/privacypolicy/','/news/','/membership/','https://external.test/news/report/','mailto:support@example.com'])assert.equal(contentClickDestination(path,origin),null);
assert.equal(contentClickDestination('/news/example/#details',origin,origin+'/news/example/'),null);
assert.equal(contentClickDestination('/membership/',origin,undefined,true),'/membership/');
assert.equal(routes.accountDestination('/market-news/story/?id=story_123'),'/market-news/story/?id=story_123');
assert.equal(routes.accountDestination('/insider-news/example/'),'/insider-news/example/');
account={ready:true,user:{uid:'signed-in'},error:false};
html=renderToStaticMarkup(React.createElement(access.ContentAccessPanel,{destination:'/results/report/',kind:'ultra',onRetry:()=>{}}));assert(html.includes('Get Ultra'));assert(html.includes('Get Ultra')&&html.includes('/ultra/'));assert(!html.includes('/login/'));
html=renderToStaticMarkup(React.createElement(access.ContentAccessPanel,{destination:'/results/report/',kind:'ultra',checking:true,onRetry:()=>{}}));assert.equal(html,'');assert(!html.includes('Checking your access'));
const {resultPreview}=require('./option-result-preview.cjs');
const original=require('../data/option-results.json');
for(const report of original){const preview=resultPreview({...report,privateSecret:'must-not-leak'});for(const field of ['recap','quickTake','text','privateSecret'])assert.equal(Object.hasOwn(preview,field),false);assert.equal(preview.id,report.id);assert.deepEqual(preview.images,report.images);assert.deepEqual(preview.moves,report.moves);assert(preview.previewSummary.length<=280)}
assert.deepEqual(require('../data/option-result-previews.json'),original.map(resultPreview));
console.log('PASS: public server-rendered readers, crawlable links, click-only route coverage, safe return URLs, Ultra upgrade prompt and public-only results projection.');
let stored=null,hook=0,cachedResult=null,cachedMembership=null;
const resultLib=load('lib/option-results.ts',name=>name.endsWith('option-result-previews.json')?require('../data/option-result-previews.json'):require(name));
const {default:ResultCard}=load('components/OptionResultCard.tsx',name=>name==='react'?{...React,useState:()=>[hook++===0?0:stored,()=>{}]}:name==='react/jsx-runtime'?require(name):name==='./SiteAccount'?{useSiteAccount:()=>account,AccountLink:({destination,children})=>React.createElement('a',{href:destination},children)}:name==='./ContentAccess'?access:name==='../lib/member-content'?{lastKnownResultMemberContent:()=>cachedResult,clearResultMemberContent:()=>{},fetchResultMemberContent:()=>Promise.reject()}:name==='../lib/membership-status'?{lastKnownMembershipStatus:()=>cachedMembership}:name==='../lib/option-results'?resultLib:name==='./ResearchImages'?{__esModule:true,default:({images})=>React.createElement('figure',null,images.map(image=>React.createElement('img',{key:image.url,src:image.url})))}:name==='./OptionResultPayoff'?{__esModule:true,default:()=>React.createElement('div',null,'Full payoff tool')}:name==='./ShareControl'?()=>null:{});
const preview=resultLib.optionResults[0],data={recap:['Verified member-only analysis'],quickTake:'Verified member-only take',accessUntil:null};
function renderCard(user,state,cache=null,membership=null){account={user,ready:true,error:false};stored=state;cachedResult=cache;cachedMembership=membership;hook=0;return renderToStaticMarkup(React.createElement(ResultCard,{result:preview}))}
for(const state of [null,{uid:'reader',id:preview.id,denied:true},{uid:'reader',id:preview.id,error:true},{uid:'another-account',id:preview.id,data}]){
 const html=renderCard({uid:'reader'},state);assert(!html.includes('Verified member-only analysis'));assert(!html.includes('Full payoff tool'));assert(!html.includes('<figure>'));
}
html=renderCard(null,{uid:'reader',id:preview.id,data});assert(html.includes('Sign in'));assert(!html.includes('Verified member-only analysis'));
html=renderCard({uid:'reader'},{uid:'reader',id:preview.id,data});assert(html.includes('Verified member-only analysis'));assert(html.includes('What happened'));assert(html.includes('Full payoff tool'));
html=renderCard({uid:'reader'},null,data,{status:'active',isActive:true,hasUltra:true});assert(html.includes('Verified member-only analysis'));assert(html.includes('Full payoff tool'));
html=renderCard({uid:'reader'},null,null,{status:'active',isActive:true,hasPro:true,hasUltra:false});assert(html.includes('Get Ultra'));assert(!html.includes('Full payoff tool'));
html=renderCard({uid:'reader'},null,data,{status:'inactive',isActive:false,hasPro:false,hasUltra:false});assert(html.includes('Get Pro'));assert(!html.includes('Verified member-only analysis'));
console.log('PASS: signed-out, checking, non-Ultra, outage and account-switch states cannot render full analysis; verified and cached Ultra render immediately.');
