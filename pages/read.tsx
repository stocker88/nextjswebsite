import {useEffect,useState} from 'react';
import {useRouter} from 'next/router';
import ResearchPage from '../components/ResearchPage';
import {ContentAccessPanel} from '../components/ContentAccess';
import {useSiteAccount} from '../components/SiteAccount';
import {accountDestination} from '../lib/site-auth';
import {bandAccess,bandReadUrl} from '../lib/band-access';
import {refreshMembershipStatus,type MembershipStatus} from '../lib/membership-status';
export default function ReadResearch() {
 const router=useRouter(),{user,ready}=useSiteAccount();
 const raw=typeof router.query.next==='string'?router.query.next:'';
 const destination=accountDestination(raw),valid=raw===destination&&/^\/(?:results|stock-market-news|news|catalysts)\//.test(destination);
 const [state,setState]=useState<{uid:string;membership?:MembershipStatus;error?:boolean}|null>(null),[attempt,setAttempt]=useState(0);
 useEffect(()=>{if(!user)return;let active=true;const uid=user.uid;setState(null);refreshMembershipStatus(uid).then(membership=>{if(active)setState({uid,membership})}).catch(()=>{if(active)setState({uid,error:true})});return()=>{active=false}},[user?.uid,attempt]);
 const own=user&&state?.uid===user.uid?state:null,access=bandAccess(!!user,own?.membership||null,destination.startsWith('/results/'));
 useEffect(()=>{if(ready&&valid&&access==='allowed')void router.replace(destination)},[ready,valid,access,destination,router]);
 return <ResearchPage title="Open research" path="/read/" noindex hideAppDownload><div style={{minHeight:'60vh',display:'grid',placeItems:'center',padding:'24px 0'}}>
 {!router.isReady||!ready?<p role="status">Checking your account…</p>:!valid?<p>This research link is unavailable.</p>:own?.error?<ContentAccessPanel destination={bandReadUrl(destination)} error onRetry={()=>setAttempt(n=>n+1)}/>:access==='checking'||access==='allowed'?<p role="status">Checking your membership…</p>:<ContentAccessPanel destination={bandReadUrl(destination)} kind={access==='ultra'?'ultra':access==='pro'?'pro':'article'} onRetry={()=>setAttempt(n=>n+1)}/>}
 </div></ResearchPage>;
}
