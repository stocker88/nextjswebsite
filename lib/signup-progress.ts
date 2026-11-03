import {browserIdentity} from './browser-identity';
import {getSiteAuth} from './site-auth';
import {recordSignupAttempt} from './acquisition';
import {SignupProgressQueue,type SignupEvent} from './signup-progress-queue';
type Extras=Partial<Pick<SignupEvent,'provider'|'attemptId'|'durationMs'|'isNewUser'>>;
let owner:string|null=null,session='',listeners=false,retries=0,timer:ReturnType<typeof setTimeout>|undefined;
const queues=new Map<string,SignupProgressQueue>();
function id(){return Array.from(crypto.getRandomValues(new Uint8Array(16)),v=>v.toString(16).padStart(2,'0')).join('')}
function event(step:string,action:string,errorCode:string,extra:Extras={}):SignupEvent{
 if(!session){try{session=sessionStorage.getItem('stbn.signup.session.v2')||''}catch{}if(!/^[a-f0-9]{32}$/.test(session)){session=id();try{sessionStorage.setItem('stbn.signup.session.v2',session)}catch{}}}
 return {eventId:id(),browserId:browserIdentity(),step,action,errorCode,platform:'web',clientAt:Date.now(),sessionId:session,build:'web-funnel-v2',...extra};
}
function queue(uid:string){
 if(!queues.has(uid)){
  const key='stbn.signup.queue.v2:'+uid;let saved:SignupEvent[]=[];
  try{const value=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(value))saved=value}catch{}
  queues.set(uid,new SignupProgressQueue(events=>{try{if(events.length)localStorage.setItem(key,JSON.stringify(events));else localStorage.removeItem(key)}catch{}},saved));
 }
 return queues.get(uid)!;
}
async function flush(){
 const uid=owner;if(!uid)return;
 let ok=false;
 try{
  const auth=await getSiteAuth();if(auth.currentUser?.uid!==uid)return;
  const {getFunctions,httpsCallable}=await import('firebase/functions');
  const send=httpsCallable(getFunctions(auth.app,'us-central1'),'recordSignupProgress',{timeout:10000});
  ok=await queue(uid).flush(async data=>{
   if(auth.currentUser?.uid!==uid)throw Error('Account changed');
   if(data.action==='hidden'||data.action==='exit'){
    // Keep the final visible-time segment in flight during page navigation.
    // Tokens are used only in this request, never persisted with telemetry.
    const token=await auth.currentUser.getIdToken();
    if(auth.currentUser?.uid!==uid)throw Error('Account changed');
    const response=await fetch('https://us-central1-stocker-fcda2.cloudfunctions.net/recordSignupProgress',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({data}),keepalive:true});
    const result=await response.json();
    if(!response.ok||result.error)throw Object.assign(Error('Signup telemetry unavailable'),{code:'functions/'+String(result.error?.status||'unavailable').toLowerCase().replaceAll('_','-')});
   }else await send(data);
  },()=>owner===uid&&auth.currentUser?.uid===uid);
 }catch{/* Retain queued events without blocking signup. */}
 if(!ok&&owner===uid&&retries<3&&!timer)timer=setTimeout(()=>{timer=undefined;retries++;void flush()},[1000,5000,30000][retries]);
}
function enqueue(uid:string,data:SignupEvent){queue(uid).add(data);void flush()}
export function activateSignupTracking(uid:string|null){
 owner=uid;retries=0;clearTimeout(timer);timer=undefined;
 if(!listeners){listeners=true;const resume=()=>{retries=0;void flush()};window.addEventListener('online',resume);window.addEventListener('focus',resume)}
 if(!uid)return;
 // A restored authenticated session is NOT a new sign-in or account creation.
 const key='stbn.signup.authSession.v2:'+uid;
 try{if(sessionStorage.getItem(key)){void flush();return}sessionStorage.setItem(key,'1')}catch{}
 trackSignupProgress('auth_session','success');
}
export function trackSignupProgress(step:string,action='view',errorCode='',extra:Extras={}){
 try{if(owner)enqueue(owner,event(step,action,errorCode,extra))}catch{/* Telemetry cannot break any UI handler. */}
}
export function beginSignupAuthentication(provider:string):SignupEvent|null{
 try{const data=event('auth','attempt','',{provider,attemptId:id()});recordSignupAttempt(data);return data}catch{return null}
}
export function finishSignupAuthentication(attempt:SignupEvent|null,uid:string,isNewUser:boolean){
 try{
  if(!attempt)return;
  // Bind the click only to the account returned by this sign-in.
  enqueue(uid,attempt);
  enqueue(uid,event('auth','success','',{provider:attempt.provider,attemptId:attempt.attemptId,isNewUser}));
  void getSiteAuth().then(auth=>{if(auth.currentUser?.uid===uid){owner=uid;void flush()}}).catch(()=>{});
 }catch{}
}
export function failSignupAuthentication(attempt:SignupEvent|null,error:unknown){
 try{if(attempt)recordSignupAttempt(event('auth','error',signupErrorCode(error),{provider:attempt.provider,attemptId:attempt.attemptId}))}catch{}
}
// Visible-time segments, not time in background tabs. No polling heartbeat.
// A hard crash may lose the final segment; missing duration is not zero time.
export function observeSignupStep(step:string){
 const uid=owner;
 const emit=(action:string,extra:Extras={})=>{try{if(uid)enqueue(uid,event(step,action,'',extra))}catch{}};
 let started:number|null=null,disposed=false;
 const begin=()=>{if(!disposed&&!document.hidden&&started===null){started=performance.now();emit('view')}};
 const end=(action:'hidden'|'exit')=>{if(started===null)return;const durationMs=Math.min(14400000,Math.max(0,Math.round(performance.now()-started)));started=null;emit(action,{durationMs})};
 const visible=()=>{if(document.hidden)end('hidden');else begin()};
 const hide=()=>end('exit');
 begin();document.addEventListener('visibilitychange',visible);window.addEventListener('pagehide',hide);window.addEventListener('pageshow',begin);
 return()=>{end('exit');disposed=true;document.removeEventListener('visibilitychange',visible);window.removeEventListener('pagehide',hide);window.removeEventListener('pageshow',begin)};
}
export function signupErrorCode(error:unknown){
 const code=(error as {code?:unknown})?.code;
 if(typeof code==='string')return code.replace(/^functions\//,'');
 // Classify runtime failures without storing messages, URLs, emails or tokens.
 const name=(error as {name?:unknown})?.name;
 if(name==='ChunkLoadError')return 'client/chunk-load-failed';
 if(name==='TypeError')return 'client/type-error';
 if(name==='SecurityError')return 'client/security-error';
 if(name==='AbortError')return 'client/aborted';
 return 'unknown';
}
