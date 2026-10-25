const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),ts=require('typescript'),React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');
const cache=new Map();
function load(relative){
 const filename=path.resolve(__dirname,'..',relative);if(cache.has(filename))return cache.get(filename).exports;
 const source=ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText;
 const module={exports:{}};cache.set(filename,module);
 function local(id){
  if(id.endsWith('.css'))return new Proxy({__esModule:true,default:{}},{get:(_,name)=>name==='default'?new Proxy({},{get:(_,key)=>String(key)}):undefined});
  if(id==='next/head')return {__esModule:true,default:({children})=>React.createElement(React.Fragment,null,children)};
  if(id==='next/link')return {__esModule:true,default:({href,children,...rest})=>React.createElement('a',{href,...rest},children)};
  if(id==='./SiteAccount')return {useSiteAccount:()=>({user:null,ready:true}),AccountLink:({destination,children,...props})=>React.createElement('a',{href:destination,...props},children)};
  if(id==='./layout/Header'||id==='./AppDownloadModal')return {__esModule:true,default:()=>null};
  if(id==='../lib/site-auth'||id==='./site-auth')return {accountLoginUrl:destination=>'/login/?next='+encodeURIComponent(destination),getSiteAuth:()=>{throw Error('No browser auth in SSR test')}};
  if(id.startsWith('.')){const base=path.resolve(path.dirname(filename),id);for(const ext of ['.tsx','.ts'])if(fs.existsSync(base+ext))return load(path.relative(path.resolve(__dirname,'..'),base+ext));}
  return require(id);
 }
 new Function('require','module','exports',source)(local,module,module.exports);return module.exports;
}
const {MembershipView}=load('components/MembershipStatusPage.tsx');
const draw=(membership,props={})=>renderToStaticMarkup(React.createElement(MembershipView,{membership,loading:false,error:false,onRetry:()=>{},onExplorePro:()=>{},...props}));
const base={status:'active',isActive:true,checkedAt:'2026-10-25T00:00:00Z',subscriptions:[{provider:'apple',productId:'annual',planName:'Pro · Annual',billingPeriod:'Annual',status:'active',expiresAt:'2027-01-01T00:00:00Z',willRenew:false,managementUrl:'https://apps.apple.com/account/subscriptions'}]};
let html=draw(base);assert.match(html,/Pro · Annual/);assert.match(html,/Apple App Store/);assert.match(html,/Renewal is off/);assert.match(html,/Manage subscription/);assert.doesNotMatch(html,/Your current plan · Free|Explore Pro|\$30/);
html=draw({...base,subscriptions:[{...base.subscriptions[0],provider:'stripe',willRenew:true,managementUrl:null}]});assert.match(html,/Stripe/);assert.match(html,/Renews on/);assert.match(html,/Manage subscription/);
html=draw({...base,subscriptions:[{...base.subscriptions[0],status:'trialing'}]});assert.match(html,/Trial active/);assert.match(html,/Trial ends/);
html=draw({...base,subscriptions:[{...base.subscriptions[0],managementUrl:'javascript:alert(1)'}]});assert.doesNotMatch(html,/javascript:|Manage subscription/);
html=draw({...base,status:'unknown',isActive:false,subscriptions:[]});assert.match(html,/Check membership again/);assert.doesNotMatch(html,/Explore Pro|\$30/);
html=draw(null,{loading:true});assert.match(html,/aria-busy="true"/);assert.doesNotMatch(html,/Explore Pro|\$30/);
html=draw({...base,status:'inactive',isActive:false,subscriptions:[]});assert.match(html,/YOUR CURRENT PLAN · FREE/);assert.match(html,/Explore Pro/);assert.match(html,/\$30/);assert.match(html,/\$20/);
console.log('Membership UI checks passed: active, cancellation, trial, Stripe, unsafe links, loading, unknown and Free/Pro states.');
const {StripeBillingView,RetentionOfferView}=load('components/StripeMembershipManager.tsx');
const billing={defaultCard:null,checkedAt:0,subscriptions:[{id:'sub_example',status:'active',billingPeriod:'Monthly',unitAmount:3000,currency:'usd',interval:'month',intervalCount:1,currentPeriodEnd:1795521600,cancelAtPeriodEnd:false,card:{brand:'visa',last4:'4242',expMonth:10,expYear:2030},nextInvoice:{amountDue:2400,currency:'usd'},canCancel:true}]};
const billingHtml=value=>renderToStaticMarkup(React.createElement(StripeBillingView,{details:value,busy:false,onCard:()=>{},onInvoices:()=>{},onCancel:()=>{}}));
html=billingHtml(billing);assert.match(html,/4242/);assert.match(html,/Change card/);assert.match(html,/Invoices &amp; billing details/);assert.match(html,/Cancel membership/);assert.match(html,/Estimated next payment/);assert.match(html,/\$24.00/);assert.doesNotMatch(html,/sub_example/);
html=billingHtml({...billing,subscriptions:[{...billing.subscriptions[0],cancelAtPeriodEnd:true,canCancel:false}]});assert.doesNotMatch(html,/Cancel membership/);assert.match(html,/Renewal off/);assert.match(html,/Change card/);
const offerHtml=seconds=>renderToStaticMarkup(React.createElement(RetentionOfferView,{remainingSeconds:seconds,onContinue:()=>{},onBack:()=>{},busy:false}));
html=offerHtml(3599);assert.match(html,/59:59/);assert.match(html,/next renewal only/);assert.match(html,/does not apply to annual/);assert.match(html,/Nothing changes until you confirm/);
html=offerHtml(0);assert.match(html,/This offer has expired/);assert.match(html,/still continue to cancellation/);assert.doesNotMatch(html,/20% off one more month/);
console.log('Stripe management UI checks passed: masked cards, invoice estimates, cancellation, renewal-off state and expiring retention offer.');
const MembershipAppAccess=load('components/MembershipAppAccess.tsx').default;
html=renderToStaticMarkup(React.createElement(MembershipAppAccess,{purchased:true,pro:true,onGetApp:()=>{}}));
assert.match(html,/PAYMENT CONFIRMED/);assert.match(html,/same account you used here/);assert.match(html,/Get the App/);assert.match(html,/December 1, 2026/);assert.match(html,/live video demo/);assert.match(html,/Add to my calendar/);assert.match(html,/All-day event/);assert.match(html,/\/calendar\/pro-web-launch.ics/);
html=renderToStaticMarkup(React.createElement(MembershipAppAccess,{onGetApp:()=>{}}));assert.doesNotMatch(html,/PAYMENT CONFIRMED|Your payment is confirmed/);assert.match(html,/Get the App/);
html=draw({...base,status:'inactive',isActive:false,subscriptions:[]},{paymentPending:true});assert.match(html,/confirming your payment/);assert.match(html,/Check payment again/);assert.doesNotMatch(html,/Explore Pro|PAYMENT CONFIRMED/);
const calendar=load('lib/pro-web-launch.ts'),google=new URL(calendar.proLaunchGoogleCalendarUrl());assert.equal(google.hostname,'calendar.google.com');assert.equal(google.searchParams.get('dates'),'20261201/20261202');assert.match(google.searchParams.get('details'),/Demo time and viewing link will be announced/);
const icsBytes=fs.readFileSync(path.resolve(__dirname,'../public/calendar/pro-web-launch.ics')),ics=icsBytes.toString('utf8');assert.ok(ics.endsWith('\r\n'));assert.ok(ics.split('\r\n').every(line=>Buffer.byteLength(line)<=75));
const unfolded=ics.replace(/\r\n /g,'');assert.match(unfolded,/DTSTART;VALUE=DATE:20261201/);assert.match(unfolded,/DTEND;VALUE=DATE:20261202/);assert.match(unfolded,/UID:pro-web-launch-20261201@stockstobuynow.ai/);assert.doesNotMatch(unfolded,/DTSTART:.*T/);assert.match(unfolded,/Demo time and viewing link will be announced/);
console.log('Post-payment and launch checks passed: app/same-account instructions, pending-payment guard, Google Calendar and all-day ICS export.');
html=draw({...base,subscriptions:[{...base.subscriptions[0],provider:'stripe',status:'grace_period'}]});assert.match(html,/Payment needs attention/);assert.match(html,/48-hour grace/);assert.match(html,/Payment grace ends/);assert.doesNotMatch(html,/Renews on/);
html=renderToStaticMarkup(React.createElement(StripeBillingView,{details:{...billing,subscriptions:[{...billing.subscriptions[0],canSwitch:true}]},busy:false,onCard:()=>{},onInvoices:()=>{},onCancel:()=>{},onSwitch:()=>{}}));assert.match(html,/Switch to annual/);assert.match(html,/Stripe shows your next charge before you confirm/);
html=renderToStaticMarkup(React.createElement(StripeBillingView,{details:{...billing,subscriptions:[{...billing.subscriptions[0],canRestore:true,cancelAtPeriodEnd:true,canCancel:false}]},busy:false,onCard:()=>{},onInvoices:()=>{},onCancel:()=>{},onRestore:()=>{}}));assert.match(html,/Restore renewal/);
const WebsiteCheckout=load('components/WebsiteCheckout.tsx').default;
html=renderToStaticMarkup(React.createElement(WebsiteCheckout,{onClose:()=>{}}));assert.match(html,/type="checkbox"/);assert.match(html,/No automatic refunds for unused time/);assert.match(html,/disabled=""[^>]*>Continue to secure checkout/);
const crypto=require('node:crypto'),policyBytes=fs.readFileSync(path.resolve(__dirname,'../data/legal/membership-2026-10-25.json')),policy=JSON.parse(policyBytes),policyHtml=fs.readFileSync(path.resolve(__dirname,'../public/legal/membership-2026-10-25.html'),'utf8');
assert.ok(policyHtml.includes(crypto.createHash('sha256').update(policyBytes).digest('hex')));assert.equal(policy.version,'membership-2026-10-25');for(const section of policy.sections)assert.ok(policyHtml.includes('id="'+section.id+'"'));
console.log('Billing upgrade UI checks passed: recovery notice, plan switching, renewal restoration, unchecked purchase consent and immutable policy snapshot.');

html=draw({...base,status:'inactive',isActive:false,needsPaymentUpdate:true,subscriptions:[]});assert.match(html,/restore your Pro access/);assert.doesNotMatch(html,/Explore Pro|YOUR CURRENT PLAN/);

const {PlanSwitchConfirmationView}=load('components/StripeMembershipManager.tsx');
html=renderToStaticMarkup(React.createElement(PlanSwitchConfirmationView,{preview:{subscriptionId:'sub_test',priceId:'price_test',periodEnd:1824464899,unitAmount:3000,currency:'usd',billingPeriod:'Monthly'},busy:false,onConfirm:()=>{},onBack:()=>{}}));assert.match(html,/No payment is taken now/);assert.match(html,/\$30.00/);assert.match(html,/2027/);assert.match(html,/Confirm monthly billing at renewal/);
