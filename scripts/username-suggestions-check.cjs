// Local Firebase doubles and a deterministic hook harness: no network, accounts or writes.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript'),React=require('react');
function load(file,modules,globals={}){
 const exports={};
 const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 vm.runInNewContext(code,{exports,require:name=>name.endsWith('.module.css')?{default:new Proxy({},{get:(_,key)=>String(key)})}:modules[name]||require(name),...globals});
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

 const main=harness(),events=[];
 const {ProfileOnboarding}=load('components/ProfileOnboarding.tsx',{react:main.hooks,'next/router':{useRouter:()=>({})},'../lib/account-devices':{},'../lib/onboarding-signal-preview':{onboardingSignalPreviews:[],lockedSignalPreviews:[]},'../lib/profile-onboarding':profile,'./TrustpilotWidget':{default:()=>null},'./OnboardingQuestion':{default:()=>null},'./UsernameSuggestions':{default:()=>null},'../lib/acquisition':{sourceOptions:[],linkWebsiteAcquisition:async()=>({needsSourceQuestion:false})},'../lib/signup-progress':{trackSignupProgress:(...args)=>events.push(args),signupErrorCode:error=>error.code||'unknown'}},{window:main.window,document:{addEventListener(){},removeEventListener(){}},URL});
 const mainProps={user:{uid:'me',displayName:'bad-name',photoURL:''},onComplete:()=>{}};
 let tree=main.render(ProfileOnboarding,mainProps);
 const continueButton=()=>nodes(tree).find(n=>n.type==='button'&&n.props.children==='Continue →');
 continueButton().props.onClick();await tick();await tick();tree=main.render(ProfileOnboarding,mainProps);
 assert(events.some(event=>event[2]==='username_characters'),'Specific validation reason must be recorded');
 assert.equal(nodes(tree).find(n=>n.type==='input'&&n.props.placeholder==='your_username').props.value,'bad_name');
 assert(nodes(tree).some(n=>n.props?.role==='status'&&String(n.props.children).includes('Updated your username')),'Correction must be visible before continuing');
 assert(continueButton(),'Automatic correction must not skip profile review');
 assert(!events.some(event=>event.includes('bad-name')),'Raw usernames must not enter telemetry');
 console.log('PASS: validation reasons, safe corrections, bounded database-checked suggestions, explicit selection, stale/account guards, collisions and offline behavior.');
})().catch(error=>{console.error(error);process.exitCode=1});
