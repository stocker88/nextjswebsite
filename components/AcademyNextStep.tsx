import Link from 'next/link';
import {useEffect,useState} from 'react';
import {useSiteAccount} from './SiteAccount';
import {refreshMembershipStatus} from '../lib/membership-status';
import {mobileStoreUrl} from '../lib/mobile-app';
import {accountLoginUrl} from '../lib/site-auth';
import {trackAppStoreClick} from '../lib/analytics';
export default function AcademyNextStep({className}:{className:string}){
 const {user,ready,desktop}=useSiteAccount();
 const [proUid,setProUid]=useState<string|null>(null);
 const [store,setStore]=useState(mobileStoreUrl(''));
 useEffect(()=>setStore(mobileStoreUrl(navigator.userAgent)),[]);
 useEffect(()=>{
  let live=true;setProUid(null);
  if(ready&&user)void refreshMembershipStatus(user.uid).then(m=>{
   if(live&&m.billingVerified===true&&m.hasPro===true&&m.isActive)setProUid(user.uid);
  }).catch(()=>{/* Unknown access must not offer Ultra. */});
  return()=>{live=false;};
 },[ready,user?.uid]);
 if(ready&&user&&proUid===user.uid)return <Link className={className} href="/ultra/">Explore Ultra</Link>;
 if(desktop)return <Link className={className} href={user?'/membership/':accountLoginUrl('/membership/')}>Get Started →</Link>;
 return <a className={className} data-public-store-link="true" href={store} onClick={()=>{try{trackAppStoreClick({store:store.includes('play.google.com')?'google':'apple',placement:'academy_certificate',linkUrl:store});}catch{/* Downloads must remain available. */}}}>More content in the App →</a>;
}
