// Public pages must survive auth resolving without a user, including in social browsers.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const ts=require('typescript'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
function load(file,resolve){
 const exports={};
 vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{
  compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2020,esModuleInterop:true}
 }).outputText,{exports,require:resolve});
 return exports;
}
const {bandAccess}=load('lib/band-access.ts',require);
function render(account,verified=null){
 let hook=0;
 const {default:Component}=load('components/StockSmartMoney.tsx',id=>{
  if(id==='react')return {...React,useState:initial=>[hook++===0?verified:initial,()=>{}],useEffect:()=>{}};
  if(id==='./SiteAccount')return {useSiteAccount:()=>account};
  if(id==='../lib/band-access')return {bandAccess};
  if(id==='../lib/site-auth')return {accountLoginUrl:()=>'/login/?next=%2Fmembership%2F'};
  if(id==='../lib/membership-status')return {};
  if(id==='../lib/smart-money')return {};
  if(id.endsWith('.module.css'))return {};
  return require(id);
 });
 return renderToStaticMarkup(React.createElement(Component,{symbol:'PLTR'}));
}
const paid={status:'active',billingVerified:true,isActive:true,hasPro:true};
assert.match(render({ready:true,user:null}),/Sign in to access Pro/);
assert.match(render({ready:false,user:null}),/Smart Money activity/);
assert.match(render({ready:true,user:{uid:'a'}}),/Smart Money activity/);
assert.doesNotMatch(render({ready:true,user:{uid:'a'}},{uid:'a',status:paid}),/Get Pro/);
assert.match(render({ready:true,user:{uid:'a'}},{uid:'b',status:paid}),/Get Pro/);
assert.match(render({ready:true,user:null},{uid:'a',status:paid}),/Sign in to access Pro/);
assert.match(render({ready:true,user:{uid:'a'}},{uid:'a',status:{status:'inactive',billingVerified:true,isActive:false,hasPro:false}}),/Get Pro/);

// Public URLs are deliberately absent from Apple's app-route allowlist.
const association=JSON.parse(fs.readFileSync('public/.well-known/apple-app-site-association','utf8'));
for(const detail of association.applinks.details){
 const paths=detail.components.map(rule=>rule['/']);
 assert.ok(paths.every(path=>typeof path==='string'&&!/[?*]/.test(path)), 'Only exact, intentional app paths may claim universal links');
 const opensApp=url=>paths.includes(new URL(url,'https://www.stockstobuynow.ai').pathname);
 for(const path of ['/','/news/example/','/stock-market-news/example/','/research/','/results/example/','/stocks/NVDA/','/earnings-calendar/?symbol=NVDA','/signals/','/options-prediction/','/membership/','/login/','/signup/','/?referrerUid=example&utm_source=twitter']){
  assert.equal(opensApp(path),false,`${path} must stay on the website`);
 }
 for(const path of ['/insight_details_page','/stock_page','/s','/invite_code_path','/userIdPassed']){
  assert.equal(opensApp(path+'?referrerUid=example'),true);
  assert.equal(opensApp(path+'/'),true);
 }
}
console.log('PASS public-page auth transitions, account isolation, and website/app link separation');
