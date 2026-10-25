import {useEffect,useId,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import saved from '../data/mover-trades.json';
import {findMoverTrade,formatOptionPerformance,type MoverTrade as Trade} from '../lib/mover-trades';
import type {OptionResultPreviewData} from '../lib/option-results';
import OptionResultPayoff from './OptionResultPayoff';
import {AccountLink} from './SiteAccount';
import styles from '../styles/MoverContext.module.css';
export default function MoverTrade({symbol,compact=false}:{symbol:string;compact?:boolean}){
 const [now,setNow]=useState<number|null>(null),[open,setOpen]=useState(false),[result,setResult]=useState<OptionResultPreviewData|null>(null);
 const [position,setPosition]=useState<{left:number;top:number}|null>(null),[failed,setFailed]=useState(false);
 const trigger=useRef<HTMLButtonElement>(null),panel=useRef<HTMLDivElement>(null),id=useId();
 useEffect(()=>{setNow(Date.now());const timer=window.setInterval(()=>setNow(Date.now()),60000);return()=>window.clearInterval(timer);},[]);
 const trade=now===null?undefined:findMoverTrade(saved as Trade[],symbol,now);
 useEffect(()=>{setOpen(false);setResult(null);setFailed(false);},[trade?.postId]);
 useEffect(()=>{
  if(!open||!trade)return;
  let active=true;
  import('../lib/option-results').then(data=>{if(active){setResult(data.optionResults.find(item=>item.id===trade.postId)||null);setFailed(true)}}).catch(()=>{if(active)setFailed(true)});
  return()=>{active=false};
 },[open,trade?.postId]);
 useEffect(()=>{
  if(!open||!trigger.current||!panel.current)return;
  const rect=trigger.current.getBoundingClientRect(),height=panel.current.getBoundingClientRect().height,width=Math.min(380,window.innerWidth-24);
  setPosition({left:Math.max(12,Math.min(rect.right-width,window.innerWidth-width-12)),top:Math.max(12,rect.bottom+height+12<window.innerHeight?rect.bottom+8:rect.top-height-8)});
  const dismiss=(e:PointerEvent)=>{if(!panel.current?.contains(e.target as Node)&&!trigger.current?.contains(e.target as Node))setOpen(false)};
  const escape=(e:KeyboardEvent)=>{if(e.key==='Escape'){setOpen(false);trigger.current?.focus()}};
  const close=(e:Event)=>{if(!(e.target instanceof Node)||!panel.current?.contains(e.target))setOpen(false)};
  document.addEventListener('pointerdown',dismiss);document.addEventListener('keydown',escape);window.addEventListener('scroll',close,true);window.addEventListener('resize',close);
  return()=>{document.removeEventListener('pointerdown',dismiss);document.removeEventListener('keydown',escape);window.removeEventListener('scroll',close,true);window.removeEventListener('resize',close)};
 },[open,result,failed]);
 useEffect(()=>{if(open&&position)panel.current?.querySelector<HTMLButtonElement>('button')?.focus({preventScroll:true})},[open,!!position]);
 if(!trade)return null;
 return <>
  <button ref={trigger} type="button" className={`${styles.trigger} ${styles.trade} ${trade.performancePct<0?styles.loss:''} ${compact?styles.compactTrigger:''}`} data-result-post-id={trade.postId} aria-label={`Preview recent options results: ${symbol}, ${formatOptionPerformance(trade.performancePct)} option price return`} aria-haspopup="dialog" aria-expanded={open} aria-controls={open?id:undefined} title="Preview options performance" onClick={()=>{setPosition(null);setOpen(!open)}}><span>{formatOptionPerformance(trade.performancePct)}</span><span aria-hidden="true">↗</span></button>
  {open&&createPortal(<div ref={panel} id={id} role="dialog" aria-label={`${symbol} options result preview`} className={`${styles.popover} ${styles.tradePopover}`} style={{left:position?.left||12,top:position?.top||12,visibility:position?'visible':'hidden'}}>
   <button type="button" className={styles.close} aria-label="Close options preview" onClick={()=>{setOpen(false);trigger.current?.focus()}}>×</button>
   <div className={styles.tradePreview}>
    <span className={styles.eyebrow}>{symbol} · OPTIONS RESULTS</span><h3>{trade.title}</h3>
    {result?<><p className={styles.resultSummary}>{result.previewSummary||result.title}</p><OptionResultPayoff key={result.id} result={result} compact/></>:<p role="status">{failed?'Open the full results for this saved report.':'Loading result…'}</p>}
    <AccountLink destination={trade.href} className={styles.read}>Read full results ↗</AccountLink>
   </div>
  </div>,document.body)}
 </>;
}
