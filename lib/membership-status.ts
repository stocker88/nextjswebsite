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
export async function fetchMembershipStatus(uid:string):Promise<MembershipStatus> {
  const auth=await getSiteAuth();
  if(auth.currentUser?.uid!==uid)throw new Error('Account changed');
  const {getFunctions,httpsCallable}=await import('firebase/functions');
  const call=httpsCallable<Record<string,never>,MembershipStatus>(
    getFunctions(auth.app,'us-central1'),'getMembershipStatus',{timeout:35000});
  const result=await call({});
  if(auth.currentUser?.uid!==uid)throw new Error('Account changed');
  const value=result.data;
  if(!value||!['active','inactive','unknown'].includes(value.status)||
    !Array.isArray(value.subscriptions)||typeof value.isActive!=='boolean'||
    (value.status==='active'&&(!value.isActive||!value.subscriptions.length))||
    (value.status!=='active'&&value.isActive))throw new Error('Invalid membership response');
  return value;
}
export function billingManagementUrl(value:string|null):string|null {
  try {
    const url=new URL(value||'');
    return url.protocol==='https:'&&['apps.apple.com','play.google.com','billing.stripe.com'].includes(url.hostname)?url.href:null;
  }catch{return null}
}
