import {useEffect,useState,type PointerEvent} from 'react';
import {AccountLink,useSiteAccount} from './SiteAccount';
import {canOfferMembership,refreshMembershipStatus} from '../lib/membership-status';
import styles from '../styles/DesktopProduct.module.css';
function movePlanLight(event:PointerEvent<HTMLAnchorElement>){
 if(event.pointerType==='touch')return;
 const card=event.currentTarget,bounds=card.getBoundingClientRect();
 card.style.setProperty('--plan-light-x',`${event.clientX-bounds.left}px`);
 card.style.setProperty('--plan-light-y',`${event.clientY-bounds.top}px`);
 card.dataset.pointerLight='true';
}
function clearPlanLight(event:PointerEvent<HTMLAnchorElement>){delete event.currentTarget.dataset.pointerLight;}
export default function MembershipPlans({onExplorePro,onExploreFree,verifiedInactive=false,onboarding=false}:{onExplorePro?:()=>void;onExploreFree?:()=>void;verifiedInactive?:boolean;onboarding?:boolean}={}){
 const {user,ready}=useSiteAccount(),uid=user?.uid;
 const [visible,setVisible]=useState(()=>ready&&(!user||verifiedInactive));
 useEffect(()=>{
  if(!ready){setVisible(false);return}
  if(!uid){setVisible(true);return}
  if(verifiedInactive){setVisible(true);return}
  // Never expose purchase cards while a signed-in account is being refreshed.
  // Membership pages restore the cached entitlement; this shared sales block
  // stays hidden until the refresh explicitly confirms an inactive account.
  setVisible(false);
  let current=true;
  refreshMembershipStatus(uid).then(value=>{
   if(current)setVisible(canOfferMembership(value));
  }).catch(()=>{
   // A failed verification is not permission to sell a second subscription.
   if(current)setVisible(false);
  });
  return()=>{current=false};
 },[ready,uid,verifiedInactive]);
 if(!visible)return null;
 return <section className={styles.memberships} id="memberships" aria-labelledby="membership-title">
 <header><span className={styles.eyebrow}>MEMBERSHIP</span><h2 id="membership-title">More perspective.<br/>Your choice.</h2><p>{onboarding?'Start your free trial in the app, or go deeper with Pro.':'Start exploring for free. Go deeper with Pro.'}</p></header>
 <div className={styles.plans}>
 <AccountLink onPointerEnter={movePlanLight} onPointerMove={movePlanLight} onPointerLeave={clearPlanLight} onPointerCancel={clearPlanLight} destination="/stock-market-heatmap/" onClick={event=>{if(onExploreFree&&user){event.preventDefault();onExploreFree()}}} className={styles.plan}><span className={styles.planTag}>EXPLORE</span><h3>{onboarding?'Free trial':'Free'}</h3><p className={styles.planLead}>Your daily view of the market.</p><p>Get oriented with public market tools and research previews.</p><ul><li>Market heatmaps and biggest movers</li><li>Public news and research previews</li><li>Earnings and market calendars</li><li>Options strategies and payoff tools</li><li>Receive live alerts straight to your phone</li></ul><span className={styles.secondary}>{onExploreFree?'Start your free trial in the app':'Explore the market'} <span aria-hidden="true">↗</span></span></AccountLink>
 <AccountLink data-local-account-action={onExplorePro&&user?'true':undefined} onPointerEnter={movePlanLight} onPointerMove={movePlanLight} onPointerLeave={clearPlanLight} onPointerCancel={clearPlanLight} destination="/membership/" onClick={event=>{if(onExplorePro&&user){event.preventDefault();onExplorePro()}}} className={`${styles.plan} ${styles.pro}`}><span className={styles.planTag}>GO DEEPER</span><h3>Pro <span>FULL ACCESS</span></h3><div className={styles.planPricing} aria-label="Pro pricing"><div className={styles.monthlyPrice}><strong>$30<span>/month</span></strong><span>Monthly billing</span></div><div className={styles.annualPrice}><div className={styles.priceHeading}><span>ANNUAL OFFER</span><b>33% OFF</b></div><strong>$20<span>/month</span></strong><span className={styles.usualPrice}>Usually <s>$30/month</s></span><span className={styles.billingTotal}>$240 billed annually · Usually $360/year</span></div></div><p className={styles.planLead}>Bring the research into focus.</p><p>Unlock member insights and the tools to explore each idea in the app. Live Pro web launches December 1, 2026, with a live video demo.</p><ul><li>Short- and long-term signals</li><li>Ask what stocks and options to buy now</li><li>Review admins’ live portfolios and trades</li><li>Unlock access to community insights</li><li>Receive live alerts straight to your phone</li></ul><span className={styles.primary}>Explore Pro <span aria-hidden="true">↗</span></span></AccountLink>
 </div><p className={styles.disclosure}>Research and educational tools. Investing involves risk; membership does not guarantee returns.</p>
 </section>}
