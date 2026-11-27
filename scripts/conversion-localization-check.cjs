const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),ts=require('typescript'),React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');
const cache=new Map();let language='en';
function load(relative){
 const filename=path.resolve(__dirname,'..',relative);if(cache.has(filename))return cache.get(filename).exports;
 const source=ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText;
 const module={exports:{}};cache.set(filename,module);
 function local(id){
  if(id==='next/router')return {useRouter:()=>({asPath:language==='en'?'/membership/':'/'+language+'/membership/',pathname:language==='en'?'/membership/':'/'+language+'/membership/'})};
  if(id.startsWith('.')&&id.endsWith('.json'))return require(path.resolve(path.dirname(filename),id));
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

const {translateText}=load('lib/localization/translate.ts');
const Checkout=load('components/WebsiteCheckout.tsx').default;
const {QuestionProgress}=load('components/OnboardingQuestion.tsx');
const Question=load('components/OnboardingQuestion.tsx').default;
const {onboardingQuestions}=load('lib/profile-onboarding.ts');
const {UltraMembershipView}=load('components/UltraMembershipPage.tsx');
const base={signedIn:true,checking:false,error:'',busy:false,period:'annual',accepted:false,showApp:false,onPeriod(){},onAccepted(){},onBuy(){},onRetry(){},onApp(){}};
for(language of ['en','es','de','fr','ja','ko']){
 const html=renderToStaticMarkup(React.createElement(Checkout,{onClose(){}}));
 assert.ok(html.includes(translateText('Go deeper with Pro.',language)));
 assert.ok(html.includes(translateText('Continue to secure checkout ↗',language)));
 assert.match(html,/disabled=""/);assert.match(html,/\$30/);assert.match(html,/type="checkbox"/);
 const q=renderToStaticMarkup(React.createElement(Question,{current:1,progressCurrent:2,progressTotal:4,questions:onboardingQuestions,answer:'',onSelect(){}}));
 assert.ok(q.includes(translateText('Where are you starting?',language)));assert.match(q,/aria-valuenow="2"/);assert.match(q,/aria-valuemax="4"/);
 const blocked=renderToStaticMarkup(React.createElement(UltraMembershipView,{...base,offer:{route:'onboarding_required',offersAvailable:false,membership:{hasPro:true,hasUltra:false,ultraPurchaseEligible:false}}}));
 assert.ok(blocked.includes(translateText('Complete Level 1 to unlock Ultra',language)));assert.doesNotMatch(blocked,/\$[0-9]/);
 const eligible=renderToStaticMarkup(React.createElement(UltraMembershipView,{...base,offer:{route:'stripe_switch',offersAvailable:true,membership:{status:'active',billingVerified:true,hasPro:true,hasUltra:false,ultraPurchaseEligible:true}}}));
 assert.ok(eligible.includes(translateText('Replace your Stripe Pro with Ultra',language)));assert.ok(eligible.includes(translateText('Review my Ultra upgrade →',language)));
}
console.log('Six-language checkout, consent, prices, signup progress and Ultra eligibility passed.');
