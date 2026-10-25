import {getSiteAuth} from './site-auth';
import type {MembershipStatus} from './membership-status';
export type WebsitePlan='monthly'|'annual';
async function billingCall<T>(name:string,data:Record<string,string|boolean>={}):Promise<T>{
 const auth=await getSiteAuth(),uid=auth.currentUser?.uid;
 if(!uid)throw new Error('Please sign in before continuing.');
 const {getFunctions,httpsCallable}=await import('firebase/functions');
 const result=await httpsCallable<Record<string,string|boolean>,T>(getFunctions(auth.app,'us-central1'),name,{timeout:65000})(data);
 if(auth.currentUser?.uid!==uid)throw new Error('Your account changed. Please try again.');
 return result.data;
}
export function stripeRedirect(value:string,host:'checkout.stripe.com'|'billing.stripe.com'):string{
 const url=new URL(value);
 if(url.protocol!=='https:'||url.hostname!==host)throw new Error('Invalid billing destination.');
 return url.href;
}
export async function startWebsiteCheckout(plan:WebsitePlan){
 const device=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)?'mobile_web':'desktop';
 const result=await billingCall<{url:string}>('createWebsiteCheckout',{plan,origin:window.location.origin,device,acceptedTerms:true,policyVersion:'membership-2026-10-25'});
 window.location.assign(stripeRedirect(result.url,'checkout.stripe.com'));
}
export async function openWebsiteBillingPortal(action:'billing'|'payment_method_update'='billing'){
 const result=await billingCall<{url:string}>('createWebsiteBillingPortal',{action,origin:window.location.origin});
 window.location.assign(stripeRedirect(result.url,'billing.stripe.com'));
}
export type WebsiteCheckoutResult=MembershipStatus&{checkoutConfirmed?:boolean};
export async function completeWebsiteCheckout(sessionId:string):Promise<WebsiteCheckoutResult>{
 return billingCall<WebsiteCheckoutResult>('completeWebsiteCheckout',{sessionId});
}
export type BillingCard={brand:string;last4:string;expMonth:number;expYear:number};
export type StripeBillingSubscription={kind?:'pro'|'ultra'|'ultra_addon'|'device_slots';extraDevices?:number;id:string;status:string;billingPeriod:string;unitAmount:number|null;currency:string|null;interval:string|null;intervalCount:number;currentPeriodEnd:number|null;cancelAtPeriodEnd:boolean;card:BillingCard|null;nextInvoice?:{amountDue:number;currency:string}|null;canCancel:boolean;scheduledPlan?:{billingPeriod:string;effectiveAt:number;unitAmount:number;currency:string}|null;priceId?:string|null;canSwitch?:boolean;canRestore?:boolean};
export type StripeBillingDetails={defaultCard:BillingCard|null;subscriptions:StripeBillingSubscription[];checkedAt:number};
export type CancellationSession={url:string;offerExpiresAt:number|null;serverTime:number};
export function fetchWebsiteBillingDetails(){return billingCall<StripeBillingDetails>('getWebsiteBillingDetails')}
export async function startWebsiteCancellation(subscriptionId:string){
 const result=await billingCall<CancellationSession>('startWebsiteCancellation',{subscriptionId,origin:window.location.origin});
 stripeRedirect(result.url,'billing.stripe.com');return result;
}
export function followBillingUrl(url:string){window.location.assign(stripeRedirect(url,'billing.stripe.com'))}

export type PlanSwitchPreview={subscriptionId:string;priceId:string;periodEnd:number;unitAmount:number;currency:string;billingPeriod:string};
export async function switchWebsitePlan(subscriptionId:string,confirmation?:PlanSwitchPreview){
 const result=await billingCall<{url?:string;preview?:PlanSwitchPreview;scheduled?:boolean}>('switchWebsitePlan',{subscriptionId,origin:window.location.origin,...(confirmation?{confirm:'schedule-monthly',priceId:confirmation.priceId,periodEnd:String(confirmation.periodEnd)}:{})});
 if(result.url)followBillingUrl(result.url);
 return result;
}
export function restoreWebsiteRenewal(subscription:StripeBillingSubscription){
 return billingCall<{restored:boolean}>('restoreWebsiteRenewal',{subscriptionId:subscription.id,priceId:subscription.priceId||'',periodEnd:String(subscription.currentPeriodEnd),confirm:'restore-renewal'});
}
