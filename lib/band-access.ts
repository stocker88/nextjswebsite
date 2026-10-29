import type {MembershipStatus} from './membership-status';
export type BandAccess='signin'|'checking'|'pro'|'ultra'|'allowed';
export function bandAccess(signedIn:boolean,membership:MembershipStatus|null,options=false):BandAccess {
 if(!signedIn)return 'signin';
 if(!membership||membership.status==='unknown'||membership.billingVerified!==true)return 'checking';
 if(!membership.isActive||membership.hasPro!==true)return 'pro';
 if(options&&(membership.hasUltra!==true||membership.ultraAccessUntil!==null&&membership.ultraAccessUntil!==undefined&&!(Date.parse(membership.ultraAccessUntil)>Date.now())))return 'ultra';
 return 'allowed';
}
export const bandReadUrl=(destination:string)=>'/read/?next='+encodeURIComponent(destination);
