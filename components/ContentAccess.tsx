import Link from 'next/link';
import {useSiteAccount} from './SiteAccount';
import {accountLoginUrl} from '../lib/site-auth';
import s from '../styles/ContentAccess.module.css';

export function ContentAccessPanel({destination,kind='article',checking=false,error=false,onRetry}:{destination:string;kind?:'article'|'results'|'ultra';checking?:boolean;error?:boolean;onRetry?:()=>void}){
 const {user}=useSiteAccount();
 const ultra=kind==='ultra'&&!!user,resultReader=kind==='ultra'&&!user;
 return <section className={`${s.panel} ${kind==='ultra'?s.ultra:''}`} aria-label={checking?'Checking access':ultra?'Ultra membership access':'Sign in to continue'} aria-busy={checking}>
  <span className={s.icon} aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 10V7a5 5 0 0 1 10 0v3M5 10h14v11H5zM12 14v3"/></svg></span>
  <div className={s.copy}><span className={s.eyebrow}>{ultra?'ULTRA MEMBERSHIP':'YOUR ACCOUNT · YOUR RESEARCH'}</span>
   <h2>{checking?'Checking your access…':error?'We couldn’t verify your access':ultra?'Go deeper with Ultra':resultReader?'Sign in to view full results':kind==='results'?'Sign in to explore Results':'Sign in to continue reading'}</h2>
   <p>{checking?'This will only take a moment.':error?'Please check your connection and try again.':ultra?'The full results analysis, contract breakdown and detailed charts are included with Ultra. You can still view the preview and explore company research.':resultReader?'Sign in with the same account you use in the app. The full results analysis requires an Ultra membership.':kind==='results'?'Create an account or sign in to browse options results. Full results analysis requires Ultra.':'The preview is available to everyone. Sign in to open the full article using the same account you use in the app.'}</p>
   {!checking&&<div className={s.actions}>{error?<button onClick={onRetry}>Try again</button>:ultra?<><Link href="/ultra/">Join Ultra</Link><button className={s.secondary} onClick={onRetry}>Refresh access</button></>:<Link href={accountLoginUrl(destination)}>Sign in or create an account <span aria-hidden="true">→</span></Link>}</div>}
  </div>
 </section>;
}
