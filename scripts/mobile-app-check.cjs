const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript'),React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');
function load(file,modules={}){const module={exports:{}};const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true,target:ts.ScriptTarget.ES2020}}).outputText;new Function('require','module','exports',code)(name=>name in modules?modules[name]:require(name),module,module.exports);return module.exports;}
const app=load('lib/mobile-app.ts'),device=load('lib/device-access.ts');
for(const [userAgent,platform,touch,url] of [['iPhone Mobile','iPhone',5,app.APPLE_STORE_URL],['iPad','iPad',5,app.APPLE_STORE_URL],['Macintosh Safari','MacIntel',5,app.APPLE_STORE_URL],['Android Mobile','Linux',5,app.GOOGLE_STORE_URL]]){
 assert.equal(device.isDesktopDevice({userAgent,platform,maxTouchPoints:touch}),false);assert.equal(app.mobileStoreUrl(userAgent),url);
}
assert.equal(device.isDesktopDevice({userAgent:'Macintosh Chrome',platform:'MacIntel',maxTouchPoints:0}),true);
assert.equal(device.isDesktopDevice({userAgent:'Windows Chrome',platform:'Win32',maxTouchPoints:0}),true);
for(const path of ['/login/?next=%2Fmembership','/membership/','/ultra/','/continue/','/account/','/signup/'])assert(app.isMobileAccountPath(path));
for(const path of ['/','/stock-market-news/','/posts/privacypolicy/','/legal/membership-2026-10-25.html'])assert(!app.isMobileAccountPath(path));
let mobile=true,path='/membership/';
const boundary=load('components/MobileAppBoundary.tsx',{
 react:{...React,useState:()=>[mobile,()=>{}],useEffect:()=>{}},'next/router':{useRouter:()=>({pathname:path})},
 'next/head':({children})=>children,'../lib/device-access':device,'../lib/mobile-app':app,
 './MobileStoreLink':()=>React.createElement('a',{href:app.APPLE_STORE_URL},'Get the app →'),'../styles/AccountLogin.module.css':{}
}).default;
function child(){throw Error('Mobile must not mount signup or checkout');}
assert.match(renderToStaticMarkup(boundary({children:React.createElement(child)})),/Get the app/);
mobile=null;assert.equal(boundary({children:React.createElement(child)}),null);
mobile=false;assert.equal(boundary({children:'Desktop signup and checkout'}).props.children,'Desktop signup and checkout');
mobile=true;path='/';assert.equal(boundary({children:'Public website'}).props.children,'Public website');
const plans=load('components/MembershipPlans.tsx',{react:{...React,useState:()=>[true,()=>{}],useEffect:()=>{}},'./SiteAccount':{useSiteAccount:()=>({user:null,ready:true,desktop:false})},'../lib/membership-status':{},'./TrustpilotWidget':()=>null,'../styles/DesktopProduct.module.css':{}}).default;
assert.equal(plans(),null);
console.log('PASS: iPhone, iPad, Android store mapping; no mobile signup/checkout mount or membership plans; desktop and public pages preserved.');
