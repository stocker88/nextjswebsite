import {useEffect,useRef,useState} from 'react';
import {QRCodeSVG} from 'qrcode.react';
import type {Event} from '../../lib/earnings';
import {snapshotShareUrl} from '../../lib/earnings-image';
export default function ShareSnapshot({events,dates,week}:{events:Event[];dates:string[];week:string}){
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),[image,setImage]=useState<{url:string;file:File}|null>(null);
 const qr=useRef<HTMLDivElement>(null),dialog=useRef<HTMLDialogElement>(null),trigger=useRef<HTMLButtonElement>(null);
 useEffect(()=>{if(!image)return;dialog.current?.showModal();return()=>{dialog.current?.close();URL.revokeObjectURL(image.url);trigger.current?.focus();}},[image]);
 async function generate(){setBusy(true);setError('');try{const {createEarningsImage}=await import('../../lib/earnings-image');const svg=qr.current?.querySelector('svg');if(!svg)throw new Error('QR code unavailable.');const blob=await createEarningsImage(events,dates,week,svg);setImage({url:URL.createObjectURL(blob),file:new File([blob],`earnings-week-${week}.png`,{type:'image/png'})});}catch(e){setError(e instanceof Error?e.message:'Could not create the image. Please try again.')}finally{setBusy(false)}}
 async function share(){if(!image)return;try{if(navigator.canShare?.({files:[image.file]})){await navigator.share({files:[image.file],title:'This week’s earnings · Stocks To Buy Now'});}else{const a=document.createElement('a');a.href=image.url;a.download=image.file.name;a.click();}}catch(e){if((e as Error).name!=='AbortError')setError('Sharing is unavailable here. Use Download PNG instead.')}}
 return <div className="ews-export"><button className="ews-share" ref={trigger} onClick={generate} disabled={busy||!events.length}>{busy?'Preparing image…':'Share image ↗'}</button>
  <div ref={qr} hidden><QRCodeSVG value={snapshotShareUrl} size={164} level="M" includeMargin/></div>
  {error&&!image&&<p role="alert" className="ews-export-error">{error}</p>}
  {image&&<dialog ref={dialog} className="ews-image-dialog" aria-labelledby="ews-image-title" onCancel={e=>{e.preventDefault();setImage(null)}} onClick={e=>{if(e.target===e.currentTarget)setImage(null)}}>
   <header><div><h2 id="ews-image-title">Share earnings snapshot</h2><p>1200 × 1200 PNG · Website branding and QR included</p></div><button onClick={()=>setImage(null)} aria-label="Close image preview">×</button></header>
   <img src={image.url} width={1200} height={1200} alt="Shareable weekly earnings calendar with company logos, release windows and a QR code to StocksToBuyNow.ai"/>
   <p className="ews-image-note">Shows the largest companies for each session in your selected week. Scan the QR for the full calendar.</p>
   {error&&<p role="alert" className="ews-export-error">{error}</p>}
   <footer><button onClick={share}>Share…</button><a href={image.url} download={image.file.name}>Download PNG ↓</a></footer>
  </dialog>}
  <style jsx global>{`
   .ews-share{padding:9px 13px;border:1px solid #52648a;border-radius:8px;background:#202e49;color:#d9e5ff;font-size:12px;white-space:nowrap;cursor:pointer}.ews-share:disabled{opacity:.55;cursor:default}.ews-export-error{color:#ffc1ca;font-size:12px;max-width:300px}
   .ews-image-dialog{position:fixed;inset:0;margin:auto;width:min(620px,calc(100vw - 24px));max-height:calc(100dvh - 30px);padding:20px;border:1px solid #465375;border-radius:18px;background:#0f192c;color:#edf1ff;overflow:auto;z-index:2000}.ews-image-dialog::backdrop{background:#030816d9}.ews-image-dialog header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:16px}.ews-image-dialog h2{font-size:20px;margin:0 0 5px;color:#eef2ff}.ews-image-dialog header p,.ews-image-note{font-size:11px;color:#a9bada;line-height:1.5;margin:0}.ews-image-dialog header button{background:#24334e;border:0;border-radius:8px;color:#eff4ff;font-size:24px;min-width:36px;height:36px;cursor:pointer}.ews-image-dialog>img{display:block;width:100%;height:auto;max-height:60dvh;object-fit:contain;margin:0 auto 12px}.ews-image-dialog footer{display:flex;gap:12px;margin-top:16px}.ews-image-dialog footer button,.ews-image-dialog footer a{flex:1;padding:11px 14px;text-align:center;border:1px solid #63729a;border-radius:9px;background:#253653;color:#e6efff;font-size:13px;text-decoration:none;cursor:pointer}.ews-image-dialog footer button{background:#67519e;border-color:#8b74bd}
   @media(max-width:700px){.ews-share{font-size:11px;padding:9px 11px}.ews-image-dialog{padding:14px}.ews-image-dialog h2{font-size:18px}}
  `}</style>
 </div>;
}
