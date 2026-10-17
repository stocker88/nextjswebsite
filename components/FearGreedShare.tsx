import {useEffect,useRef,useState} from 'react';
import saved from '../data/fear-greed-share.json';
import styles from './heatmap/Heatmap.module.css';
export default function FearGreedShare(){
 const dialog=useRef<HTMLDialogElement>(null);
 const [image,setImage]=useState<{url:string;file:File}|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState('');
 useEffect(()=>{if(image)dialog.current?.showModal();return()=>{if(image)URL.revokeObjectURL(image.url)}},[image]);
 async function prepare(){setBusy(true);setError('');try{
  const response=await fetch(saved.image);if(!response.ok)throw Error('Image unavailable');
  const blob=await response.blob();if(!blob.type.includes('image/png'))throw Error('Invalid image');
  setImage({url:URL.createObjectURL(blob),file:new File([blob],`fear-and-greed-${saved.timestamp.slice(0,10)}.png`,{type:'image/png'})});
 }catch{setError('The image could not be loaded. Please try again.')}finally{setBusy(false)}}
 function download(){if(!image)return;const a=document.createElement('a');a.href=image.url;a.download=image.file.name;a.click()}
 async function share(){if(!image)return;try{if(navigator.canShare?.({files:[image.file]}))await navigator.share({files:[image.file],title:'Fear & Greed Index'});else download()}catch(e){if((e as Error).name!=='AbortError')setError('Sharing is unavailable here. Use Download PNG.')}}
 return <><button onClick={prepare} disabled={busy}>{busy?'Preparing image…':'↗ Share image'}</button>{error&&!image&&<p role="alert">{error}</p>}
 <dialog ref={dialog} className={styles.shareDialog} onCancel={()=>setImage(null)}><div className={styles.shareHeader}><h2>Share Fear &amp; Greed</h2><button aria-label="Close image preview" onClick={()=>{dialog.current?.close();setImage(null)}}>×</button></div>{image&&<img src={image.url} alt="Fear and Greed sentiment recap with website branding and QR code"/>}<div className={styles.shareActions}><button onClick={share}>Share image</button><button onClick={download}>Download PNG</button></div>{error&&<p role="alert">{error}</p>}</dialog></>;
}
