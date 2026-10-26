import {signOutWebsiteDevice} from '../lib/account-devices';
import {useEffect,useRef,useState} from 'react';
import {useSiteAccount} from './SiteAccount';
import {getSiteAuth} from '../lib/site-auth';
import s from '../styles/AccountMenu.module.css';

export default function AccountMenu(){
 const {user}=useSiteAccount();
 const [profile,setProfile]=useState<{uid:string;name:string;photo:string}|null>(null);
 const [open,setOpen]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(''),[brokenPhoto,setBrokenPhoto]=useState('');
 const root=useRef<HTMLDivElement>(null),trigger=useRef<HTMLButtonElement>(null);
 useEffect(()=>{
  let active=true;
  setOpen(false);setError('');setProfile(null);
  const load=()=>{if(user)void Promise.all([getSiteAuth(),import('firebase/firestore')]).then(async([auth,db])=>{
   const doc=await db.getDoc(db.doc(db.getFirestore(auth.app),'users',user.uid)),data=doc.data();
   if(active&&data)setProfile({uid:user.uid,name:typeof data.userName==='string'?data.userName:'',photo:typeof data.photoUrl==='string'?data.photoUrl:typeof data.authorPhotoUrl==='string'?data.authorPhotoUrl:''});
  }).catch(()=>{/* Provider identity remains available if the app profile cannot be read. */})};
  load();window.addEventListener('site-profile-updated',load);
  return()=>{active=false;window.removeEventListener('site-profile-updated',load)};
 },[user?.uid]);
 useEffect(()=>{
  if(!open)return;
  const outside=(event:PointerEvent)=>{if(!root.current?.contains(event.target as Node))setOpen(false)};
  const escape=(event:KeyboardEvent)=>{if(event.key==='Escape'){setOpen(false);trigger.current?.focus()}};
  document.addEventListener('pointerdown',outside);document.addEventListener('keydown',escape);
  return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape)};
 },[open]);
 if(!user)return null;
 const current=profile?.uid===user.uid?profile:null;
 const name=current?.name||user.displayName||'My account';
 const photo=current?.photo||user.photoURL||'';
 const initials=name.split(/\s+/).slice(0,2).map(part=>part[0]).join('').toUpperCase();
 async function signOut(){
  setBusy(true);setError('');
  try{await signOutWebsiteDevice();setOpen(false)}
  catch{setError('Could not sign out. Please try again.')}finally{setBusy(false)}
 }
 return <div className={s.account} ref={root}>
  <button ref={trigger} className={s.trigger} type="button" aria-label={`Account: ${name}`} aria-expanded={open} aria-controls="site-account-panel" onClick={()=>setOpen(!open)}>
   <span className={s.avatar}>{photo&&photo!==brokenPhoto?<img src={photo} alt="" width="34" height="34" referrerPolicy="no-referrer" onError={()=>setBrokenPhoto(photo)}/>:<span aria-hidden="true">{initials}</span>}</span>
   <span className={s.name}>{name}</span><span className={s.chevron} aria-hidden="true">⌄</span>
  </button>
  {open&&<div id="site-account-panel" className={s.panel}><strong>{name}</strong><span>Signed in</span><a href="/account/">Account &amp; devices ↗</a><a href="/membership/">My membership ↗</a><button type="button" disabled={busy} onClick={()=>void signOut()}>{busy?'Signing out…':'Sign out'}</button>{error&&<p role="alert">{error}</p>}</div>}
 </div>;
}
