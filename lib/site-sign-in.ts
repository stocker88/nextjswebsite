import type {AuthCredential,User} from 'firebase/auth';
import {getSiteAuth} from './site-auth';
export type SiteProvider='google'|'apple'|'facebook'|'twitter';
export const providerNames:Record<SiteProvider,string>={google:'Google',apple:'Apple',facebook:'Facebook',twitter:'X'};
export const providerIds:Record<SiteProvider,string>={google:'google.com',apple:'apple.com',facebook:'facebook.com',twitter:'twitter.com'};
export const providerEnabled=(provider:SiteProvider)=>provider==='facebook'?process.env.NEXT_PUBLIC_FACEBOOK_SIGN_IN==='true':provider==='twitter'?process.env.NEXT_PUBLIC_X_SIGN_IN!=='false':true;
let pending:{provider:SiteProvider;credential:AuthCredential;email?:string;createdAt:number}|null=null;
function activePending(){if(pending&&Date.now()-pending.createdAt>=10*60*1000)pending=null;return pending}
export const pendingSiteLink=()=>{const request=activePending();return request?{provider:request.provider,email:request.email}:null};
export const clearPendingSiteLink=()=>{pending=null};
async function providerFor(provider:SiteProvider){
 const sdk=await import('firebase/auth');
 const method=provider==='google'?new sdk.GoogleAuthProvider():provider==='facebook'?new sdk.FacebookAuthProvider():provider==='twitter'?new sdk.TwitterAuthProvider():new sdk.OAuthProvider('apple.com');
 if(provider==='google')method.setCustomParameters({prompt:'select_account'});
 if(provider==='apple'){method.addScope('email');method.addScope('name')}
 if(provider==='facebook')method.addScope('email');
 return {sdk,method};
}
export async function signInSite(provider:SiteProvider){
 if(!providerEnabled(provider))throw new Error('This sign-in method is being configured. Please use Google or Apple.');
 const auth=await getSiteAuth(),{sdk,method}=await providerFor(provider);
 try{return await sdk.signInWithPopup(auth,method)}catch(error){
  if((error as {code?:string}).code==='auth/account-exists-with-different-credential'){
   const cause=error as Parameters<typeof sdk.GoogleAuthProvider.credentialFromError>[0];
   const credential=provider==='google'?sdk.GoogleAuthProvider.credentialFromError(cause):provider==='facebook'?sdk.FacebookAuthProvider.credentialFromError(cause):provider==='twitter'?sdk.TwitterAuthProvider.credentialFromError(cause):sdk.OAuthProvider.credentialFromError(cause);
   if(credential)pending={provider,credential,createdAt:Date.now(),email:(error as {customData?:{email?:string}}).customData?.email};
  }
  throw error;
 }
}
async function retainUser(user:User,operation:()=>Promise<{user:User}>){
 const auth=await getSiteAuth(),uid=user.uid;
 if(auth.currentUser?.uid!==uid)throw new Error('Your account changed. Please sign in again.');
 const result=await operation();
 if(result.user.uid!==uid||auth.currentUser?.uid!==uid)throw new Error('Your account changed. Please sign in again.');
 await user.reload();
 return user;
}
export async function completePendingSiteLink(){
 const auth=await getSiteAuth(),request=activePending(),user=auth.currentUser;
 if(!request||!user)throw new Error('Sign in with your existing account first.');
 if(request.email&&user.email?.toLowerCase()!==request.email.toLowerCase())throw new Error('Sign in to the existing account with the same email before linking.');
 const sdk=await import('firebase/auth');
 await retainUser(user,()=>sdk.linkWithCredential(user,request.credential));
 pending=null;
}
export async function linkSiteProvider(provider:SiteProvider){
 if(!providerEnabled(provider))throw new Error('This sign-in method is being configured.');
 const auth=await getSiteAuth(),user=auth.currentUser;
 if(!user)throw new Error('Please sign in first.');
 const {sdk,method}=await providerFor(provider);
 return retainUser(user,()=>sdk.linkWithPopup(user,method));
}
export function siteSignInError(error:unknown):string{
 const code=(error as {code?:string}).code;
 if(code==='auth/account-exists-with-different-credential')return 'This email already has an account. Sign in using your existing method, then confirm linking the new method.';
 if(code==='auth/credential-already-in-use'||code==='auth/email-already-in-use')return 'This sign-in belongs to another account. No accounts or memberships were merged. Use that account or contact support.';
 if(code==='auth/provider-already-linked')return 'This method is already linked to your account.';
 if(code==='auth/popup-blocked')return 'Allow pop-ups for this website and try again.';
 if(code==='auth/unauthorized-domain'||code==='auth/operation-not-allowed')return 'This sign-in method is not configured yet. Please use another method.';
 if(code==='auth/requires-recent-login')return 'Sign in again with your existing method, then return here to link.';
 if(code==='auth/multi-factor-auth-required')return 'This account requires two-factor verification. Please continue in the app.';
 if(code==='auth/network-request-failed')return 'Unable to connect. Check your connection and try again.';
 return error instanceof Error&&!code?error.message:'Sign-in could not be completed. Please try again.';
}
