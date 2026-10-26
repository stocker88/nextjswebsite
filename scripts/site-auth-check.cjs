const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript');
function load(file,requireFn=require){const source=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.ReactJSX}}).outputText;const exports={};vm.runInNewContext(source,{exports,require:requireFn,Promise,URL});return exports;}
const routes=load('lib/site-auth.ts');
assert.equal(routes.accountDestination('/membership/'),'/membership/');
for(const value of ['https://example.com','//example.com','javascript:alert(1)','/login/',undefined,['/membership/'],'/membership/?next=https://example.com'])assert.equal(routes.accountDestination(value),'/stock-market-heatmap/');
assert.equal(routes.accountLoginUrl('/membership/'),'/login/?next=%2Fmembership%2F');
for(const path of ['/smart-money/','/politician-trades/','/insider-trades/','/hedge-fund-activity/','/smart-money/?view=signals'])assert.equal(routes.accountDestination(path),path);
for(const path of ['/smart-money/?view=activity','/smart-money/?view=signals&next=https://evil.test','/smart-money/../'])assert.equal(routes.accountDestination(path),'/stock-market-heatmap/');
let account={user:null,ready:true,error:false};
const react=require('react');
const {AccountLink}=load('components/SiteAccount.tsx',name=>name==='react'?{...react,useContext:()=>account}:name==='../lib/site-auth'?routes:name==='../lib/site-account-hint'?load('lib/site-account-hint.ts'):name==='../lib/membership-status'?{preloadMembershipStatus:()=>Promise.resolve(null)}:name==='../lib/desktop-access'?load('lib/desktop-access.ts'):name==='../lib/content-access'?load('lib/content-access.ts'):name==='../lib/device-access'?load('lib/device-access.ts'):name==='next/router'?{useRouter:()=>({})}:name.endsWith('.css')?{}:name==='./AccountDevices'||name==='./DeviceCapacityNotice'||name==='./ProfileOnboarding'?()=>null:name==='../lib/account-devices'?{}:require(name));
assert.equal(AccountLink({destination:'/membership/',children:'Pro'}).props.href,'/membership/');
assert.equal(AccountLink({destination:'/membership/',children:'Pro'}).props['data-account-required'],'true');
account={user:{uid:'test-account'},ready:true,error:false};
assert.equal(AccountLink({destination:'/membership/',children:'Pro'}).props.href,'/membership/');
assert.equal(AccountLink({destination:'/stock-market-heatmap/',children:'Market'}).props.href,'/stock-market-heatmap/');
console.log('Account links: signed-out gating, signed-in destinations and redirect allowlist passed.');

for(const path of ['/results/options-results-slb-2026-10-23/','/stock-market-news/example--post-id/','/catalysts/earnings-preview/'])assert.equal(routes.accountDestination(path),path);
for(const path of ['/results/../','/results/%2e%2e/','/results/example/?next=https://evil.test','/results/example/#fragment'])assert.equal(routes.accountDestination(path),'/stock-market-heatmap/');
account={user:null,ready:true,error:false};
assert.equal(AccountLink({destination:'/results/options-results-slb-2026-10-23/',children:'Read'}).props.href,'/results/options-results-slb-2026-10-23/');

const device=load('lib/device-access.ts');
for(const nav of [{userAgent:'Mozilla Macintosh Chrome',platform:'MacIntel',maxTouchPoints:0},{userAgent:'Mozilla Windows NT 10.0',platform:'Win32',maxTouchPoints:10}])assert.equal(device.isDesktopDevice(nav),true);
for(const nav of [{userAgent:'Mozilla iPhone Mobile',platform:'iPhone',maxTouchPoints:5},{userAgent:'Mozilla Android',platform:'Linux',maxTouchPoints:5},{userAgent:'Mozilla Macintosh Safari',platform:'MacIntel',maxTouchPoints:5}])assert.equal(device.isDesktopDevice(nav),false);
for(const href of ['https://apps.apple.com/us/app/id1565527320','https://play.google.com/store/apps/details?id=com.newcompany.stocker','/insight_details_page?postId=123','ai.stockstobuynow://thread/123'])assert.equal(device.isAppDestination(href,'https://www.stockstobuynow.ai'),true);
for(const href of ['/stock-market-news/','https://apps.apple.com/us/app/id999999','https://play.google.com/store/apps/details?id=other'])assert.equal(device.isAppDestination(href,'https://www.stockstobuynow.ai'),false);
console.log('Desktop/mobile device detection and app destination targeting passed.');
