export const SITE_ACCOUNT_HINT_KEY='stbn.siteAccountHint.v1';
export const SITE_ACCOUNT_HINT_TTL=30*24*60*60*1000;

type AccountIdentity={uid?:string;displayName?:string|null;email?:string|null;photoURL?:string|null};
export type CachedSiteProfile={uid:string;name:string;photo:string;profile:boolean};
function safePhoto(value:unknown){return typeof value==='string'&&/^https:\/\//i.test(value)?value:''}
export function readSiteProfile(uid:string):CachedSiteProfile|null{
 if(typeof window==='undefined')return null;
 try{const h=JSON.parse(localStorage.getItem(SITE_ACCOUNT_HINT_KEY)||'null');
  return h?.signedIn===true&&h.uid===uid&&typeof h.name==='string'?{uid,name:h.name,photo:safePhoto(h.photo),profile:h.profile===true}:null;
 }catch{return null}
}

function safeName(identity:AccountIdentity){
 const raw=(identity.displayName||identity.email?.split('@')[0]||'My account').replace(/[\u0000-\u001f\u007f]/g,' ').trim();
 return (raw||'My account').slice(0,60);
}
function initials(name:string){
 const value=name.split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase();
 return (value||'A').slice(0,2);
}
function paint(signedIn:boolean,name='My account',photo=''){
 if(typeof document==='undefined')return;
 const root=document.documentElement;
 root.dataset.siteAccount=signedIn?'signed-in':'signed-out';
 if(signedIn){
  root.style.setProperty('--site-account-name',JSON.stringify(name));
  root.style.setProperty('--site-account-initials',JSON.stringify(initials(name)));
  root.style.setProperty('--site-account-photo',photo?`url(${JSON.stringify(photo)})`:'none');
  root.style.setProperty('--site-account-initials-opacity',photo?'0':'1');
 }else{
  root.style.removeProperty('--site-account-name');
  root.style.removeProperty('--site-account-initials');
  root.style.removeProperty('--site-account-photo');
  root.style.removeProperty('--site-account-initials-opacity');
 }
}
export function rememberSiteAccount(identity:AccountIdentity|null,now=Date.now(),profile=false){
 if(typeof window==='undefined')return;
 if(!identity){
  try{localStorage.removeItem(SITE_ACCOUNT_HINT_KEY)}catch{/* Firebase remains authoritative. */}
  paint(false);
  return;
 }
 const cached=identity.uid?readSiteProfile(identity.uid):null;
 const keep=cached?.profile&&!profile;
 const name=keep?cached.name:safeName(identity),photo=keep?cached.photo:safePhoto(identity.photoURL);
 try{localStorage.setItem(SITE_ACCOUNT_HINT_KEY,JSON.stringify({signedIn:true,uid:identity.uid,name,photo,profile:profile||!!keep,updatedAt:now}))}catch{/* The current session still renders normally. */}
 paint(true,name,photo);
}
