import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {useSiteAccount} from './SiteAccount';
import {loadRecentResearch} from '../lib/research-feed';
import {researchUrl,type ResearchPreview} from '../lib/research';
import {companySymbol,sessionLabel,isMarketResearch,researchCardTone,isOptionsResearch,ribbonHeadline,withOptionResults} from '../lib/latest-research';
import {startResearchBandScroll} from '../lib/research-band-scroll';
import styles from '../styles/LatestResearchBand.module.css';
function CompanyMark({symbol}:{symbol:string}) {
 const [failed,setFailed]=useState(false);
 return <span className={styles.logo} aria-hidden="true">{symbol&&!failed?<img src={'/assets/logo/'+encodeURIComponent(symbol)+'.webp'} width={24} height={24} alt="" onError={()=>setFailed(true)}/>:symbol?symbol.slice(0,2):'✦'}</span>;
}
export function LatestResearchItems({items}:{items:ResearchPreview[]}) {
 const rail=useRef<HTMLDivElement>(null),region=useRef<HTMLElement>(null);
 const [paused,setPaused]=useState(false);
 const identity=items.map(item=>item.id).join('|');
 useEffect(()=>{if(rail.current&&region.current)return startResearchBandScroll(rail.current,region.current,paused);},[identity,paused]);
 const step=(direction:number)=>rail.current?.scrollBy({left:direction*340,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
 return <section ref={region} className={styles.band} aria-label="News, research and options">
  <div className={styles.rail} ref={rail}>
   {items.map(item=>{const options=isOptionsResearch(item),headline=ribbonHeadline(item.title),market=isMarketResearch(item),snapshot=sessionLabel(item),symbol=market&&snapshot?'SPY':companySymbol(item);return <Link className={`${styles.item} ${styles[researchCardTone(item)]}`} key={item.id} href={item.href||researchUrl(item.id,item.title)} data-band-access={options?'ultra':'pro'} title={headline}>
    <CompanyMark key={symbol} symbol={symbol}/><span className={styles.copy}><span className={styles.headline}>{(symbol||market||options)&&<b>{options?'Options':market?'Market':symbol}</b>}<span>{options&&symbol?symbol+' · ':''}{headline}</span></span>{snapshot&&<span className={styles.snapshot}><strong className={snapshot.move>0?styles.up:snapshot.move<0?styles.down:styles.neutral}>{snapshot.change}</strong><span>{snapshot.label}</span></span>}</span><span className={styles.chevron} aria-hidden="true">›</span>
   </Link>})}
  </div>
  <div className={styles.controls}><button className={styles.pause} type="button" aria-label={paused?'Resume automatic scrolling':'Pause automatic scrolling'} aria-pressed={paused} onClick={()=>setPaused(value=>!value)}>{paused?'Play':'Pause'}</button><button className={styles.stepButton} type="button" aria-label="Previous research" onClick={()=>step(-1)}>‹</button><button className={styles.stepButton} type="button" aria-label="Next research" onClick={()=>step(1)}>›</button></div>
 </section>;
}
export default function LatestResearchBand() {
 const {user,ready}=useSiteAccount();const [items,setItems]=useState<ResearchPreview[]>([]);
 useEffect(()=>{
  if(!ready)return;
  let active=true,busy=false;const controller=new AbortController();
  const refresh=async()=>{
   if(busy||document.hidden)return;busy=true;
   try {
    const result=await loadRecentResearch(controller.signal,items=>{if(active)setItems(withOptionResults(items));});
    if(active)setItems(withOptionResults(result));
   }catch{/* Keep the last successful headlines during a temporary connection failure. */}finally{busy=false;}
  };
  void refresh();const timer=window.setInterval(()=>void refresh(),60000);const focus=()=>void refresh();window.addEventListener('focus',focus);document.addEventListener('visibilitychange',focus);
  return()=>{active=false;controller.abort();window.clearInterval(timer);window.removeEventListener('focus',focus);document.removeEventListener('visibilitychange',focus)};
 },[ready,user?.uid]);
 if(!ready||!items.length)return null;
 return <LatestResearchItems items={items}/>;
}
