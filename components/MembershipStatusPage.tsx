import {DesktopActionText} from './DesktopAppLink';
import {useRouter} from 'next/router';
import {DESKTOP_ACCESS_PATH,desktopPaymentPending} from '../lib/desktop-access';
import Head from 'next/head';
import Link from 'next/link';
import {useCallback,useEffect,useState} from 'react';
import Header from './layout/Header';
import MembershipPlans from './MembershipPlans';
import WebsiteCheckout from './WebsiteCheckout';
import AppDownloadModal from './AppDownloadModal';
import MembershipAppAccess from './MembershipAppAccess';
import {completeWebsiteCheckout} from '../lib/website-billing';
import StripeMembershipManager from './StripeMembershipManager';
import {useSiteAccount} from './SiteAccount';
import {accountLoginUrl} from '../lib/site-auth';
import {fetchMembershipStatus,billingManagementUrl,type MembershipStatus,type MembershipSubscription} from '../lib/membership-status';
import s from '../styles/Membership.module.css';

const providerNames={apple:'Apple App Store',google:'Google Play',stripe:'Stripe',revenuecat:'App membership'};
const dateLabel=(value:string)=>new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(value));
const deadlineLabel=(value:string)=>new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit',timeZoneName:'short'}).format(new Date(value));
function SubscriptionCard({subscription,onRefresh}:{subscription:MembershipSubscription;onRefresh:()=>void}){
 const manage=billingManagementUrl(subscription.managementUrl);
 const [manageOpen,setManageOpen]=useState(false);
 return <article className={s.subscription}>
  <div className={s.planHeading}><h2>{subscription.planName}</h2><span className={s.badge}>{subscription.status==='trialing'?'Trial active':subscription.status==='grace_period'?'Payment needs attention':'Active'}</span></div>
  <dl>
   <div><dt>Membership</dt><dd>{subscription.tier==='ultra'?'Ultra · Pro included':subscription.tier==='ultra_addon'?'Ultra add-on · Pro required':'Pro · Full access'}</dd></div>
   <div><dt>Billing through</dt><dd>{providerNames[subscription.provider]||'App membership'}</dd></div>
   {subscription.billingPeriod&&<div><dt>Plan</dt><dd>{subscription.billingPeriod}</dd></div>}
   <div><dt>{subscription.expiresAt?(subscription.status==='trialing'?'Trial ends':subscription.status==='grace_period'?'Payment grace ends':subscription.willRenew===true?'Renews on':'Access until'):'Access'}</dt><dd>{subscription.expiresAt?(subscription.status==='grace_period'?deadlineLabel(subscription.expiresAt):dateLabel(subscription.expiresAt)):'No expiry date'}</dd></div>
  </dl>
  {subscription.status==='grace_period'&&<p className={s.note}>Your renewal payment needs attention. Update your card before the 48-hour grace period ends to keep Pro access.</p>}
  {subscription.expiresAt&&subscription.willRenew===false&&<p className={s.note}>Renewal is off. Your access continues until the date above.</p>}
  {subscription.provider==='stripe'?<button className={s.secondary} onClick={()=>setManageOpen(true)}>Manage subscription & payment card</button>:manage?<a className={s.secondary} href={manage} target="_blank" rel="noopener noreferrer">Manage subscription ↗</a>:<p className={s.note}>For billing help, <a href="mailto:support@stockstobuynow.ai">contact support</a>.</p>}
  {manageOpen&&<StripeMembershipManager onClose={()=>setManageOpen(false)} onRefresh={onRefresh}/>}
 </article>;
}
export function MembershipView({membership,loading,error,onRetry,onExplorePro,paymentPending=false,onBackToMembership}:{paymentPending?:boolean;onBackToMembership?:()=>void;membership:MembershipStatus|null;loading:boolean;error:boolean;onRetry:()=>void;onExplorePro:()=>void}){
 if(loading)return <section className={s.statusPanel} aria-live="polite" aria-busy="true"><span className={s.eyebrow}>YOUR MEMBERSHIP</span><h1>Checking your membership…</h1><p>Looking up your app and website subscriptions.</p></section>;
 if(paymentPending)return <section className={s.statusPanel} role="status"><span className={s.eyebrow}>YOUR PAYMENT</span><h1>We’re confirming your payment.</h1><p>Your Pro access will appear once Stripe confirms payment. Please check again before starting another checkout.</p><div className={s.actions}><button className={s.primary} onClick={onRetry}>Check payment again</button><button className={s.secondary} onClick={onBackToMembership}>Back to membership</button></div></section>;
 if(error||!membership||membership.status==='unknown')return <section className={s.statusPanel} role="status"><span className={s.eyebrow}>YOUR MEMBERSHIP</span><h1>Let’s check again.</h1><p>We couldn’t verify your membership right now. Please retry before choosing another plan.</p><button className={s.primary} onClick={onRetry}>Check membership again</button><p className={s.note}>Need help? <a href="mailto:support@stockstobuynow.ai">Contact support</a>.</p></section>;
 if(membership.status==='inactive'&&membership.needsPaymentUpdate)return <section className={s.statusPanel}><span className={s.eyebrow}>PAYMENT NEEDS ATTENTION</span><h1>Let’s restore your Pro access.</h1><p>Your existing Stripe membership needs a payment update. Use Manage Stripe billing below to update your card and settle payment, rather than purchasing a second subscription.</p><button className={s.secondary} onClick={onRetry}>I’ve updated payment — check again</button></section>;
 if(membership.status==='inactive')return <><div className={s.freeNotice}><span className={s.eyebrow}>YOUR CURRENT PLAN · FREE</span><p>Explore the market for free, or choose Pro to go deeper.</p><button onClick={onRetry}>Already subscribed? Check again ↻</button></div><MembershipPlans onExplorePro={onExplorePro}/></>;
 return <section className={s.active}>
  <header><span className={s.eyebrow}>YOUR MEMBERSHIP</span><h1>Your perspective.<br/>With {membership.hasUltra?'Ultra':'Pro'}.</h1><p>Your membership is recognized on this account, including subscriptions purchased in the app.</p></header>
  <div className={s.subscriptionGrid}>{membership.subscriptions.map((subscription,index)=><SubscriptionCard key={[subscription.provider,subscription.productId,index].join(':')} subscription={subscription} onRefresh={onRetry}/>)}</div>
  <div className={s.actions}><Link className={s.primary} href="/stock-market-heatmap/">Explore the market ↗</Link>{!membership.hasUltra&&<Link className={s.secondary} href="/ultra/">Join Ultra →</Link>}<button className={s.secondary} onClick={onRetry}>Refresh membership</button></div>
  <p className={s.note}>Use the same sign-in account on the website and in the app to access your membership.</p>
 </section>;
}
export default function MembershipStatusPage(){
 const {user,ready,error:authError}=useSiteAccount();
 const router=useRouter();
 const [version,setVersion]=useState(0),[checkout,setCheckout]=useState(false),[manageBilling,setManageBilling]=useState(false),[appDownload,setAppDownload]=useState(false),[welcomeUid,setWelcomeUid]=useState<string|null>(null);
 const [state,setState]=useState<{uid:string;loading:boolean;error:boolean;value:MembershipStatus|null;pending?:boolean}>({uid:'',loading:false,error:false,value:null});
 const uid=user?.uid;
 useEffect(()=>{setManageBilling(false);setCheckout(false);setAppDownload(false);setWelcomeUid(null)},[uid]);
 const refresh=useCallback(()=>setVersion(value=>value+1),[]);
 useEffect(()=>{
  if(!ready||!uid)return;
  let current=true;
  setState({uid,loading:true,error:false,value:null});
  const sessionId=new URLSearchParams(window.location.search).get('session_id');
  const request=sessionId?completeWebsiteCheckout(sessionId):fetchMembershipStatus(uid);
  request.then(value=>{if(!current)return;const confirmed='checkoutConfirmed' in value&&value.checkoutConfirmed===true;
   if(sessionId&&confirmed){setWelcomeUid(uid);window.history.replaceState(window.history.state,'','/membership/')}
   setState({uid,loading:false,error:false,value,pending:!!sessionId&&!confirmed&&value.status==='inactive'});})
   .catch(()=>{if(current)setState({uid,loading:false,error:true,value:null})});
  return()=>{current=false};
 },[ready,uid,version]);
 useEffect(()=>{
  if(!uid)return;
  window.addEventListener('focus',refresh);
  return()=>window.removeEventListener('focus',refresh);
 },[uid,refresh]);
 const own=uid&&state.uid===uid;
 useEffect(()=>{if(uid&&own&&!state.loading&&!state.error&&!state.pending&&state.value?.status==='active'&&state.value.isActive&&desktopPaymentPending(uid))void router.replace(DESKTOP_ACCESS_PATH)},[uid,own,state,router]);
 return <><Head><title>My membership | Stocks To Buy Now AI</title><meta name="robots" content="noindex,follow"/></Head>
  <div className={s.page}><Header homeHref="/" navBasePath="/" forceDark hideAppDownload/>
   <main className={s.main}><Link className={s.back} href="/">← Back to home</Link>
    {user&&welcomeUid===uid&&own&&state.value?.status==='active'&&!state.loading&&<MembershipAppAccess purchased pro onGetApp={()=>setAppDownload(true)}/>}
    {!ready?<section className={s.statusPanel} role="status"><h1>Checking your account…</h1></section>:authError?<section className={s.statusPanel}><h1>Let’s reconnect your account.</h1><p>Your account couldn’t be loaded. Sign in again to check your membership.</p><Link className={s.primary} href={accountLoginUrl('/membership/')}>Sign in</Link></section>:!user?<><div className={s.signInNotice}><div><strong>Already a member?</strong><p>Sign in with the same account you use in the app to see your membership.</p></div><Link className={s.secondary} href={accountLoginUrl('/membership/')}>Sign in →</Link></div><MembershipPlans/></>:<MembershipView membership={own?state.value:null} loading={!own||state.loading} error={own&&state.error} onRetry={refresh} onExplorePro={()=>setCheckout(true)} paymentPending={!!(own&&state.pending)} onBackToMembership={()=>{window.history.replaceState(window.history.state,'','/membership/');refresh()}}/>}
    {user&&own&&state.value?.status==='inactive'&&state.value.hasStripeBilling&&<div className={s.actions}><button className={s.secondary} onClick={()=>setManageBilling(true)}>Manage Stripe billing, cards & invoices</button></div>}
    {welcomeUid===uid&&user?<div className={s.appDownloadFooter}><p>Ready to use Pro? Sign in to the app with this same account.</p><button className={s.primary} onClick={()=>setAppDownload(true)}><DesktopActionText>{'Get the App ↗'}</DesktopActionText></button></div>:<MembershipAppAccess pro={!!(user&&own&&state.value?.status==='active')} onGetApp={()=>setAppDownload(true)}/>}
   </main>
  </div>{manageBilling&&user&&<StripeMembershipManager onClose={()=>setManageBilling(false)} onRefresh={refresh}/>} {checkout&&<WebsiteCheckout onClose={()=>setCheckout(false)}/>} {appDownload&&<AppDownloadModal placement="membership_app_access" title={own&&state.value?.status==='active'?"Get the app. Your Pro account is ready.":"Get the app for iPhone or Android."} description="Download the app, then sign in with the same account you used on this website. If you have an active Pro membership, it will be recognized." onClose={()=>setAppDownload(false)}/>}
 </>;
}
