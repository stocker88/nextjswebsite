import Link from 'next/link';
import {useSiteAccount} from './SiteAccount';
import {accountLoginUrl} from '../lib/site-auth';
import s from '../styles/ContentAccess.module.css';

export function ContentAccessPanel({destination,kind='article',checking=false,error=false,onRetry}:{destination:string;kind?:'article'|'results'|'ultra'|'pro';checking?:boolean;error?:boolean;onRetry?:()=>void}){
 const {user}=useSiteAccount();
 const pro=kind==='pro'&&!!user;
 const ultra=kind==='ultra'&&!!user,resultReader=kind==='ultra'&&!user;
 if(checking)return null;
 return <section className={`${s.panel} ${kind==='ultra'?s.ultra:''}`} aria-label={ultra?'Ultra membership access':pro?'Pro membership access':'Sign in to continue'}>
  <span className={s.icon} aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 10V7a5 5 0 0 1 10 0v3M5 10h14v11H5zM12 14v3"/></svg></span>
  <div className={s.copy}><span className={s.eyebrow}>{ultra?'ULTRA MEMBERSHIP':pro?'PRO MEMBERSHIP':'YOUR ACCOUNT · YOUR RESEARCH'}</span>
   <h2>{error?'We couldn’t verify your access':ultra?'Get Ultra':pro?'Get Pro':resultReader?'Sign in to view full results':kind==='results'?'Sign in to explore Results':'Sign in to continue reading'}</h2>
   <p>{error?'Please check your connection and try again.':pro?'Open the full news and research with an active Pro membership.':ultra?'The full results analysis, contract breakdown and detailed charts are included with Ultra. You can still view the preview and explore company research.':resultReader?'Sign in with the same account you use in the app. The full results analysis requires an Ultra membership.':kind==='results'?'Create an account or sign in to browse options results. Full results analysis requires Ultra.':'The preview is available to everyone. Sign in to open the full article using the same account you use in the app.'}</p>
   <div className={s.actions}>{error?<button onClick={onRetry}>Try again</button>:ultra?<><Link href="/ultra/">Get Ultra</Link><button className={s.secondary} onClick={onRetry}>Refresh access</button></>:pro?<Link href="/membership/">Get Pro</Link>:<Link href={accountLoginUrl(destination)}>Sign in or create an account <span aria-hidden="true">→</span></Link>}</div>
  </div>
 </section>;
}
