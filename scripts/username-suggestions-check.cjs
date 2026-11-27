// Local Firebase doubles and a deterministic hook harness: no network, accounts or writes.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript'),React=require('react');
function load(file,modules,globals={}){
 const exports={};
 const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 vm.runInNewContext(code,{exports,require:name=>name.includes('localization/LocalizedContent')?{default:({children})=>React.createElement(React.Fragment,null,children)}:name.includes('localization/LanguageSelector')?{default:()=>null}:name.includes('localization/client-language')?{clientLanguage:()=> 'en'}:name.endsWith('.module.css')?{default:new Proxy({},{get:(_,key)=>String(key)})}:modules[name]||require(name),...globals});
 return exports;
}
let occupied=[],calls=[],fail=false;
const sdk={getFirestore:()=>({}),collection:()=> 'users',where:(field,op,value)=>({field,op,value}),limit:()=>({}),query:(_,condition)=>condition,
 getDocs:async query=>{calls.push(query);if(fail)throw Error('offline');return {docs:occupied.filter(row=>query.op==='in'?query.value.includes(row.name):query.value===row.name).map(row=>({id:row.uid,data:()=>({userName:row.name})}))}}};
const profile=load('lib/profile-onboarding.ts',{'./site-auth':{getSiteAuth:async()=>({app:{}})},'./site-account-hint':{},'firebase/firestore':sdk});
function harness(){
 let slots=[],cursor=0,effects=[],timers=new Map(),nextTimer=0;
 const hooks={...React,useState:initial=>{const i=cursor++;if(!(i in slots))slots[i]=typeof initial==='function'?initial():initial;return [slots[i],value=>{slots[i]=typeof value==='function'?value(slots[i]):value}]},
 useRef:initial=>{const i=cursor++;return slots[i]||(slots[i]={current:initial})},useMemo:fn=>fn(),
 useEffect:(fn,deps)=>{const i=cursor++,old=slots[i];if(!old||deps.some((value,n)=>value!==old.deps[n]))effects.push(()=>{old?.cleanup?.();slots[i]={deps,cleanup:fn()}})}};
 return {hooks,window:{setTimeout:fn=>{timers.set(++nextTimer,fn);return nextTimer},clearTimeout:id=>timers.delete(id)},
 render:(Component,props)=>{cursor=0;const tree=Component(props);effects.splice(0).forEach(fn=>fn());return tree},
 timers:()=>{const pending=[...timers.values()];timers.clear();pending.forEach(fn=>fn())}};
}
function nodes(tree){if(!tree||typeof tree!=='object')return [];return [tree,...React.Children.toArray(tree.props?.children).flatMap(nodes)]}
const tick=()=>new Promise(resolve=>setImmediate(resolve));
(async()=>{
 const cases=[['','username_empty'],['someone@example.com','username_email_or_url'],['bad-name','username_characters'],['abc123456','username_too_many_digits'],['abcdefghijklmnop','username_too_long'],['good_name','']];
 for(const [name,reason] of cases)assert.equal(profile.usernameValidationCode(name),reason);
 for(const name of ['José!','abc123456789','a'.repeat(50),'hello@example.com','👋','12345_name','a']){
  const candidates=profile.usernameCandidates(name);assert(candidates.length<=9);
  for(const candidate of candidates){assert.equal(profile.usernameValidationMessage(candidate),'');assert(candidate!==profile.normalizeUsername(name))}
 }
 const candidates=profile.usernameCandidates('tester');
 occupied=[{name:candidates[0],uid:'someone-else'}];calls=[];
 const suggested=await profile.availableUsernameSuggestions('tester','me');
 assert.equal(calls.length,1);assert.equal(calls[0].op,'in');assert.equal(suggested.length,2);assert(!suggested.includes(candidates[0]));
 occupied=candidates.map(name=>({name,uid:'someone-else'}));assert.equal((await profile.availableUsernameSuggestions('tester','me')).length,0);
 occupied=[{name:candidates[0],uid:'me'}];assert.equal((await profile.availableUsernameSuggestions('tester','me'))[0],candidates[0]);
 fail=true;await assert.rejects(profile.availableUsernameSuggestions('tester','me'),/offline/);fail=false;occupied=[];

 const h=harness(),pending=[],selected=[];
 const Suggest=load('components/UsernameSuggestions.tsx',{react:h.hooks,'../lib/profile-onboarding':{availableUsernameSuggestions:(value,uid)=>new Promise((resolve,reject)=>pending.push({value,uid,resolve,reject}))}},{window:h.window}).default;
 let props={value:'old',uid:'me',enabled:true,onSelect:name=>selected.push(name)};
 h.render(Suggest,props);h.timers();
 props={...props,value:'new'};h.render(Suggest,props);h.timers();
 pending[0].resolve(['old_hi']);await tick();assert(!nodes(h.render(Suggest,props)).some(n=>n.type==='button'),'Stale input must not display suggestions');
 pending[1].resolve(['new_hi']);await tick();let button=nodes(h.render(Suggest,props)).find(n=>n.type==='button');assert(button);assert.equal(selected.length,0,'No silent replacement');button.props.onClick();assert.deepEqual(selected,['new_hi']);
 props={...props,uid:'another'};assert(!nodes(h.render(Suggest,props)).some(n=>n.type==='button'),'Suggestions are account scoped');h.timers();pending[2].reject(Error('offline'));await tick();assert(!nodes(h.render(Suggest,props)).some(n=>n.type==='button'));
 props={...props,enabled:false};assert.equal(h.render(Suggest,props),null);

 for(const sourceNeeded of [true,false,'offline']){
 const main=harness(),events=[],saved=[],linked=[];
 const questionView=()=>null;
 const {ProfileOnboarding}=load('components/ProfileOnboarding.tsx',{react:main.hooks,'next/router':{useRouter:()=>({})},'../lib/site-auth':{profileCompletionDestination:()=>'/membership/?from=onboarding'},'../lib/account-devices':{},'../lib/onboarding-signal-preview':{onboardingSignalPreviews:[],lockedSignalPreviews:[]},'../lib/profile-onboarding':{...profile,completeProfileOnboarding:async(user,data)=>saved.push(data)},'./TrustpilotWidget':{default:()=>null},'./OnboardingQuestion':{default:questionView,QuestionProgress:()=>null},'../lib/acquisition':{sourceOptions:[['google','Google search']],linkWebsiteAcquisition:async(uid,source)=>{linked.push(source);if(sourceNeeded==='offline')throw Error('offline');return {needsSourceQuestion:sourceNeeded}}},'../lib/signup-progress':{observeSignupStep:()=>()=>{},trackSignupProgress:(...args)=>events.push(args),signupErrorCode:error=>error.code||'unknown'}},{window:main.window,document:{},URL});
 const props={user:{uid:'me',displayName:'bad-name'},onComplete:()=>saved.push('complete')};
 let tree=main.render(ProfileOnboarding,props);await tick();await tick();tree=main.render(ProfileOnboarding,props);
 assert(!nodes(tree).some(n=>n.type==='input'),'No manual username screen');
 if(sourceNeeded){
  assert(nodes(tree).some(n=>n.type==='h1'&&n.props.children==='How did you discover us?'));
  nodes(tree).find(n=>n.type==='button'&&Array.isArray(n.props.children)&&n.props.children[0]==='Google search').props.onClick();
  tree=main.render(ProfileOnboarding,props);
  nodes(tree).find(n=>n.type==='button'&&n.props.children==='Continue →').props.onClick();
 }
 for(let i=1;i<=3;i++){
  tree=main.render(ProfileOnboarding,props);const question=nodes(tree).find(n=>n.type===questionView);
  assert.equal(question.props.progressCurrent,i+(sourceNeeded?1:0));assert.equal(question.props.progressTotal,sourceNeeded?4:3);
  if(i===1)assert.equal(typeof question.props.onBack,sourceNeeded?'function':'undefined');
  question.props.onSelect(profile.onboardingQuestions[i-1].options[0]);
 }
 tree=main.render(ProfileOnboarding,props);
 nodes(tree).find(n=>n.type==='button'&&n.props.children==='Receive new signals now →').props.onClick();await tick();
 assert.equal(saved[0].userName,'bad_name');assert.equal(saved[0].heardFrom,sourceNeeded?'google':'');assert.equal(saved[1],'complete');
 assert(!events.some(event=>event.includes('bad-name')));
 }
 console.log('PASS: validation reasons, safe corrections, bounded database-checked suggestions, explicit selection, stale/account guards, collisions and offline behavior.');
})().catch(error=>{console.error(error);process.exitCode=1});
