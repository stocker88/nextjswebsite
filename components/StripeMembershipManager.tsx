import {useEffect,useRef,useState} from 'react';
import {fetchWebsiteBillingDetails,openWebsiteBillingPortal,switchWebsitePlan,restoreWebsiteRenewal,startWebsiteCancellation,followBillingUrl,type StripeBillingDetails,type StripeBillingSubscription,type CancellationSession,type PlanSwitchPreview} from '../lib/website-billing';
import s from '../styles/Membership.module.css';
const money=(amount:number,currency:string)=>new Intl.NumberFormat('en-US',{style:'currency',currency:currency.toUpperCase()}).format(amount/100);
const date=(seconds:number)=>new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(seconds*1000));
export function PlanSwitchConfirmationView({preview,busy,onConfirm,onBack}:{preview:PlanSwitchPreview;busy:boolean;onConfirm:()=>void;onBack:()=>void}){return <><h2 id="billing-manager-title">Switch to monthly at renewal?</h2><p>Your annual membership continues through {date(preview.periodEnd)}. No payment is taken now.</p><p>Your next charge will be {money(preview.unitAmount,preview.currency)} on {date(preview.periodEnd)}, then every month. Any applicable tax is shown on your Stripe invoice.</p><button className={s.primary} disabled={busy} onClick={onConfirm}>{busy?'Scheduling…':'Confirm monthly billing at renewal'}</button><button className={s.cancelLink} disabled={busy} onClick={onBack}>Keep annual billing</button></>;}
export function StripeBillingView({details,busy,onCard,onInvoices,onCancel,onSwitch,onRestore}:{details:StripeBillingDetails;busy:boolean;onCard:()=>void;onInvoices:()=>void;onCancel:(id:string)=>void;onSwitch?:(id:string)=>void;onRestore?:(subscription:StripeBillingSubscription)=>void}){
 return <><div className={s.billingList}>{details.subscriptions.map(subscription=><section className={s.billingSubscription} key={subscription.id}>
  <div className={s.planHeading}><h3>{subscription.kind==='device_slots'?`Extra devices · +${subscription.extraDevices}`:`${subscription.kind==='ultra_addon'?'Ultra add-on':subscription.kind==='ultra'?'Ultra':'Pro'} · ${subscription.billingPeriod}`}</h3><span className={s.badge}>{subscription.cancelAtPeriodEnd?'Renewal off':subscription.status==='active'?'Active':subscription.status.replace('_',' ')}</span></div>
  {subscription.unitAmount!==null&&subscription.currency&&<p className={s.billingAmount}>{money(subscription.unitAmount,subscription.currency)} <span>/{subscription.intervalCount>1?subscription.intervalCount+' ':''}{subscription.interval}</span></p>}
  {subscription.nextInvoice&&<p className={s.note}>Estimated next payment: <strong>{money(subscription.nextInvoice.amountDue,subscription.nextInvoice.currency)}</strong></p>}
  {subscription.currentPeriodEnd&&<p className={s.note}>{subscription.status==='canceled'?'Billing period ended':subscription.cancelAtPeriodEnd?'Access until':'Current billing period ends'} {date(subscription.currentPeriodEnd)}</p>}
  <div className={s.cardSummary}><span aria-hidden="true">▣</span><div><strong>{subscription.card?<><span className={s.cardBrand}>{subscription.card.brand}</span> ···· {subscription.card.last4}</>:'No default card on file'}</strong>{subscription.card&&<small>Expires {String(subscription.card.expMonth).padStart(2,'0')}/{subscription.card.expYear}</small>}</div><button disabled={busy} onClick={onCard}>Change card ↗</button></div>
  {subscription.canSwitch&&onSwitch&&<><button className={s.secondary} disabled={busy} onClick={()=>onSwitch(subscription.id)}>{subscription.billingPeriod==='Annual'?'Switch to monthly at renewal':'Switch to annual ↗'}</button><p className={s.note}>Stripe shows your next charge before you confirm. Moving to annual bills now with credit for unused time; moving to monthly starts at your annual renewal.</p></>}
  {subscription.scheduledPlan&&<p className={s.note}>Scheduled: {subscription.scheduledPlan.billingPeriod} billing starts {date(subscription.scheduledPlan.effectiveAt)} at {money(subscription.scheduledPlan.unitAmount,subscription.scheduledPlan.currency)} per month. Your current paid period stays unchanged.</p>}
  {subscription.canRestore&&onRestore&&<button className={s.secondary} disabled={busy} onClick={()=>onRestore(subscription)}>Restore renewal</button>}
  {subscription.canCancel?<button className={s.cancelLink} disabled={busy} onClick={()=>onCancel(subscription.id)}>{subscription.kind==='device_slots'?'Cancel device add-on':subscription.kind==='ultra_addon'?'Cancel Ultra add-on':'Cancel membership'}</button>:subscription.cancelAtPeriodEnd?<p className={s.note}>Your membership stays available until the date above. Renewal is cancelled.</p>:null}
 </section>)}</div>
 <div className={s.actions}><button className={s.secondary} disabled={busy} onClick={onInvoices}>Invoices & billing details ↗</button></div>
 <p className={s.note}>Stripe securely stores your card and billing details. Only the card brand, last four digits and expiry appear here.</p>
 </>;
}
export function RetentionOfferView({remainingSeconds,onContinue,onBack,busy}:{remainingSeconds:number;onContinue:()=>void;onBack:()=>void;busy:boolean}){
 const active=remainingSeconds>0;
 return <><h2 id="billing-manager-title">Before you go.</h2><p>You can cancel renewal securely with Stripe. Your access will continue until the end of your paid billing period.</p>
  <div className={s.retentionOffer}><span className={s.eyebrow}>ONE-TIME MONTHLY OFFER</span><h3>{active?'20% off one more month.':'This offer has expired.'}</h3>
  {active?<><p>Keep your monthly membership and save 20% on your next renewal only. Your normal monthly price resumes after that.</p><p className={s.offerClock} role="timer" aria-label="Offer time remaining">Available for {Math.floor(remainingSeconds/60)}:{String(remainingSeconds%60).padStart(2,'0')}</p><p className={s.note}>This one-hour window won’t restart. The offer can be redeemed once per account and does not apply to annual plans.</p></>:<p>You can still continue to cancellation. This offer will not be issued again.</p>}
  </div>
  <button className={s.primary} disabled={busy} onClick={onContinue}>{busy?'Opening Stripe…':'Review cancellation options in Stripe ↗'}</button>
  <button className={s.cancelLink} disabled={busy} onClick={onBack}>Back to membership</button><p className={s.note}>Stripe will ask why you’re leaving. You can then choose to cancel or, while eligible, accept the discount. Nothing changes until you confirm there.</p>
 </>;
}
export default function StripeMembershipManager({onClose,onRefresh}:{onClose:()=>void;onRefresh:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null),[details,setDetails]=useState<StripeBillingDetails|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState(''),[retry,setRetry]=useState(0);
 const [offer,setOffer]=useState<{session:CancellationSession;subscriptionId:string;receivedAt:number}|null>(null),[clock,setClock]=useState(Date.now());
 const [switching,setSwitching]=useState<PlanSwitchPreview|null>(null);
 const [restoring,setRestoring]=useState<StripeBillingSubscription|null>(null);
 useEffect(()=>{dialog.current?.showModal();return()=>dialog.current?.close()},[]);
 useEffect(()=>{let current=true;setDetails(null);setError('');fetchWebsiteBillingDetails().then(result=>{if(current)setDetails(result)}).catch(()=>{if(current)setError('Your billing information couldn’t be loaded. Please try again.')});return()=>{current=false}},[retry]);
 useEffect(()=>{if(!offer)return;const timer=window.setInterval(()=>setClock(Date.now()),1000);return()=>window.clearInterval(timer)},[offer]);
 async function portal(action:'billing'|'payment_method_update'){setBusy(true);setError('');try{await openWebsiteBillingPortal(action)}catch{setError('Stripe could not be opened. Please try again.');setBusy(false)}}
 async function cancel(subscriptionId:string,continueToStripe=false){setBusy(true);setError('');try{
  const result=await startWebsiteCancellation(subscriptionId);
  if(continueToStripe||!result.offerExpiresAt)followBillingUrl(result.url);
  else{setOffer({session:result,subscriptionId,receivedAt:Date.now()});setClock(Date.now());setBusy(false)}
 }catch{setError('Cancellation options couldn’t be opened. Please refresh your membership and try again.');setBusy(false)}}
 async function change(subscriptionId:string,confirmation?:PlanSwitchPreview){setBusy(true);setError('');try{const result=await switchWebsitePlan(subscriptionId,confirmation);if(result.preview)setSwitching(result.preview);if(result.scheduled){setSwitching(null);setRetry(value=>value+1)}if(!result.url)setBusy(false)}catch{setError('Plan switching could not be completed. Refresh your billing details and try again.');setBusy(false)}}
 async function restore(){if(!restoring)return;setBusy(true);setError('');try{await restoreWebsiteRenewal(restoring);setRestoring(null);setRetry(value=>value+1);onRefresh()}catch{setError('Renewal could not be restored. Refresh your billing details and review again.')}finally{setBusy(false)}}
 const remaining=offer?Math.max(0,Math.floor(((offer.session.offerExpiresAt||0)-offer.session.serverTime-(clock-offer.receivedAt))/1000)):0;
 return <dialog ref={dialog} className={s.checkoutDialog} aria-labelledby="billing-manager-title" onCancel={event=>{event.preventDefault();if(!busy){onClose();onRefresh()}}}>
 <button className={s.close} onClick={()=>{onClose();onRefresh()}} disabled={busy} aria-label="Close billing settings">×</button><span className={s.eyebrow}>YOUR ACCOUNT · YOUR MEMBERSHIP</span>
 {switching?<PlanSwitchConfirmationView preview={switching} busy={busy} onConfirm={()=>void change(switching.subscriptionId,switching)} onBack={()=>setSwitching(null)}/>:restoring?<><h2 id="billing-manager-title">Restore your renewal?</h2><p>Your current access stays the same. No payment is taken now.</p><p>{restoring.unitAmount!==null&&restoring.currency&&money(restoring.unitAmount,restoring.currency)} will renew {restoring.currentPeriodEnd?'on '+date(restoring.currentPeriodEnd):'at your next renewal'} and then every {restoring.interval}. Any applicable tax or existing discount is shown on your Stripe invoice.</p><button className={s.primary} disabled={busy} onClick={()=>void restore()}>{busy?'Restoring…':'Confirm restore renewal'}</button><button className={s.cancelLink} disabled={busy} onClick={()=>setRestoring(null)}>Keep renewal cancelled</button></>:offer?<RetentionOfferView remainingSeconds={remaining} busy={busy} onContinue={()=>void cancel(offer.subscriptionId,true)} onBack={()=>setOffer(null)}/>:<><h2 id="billing-manager-title">Your billing, in one place.</h2><p>Review your payment card, update billing details and manage your membership.</p>
 {!details&&!error?<p role="status">Loading your Stripe billing details…</p>:details?<StripeBillingView details={details} busy={busy} onCard={()=>void portal('payment_method_update')} onInvoices={()=>void portal('billing')} onCancel={id=>void cancel(id)} onSwitch={id=>void change(id)} onRestore={setRestoring}/>:<button className={s.secondary} onClick={()=>setRetry(value=>value+1)}>Try again</button>}</>}
 {error&&<p className={s.billingError} role="alert">{error}</p>}
 </dialog>;
}
