export const SITE_ACCOUNT_HINT_KEY='stbn.siteAccountHint.v1';
export const SITE_ACCOUNT_HINT_TTL=30*24*60*60*1000;

type AccountIdentity={displayName?:string|null;email?:string|null};

function safeName(identity:AccountIdentity){
 const raw=(identity.displayName||identity.email?.split('@')[0]||'My account').replace(/[\u0000-\u001f\u007f]/g,' ').trim();
 return (raw||'My account').slice(0,60);
}
function initials(name:string){
 const value=name.split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join('').toUpperCase();
 return (value||'A').slice(0,2);
}
function paint(signedIn:boolean,name='My account'){
 if(typeof document==='undefined')return;
 const root=document.documentElement;
 root.dataset.siteAccount=signedIn?'signed-in':'signed-out';
 if(signedIn){
  root.style.setProperty('--site-account-name',JSON.stringify(name));
  root.style.setProperty('--site-account-initials',JSON.stringify(initials(name)));
 }else{
  root.style.removeProperty('--site-account-name');
  root.style.removeProperty('--site-account-initials');
 }
}
export function rememberSiteAccount(identity:AccountIdentity|null,now=Date.now()){
 if(typeof window==='undefined')return;
 if(!identity){
  try{localStorage.removeItem(SITE_ACCOUNT_HINT_KEY)}catch{/* Firebase remains authoritative. */}
  paint(false);
  return;
 }
 const name=safeName(identity);
 try{localStorage.setItem(SITE_ACCOUNT_HINT_KEY,JSON.stringify({signedIn:true,name,updatedAt:now}))}catch{/* The current session still renders normally. */}
 paint(true,name);
}
