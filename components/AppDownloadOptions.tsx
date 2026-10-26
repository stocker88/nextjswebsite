import {QRCodeSVG} from 'qrcode.react';
import {trackAppStoreClick} from '../lib/analytics';
export const APP_DOWNLOADS=[
 {store:'apple' as const,label:'Get the iPhone app',url:'https://apps.apple.com/us/app/id1565527320'},
 {store:'google' as const,label:'Get the Android app',url:'https://play.google.com/store/apps/details?id=com.newcompany.stocker'},
];
function StoreIcon({store}:{store:'apple'|'google'}){
 if(store==='apple')return <svg data-store-icon="apple" aria-hidden="true" viewBox="0 0 24 24"><path fill="currentColor" d="M17.05 12.54c-.03-2.31 1.89-3.43 1.98-3.49a4.27 4.27 0 0 0-3.36-1.82c-1.41-.15-2.78.85-3.5.85-.74 0-1.85-.84-3.05-.81a4.46 4.46 0 0 0-3.75 2.29c-1.62 2.8-.41 6.92 1.14 9.19.78 1.11 1.68 2.35 2.88 2.31 1.17-.05 1.61-.74 3.02-.74 1.4 0 1.81.74 3.03.71 1.26-.02 2.05-1.12 2.8-2.24a9.16 9.16 0 0 0 1.28-2.61 4.02 4.02 0 0 1-2.47-3.64ZM14.75 5.73a4.08 4.08 0 0 0 .93-2.93 4.14 4.14 0 0 0-2.69 1.39 3.88 3.88 0 0 0-.96 2.82 3.42 3.42 0 0 0 2.72-1.28Z"/></svg>;
 return <svg data-store-icon="google" aria-hidden="true" viewBox="0 0 24 24"><path fill="#34A853" d="M3.3 2.65c-.2.3-.3.68-.3 1.13v16.44c0 .45.1.83.3 1.13l9.2-9.35-9.2-9.35Z"/><path fill="#4285F4" d="m15.56 8.89-10.9-6.2a2.05 2.05 0 0 0-1.36-.04L12.5 12l3.06-3.11Z"/><path fill="#FBBC04" d="m3.3 21.35c.38.21.84.18 1.36-.04l10.9-6.2L12.5 12l-9.2 9.35Z"/><path fill="#EA4335" d="m20.05 11.45-4.49-2.56L12.5 12l3.06 3.11 4.49-2.56c.63-.36.63-.74 0-1.1Z"/></svg>;
}
// Desktop callers render this only after the server has confirmed membership.
export default function AppDownloadOptions({placement,showQR=false,threadId}:{placement:string;showQR?:boolean;threadId?:string|null}){
 return <div data-desktop-download-ready="true" className="verified-downloads">
  <div className="store-links">{APP_DOWNLOADS.map(store=><a key={store.store} href={store.url} target="_blank" rel="noopener noreferrer" onClick={()=>trackAppStoreClick({store:store.store,placement,linkUrl:store.url})}><StoreIcon store={store.store}/><span>{store.label}</span><span className="store-arrow" aria-hidden="true">↗</span></a>)}</div>
  {showQR&&<div className="download-qr"><p>Scan with your phone to get the app</p><div className="qr-options">{APP_DOWNLOADS.map(store=><figure key={store.store}><QRCodeSVG value={store.url} size={148} level="M" includeMargin/><figcaption>{store.store==='apple'?'iPhone · App Store':'Android · Google Play'}</figcaption></figure>)}</div>
   {threadId&&<figure className="thread-qr"><QRCodeSVG value={'https://www.stockstobuynow.ai/insight_details_page?postId='+encodeURIComponent(threadId)} size={132} includeMargin/><figcaption>Already have the app? Scan to open your selected thread.</figcaption></figure>}
  </div>}
  <style jsx>{`.store-links{display:flex;justify-content:center;flex-wrap:wrap;gap:12px;margin-top:24px}.store-links a{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:46px;padding:13px 20px;border:1px solid #8270ac;border-radius:999px;background:#c7b2ef;color:#1c1630;font-size:14px;font-weight:650;text-decoration:none}.store-links a :global(svg){width:18px;height:18px;flex:0 0 18px}.store-arrow{margin-left:1px}.store-links a:last-child{background:#15273c;color:#c0dcff;border-color:#436082}.store-links a:focus-visible{outline:2px solid white;outline-offset:3px}.download-qr{margin-top:28px;padding-top:24px;border-top:1px solid #a990db30}.download-qr>p{color:#b9c6dc;font-size:14px}.qr-options{display:flex;justify-content:center;gap:26px;margin-top:20px}.qr-options figure,.thread-qr{margin:0}.qr-options :global(svg),.thread-qr :global(svg){display:block;border-radius:12px;background:white;margin:auto}.qr-options figcaption,.thread-qr figcaption{margin-top:10px;color:#c0cce0;font-size:12px;text-align:center}.thread-qr{margin-top:28px}@media(max-width:400px){.store-links a{gap:8px;padding-inline:17px}.qr-options{gap:12px}.qr-options :global(svg){width:124px;height:124px}}`}</style>
 </div>;
}
