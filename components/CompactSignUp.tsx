import {useState} from 'react';
import {useRouter} from 'next/router';
import {DESKTOP_ACCESS_PATH} from '../lib/desktop-access';
import {accountLoginUrl} from '../lib/site-auth';
import {signInSite,type SiteProvider} from '../lib/site-sign-in';

type Props={placement?:'header'|'hero';onComplete?:()=>void};

export default function CompactSignUp({placement='hero',onComplete}:Props){
 const router=useRouter();
 const [busy,setBusy]=useState<SiteProvider|null>(null);
 const begin=async(provider:SiteProvider)=>{
  if(busy)return;
  setBusy(provider);
  try{
   await signInSite(provider);
   onComplete?.();
   await router.push(DESKTOP_ACCESS_PATH);
  }catch(cause){
   const code=(cause as {code?:string})?.code;
   if(code!=='auth/popup-closed-by-user'&&code!=='auth/cancelled-popup-request'){
    await router.push(accountLoginUrl(DESKTOP_ACCESS_PATH));
   }
  }finally{setBusy(null)}
 };
 return <div className={`compact-signup compact-signup--${placement}`} aria-label="Sign up">
  <span className="compact-signup__label">Sign Up</span>
  <div className="compact-signup__providers">
   <button type="button" onClick={()=>void begin('google')} disabled={!!busy} aria-label="Sign up with Google" title="Sign up with Google">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.3c1.9-1.8 2.9-4.4 2.9-7.4Z"/><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.4l-3.3-2.5c-.9.6-2 1-3.4 1a5.9 5.9 0 0 1-5.5-4.1H3.1v2.6A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.5 14a6 6 0 0 1 0-3.9V7.4H3.1a10 10 0 0 0 0 9.2L6.5 14Z"/><path fill="#EA4335" d="M12 5.9c1.5 0 2.8.5 3.9 1.5l2.9-2.8A9.7 9.7 0 0 0 3.1 7.4l3.4 2.7A5.9 5.9 0 0 1 12 5.9Z"/></svg>
   </button>
   <button type="button" className="compact-signup__apple" onClick={()=>void begin('apple')} disabled={!!busy} aria-label="Sign up with Apple" title="Sign up with Apple">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.1 12.7c0-2.7 2.2-4 2.3-4.1a5 5 0 0 0-3.9-2.1c-1.7-.2-3.2 1-4.1 1s-2.2-1-3.7-1C5.8 6.6 4 7.7 3 9.4c-2.1 3.6-.5 9 1.5 11.9 1 1.4 2.1 3 3.7 2.9 1.5-.1 2.1-1 3.9-1s2.3 1 3.9 1c1.6 0 2.6-1.4 3.6-2.9 1.1-1.6 1.6-3.2 1.6-3.3-.1 0-4.1-1.6-4.1-5.3Zm-2.7-8c.8-1 1.4-2.5 1.2-3.9-1.2.1-2.7.8-3.6 1.9-.8.9-1.5 2.4-1.3 3.8 1.4.1 2.8-.7 3.7-1.8Z"/></svg>
   </button>
  </div>
  <style jsx>{`
   .compact-signup{display:inline-flex;flex-direction:column;align-items:center;gap:4px;color:#fff}
   .compact-signup__label{font-size:9px;font-weight:750;line-height:1;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.82)}
   .compact-signup__providers{display:flex;align-items:center;gap:6px}
   button{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;padding:0;border:1px solid rgba(255,255,255,.38);border-radius:999px;background:#fff;box-shadow:0 5px 18px rgba(0,0,0,.18);cursor:pointer;transition:transform .18s ease,box-shadow .18s ease,opacity .18s ease}
   button:hover{transform:translateY(-1px);box-shadow:0 7px 22px rgba(0,0,0,.25)}
   button:focus-visible{outline:2px solid #d6c2ff;outline-offset:3px}
   button:disabled{cursor:wait;opacity:.6;transform:none}
   button svg{width:17px;height:17px}
   .compact-signup__apple{background:#fff;color:#050505}
   .compact-signup--hero{gap:6px}
   .compact-signup--hero .compact-signup__label{font-size:10px}
   .compact-signup--hero button{width:42px;height:42px}
   .compact-signup--hero button svg{width:20px;height:20px}
   @media(prefers-reduced-motion:reduce){button{transition:none}}
  `}</style>
 </div>;
}
