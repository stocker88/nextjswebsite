import {useEffect,useRef,useState} from 'react';
import {startWebsiteCheckout,type WebsitePlan} from '../lib/website-billing';
import s from '../styles/Membership.module.css';
export default function WebsiteCheckout({onClose}:{onClose:()=>void}){
 const [plan,setPlan]=useState<WebsitePlan>('annual'),[busy,setBusy]=useState(false),[error,setError]=useState(''),[accepted,setAccepted]=useState(false);
 const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const element=dialog.current;element?.showModal();return()=>element?.close()},[]);
 async function checkout(){if(!accepted)return;setBusy(true);setError('');try{await startWebsiteCheckout(plan)}catch{setError('Checkout couldn’t be opened. Please try again, or refresh your membership if you have already paid.');setBusy(false)}}
 return <dialog ref={dialog} className={s.checkoutDialog} aria-labelledby="checkout-title" onCancel={event=>{event.preventDefault();if(!busy)onClose()}}>
  <button className={s.close} onClick={onClose} disabled={busy} aria-label="Close plan selection">×</button>
  <span className={s.eyebrow}>YOUR MEMBERSHIP · YOUR PERSPECTIVE</span><h2 id="checkout-title">Go deeper with Pro.</h2>


   <label className={plan==='monthly'?s.selected:''}><input type="radio" name="billing-plan" checked={plan==='monthly'} onChange={()=>setPlan('monthly')}/><span><b>Monthly</b><strong>$30 <small>/month</small></strong><em>$30 billed every month</em></span></label>
   <label className={plan==='annual'?s.selected:''}><input type="radio" name="billing-plan" checked={plan==='annual'} onChange={()=>setPlan('annual')}/><span><b>Annual <i>Save 33%</i></b><strong>$20 <small>/month</small></strong><em>$240 billed every year</em></span></label>
  </fieldset>
  <p className={s.note}>Prices in USD. Stripe may offer payment in your local currency at checkout, with the exchange rate and total shown before you pay.</p>
  <label className={s.termsConsent}><input type="checkbox" checked={accepted} onChange={event=>setAccepted(event.target.checked)} disabled={busy}/><span>I agree to the <a href="/legal/membership-2026-10-25.html" target="_blank" rel="noopener noreferrer">purchase terms</a>, including automatic renewal, <a href="/legal/membership-2026-10-25.html#cancellation" target="_blank" rel="noopener noreferrer">cancellation</a> and <a href="/legal/membership-2026-10-25.html#refunds" target="_blank" rel="noopener noreferrer">refunds</a>. No automatic refunds for unused time; mandatory rights remain protected.</span></label>
  <p className={s.note}><a href="/posts/privacypolicy/" target="_blank" rel="noopener noreferrer">Privacy policy</a> · <a href="/legal/membership-2026-10-25.html#privacy" target="_blank" rel="noopener noreferrer">Billing privacy and purchase records</a></p>
  <button className={s.primary} disabled={busy||!accepted} onClick={checkout}>{busy?'Opening secure checkout…':'Continue to secure checkout ↗'}</button>
  <p className={s.note}>Renews automatically. Cancel renewal anytime through Manage subscription.</p>
  {error&&<p role="alert" className={s.billingError}>{error}</p>}
 </dialog>;
}
