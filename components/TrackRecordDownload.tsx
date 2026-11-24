import {useState} from 'react';
import styles from '../styles/ShareControl.module.css';

export default function TrackRecordDownload(){
 const [busy,setBusy]=useState(false),[error,setError]=useState('');
 async function save(){
  const generatedAt=new Date();
  setBusy(true);setError('');
  try{
   const image=new Image();
   await new Promise<void>((resolve,reject)=>{image.onload=()=>resolve();image.onerror=()=>reject(new Error('Image unavailable'));image.src='/data/track-record-template.png';});
   const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1350;
   const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas unavailable');
   ctx.drawImage(image,0,0);ctx.font='28px Arial, sans-serif';ctx.fillStyle='#aabbcf';
   ctx.fillText(generatedAt.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}),64,211);
   const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Export failed')),'image/png'));
   const url=URL.createObjectURL(blob),link=document.createElement('a');
   link.href=url;link.download=`track-record-${generatedAt.getFullYear()}-${String(generatedAt.getMonth()+1).padStart(2,'0')}-${String(generatedAt.getDate()).padStart(2,'0')}.png`;
   document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
  }catch{setError('Could not generate the image. Please try again.')}finally{setBusy(false)}
 }
 return <><button type="button" onClick={save} disabled={busy} className={`${styles.button} ${styles.save}`}>{busy?'Generating image…':'↓ Save image'}</button>{error&&<p role="alert">{error}</p>}</>;
}
