import {getSiteAuth} from './site-auth';

// Best effort and non-blocking: telemetry must never prevent signup.
export function trackSignupProgress(step:string,action='view',errorCode=''){
 const eventId=crypto.randomUUID().replace(/-/g,'');
 void (async()=>{
  const auth=await getSiteAuth();if(!auth.currentUser)return;
  const {getFunctions,httpsCallable}=await import('firebase/functions');
  await httpsCallable(getFunctions(auth.app,'us-central1'),'recordSignupProgress')({eventId,step,action,errorCode,platform:'web'});
 })().catch(()=>{});
}
export function signupErrorCode(error:unknown){
 const code=(error as {code?:unknown})?.code;
 return typeof code==='string'?code.replace(/^functions\//,''):'unknown';
}
