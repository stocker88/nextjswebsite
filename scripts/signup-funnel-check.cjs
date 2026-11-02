const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript');
const compile=file=>ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const qexports={};vm.runInNewContext(compile('lib/signup-progress-queue.ts'),{exports:qexports,Date});
const {SignupProgressQueue}=qexports;
const tick=()=>new Promise(resolve=>setImmediate(resolve));
async function main(){
 let saved=[],sent=[];const now=Date.now();
 const q=new SignupProgressQueue(events=>saved=[...events],[],()=>now);
 const data={eventId:'event123456',clientAt:now};q.add(data);q.add(data);assert.equal(saved.length,1);
 assert.equal(await q.flush(async()=>{throw Error('offline')},()=>true),false);assert.equal(saved.length,1);
 await q.flush(async e=>sent.push(e),()=>false);assert.equal(sent.length,0);
 await q.flush(async e=>sent.push(e),()=>true);assert.equal(sent.length,1);assert.equal(saved.length,0);
 q.add({...data,eventId:'expired',clientAt:now-86400001});await q.flush(async()=>{throw Error('must not send expired')},()=>true);assert.equal(saved.length,0);
 for(let i=0;i<110;i++)q.add({...data,eventId:'event_'+i});assert.equal(saved.length,100);
 // Real controller with mocked transports/browser: distinguish auth restore,
 // explicit provider click/success, and visible time from background time.
 let clock=0,auth={currentUser:{uid:'alice',getIdToken:async()=>'test-token'},app:{}},events=[],anonymous=[];
 const storage=()=>{const data=new Map();return {getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)}};
 const target=()=>{const listeners=new Map();return {addEventListener:(k,f)=>{if(!listeners.has(k))listeners.set(k,new Set());listeners.get(k).add(f)},removeEventListener:(k,f)=>listeners.get(k)?.delete(f),fire:k=>[...(listeners.get(k)||[])].forEach(f=>f())}};
 const document={...target(),hidden:false},window=target(),exports={};
 vm.runInNewContext(compile('lib/signup-progress.ts'),{exports,require:name=>name==='./site-auth'?{getSiteAuth:async()=>auth}:name==='./acquisition'?{recordSignupAttempt:e=>anonymous.push(e)}:name==='./signup-progress-queue'?qexports:name==='firebase/functions'?{getFunctions:()=>({}),httpsCallable:()=>async e=>events.push({uid:auth.currentUser.uid,...e})}:require(name),fetch:async(url,options)=>{assert.equal(options.keepalive,true);assert.equal(options.headers.Authorization,'Bearer test-token');events.push({uid:auth.currentUser.uid,...JSON.parse(options.body).data});return{ok:true,json:async()=>({result:{saved:true}})}},crypto:require('node:crypto').webcrypto,sessionStorage:storage(),localStorage:storage(),window,document,performance:{now:()=>clock},Date,setTimeout,clearTimeout});
 exports.activateSignupTracking('alice');await tick();exports.activateSignupTracking('alice');await tick();assert.equal(events.filter(e=>e.step==='auth_session').length,1);
 const stop=exports.observeSignupStep('profile');await tick();clock=1200;document.hidden=true;document.fire('visibilitychange');await tick();
 clock=9000;document.hidden=false;document.fire('visibilitychange');await tick();clock=9500;stop();await tick();
 assert.equal(events.filter(e=>e.durationMs!==undefined).reduce((sum,e)=>sum+e.durationMs,0),1700);
 assert.equal(events.filter(e=>e.step==='profile'&&e.action==='view').length,2);
 const attempt=exports.beginSignupAuthentication('apple');assert.equal(anonymous[0].action,'attempt');
 exports.finishSignupAuthentication(attempt,'alice',true);await tick();
 assert.equal(events.find(e=>e.step==='auth'&&e.action==='success').isNewUser,true);
 exports.failSignupAuthentication(attempt,{code:'auth/popup-closed-by-user'});assert.equal(anonymous[1].errorCode,'auth/popup-closed-by-user');
 const old=exports.observeSignupStep('question_1');await tick();auth.currentUser={uid:'bob',getIdToken:async()=>'test-token'};exports.activateSignupTracking('bob');old();await tick();
 assert(!events.some(e=>e.uid==='bob'&&e.step==='question_1'));
 console.log('Signup funnel: bounded retry, dedupe, expiry, account isolation, auth milestones and visible timings passed.');
}
main().catch(error=>{console.error(error);process.exitCode=1});
