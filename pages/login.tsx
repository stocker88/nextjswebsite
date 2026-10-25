import Head from 'next/head';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {useRouter} from 'next/router';
import {useSiteAccount} from '../components/SiteAccount';
import {accountDestination} from '../lib/site-auth';
import MoreSignInOptions from '../components/MoreSignInOptions';
import {signInSite,pendingSiteLink,completePendingSiteLink,clearPendingSiteLink,providerNames,siteSignInError,type SiteProvider} from '../lib/site-sign-in';
import s from '../styles/AccountLogin.module.css';

export default function AccountLogin(){
 const router=useRouter(),{user,ready}=useSiteAccount();
 const [busy,setBusy]=useState<string|null>(null),[error,setError]=useState('');
 const [linkRequest,setLinkRequest]=useState(pendingSiteLink);
 const destination=accountDestination(router.query.next);
 const appAccessDestination=destination==='/continue/';
 const ultraDestination=destination==='/ultra/';
 const resultsDestination=destination.startsWith('/results/');
 const articleDestination=!ultraDestination&&!appAccessDestination&&!resultsDestination&&destination!=='/membership/'&&destination!=='/stock-market-heatmap/';
 useEffect(()=>{if(router.isReady&&ready&&user&&!pendingSiteLink())void router.replace(destination)},[router.isReady,ready,user,destination,router,linkRequest]);
 async function signIn(provider:SiteProvider){
  if(busy)return;setBusy(provider);setError('');
  try{await signInSite(provider);setLinkRequest(pendingSiteLink());if(!pendingSiteLink())await router.replace(destination)}
  catch(cause){const code=(cause as {code?:string}).code;if(code!=='auth/popup-closed-by-user'&&code!=='auth/cancelled-popup-request')setError(siteSignInError(cause));setLinkRequest(pendingSiteLink())}
  finally{setBusy(null)}
 }
 async function confirmLink(){setBusy('link');setError('');try{await completePendingSiteLink();setLinkRequest(null);await router.replace(destination)}catch(cause){setError(siteSignInError(cause))}finally{setBusy(null)}}

 return <><Head><title>Get started | Stocks To Buy Now AI</title><meta name="robots" content="noindex,follow"/></Head><main className={s.page}><Link className={s.back} href="/">← Back to home</Link><section className={s.card} aria-labelledby="account-login-title"><Link href="/" aria-label="Stocks To Buy Now AI home"><img src="/assets/images/stockerRobotIcon.png" alt="" width="64" height="64"/></Link><span className={s.eyebrow}>YOUR ACCOUNT · YOUR PERSPECTIVE</span><h1 id="account-login-title">Let’s get started!</h1><p>Create an account or sign in to {ultraDestination?'explore Ultra':appAccessDestination?'access your research':resultsDestination?'explore Results':articleDestination?'continue reading this article':destination==='/membership/'?'explore your membership':'explore the market'}.</p>{resultsDestination&&<p className={s.hint}>Sign in to browse results. Full results analysis requires Ultra membership.</p>}<div className={s.providers}><button disabled={!!busy} onClick={()=>void signIn('google')}><svg aria-hidden="true" viewBox="0 0 24 24"><path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.52h3.24c1.9-1.75 2.98-4.33 2.98-7.37Z"/><path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.4l-3.24-2.52c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.06v2.6A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.41 13.92A6 6 0 0 1 6.1 12c0-.67.11-1.31.31-1.92v-2.6H3.06A10 10 0 0 0 2 12c0 1.61.38 3.14 1.06 4.52l3.35-2.6Z"/><path fill="#EA4335" d="M12 5.96c1.47 0 2.79.51 3.82 1.51l2.87-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.94 5.48l3.35 2.6A5.98 5.98 0 0 1 12 5.96Z"/></svg>{busy==='google'?'Signing in…':'Continue with Google'}</button><button className={s.apple} disabled={!!busy} onClick={()=>void signIn('apple')}><svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path d="M16.7 12.8c0-2 1.6-3 1.7-3.1-1-1.4-2.4-1.6-2.9-1.6-1.3-.1-2.6.8-3.3.8-.6 0-1.7-.8-2.8-.8-1.5 0-2.8.8-3.5 2.1-1.5 2.6-.4 6.4 1 8.5.7 1 1.5 2.1 2.6 2.1 1-.1 1.4-.7 2.7-.7s1.6.7 2.8.7c1.1 0 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.4-.1 0-1.9-.7-1.9-3.6ZM14.5 6.7c.6-.8 1.1-1.9 1-3-.9 0-2 .6-2.7 1.4-.6.7-1.2 1.8-1 2.9 1 .1 2-.5 2.7-1.3Z"/></svg>{busy==='apple'?'Signing in…':'Continue with Apple'}</button></div><MoreSignInOptions busy={!!busy} onSelect={provider=>void signIn(provider)}/>{linkRequest&&user&&<div className={s.linkConfirm}><p>Link {providerNames[linkRequest.provider]} to your signed-in account? Your profile, membership and saved content stay on this account.</p><button disabled={!!busy} onClick={()=>void confirmLink()}>Link {providerNames[linkRequest.provider]}</button><button disabled={!!busy} onClick={()=>{clearPendingSiteLink();setLinkRequest(null);void router.replace(destination)}}>Continue without linking</button></div>}{error&&<p className={s.error} role="alert">{error}</p>}<p className={s.hint}>Already use the app? Continue with the same Google or Apple account.</p><div className={s.footer}>Stocks To Buy Now AI <span>Secure account sign-in</span></div></section></main></>;
}
