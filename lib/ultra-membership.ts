import {getSiteAuth} from './site-auth';
import {stripeRedirect,completeWebsiteCheckout} from './website-billing';
import type {MembershipStatus} from './membership-status';
export type UltraPeriod='monthly'|'annual';
export type UltraRoute='checkout'|'stripe_switch'|'apple_addon'|'apple_upgrade'|'google_upgrade'|'active'|'unavailable'|'support'|'payment_update'|'restore_pro';
export type UltraOffer={route:UltraRoute;offersAvailable:boolean;plans:{id:UltraPeriod;amount:number;currency:string;interval:string}[];policy:{version:string;url:string};membership:MembershipStatus};
async function call<T>(name:string,data:Record<string,string|boolean>={}):Promise<T>{
 const auth=await getSiteAuth(),uid=auth.currentUser?.uid;if(!uid)throw Error('Please sign in.');
 const {getFunctions,httpsCallable}=await import('firebase/functions');
 const result=await httpsCallable<Record<string,string|boolean>,T>(getFunctions(auth.app,'us-central1'),name,{timeout:65000})(data);
 if(auth.currentUser?.uid!==uid)throw Error('Account changed');return result.data;
}
export async function fetchUltraOffer(){const offer=await call<UltraOffer>('getWebsiteUltraOffer');if(!offer||!Array.isArray(offer.plans)||!offer.membership||typeof offer.route!=='string')throw Error('Invalid membership response');return offer;}
export async function startUltra(period:UltraPeriod){
 const response=await call<{url:string;kind:'checkout'|'stripe_switch'}>('startWebsiteUltra',{plan:period,origin:location.origin,device:'desktop',acceptedTerms:true,policyVersion:'ultra-2026-10-26'});
 const url=stripeRedirect(response.url,response.kind==='stripe_switch'?'billing.stripe.com':'checkout.stripe.com');location.assign(url);
}
export async function completeUltraCheckout(session:string){await completeWebsiteCheckout(session);return fetchUltraOffer();}
