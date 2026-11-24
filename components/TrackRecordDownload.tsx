import {useState} from 'react';
import styles from '../styles/ShareControl.module.css';

export default function TrackRecordDownload(){
 const [busy,setBusy]=useState(false),[error,setError]=useState('');
 async function save(){
  const generatedAt=new Date();
  setBusy(true);setError('');
  let templateUrl:string|undefined;
  try{
   // Fetch bytes first so a CDN/canonical-host redirect cannot taint the canvas.
   let response=await fetch('/data/track-record-template.png',{cache:'reload'});
   if(!response.ok||!response.headers.get('content-type')?.includes('image/png')){
    response=await fetch('https://www.stockstobuynow.ai/data/track-record-template.png',{mode:'cors',credentials:'omit',cache:'reload'});
   }
   if(!response.ok||!response.headers.get('content-type')?.includes('image/png'))throw new Error('The image template could not be loaded.');
   templateUrl=URL.createObjectURL(await response.blob());
   const image=new Image();
   await new Promise<void>((resolve,reject)=>{image.onload=()=>resolve();image.onerror=()=>reject(new Error('Your browser could not decode the image template.'));image.src=templateUrl!;});
   const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1350;
   const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas unavailable');
   ctx.drawImage(image,0,0);ctx.font='28px Arial, sans-serif';ctx.fillStyle='#aabbcf';
   ctx.fillText(generatedAt.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}),64,211);
   const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Export failed')),'image/png'));
   const url=URL.createObjectURL(blob),link=document.createElement('a');
   link.href=url;link.download=`track-record-${generatedAt.getFullYear()}-${String(generatedAt.getMonth()+1).padStart(2,'0')}-${String(generatedAt.getDate()).padStart(2,'0')}.png`;
   document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
  }catch(e){setError(e instanceof Error?`${e.message} You can open the ready-made image below.`:'Could not generate the image. You can open the ready-made image below.');}finally{if(templateUrl)URL.revokeObjectURL(templateUrl);setBusy(false)}
 }
 return <><button type="button" onClick={save} disabled={busy} className={`${styles.button} ${styles.save}`}>{busy?'Generating image…':'↓ Save image'}</button>{error&&<p role="alert">{error} <a href="https://www.stockstobuynow.ai/data/track-record-2025-12-31.png" target="_blank" rel="noopener noreferrer">Open ready-made image (fixed date) ↗</a></p>}</>;
}
