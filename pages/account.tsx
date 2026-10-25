import Head from 'next/head';
import AccountDevices from '../components/AccountDevices';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {useRouter} from 'next/router';
import {useSiteAccount} from '../components/SiteAccount';
import {accountLoginUrl} from '../lib/site-auth';
import {linkSiteProvider,providerEnabled,providerIds,providerNames,siteSignInError,type SiteProvider} from '../lib/site-sign-in';
import s from '../styles/AccountLogin.module.css';
export default function Account(){
 const {user,ready}=useSiteAccount(),router=useRouter();
 const [linked,setLinked]=useState<string[]>([]),[busy,setBusy]=useState<string|null>(null),[message,setMessage]=useState('');
 useEffect(()=>{if(ready&&!user)void router.replace(accountLoginUrl('/account/'));if(user)setLinked(user.providerData.map(item=>item.providerId))},[ready,user,router]);
 async function link(provider:SiteProvider){setBusy(provider);setMessage('');try{const sameUser=await linkSiteProvider(provider);setLinked(sameUser.providerData.map(item=>item.providerId));setMessage(`${providerNames[provider]} linked. Your existing account and membership are unchanged.`)}catch(cause){setMessage(siteSignInError(cause))}finally{setBusy(null)}}
 return <><Head><title>Account &amp; sign-in methods | Stocks To Buy Now AI</title><meta name="robots" content="noindex,follow"/></Head><main className={s.page}><Link className={s.back} href="/">← Back to home</Link><section className={s.card}><span className={s.eyebrow}>YOUR ACCOUNT</span><h1>Account settings</h1>{user?<><p>Signed in as <strong>{user.displayName||user.email||'your account'}</strong>.</p><p><a href="#devices-title" style={{color:"#c3b1ff"}}>Manage signed-in devices ↓</a></p><h2 style={{fontSize:22}}>Sign-in methods</h2><p>Connect another method to this same account. Your membership, posts and saved content stay together.</p><div className={s.providers}>{(['google','apple','twitter','facebook'] as const).map(provider=><button key={provider} disabled={!!busy||linked.includes(providerIds[provider])||!providerEnabled(provider)} onClick={()=>void link(provider)}>{providerNames[provider]} · {linked.includes(providerIds[provider])?'Linked':!providerEnabled(provider)?'Setup pending':busy===provider?'Linking…':'Link to this account'}</button>)}</div><p className={s.hint}>If a method belongs to another account, it cannot be moved here automatically. Contact support for help.</p>{message&&<p role="status">{message}</p>}<AccountDevices/></>:<p>Checking your account…</p>}</section></main></>;
}
