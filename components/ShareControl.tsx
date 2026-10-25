import ShareAction from './ShareAction';
import {useEffect,useRef,useState} from 'react';
import {QRCodeSVG} from 'qrcode.react';
import styles from '../styles/ShareControl.module.css';
export type ShareRow={label:string;value:string;detail?:string};
export default function ShareControl({title,path,subtitle,rows}:{title:string;path?:string;subtitle?:string;rows?:ShareRow[]}) {
 const [url,setUrl]=useState(''),[message,setMessage]=useState(''),[busy,setBusy]=useState(false),[preview,setPreview]=useState<{url:string;file:File}|null>(null);
 const qr=useRef<HTMLDivElement>(null),dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const target=new URL(path||window.location.pathname+window.location.search+window.location.hash,'https://www.stockstobuynow.ai');setUrl(target.href)},[path]);
 useEffect(()=>{if(preview)dialog.current?.showModal();return()=>{if(preview)URL.revokeObjectURL(preview.url)}},[preview]);
 async function link(){setMessage('');try{if(navigator.share)await navigator.share({title,url});else{await navigator.clipboard.writeText(url);setMessage('Link copied')}}catch(e){if((e as Error).name!=='AbortError')setMessage('Copy the link below to share.')}}
 async function prepare(){
  setBusy(true);setMessage('');try{
   const list=rows||[],canvas=document.createElement('canvas');canvas.width=1200;canvas.height=370+list.length*108+240;
   const ctx=canvas.getContext('2d');if(!ctx)throw Error();
   const bg=ctx.createLinearGradient(0,0,1200,canvas.height);bg.addColorStop(0,'#172540');bg.addColorStop(1,'#080f20');ctx.fillStyle=bg;ctx.fillRect(0,0,1200,canvas.height);
   const text=(s:string,x:number,y:number,size:number,color='#edf2ff',max=1080)=>{ctx.font=`${size>=30?'600':'400'} ${size}px Arial`;ctx.fillStyle=color;ctx.fillText(s,x,y,max)};
   text('STOCKS TO BUY NOW AI',60,70,24,'#c9afff');text(title,60,145,48);text(subtitle||'Saved market snapshot',60,200,24,'#afbed6');
   list.forEach((row,i)=>{const y=280+i*108;text(row.label,60,y,30,'#edf2ff',650);text(row.value,750,y,30,row.value.startsWith('-')?'#ff95a5':row.value.startsWith('+')?'#7ae0bc':'#edf2ff',390);text(row.detail||'',60,y+36,21,'#afbed6');ctx.fillStyle='#ffffff16';ctx.fillRect(60,y+58,1080,1)});
   const bottom=canvas.height-200;text('StocksToBuyNow.ai',60,bottom+65,36);text('Scan to explore the source and current view.',60,bottom+110,22,'#afbed6');text('Saved data • Historical performance does not guarantee returns.',60,bottom+160,18,'#afbed6',840);
   const svg=qr.current?.querySelector('svg');if(!svg)throw Error();const qrUrl=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)],{type:'image/svg+xml'}));
   try{const image=new Image();await new Promise<void>((resolve,reject)=>{image.onload=()=>resolve();image.onerror=reject;image.src=qrUrl});ctx.drawImage(image,960,bottom,180,180)}finally{URL.revokeObjectURL(qrUrl)}
   const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error()),'image/png'));
   setPreview({url:URL.createObjectURL(blob),file:new File([blob],`${title.toLowerCase().replace(/[^a-z0-9]+/g,'-')}.png`,{type:'image/png'})});
  }catch{setMessage('Could not create the image. Please try again.')}finally{setBusy(false)}
 }
 function save(){if(!preview)return;const a=document.createElement('a');a.href=preview.url;a.download=preview.file.name;a.click()}
 async function shareImage(){if(!preview)return;try{if(navigator.canShare?.({files:[preview.file]}))await navigator.share({title,files:[preview.file]});else save()}catch(e){if((e as Error).name!=='AbortError')setMessage('Use Save PNG to download this image.')}}
 return <div className={styles.control}><ShareAction disabled={!url} onClick={link} aria-label={`Share ${title}`}>Share</ShareAction>{rows&&<ShareAction kind="save" disabled={!url||busy||!rows.length} onClick={prepare}>{busy?'Creating…':'Save Image'}</ShareAction>}{message&&<span role="status">{message}</span>}{message==='Copy the link below to share.'&&<input aria-label="Share link" readOnly value={url} onFocus={e=>e.target.select()}/>}
 <div hidden ref={qr}><QRCodeSVG value={url||'https://www.stockstobuynow.ai'} size={240} includeMargin level="M"/></div>
 <dialog ref={dialog} className={styles.dialog} onCancel={()=>setPreview(null)}><header><strong>Share {title}</strong><button aria-label="Close share preview" onClick={()=>{dialog.current?.close();setPreview(null)}}>×</button></header>{preview&&<img src={preview.url} alt={`${title} snapshot with source QR code`}/>}<footer><button onClick={shareImage}>Share image</button><button onClick={save}>Save PNG</button><button onClick={link}>Share link</button></footer>{message&&<p role="status">{message}</p>}</dialog></div>;
}
