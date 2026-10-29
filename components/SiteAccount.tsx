import {bandReadUrl} from '../lib/band-access';
import {DESKTOP_ACCESS_PATH,rememberDesktopThread} from '../lib/desktop-access';
import {contentClickDestination} from '../lib/content-access';
import AccountDevices from './AccountDevices';
import DeviceCapacityNotice from './DeviceCapacityNotice';
import {accountDevicesEnabled,registerWebsiteDevice,checkWebsiteDevice,signOutWebsiteDevice,type DeviceNotice} from '../lib/account-devices';
import deviceStyle from '../styles/AccountLogin.module.css';
import {createContext,useCallback,useContext,useEffect,useState,type AnchorHTMLAttributes,type ReactNode} from 'react';
import {useRouter} from 'next/router';
import {isDesktopDevice,isAppDestination} from '../lib/device-access';
import type {User} from 'firebase/auth';
import {getSiteAuth,accountLoginUrl} from '../lib/site-auth';
import {rememberSiteAccount} from '../lib/site-account-hint';
import {preloadMembershipStatus} from '../lib/membership-status';
import ProfileOnboardingGate from './ProfileOnboarding';
const AccountContext=createContext<{user:User|null;ready:boolean;error:boolean;desktop:boolean}>({user:null,ready:false,error:false,desktop:false});
export function SiteAccountProvider({children}:{children:ReactNode}){
 const router=useRouter();
 const [desktop,setDesktop]=useState(false);
 useEffect(()=>{const value=isDesktopDevice(navigator);setDesktop(value);document.documentElement.dataset.desktopDevice=String(value);return()=>{delete document.documentElement.dataset.desktopDevice}},[]);
 const [deviceState,setDeviceState]=useState<'checking'|'allowed'|'limit'|'error'>('checking');
 const [supportSkip,setSupportSkip]=useState(false);
 const [retry,setRetry]=useState(0);
 const [profileReadyUid,setProfileReadyUid]=useState<string|null>(null);
 const [capacityNotice,setCapacityNotice]=useState<(DeviceNotice&{uid:string})|null>(null);
 function presentDeviceNotice(notice:DeviceNotice|null|undefined,uid:string){
  if(!notice){setCapacityNotice(old=>old?.uid===uid&&old.kind==='warning'?null:old);return;}
  const key='deviceCapacityNoticeSeen:'+uid,identity=notice.id+':'+notice.kind;
  try{if(localStorage.getItem(key)===identity)return;localStorage.setItem(key,identity);}catch{/* The notice still works if storage is unavailable. */}
  setCapacityNotice({...notice,uid});
 }
 const [state,setState]=useState({user:null as User|null,ready:false,error:false});
 useEffect(()=>{
  let active=true,stop:undefined|(()=>void);
  Promise.all([getSiteAuth(),import('firebase/auth')]).then(([auth,sdk])=>{
   if(!active)return;
   stop=sdk.onAuthStateChanged(auth,user=>{
    rememberSiteAccount(user);
    // Auth is ready independently of the background device admission check.
    setSupportSkip(false);setDeviceState('checking');setState({user,ready:true,error:false});
    setProfileReadyUid(current=>current===user?.uid?current:null);
    setCapacityNotice(old=>user&&old?.uid!==user.uid?null:old);
    if(!user)return;
    // Keep membership checks off the destination page. Most members will have
    // a verified result ready before they open Membership from the site.
    void preloadMembershipStatus(user.uid).catch(()=>{/* A later click can retry without interrupting this page. */});
   },()=>setState({user:null,ready:true,error:true}));
  }).catch(()=>{if(active)setState({user:null,ready:true,error:true})});
  return()=>{active=false;stop?.()};
 },[]);
 const profileReady=!!state.user&&profileReadyUid===state.user.uid;
 const handleProfileReady=useCallback((uid:string,ready:boolean)=>setProfileReadyUid(current=>ready?uid:current===uid?null:current),[]);
 useEffect(()=>{
  const user=state.user;
  if(!user||!profileReady)return;
  if(!accountDevicesEnabled){setDeviceState('allowed');return}
  let active=true;
  const uid=user.uid;
  setSupportSkip(false);setDeviceState('checking');
  registerWebsiteDevice().then(result=>{if(active){presentDeviceNotice(result.deviceNotice,uid);setDeviceState('allowed')}}).catch(async cause=>{
   if(!active)return;
   const auth=await getSiteAuth().catch(()=>null);
   if(!auth||auth.currentUser?.uid!==uid)return;
   const sdk=await import('firebase/auth');
   if(cause?.details?.reason==='device-revoked'){await sdk.signOut(auth);return}
   if(cause?.details?.reason==='device-capacity'){presentDeviceNotice(cause.details.deviceNotice,uid);await sdk.signOut(auth);return}
   setSupportSkip(cause?.details?.canSupportSkip===true);
   setDeviceState(cause?.code==='functions/resource-exhausted'?'limit':'error');
  });
  return()=>{active=false};
 },[state.user?.uid,profileReady,retry]);
 useEffect(()=>{
  if(!accountDevicesEnabled||!state.user||!profileReady||deviceState!=='allowed')return;
  let active=true,busy=false;
  const uid=state.user.uid;
  const check=async()=>{if(busy||document.hidden)return;busy=true;try{const result=await checkWebsiteDevice();const auth=await getSiteAuth();if(active&&auth.currentUser?.uid===uid){presentDeviceNotice(result.deviceNotice,uid);if(!result.allowed){const sdk=await import('firebase/auth');await sdk.signOut(auth)}}}catch{/* A connection failure is not proof of remote sign-out. */}finally{busy=false}};
  const timer=window.setInterval(()=>void check(),60000);
  const focus=()=>void check();window.addEventListener('focus',focus);document.addEventListener('visibilitychange',focus);
  return()=>{active=false;window.clearInterval(timer);window.removeEventListener('focus',focus);document.removeEventListener('visibilitychange',focus)};
 },[state.user,profileReady,deviceState]);
 useEffect(()=>{
  const gate=(event:MouseEvent)=>{
   if(event.type==='auxclick'&&event.button!==1)return;
   const link=event.target instanceof Element?event.target.closest('a[href]'):null;
   if(!(link instanceof HTMLAnchorElement))return;
   // Curated educational previews may opt into a direct public reading path.
   // This does not change the normal article/login behavior anywhere else.
   if(link.dataset.publicContent==='true')return;
   // Some crawlable links also trigger an in-page action (for example opening
   // the Stripe plan dialog). Let React handle those instead of preloading and
   // navigating back to the same route.
   if(link.dataset.localAccountAction==='true')return;
   if(isDesktopDevice(navigator)&&isAppDestination(link.href,location.origin)){
    if(link.closest('[data-desktop-download-ready="true"],[data-public-store-link="true"]'))return;
    rememberDesktopThread(link.href);event.preventDefault();event.stopImmediatePropagation();
    void router.push(state.user?DESKTOP_ACCESS_PATH:accountLoginUrl(DESKTOP_ACCESS_PATH));return;
   }
   if(link.dataset.bandAccess){
    const destination=contentClickDestination(link.href,location.origin,location.href,true);
    if(destination){
     event.preventDefault();event.stopImmediatePropagation();
     const resolve=state.ready?Promise.resolve(state.user):getSiteAuth().then(async auth=>{await auth.authStateReady();return auth.currentUser}).catch(()=>null);
     const separate=event.button===1||event.metaKey||event.ctrlKey||link.target==='_blank',opened=separate?window.open('about:blank','_blank'):null;
     if(opened)opened.opener=null;
     void resolve.then(user=>{const guard=bandReadUrl(destination),next=user?guard:accountLoginUrl(guard);if(opened)opened.location.replace(next);else void router.push(next)});
     return;
    }
   }
   if(state.user){
    let destination:URL|null=null;
    try{destination=new URL(link.href,location.href)}catch{/* Ignore malformed links. */}
    const backgroundStatusPath=destination?.pathname.replace(/\/+$/,'');
    if(destination?.origin===location.origin&&['/membership',DESKTOP_ACCESS_PATH.replace(/\/+$/,'')].includes(backgroundStatusPath||'')&&!destination.searchParams.has('session_id')){
     event.preventDefault();event.stopImmediatePropagation();
     const separateTab=event.button===1||event.metaKey||event.ctrlKey||link.target==='_blank';
     const opened=separateTab?window.open('about:blank','_blank'):null;
     if(opened)opened.opener=null;
     link.setAttribute('aria-busy','true');
     void preloadMembershipStatus(state.user.uid).then(()=>{
      if(opened)opened.location.replace(destination!.href);else void router.push(destination!.pathname+destination!.search+destination!.hash);
     }).catch(()=>{if(opened)opened.close()}).finally(()=>link.removeAttribute('aria-busy'));
     return;
    }
    return;
   }
   if(link.hasAttribute('download'))return;
   const destination=contentClickDestination(link.href,location.origin,location.href,link.dataset.accountRequired==='true');
   if(!destination)return;
   event.preventDefault();event.stopImmediatePropagation();
   // Wait for persisted sign-in before deciding; an early tap must not send an
   // already signed-in reader back to login. Only clicks enter this path.
   const resolveUser=state.ready?Promise.resolve(state.user):getSiteAuth().then(async auth=>{
    await auth.authStateReady();return auth.currentUser;
   }).catch(()=>null);
   const separateTab=event.button===1||event.metaKey||event.ctrlKey||link.target==='_blank';
   const opened=separateTab?window.open('about:blank','_blank'):null;
   if(opened)opened.opener=null;
   void resolveUser.then(user=>{
    const next=user?destination:accountLoginUrl(destination);
    if(opened)opened.location.replace(next);else void router.push(next);
   });
  };
  window.addEventListener('click',gate,true);window.addEventListener('auxclick',gate,true);
  return()=>{window.removeEventListener('click',gate,true);window.removeEventListener('auxclick',gate,true)};
 },[state.user,state.ready,router]);
 const deviceContent=state.user&&(deviceState==='limit'||deviceState==='error')?<main className={deviceStyle.page}><section className={deviceStyle.card}><span className={deviceStyle.eyebrow}>ACCOUNT SECURITY</span><h1>{deviceState==='limit'?'Manage your devices':'Unable to verify this device'}</h1>{deviceState==='limit'?<><p>Your account has reached its device allowance. Sign out one below or add more slots to continue here.</p><AccountDevices/></>:deviceState==='error'?<p>Please check your connection and try again.</p>:null}<div className={deviceStyle.providers}><button onClick={()=>setRetry(value=>value+1)}>Try this device again</button>{supportSkip&&<button onClick={()=>{setSupportSkip(false);void registerWebsiteDevice(true).then(()=>setRetry(value=>value+1)).catch(()=>setDeviceState('error'))}}>Add this device · Support Skip</button>}<button onClick={()=>void signOutWebsiteDevice()}>Sign out</button></div></section></main>:children;
 const content=state.user?<ProfileOnboardingGate key={state.user.uid} user={state.user} onProfileReady={handleProfileReady}>{deviceContent}</ProfileOnboardingGate>:children;
 return <AccountContext.Provider value={{...state,desktop}}>{content}{capacityNotice&&(!state.user||capacityNotice.uid===state.user.uid)&&<DeviceCapacityNotice notice={capacityNotice} onDismiss={()=>setCapacityNotice(null)}/>}</AccountContext.Provider>;
}
export const useSiteAccount=()=>useContext(AccountContext);
export function AccountLink({destination,children,...props}:Omit<AnchorHTMLAttributes<HTMLAnchorElement>,'href'>&{destination:string;children:ReactNode}){
 // Real hrefs stay crawlable and can be copied/opened directly. The provider
 // prompts for login on actual clicks, on desktop and mobile alike.
 return <a {...props} data-account-required="true" href={destination}>{children}</a>;
}
