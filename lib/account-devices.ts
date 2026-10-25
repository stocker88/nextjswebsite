import {getSiteAuth} from './site-auth';
export type AccountDevice={deviceKey:string;platform:string;deviceName:string;firstSeenAt:number|null;lastSeenAt:number|null;isCurrent:boolean};
// Emergency rollout switch; the matching server functions and registry rules are deployed.
export const accountDevicesEnabled=process.env.NEXT_PUBLIC_ACCOUNT_DEVICES_ENABLED!=='false';
const key='accountDeviceInstallationIdV1';
export function installationId(){
 let id=localStorage.getItem(key);
 if(!id||!/^[A-Za-z0-9_-]{20,180}$/.test(id)){
  id=Array.from(crypto.getRandomValues(new Uint8Array(32)),b=>b.toString(16).padStart(2,'0')).join('');
  localStorage.setItem(key,id);
 }
 return id;
}
async function call<T>(name:string,data:Record<string,string|boolean|number>={}):Promise<T>{
 const auth=await getSiteAuth(),uid=auth.currentUser?.uid;
 if(!uid)throw new Error('Please sign in again.');
 const {getFunctions,httpsCallable}=await import('firebase/functions');
 const result=await httpsCallable<Record<string,string|boolean|number>,T>(getFunctions(auth.app,'us-central1'),name)({...data,installationId:installationId()});
 if(auth.currentUser?.uid!==uid)throw new Error('Your account changed. Please try again.');
 return result.data;
}
export function browserDescription(ua:string){
 const platform=/Android/i.test(ua)?'Android':/iPhone|iPad|iPod/i.test(ua)?'iOS':/Windows/i.test(ua)?'Windows':/Macintosh|Mac OS X/i.test(ua)?'macOS':/Linux/i.test(ua)?'Linux':'Web';
 const browser=/Edg\//.test(ua)?'Edge':/Firefox|FxiOS/.test(ua)?'Firefox':/Chrome|CriOS/.test(ua)?'Chrome':/Safari/.test(ua)?'Safari':'Browser';
 return {platform:'Web',deviceName:`${browser} on ${platform}`};
}
export type DeviceNotice={id:string;kind:'warning'|'blocked';message:string;deadlineAt:number;limit:number;connected:number};
export function registerWebsiteDevice(supportSkip=false){return call<{allowed:boolean;deviceNotice?:DeviceNotice|null}>('registerAccountDevice',{...browserDescription(navigator.userAgent),...(supportSkip?{supportSkip:true}:{})})}
export function checkWebsiteDevice(){return call<{allowed:boolean;deviceNotice?:DeviceNotice|null}>('checkAccountDevice')}
export type DeviceSubscription={provider:string;productId:string;extraDevices:number;expiresAt:number;willRenew:boolean};
export type DeviceList={isSupportAccount?:boolean;devices:AccountDevice[];maxDevices:number;extraDevices:number;deviceSubscriptions:DeviceSubscription[];offersAvailable:boolean;nextReplacementAt:string|null;canSupportSkip:boolean;deviceNotice?:DeviceNotice|null};
export function listAccountDevices(){return call<DeviceList>('listAccountDevices')}
export function revokeAccountDevice(deviceKey:string){return call<{revoked:boolean}>('revokeAccountDevice',{deviceKey})}
export async function signOutWebsiteDevice(){
 const auth=await getSiteAuth();
 if(accountDevicesEnabled&&auth.currentUser)try{await call('releaseAccountDevice')}catch{/* Local sign-out remains available during an outage. */}
 const {signOut}=await import('firebase/auth');await signOut(auth);
}

export async function startDeviceCheckout(extraDevices:number){
 const result=await call<{url:string}>('createDeviceCheckout',{extraDevices,origin:location.origin,device:/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)?'mobile_web':'desktop',acceptedTerms:true,policyVersion:'device-slots-2026-10-25'});
 const url=new URL(result.url);if(url.protocol!=='https:'||url.hostname!=='checkout.stripe.com')throw Error('Invalid checkout address.');location.assign(url.href);
}
export async function openDeviceBilling(){
 const result=await call<{url:string}>('createDeviceBillingPortal',{origin:location.origin});const url=new URL(result.url);if(url.protocol!=='https:'||url.hostname!=='billing.stripe.com')throw Error('Invalid billing address.');location.assign(url.href);
}
export function refreshDeviceAllowance(){return call('getDeviceAllowance')}
export function completeDeviceCheckout(sessionId:string){return call<{checkoutConfirmed:boolean}>('completeDeviceCheckout',{sessionId})}
