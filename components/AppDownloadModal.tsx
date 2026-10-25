import {useSiteAccount} from './SiteAccount';
import {DESKTOP_ACCESS_PATH,rememberDesktopThread} from '../lib/desktop-access';
import {accountLoginUrl} from '../lib/site-auth';
import {isDesktopDevice} from '../lib/device-access';
import {useRouter} from 'next/router';
import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import ReferralRecovery from './ReferralRecovery';
import ResearchCTA from './ResearchCTA';
export default function AppDownloadModal({placement,onClose,title="Get the app to explore",description="Continue your research with stock ideas, market outlooks, earnings predictions, financials and technical setups in StocksToBuyNow.ai."}:{placement:string;onClose:()=>void;title?:string;description?:string}){
 const {user,ready}=useSiteAccount(),router=useRouter();
 const [mobileReady,setMobileReady]=useState(false);
 useEffect(()=>{if(isDesktopDevice(navigator)){if(!ready)return;rememberDesktopThread();void router.push(user?DESKTOP_ACCESS_PATH:accountLoginUrl(DESKTOP_ACCESS_PATH));}else setMobileReady(true)},[ready,user?.uid,router]);
 const panel=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  if(!mobileReady)return;
  const previous=document.activeElement as HTMLElement|null,overflow=document.body.style.overflow;
  document.body.style.overflow='hidden';panel.current?.querySelector<HTMLButtonElement>('button')?.focus();
  return()=>{document.body.style.overflow=overflow;previous?.focus()};
 },[mobileReady]);
 if(!mobileReady)return null;
 return createPortal(<div className="download-overlay" onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
  <div className="download-dialog" ref={panel} role="dialog" aria-modal="true" aria-label={title} onKeyDown={e=>{
   if(e.key==='Escape'){e.preventDefault();onClose()}
   if(e.key==='Tab'){
    const items=Array.from(panel.current?.querySelectorAll<HTMLElement>('button,a[href],summary')||[]),first=items[0],last=items[items.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}
    if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}
   }
  }}><button className="download-close" onClick={onClose} aria-label="Close app prompt">✕</button>
   <h2>{title}</h2><p>{description}</p>
   <ResearchCTA placement={placement} variant="stock"/>
   <ReferralRecovery/>
  </div>
  <style jsx>{`
   .download-overlay{position:fixed;inset:0;z-index:2147483000;background:#000b;backdrop-filter:blur(7px);display:flex;align-items:center;justify-content:center;padding:20px}.download-dialog{position:relative;box-sizing:border-box;width:100%;max-width:700px;max-height:90dvh;overflow-y:auto;padding:44px 32px 20px;border:1px solid #62517655;border-radius:26px;background:linear-gradient(135deg,#281d3e,#101e30);color:#f4f0ff;box-shadow:0 24px 80px #0007}.download-dialog h2{font-size:30px;line-height:1.2;margin:14px 0 20px}.download-dialog>p{font-size:16px;line-height:1.7;color:#b8c4da;margin:0}.download-close{position:absolute;top:12px;right:12px;min-width:44px;min-height:44px;border:1px solid #6f6487;border-radius:12px;background:#303047;color:white;font-size:22px;cursor:pointer}.download-close:focus-visible{outline:3px solid #bba0ff;outline-offset:3px}@media(max-width:600px){.download-overlay{padding:12px}.download-dialog{padding:40px 18px 12px;border-radius:20px}.download-dialog h2{font-size:25px}.download-dialog>p{font-size:14px}}
  `}</style>
 </div>,document.body);
}
