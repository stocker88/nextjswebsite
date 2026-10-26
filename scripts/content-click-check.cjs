const fs=require('node:fs'),assert=require('node:assert/strict'),ts=require('typescript'),React=require('react');
function load(file,modules={},globals={}){
 const source=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
 const module={exports:{}};new Function('require','module','exports',...Object.keys(globals),source)(name=>name in modules?modules[name]:require(name),module,module.exports,...Object.values(globals));return module.exports;
}
const content=load('lib/content-access.ts'),routes=load('lib/site-auth.ts');
const origin='https://www.stockstobuynow.ai';
class Element{}
class Anchor extends Element{
 constructor(href,props={}){super();this.href=new URL(href,origin).href;this.target='';this.dataset={};Object.assign(this,props);}
 closest(selector){return selector==='a[href]'?this:null;}
 hasAttribute(name){return name==='download'&&this.download===true;}
}
const settle=()=>new Promise(resolve=>setImmediate(resolve));
async function run({desktop=false,user=null,ready=true,persistedUser=null}={}){
 const effects=[],events=new Map(),pushed=[],opened=[];
 const window={addEventListener:(type,fn)=>events.set(type,fn),removeEventListener:()=>{},open:()=>{
   const page={opener:{},location:{replace:value=>opened.push(value)}};return page;
 }};
 const state={user,ready,error:false};
 const react={...React,useCallback:fn=>fn,useEffect:fn=>effects.push(fn),useState:initial=>[initial&&typeof initial==='object'&&'ready' in initial?state:initial,()=>{}]};
 const {SiteAccountProvider}=load('components/SiteAccount.tsx',{
  react,'react/jsx-runtime':require('react/jsx-runtime'),'next/router':{useRouter:()=>({push:value=>pushed.push(value)})},
  '../lib/content-access':content,'../lib/site-auth':{...routes,getSiteAuth:async()=>({authStateReady:async()=>{},currentUser:persistedUser})},
  '../lib/site-account-hint':{},'../lib/membership-status':{preloadMembershipStatus:()=>Promise.resolve(null)},'./ProfileOnboarding':()=>null,
  '../lib/desktop-access':load('lib/desktop-access.ts'),'../lib/device-access':{isDesktopDevice:()=>desktop,isAppDestination:()=>false},
  './AccountDevices':{},'./DeviceCapacityNotice':{},'../lib/account-devices':{},'../styles/AccountLogin.module.css':{}
 },{Element,HTMLAnchorElement:Anchor,window,navigator:{},location:{origin,href:origin+'/stock-market-heatmap/'}});
 SiteAccountProvider({children:null});effects.at(-1)();
 async function click(href,props={},eventProps={}){
  let prevented=false;
  events.get(eventProps.type||'click')({target:new Anchor(href,props),button:0,...eventProps,
   preventDefault:()=>prevented=true,stopImmediatePropagation:()=>{}});
  await settle();return prevented;
 }
 return {click,pushed,opened};
}
(async()=>{
 for(const desktop of [false,true]){
  for(const path of ['/results/','/results/options-results-crwd-2026-10-23/','/news/example/','/market-news/example/','/stock-market-news/example/','/catalysts/example/','/posts/investing/','/insider-news/example/']){
   const test=await run({desktop});assert.equal(await test.click(path),true);assert.equal(test.pushed[0],routes.accountLoginUrl(path));
  }
  const membership=await run({desktop});await membership.click('/membership/',{dataset:{accountRequired:'true'}});assert.deepEqual(membership.pushed,[routes.accountLoginUrl('/membership/')]);
  const signed=await run({desktop,user:{uid:'reader'}});assert.equal(await signed.click('/news/example/'),false);assert.deepEqual(signed.pushed,[]);
  const checkout=await run({desktop,user:{uid:'reader'}});assert.equal(await checkout.click('/membership/',{dataset:{localAccountAction:'true'}}),false);assert.deepEqual(checkout.pushed,[]);
 }
 const early=await run({ready:false,persistedUser:{uid:'reader'}});await early.click('/news/example/');assert.deepEqual(early.pushed,['/news/example/']);
 const blank=await run();await blank.click('/news/example/',{target:'_blank'});assert.deepEqual(blank.opened,[routes.accountLoginUrl('/news/example/')]);assert.deepEqual(blank.pushed,[]);
 const middle=await run();await middle.click('/results/',{},{button:1,type:'auxclick'});assert.deepEqual(middle.opened,[routes.accountLoginUrl('/results/')]);
 const right=await run();assert.equal(await right.click('/news/example/',{},{button:2,type:'auxclick'}),false);assert.deepEqual(right.pushed,[]);
 const story=await run();await story.click('/market-news/story/?id=story_123');assert.deepEqual(story.pushed,[routes.accountLoginUrl('/market-news/story/?id=story_123')]);
 for(const [path,props] of [['https://publisher.test/news/item',{}],['/posts/privacypolicy/',{}],['/news/',{}],['/news/example/',{download:true}]]){
  const test=await run();assert.equal(await test.click(path,props),false);assert.deepEqual(test.pushed,[]);
 }
 console.log('PASS: actual click handlers gate article/results clicks on desktop and mobile, retain signed-in navigation, wait for persisted auth, handle new-tab/middle clicks and preserve public/direct links.');
})().catch(error=>{console.error(error);process.exitCode=1});
