import {DESKTOP_ACCESS_PATH,rememberDesktopThread} from '../lib/desktop-access';
import {signInContentKind} from '../lib/content-access';
import AccountDevices from './AccountDevices';
import DeviceCapacityNotice from './DeviceCapacityNotice';
import {accountDevicesEnabled,registerWebsiteDevice,checkWebsiteDevice,signOutWebsiteDevice,type DeviceNotice} from '../lib/account-devices';
import deviceStyle from '../styles/AccountLogin.module.css';
import {createContext,useContext,useEffect,useState,type AnchorHTMLAttributes,type ReactNode} from 'react';
import {useRouter} from 'next/router';
import {isDesktopDevice,isAppDestination} from '../lib/device-access';
import type {User} from 'firebase/auth';
import {getSiteAuth,accountLoginUrl} from '../lib/site-auth';
const AccountContext=createContext<{user:User|null;ready:boolean;error:boolean;desktop:boolean}>({user:null,ready:false,error:false,desktop:false});
export function SiteAccountProvider({children}:{children:ReactNode}){
 const router=useRouter();
 const [desktop,setDesktop]=useState(false);
 useEffect(()=>{const value=isDesktopDevice(navigator);setDesktop(value);document.documentElement.dataset.desktopDevice=String(value);return()=>{delete document.documentElement.dataset.desktopDevice}},[]);
 const [deviceState,setDeviceState]=useState<'checking'|'allowed'|'limit'|'error'>('checking');
 const [supportSkip,setSupportSkip]=useState(false);
 const [retry,setRetry]=useState(0);
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
   let generation=0;
   stop=sdk.onAuthStateChanged(auth,user=>{
    const ticket=++generation;
    // Auth is ready independently of the background device admission check.
    setSupportSkip(false);setDeviceState('checking');setState({user,ready:true,error:false});
    setCapacityNotice(old=>user&&old?.uid!==user.uid?null:old);
    if(!user)return;
    if(!accountDevicesEnabled){setDeviceState('allowed');setState({user,ready:true,error:false});return}
    registerWebsiteDevice().then(result=>{if(active&&ticket===generation){presentDeviceNotice(result.deviceNotice,user.uid);setDeviceState('allowed');setState({user,ready:true,error:false})}}).catch(async cause=>{
     if(!active||ticket!==generation)return;
     if(cause?.details?.reason==='device-revoked'){await sdk.signOut(auth);return}
     if(cause?.details?.reason==='device-capacity'){presentDeviceNotice(cause.details.deviceNotice,user.uid);await sdk.signOut(auth);return}
     setSupportSkip(cause?.details?.canSupportSkip===true);
     setDeviceState(cause?.code==='functions/resource-exhausted'?'limit':'error');setState({user,ready:true,error:false});
    });
   },()=>setState({user:null,ready:true,error:true}));
  }).catch(()=>{if(active)setState({user:null,ready:true,error:true})});
  return()=>{active=false;stop?.()};
 },[retry]);
 useEffect(()=>{
  if(!accountDevicesEnabled||!state.user||deviceState!=='allowed')return;
  let active=true,busy=false;
  const uid=state.user.uid;
  const check=async()=>{if(busy||document.hidden)return;busy=true;try{const result=await checkWebsiteDevice();const auth=await getSiteAuth();if(active&&auth.currentUser?.uid===uid){presentDeviceNotice(result.deviceNotice,uid);if(!result.allowed){const sdk=await import('firebase/auth');await sdk.signOut(auth)}}}catch{/* A connection failure is not proof of remote sign-out. */}finally{busy=false}};
  const timer=window.setInterval(()=>void check(),60000);
  const focus=()=>void check();window.addEventListener('focus',focus);document.addEventListener('visibilitychange',focus);
  return()=>{active=false;window.clearInterval(timer);window.removeEventListener('focus',focus);document.removeEventListener('visibilitychange',focus)};
 },[state.user,deviceState]);
 useEffect(()=>{
  const gate=(event:MouseEvent)=>{
   const link=event.target instanceof Element?event.target.closest('a[href]'):null;
   if(!(link instanceof HTMLAnchorElement))return;
   if(isDesktopDevice(navigator)&&isAppDestination(link.href,location.origin)){
    if(link.closest('[data-desktop-download-ready="true"],[data-public-store-link="true"]'))return;
    rememberDesktopThread(link.href);event.preventDefault();event.stopImmediatePropagation();
    void router.push(state.user?DESKTOP_ACCESS_PATH:accountLoginUrl(DESKTOP_ACCESS_PATH));return;
   }
   if(state.user)return;
   const target=new URL(link.href,location.origin);
   const owned=target.origin===location.origin&&(!!signInContentKind(target.pathname)||target.pathname.startsWith('/results/'));
   if(!owned)return;
   event.preventDefault();event.stopImmediatePropagation();
   void router.push(accountLoginUrl(owned?target.pathname:location.pathname));
  };
  window.addEventListener('click',gate,true);window.addEventListener('auxclick',gate,true);
  return()=>{window.removeEventListener('click',gate,true);window.removeEventListener('auxclick',gate,true)};
 },[state.user,router]);
 return <AccountContext.Provider value={{...state,desktop}}>{state.user&&(deviceState==='limit'||deviceState==='error')?<main className={deviceStyle.page}><section className={deviceStyle.card}><span className={deviceStyle.eyebrow}>ACCOUNT SECURITY</span><h1>{deviceState==='limit'?'Manage your devices':'Unable to verify this device'}</h1>{deviceState==='limit'?<><p>Your account has reached its device allowance. Sign out one below or add more slots to continue here.</p><AccountDevices/></>:deviceState==='error'?<p>Please check your connection and try again.</p>:null}<div className={deviceStyle.providers}><button onClick={()=>setRetry(value=>value+1)}>Try this device again</button>{supportSkip&&<button onClick={()=>{setSupportSkip(false);void registerWebsiteDevice(true).then(()=>setRetry(value=>value+1)).catch(()=>setDeviceState('error'))}}>Add this device · Support Skip</button>}<button onClick={()=>void signOutWebsiteDevice()}>Sign out</button></div></section></main>:children}{capacityNotice&&(!state.user||capacityNotice.uid===state.user.uid)&&<DeviceCapacityNotice notice={capacityNotice} onDismiss={()=>setCapacityNotice(null)}/>}</AccountContext.Provider>;
}
export const useSiteAccount=()=>useContext(AccountContext);
export function AccountLink({destination,children,...props}:Omit<AnchorHTMLAttributes<HTMLAnchorElement>,'href'>&{destination:string;children:ReactNode}){
 const {user}=useSiteAccount();
 return <a {...props} href={user?destination:accountLoginUrl(destination)}>{children}</a>;
}
