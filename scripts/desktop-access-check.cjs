const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript'),React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');
const memory=new Map(),storage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)};
function load(file,modules={},globals={}){
 const source=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
 const module={exports:{}};new Function('require','module','exports','sessionStorage',...Object.keys(globals),source)(name=>name in modules?modules[name]:require(name),module,module.exports,storage,...Object.values(globals));return module.exports;
}
const access=load('lib/desktop-access.ts'),routes=load('lib/site-auth.ts');
const active=provider=>({status:'active',isActive:true,subscriptions:[{provider,planName:'Pro',status:'active'}]});
const inactive={status:'inactive',isActive:false,subscriptions:[]};
assert.equal(routes.accountDestination('/continue/'),access.DESKTOP_ACCESS_PATH);
assert.equal(routes.accountDestination('/continue'),access.DESKTOP_ACCESS_PATH);
assert.equal(routes.accountDestination('/continue/?next=https://evil.test'),'/stock-market-heatmap/');
assert.equal(access.desktopAccessDecision(false,false,null),'checking');
assert.equal(access.desktopAccessDecision(true,false,active('stripe')),'login');
for(const provider of ['stripe','apple','google','revenuecat'])assert.equal(access.desktopAccessDecision(true,true,active(provider)),'download');
assert.equal(access.desktopAccessDecision(true,true,inactive),'payment');
for(const value of [null,{...inactive,status:'unknown'},{...active('stripe'),isActive:false},{...active('apple'),subscriptions:[]}])assert.equal(access.desktopAccessDecision(true,true,value),'retry');
for(const label of ['Get the App →','Download for iOS','Get App']){assert.equal(access.desktopActionLabel(label,false),'Sign Up →');assert.equal(access.desktopActionLabel(label,true),'Access your research →');}
assert.equal(access.desktopActionLabel('Open the thread in the app ↗',false),'Review the full thread now ↗');
assert.equal(access.desktopActionLabel('Open in app →',true),'Review the full research now ↗');
assert.equal(access.desktopActionLabel('Review options signals in the app →',true),'Review options signals →');
access.rememberDesktopPayment('buyer',storage,1000);
assert.equal(access.desktopPaymentPending('buyer',storage,1001),true);
assert.equal(access.desktopPaymentPending('other-user',storage,1001),false);
assert.equal(access.desktopPaymentPending('buyer',storage,999),false);
assert.equal(access.desktopPaymentPending('buyer',storage,1000+7200000),false);
access.clearDesktopPayment(storage);assert.equal(access.desktopPaymentPending('buyer',storage,1001),false);
access.rememberDesktopThread('/insight_details_page?postId=report_123',storage,1000);
assert.equal(access.desktopThread(storage,1001),'report_123');assert.equal(access.desktopThread(storage,7201000),null);
access.rememberDesktopThread('/insight_details_page?postId=https://evil.test',storage,1000);assert.equal(access.desktopThread(storage,1001),null);
access.rememberDesktopThread('/insight_details_page?postId=report_123',storage,1000);access.rememberDesktopThread(undefined,storage,1001);assert.equal(access.desktopThread(storage,1001),null);
let account={desktop:true,user:null,ready:true,error:false};
const {default:DesktopAppLink,DesktopActionText}=load('components/DesktopAppLink.tsx',{'./SiteAccount':{useSiteAccount:()=>account},'../lib/site-auth':routes,'../lib/desktop-access':access});
let calls=0;const props={href:'https://apps.apple.com/us/app/id1565527320',target:'_blank',children:'Get the app →',onClick:()=>calls++};
let link=DesktopAppLink(props);assert.equal(link.props.href,'/login/?next=%2Fcontinue%2F');assert.equal(link.props.target,undefined);link.props.onClick({});assert.equal(calls,0);assert.equal(link.props.children,'Sign Up →');
account={...account,user:{uid:'buyer'}};link=DesktopAppLink(props);assert.equal(link.props.href,'/continue/');assert.equal(link.props.children,'Access your research →');
account={...account,desktop:false};link=DesktopAppLink(props);assert.equal(link.props.href,props.href);assert.equal(link.props.target,'_blank');assert.equal(link.props.children,props.children);link.props.onClick({});assert.equal(calls,1);
assert.equal(DesktopActionText({children:'Get App',desktopLabel:'Review research'}).props.children,'Get App');
const DownloadOptions=load('components/AppDownloadOptions.tsx',{'../lib/analytics':{trackAppStoreClick:()=>{}}}).default;
const qr=renderToStaticMarkup(React.createElement(DownloadOptions,{placement:'test',showQR:true,threadId:'report_123'}));assert.match(qr,/data-desktop-download-ready="true"/);assert.match(qr,/data-store-icon="apple"/);assert.match(qr,/data-store-icon="google"/);assert.match(qr,/iPhone · App Store/);assert.match(qr,/Android · Google Play/);assert.match(qr,/selected thread/);assert.equal((qr.match(/<svg/g)||[]).length,5);
assert.equal((qr.match(/data-store-review-card=/g)||[]).length,2);
for(const expected of ['iPhone &amp; iPad reviews','Android reviews','★★★★★','Get the iPhone app','Get the Android app'])assert.match(qr,new RegExp(expected));
let effects=[],states=[],index=0;const navigations=[];const router={replace:path=>navigations.push(path)};
const page=load('components/DesktopAccessPage.tsx',{
 react:{...React,useState:initial=>[states[index++]??initial,()=>{}],useEffect:fn=>effects.push(fn)},
 'next/head':{default:({children})=>React.createElement(React.Fragment,null,children),__esModule:true},
 'next/link':{default:({href,children,...rest})=>React.createElement('a',{href,...rest},children),__esModule:true},
 'next/router':{useRouter:()=>router},'./layout/Header':{default:()=>null,__esModule:true},
 './SiteAccount':{useSiteAccount:()=>account},'./AppDownloadOptions':{default:DownloadOptions,__esModule:true},
 './MembershipAppAccess':{LaunchCalendarButton:()=>React.createElement('button',null,'Add to my calendar')},
 '../lib/membership-status':{fetchMembershipStatus:()=>Promise.resolve(inactive)},'../lib/site-auth':routes,'../lib/desktop-access':access,
 '../styles/AccountLogin.module.css':{__esModule:true,default:{}}
}).default;
function draw(user,state,ready=true){account={desktop:true,user,ready,error:false};states=[0,null,state];index=0;effects=[];return renderToStaticMarkup(page());}
let html=draw(null,null);assert.doesNotMatch(html,/<svg|Get the iPhone app/);assert.match(html,/Sign up to continue/);effects[1]();assert.equal(navigations.pop(),'/login/?next=%2Fcontinue%2F');
for(const [state,ready] of [[null,true],[{uid:'other-account',value:active('stripe'),error:false},true],[null,false]]){html=draw({uid:'buyer'},state,ready);assert.doesNotMatch(html,/<svg|Get the iPhone app|Checking/);}
html=draw({uid:'buyer'},{uid:'buyer',value:null,error:true});assert.match(html,/couldn’t be verified/);assert.doesNotMatch(html,/<svg|Choose your membership/);
html=draw({uid:'buyer'},{uid:'buyer',value:inactive,error:false});assert.doesNotMatch(html,/<svg|Get the iPhone app/);effects[2]();assert.equal(navigations.pop(),'/membership/?continue=app');assert.equal(access.desktopPaymentPending('buyer'),true);
for(const provider of ['stripe','apple','google']){html=draw({uid:'buyer'},{uid:'buyer',value:active(provider),error:false});assert.match(html,/Your membership is ready/);assert.match(html,/same account/);assert.match(html,/Scan with your phone/);assert.match(html,/data-store-icon="apple"/);assert.match(html,/data-store-icon="google"/);assert.equal((html.match(/<svg/g)||[]).length,4);effects[2]();assert.equal(access.desktopPaymentPending('buyer'),false);}
console.log('PASS: desktop login/payment/verified QR flow; Apple, Google, Stripe; outages and account changes; mobile destinations; thread and post-payment continuation.');

// Restricted pictures skip the download prompt and enter the same membership flow.
const {isDesktopDevice}=load('lib/device-access.ts');
let nav={userAgent:'Mozilla Macintosh Chrome',platform:'MacIntel',maxTouchPoints:0};
let imageUpdates=[];
const Images=load('components/ResearchImages.tsx',{
 react:{...React,useState:initial=>[initial,value=>imageUpdates.push(value)],useRef:initial=>({current:initial}),useEffect:()=>{}},
 'next/router':{useRouter:()=>({push:path=>navigations.push(path)})},'./SiteAccount':{useSiteAccount:()=>account},
 '../lib/site-auth':routes,'../lib/device-access':{isDesktopDevice},'../lib/desktop-access':access,
 './DesktopAppLink':{DesktopActionText},'./ResearchCTA':{__esModule:true,default:()=>null}
},{navigator:nav,innerWidth:1280,innerHeight:900}).default;
function findPicture(node){if(!node||typeof node!=='object')return null;if(node.type==='button'&&node.props.className==='picture')return node;for(const child of React.Children.toArray(node.props?.children)){const found=findPicture(child);if(found)return found;}return null;}
function picture(appOnly=true){imageUpdates=[];return findPicture(Images({images:[{url:'https://example.test/chart.png',filename:'Chart.png'}],appOnly}));}
const clicked={getBoundingClientRect:()=>({left:20,top:30,width:100,height:100})};
account={desktop:true,user:null,ready:true};let image=picture();assert.match(image.props['aria-label'],/Review the full research picture/);image.props.onClick({currentTarget:{getBoundingClientRect:()=>{throw Error('Should navigate before opening a lightbox')}}});assert.equal(navigations.pop(),'/login/?next=%2Fcontinue%2F');assert.equal(imageUpdates.length,0);
account={...account,user:{uid:'buyer'}};picture().props.onClick({currentTarget:clicked});assert.equal(navigations.pop(),'/continue/');assert.equal(imageUpdates.length,0);
const before=navigations.length;picture(false).props.onClick({currentTarget:clicked});assert.equal(navigations.length,before);assert.equal(imageUpdates.at(-1),0);
nav.userAgent='Mozilla iPhone Mobile';nav.platform='iPhone';nav.maxTouchPoints=5;account={...account,desktop:false};image=picture();assert.match(image.props['aria-label'],/Get the app to view/);image.props.onClick({currentTarget:clicked});assert.equal(navigations.length,before);assert.equal(imageUpdates.at(-1),0);
console.log('PASS: restricted desktop pictures enter signup/membership directly; public image zoom and mobile picture prompts stay unchanged.');
