import {QRCodeSVG} from 'qrcode.react';
import {trackAppStoreClick} from '../lib/analytics';
export const APP_DOWNLOADS=[
 {store:'apple' as const,label:'Get the iPhone app',url:'https://apps.apple.com/us/app/id1565527320'},
 {store:'google' as const,label:'Get the Android app',url:'https://play.google.com/store/apps/details?id=com.newcompany.stocker'},
];
// Desktop callers render this only after the server has confirmed membership.
export default function AppDownloadOptions({placement,showQR=false,threadId}:{placement:string;showQR?:boolean;threadId?:string|null}){
 return <div data-desktop-download-ready="true" className="verified-downloads">
  <div className="store-links">{APP_DOWNLOADS.map(store=><a key={store.store} href={store.url} target="_blank" rel="noopener noreferrer" onClick={()=>trackAppStoreClick({store:store.store,placement,linkUrl:store.url})}>{store.label} ↗</a>)}</div>
  {showQR&&<div className="download-qr"><p>Scan with your phone to get the app</p><div className="qr-options">{APP_DOWNLOADS.map(store=><figure key={store.store}><QRCodeSVG value={store.url} size={148} level="M" includeMargin/><figcaption>{store.store==='apple'?'iPhone · App Store':'Android · Google Play'}</figcaption></figure>)}</div>
   {threadId&&<figure className="thread-qr"><QRCodeSVG value={'https://www.stockstobuynow.ai/insight_details_page?postId='+encodeURIComponent(threadId)} size={132} includeMargin/><figcaption>Already have the app? Scan to open your selected thread.</figcaption></figure>}
  </div>}
  <style jsx>{`.store-links{display:flex;justify-content:center;flex-wrap:wrap;gap:12px;margin-top:24px}.store-links a{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:13px 20px;border:1px solid #8270ac;border-radius:999px;background:#c7b2ef;color:#1c1630;font-size:14px;font-weight:650;text-decoration:none}.store-links a:last-child{background:#15273c;color:#c0dcff;border-color:#436082}.store-links a:focus-visible{outline:2px solid white;outline-offset:3px}.download-qr{margin-top:28px;padding-top:24px;border-top:1px solid #a990db30}.download-qr>p{color:#b9c6dc;font-size:14px}.qr-options{display:flex;justify-content:center;gap:26px;margin-top:20px}.qr-options figure,.thread-qr{margin:0}.qr-options :global(svg),.thread-qr :global(svg){display:block;border-radius:12px;background:white;margin:auto}.qr-options figcaption,.thread-qr figcaption{margin-top:10px;color:#c0cce0;font-size:12px;text-align:center}.thread-qr{margin-top:28px}@media(max-width:400px){.qr-options{gap:12px}.qr-options :global(svg){width:124px;height:124px}}`}</style>
 </div>;
}
