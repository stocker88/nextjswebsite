import {getSiteAuth} from './site-auth';

export type MembershipSubscription = {
  tier?:'pro'|'ultra'|'ultra_addon';
  provider:'apple'|'google'|'stripe'|'revenuecat';
  productId:string|null;
  planName:string;
  billingPeriod:string|null;
  status:'active'|'trialing'|'grace_period';
  expiresAt:string|null;
  willRenew:boolean|null;
  managementUrl:string|null;
};
export type MembershipStatus = {
  status:'active'|'inactive'|'unknown';
  isActive:boolean;
  billingVerified?:boolean;
  hasPro?:boolean;
  hasUltra?:boolean;
  hasUltraAddon?:boolean;
  ultraAccessUntil?:string|null;
  hasStripeBilling?:boolean;
  needsPaymentUpdate?:boolean;
  subscriptions:MembershipSubscription[];
  checkedAt:string;
};

const MEMBERSHIP_CACHE_TTL=5*60*1000;
const memoryCache=new Map<string,{value:MembershipStatus;cachedAt:number}>();
const pendingChecks=new Map<string,Promise<MembershipStatus>>();
const membershipCacheKey=(uid:string)=>`stbn.membershipStatus.v1:${uid}`;

function validMembershipStatus(value:unknown):value is MembershipStatus {
  if(!value||typeof value!=='object')return false;
  const candidate=value as MembershipStatus;
  return ['active','inactive','unknown'].includes(candidate.status)&&
    Array.isArray(candidate.subscriptions)&&typeof candidate.isActive==='boolean'&&
    !(candidate.status==='active'&&(!candidate.isActive||!candidate.subscriptions.length))&&
    !(candidate.status!=='active'&&candidate.isActive);
}

function rememberMembershipStatus(uid:string,value:MembershipStatus,cachedAt=Date.now()){
  const entry={value,cachedAt};
  memoryCache.set(uid,entry);
  if(typeof window==='undefined')return;
  const encoded=JSON.stringify(entry);
  try{sessionStorage.setItem(membershipCacheKey(uid),encoded)}catch{/* The durable cache below can still prevent a reload flicker. */}
  try{localStorage.setItem(membershipCacheKey(uid),encoded)}catch{/* Memory/session caching still works when durable storage is unavailable. */}
}

function storedMembershipStatus(uid:string):{value:MembershipStatus;cachedAt:number}|null {
  let entry=memoryCache.get(uid)||null;
  if(!entry&&typeof window!=='undefined'){
    for(const getStorage of [()=>window.sessionStorage,()=>window.localStorage])try{
      const storage=getStorage();
      const stored=JSON.parse(storage.getItem(membershipCacheKey(uid))||'null');
      if(stored&&Number.isFinite(stored.cachedAt)&&validMembershipStatus(stored.value)){
        entry={value:stored.value,cachedAt:stored.cachedAt};memoryCache.set(uid,entry);
        break;
      }
    }catch{/* Ignore corrupt or unavailable browser storage. */}
  }
  return entry;
}

export function lastKnownMembershipStatus(uid:string):MembershipStatus|null {
  return storedMembershipStatus(uid)?.value||null;
}

export function canOfferMembership(value:MembershipStatus|null|undefined):boolean {
  return !!value&&value.status==='inactive'&&!value.isActive&&!value.needsPaymentUpdate;
}

export function cachedMembershipStatus(uid:string,maxAge=MEMBERSHIP_CACHE_TTL):MembershipStatus|null {
  const entry=storedMembershipStatus(uid);
  if(!entry||Date.now()-entry.cachedAt>maxAge)return null;
  return entry.value;
}

export async function fetchMembershipStatus(uid:string):Promise<MembershipStatus> {
  const auth=await getSiteAuth();
  if(auth.currentUser?.uid!==uid)throw new Error('Account changed');
  const {getFunctions,httpsCallable}=await import('firebase/functions');
  const call=httpsCallable<Record<string,never>,MembershipStatus>(
    getFunctions(auth.app,'us-central1'),'getMembershipStatus',{timeout:35000});
  const result=await call({});
  if(auth.currentUser?.uid!==uid)throw new Error('Account changed');
  const value=result.data;
  if(!validMembershipStatus(value))throw new Error('Invalid membership response');
  rememberMembershipStatus(uid,value);
  return value;
}

export function refreshMembershipStatus(uid:string):Promise<MembershipStatus>{
  const pending=pendingChecks.get(uid);
  if(pending)return pending;
  const request=fetchMembershipStatus(uid).finally(()=>pendingChecks.delete(uid));
  pendingChecks.set(uid,request);
  return request;
}

export function preloadMembershipStatus(uid:string):Promise<MembershipStatus>{
  const cached=cachedMembershipStatus(uid);
  if(cached){
    // Preserve the instant cached render, but always revalidate silently.
    void refreshMembershipStatus(uid).catch(()=>{/* The last verified state remains safer than a purchase prompt. */});
    return Promise.resolve(cached);
  }
  return refreshMembershipStatus(uid);
}
export function billingManagementUrl(value:string|null):string|null {
  try {
    const url=new URL(value||'');
    return url.protocol==='https:'&&['apps.apple.com','play.google.com','billing.stripe.com'].includes(url.hostname)?url.href:null;
  }catch{return null}
}
