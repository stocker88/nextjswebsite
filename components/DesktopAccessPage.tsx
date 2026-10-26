import Head from 'next/head';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {useRouter} from 'next/router';
import Header from './layout/Header';
import {useSiteAccount} from './SiteAccount';
import AppDownloadOptions from './AppDownloadOptions';
import {LaunchCalendarButton} from './MembershipAppAccess';
import {lastKnownMembershipStatus,refreshMembershipStatus,type MembershipStatus} from '../lib/membership-status';
import {accountLoginUrl} from '../lib/site-auth';
import {DESKTOP_ACCESS_PATH,desktopAccessDecision,rememberDesktopPayment,clearDesktopPayment,desktopThread} from '../lib/desktop-access';
import s from '../styles/AccountLogin.module.css';
export default function DesktopAccessPage(){
 const {user,ready,error:authError}=useSiteAccount(),router=useRouter();
 const [attempt,setAttempt]=useState(0),[threadId,setThreadId]=useState<string|null>(null);
 const [state,setState]=useState<{uid:string;value:MembershipStatus|null;error:boolean}|null>(()=>user?{uid:user.uid,value:lastKnownMembershipStatus(user.uid),error:false}:null);
 useEffect(()=>{setThreadId(desktopThread())},[]);
 useEffect(()=>{
  if(!ready)return;
  if(!user){if(!authError)void router.replace(accountLoginUrl(DESKTOP_ACCESS_PATH));return;}
  let active=true;const uid=user.uid,cached=lastKnownMembershipStatus(uid);setState(previous=>previous?.uid===uid&&previous.value?previous:cached?{uid,value:cached,error:false}:null);
  refreshMembershipStatus(uid).then(value=>{if(active)setState({uid,value,error:false})}).catch(()=>{if(active)setState(previous=>previous?.uid===uid&&previous.value?previous:{uid,value:null,error:true})});
  return()=>{active=false};
 },[ready,user?.uid,attempt,authError,router]);
 const own=user&&state?.uid===user.uid?state:null;
 const decision=desktopAccessDecision(ready,!!user,own?.value||null);
 const checking=!ready||!!user&&!own;
 useEffect(()=>{
  if(!user||!own)return;
  if(decision==='payment'){rememberDesktopPayment(user.uid);void router.replace('/membership/?continue=app');}
  if(decision==='download')clearDesktopPayment();
 },[decision,user?.uid,own,router]);
 return <><Head><title>Continue your research | Stocks To Buy Now AI</title><meta name="robots" content="noindex,follow"/></Head><Header homeHref="/" navBasePath="/" forceDark hideAppDownload/>
  <main className={s.page}>{!checking&&<section className={`${s.card} research-access-card`} aria-live="polite" aria-busy={decision==='payment'}>
   <Link href="/" className="research-back">← Back to home</Link><span className={s.eyebrow}>YOUR ACCOUNT · YOUR RESEARCH</span>
   {decision==='download'?<><h1>Your membership is ready.</h1><p>Get the app and sign in with the same account you’re using here to access your membership.</p><AppDownloadOptions placement="verified_desktop_access" showQR threadId={threadId}/><p className={s.hint}>Live Pro web launches December 1, 2026, with a live video demo.</p><LaunchCalendarButton/></>:decision==='payment'?<><h1>Choose your membership.</h1><p>Taking you to your payment and membership options…</p><Link href="/membership/?continue=app">View membership options →</Link></>:decision==='login'?<><h1>{authError?'Let’s reconnect your account.':'Sign up to continue.'}</h1><p>Use the same sign-in account you use in the app.</p><Link href={accountLoginUrl(DESKTOP_ACCESS_PATH)}>Sign in or create an account →</Link></>:<><h1>Let’s check again.</h1><p>Your membership couldn’t be verified. Please retry before choosing another plan.</p><div className={s.providers}><button onClick={()=>setAttempt(n=>n+1)}>Check membership again</button></div><Link href="/membership/">Manage membership →</Link></>}
  </section>}</main><style jsx>{`.research-back{display:block;margin-bottom:24px;color:#c9b6ec;text-decoration:none;font-size:14px}:global(.research-access-card){width:min(680px,100%);max-width:680px;box-sizing:border-box;margin-top:45px}`}</style>
 </>;
}
