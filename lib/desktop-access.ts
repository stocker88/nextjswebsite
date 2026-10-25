import type {MembershipStatus} from './membership-status';
export const DESKTOP_ACCESS_PATH='/continue/';
const PAYMENT_INTENT='desktopProContinuation',THREAD_INTENT='desktopResearchThread';
type StorageAccess=Pick<Storage,'getItem'|'setItem'|'removeItem'>;
export function desktopAccessDecision(ready:boolean,signedIn:boolean,membership:MembershipStatus|null):'checking'|'login'|'payment'|'download'|'retry'{
 if(!ready)return 'checking';
 if(!signedIn)return 'login';
 if(!membership||membership.status==='unknown')return 'retry';
 if(membership.status==='active'&&membership.isActive===true&&membership.subscriptions.length>0)return 'download';
 return membership.status==='inactive'&&membership.isActive===false?'payment':'retry';
}
export function desktopActionLabel(label:string,signedIn:boolean):string{
 if(/open.*(?:thread|insight).*app/i.test(label))return 'Review the full thread now ↗';
 if(/^open in (?:the )?app/i.test(label))return 'Review the full research now ↗';
 if(/^(?:get|download|install).*app|^download for (?:ios|android)/i.test(label))return signedIn?'Access your research →':'Sign Up →';
 if(/^explore the app/i.test(label))return 'Explore the full research →';
 return label.replace(/\s+in the app(?=\s*[↗→]?\s*$)/i,'');
}
export function rememberDesktopPayment(uid:string,storage:StorageAccess=sessionStorage,now=Date.now()){
 try{storage.setItem(PAYMENT_INTENT,JSON.stringify({uid,createdAt:now}));}catch{/* The explicit continuation URL still works. */}
}
export function desktopPaymentPending(uid:string,storage:StorageAccess=sessionStorage,now=Date.now()):boolean{
 try{const value=JSON.parse(storage.getItem(PAYMENT_INTENT)||'null');return value?.uid===uid&&Number.isFinite(value.createdAt)&&now>=value.createdAt&&now-value.createdAt<2*60*60*1000;}catch{return false;}
}
export function clearDesktopPayment(storage:StorageAccess=sessionStorage){try{storage.removeItem(PAYMENT_INTENT)}catch{}}
export function rememberDesktopThread(raw?:string,storage:StorageAccess=sessionStorage,now=Date.now()){
 try{const id=raw?new URL(raw,'https://www.stockstobuynow.ai').searchParams.get('postId'):null;
  if(id&&/^[A-Za-z0-9_-]{1,150}$/.test(id))storage.setItem(THREAD_INTENT,JSON.stringify({id,createdAt:now}));else storage.removeItem(THREAD_INTENT);
 }catch{/* Storage can be unavailable in private browsing. */}
}
export function desktopThread(storage:StorageAccess=sessionStorage,now=Date.now()):string|null{
 try{const value=JSON.parse(storage.getItem(THREAD_INTENT)||'null');return typeof value?.id==='string'&&/^[A-Za-z0-9_-]{1,150}$/.test(value.id)&&Number.isFinite(value.createdAt)&&now>=value.createdAt&&now-value.createdAt<2*60*60*1000?value.id:null;}catch{return null;}
}
