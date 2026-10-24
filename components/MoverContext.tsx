import {useEffect,useId,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {savedCoverage,loadMoverCoverage} from '../lib/mover-coverage';
import trades from '../data/mover-trades.json';
import {findMoverTrade,type MoverTrade} from '../lib/mover-trades';
import {savedNews,loadHeadlines} from '../lib/market-news';
import {findMoverHeadline} from '../lib/mover-headlines';
import {allowsMoverHeadlines,findMoverContext,isSessionExplanation,MoverContextArticle} from '../lib/mover-context';
import type {HeatStock,Period} from '../lib/market-heatmap';
import styles from '../styles/MoverContext.module.css';

export default function MoverContext({stock,period,marketSession='intraday',compact=false}:{stock:HeatStock;period:Period;marketSession?:string;compact?:boolean}) {
  const [now,setNow]=useState<number|null>(null),[open,setOpen]=useState(false);
  const [coverage,setCoverage]=useState(savedCoverage);
  useEffect(()=>{let active=true;const refresh=()=>{if(!document.hidden)void loadMoverCoverage().then(items=>{if(active)setCoverage(items);});};refresh();const timer=window.setInterval(refresh,60000);window.addEventListener('focus',refresh);return()=>{active=false;window.clearInterval(timer);window.removeEventListener('focus',refresh);};},[]);
  const [headlines,setHeadlines]=useState(savedNews.items);
  const [position,setPosition]=useState<{left:number;top:number}|null>(null);
  const trigger=useRef<HTMLButtonElement>(null),panel=useRef<HTMLDivElement>(null),id=useId();
  useEffect(()=>{setNow(Date.now());const timer=setInterval(()=>setNow(Date.now()),60000);return()=>clearInterval(timer);},[]);
  const researchArticle=now===null?undefined:findMoverContext(coverage,stock.symbol,now,period,stock.asOf,stock.changes[period],marketSession);
  const trade=now===null?undefined:findMoverTrade(trades as MoverTrade[],stock.symbol,now);
  const headlinesAllowed=allowsMoverHeadlines(period);
  const blocked=Boolean(researchArticle||trade);
  useEffect(()=>{
    if(now===null||blocked||!headlinesAllowed)return;
    let active=true;
    const refresh=()=>{if(document.hidden)return;void loadHeadlines().then(data=>{if(active)setHeadlines(data.items);});};
    refresh();const timer=window.setInterval(refresh,3*60*60*1000);window.addEventListener('focus',refresh);
    return()=>{active=false;window.clearInterval(timer);window.removeEventListener('focus',refresh);};
  },[blocked,now===null,headlinesAllowed]);
  const article=researchArticle||(now===null||!headlinesAllowed?undefined:findMoverHeadline(headlines,stock.symbol,now,{trade:!!trade},period));
  useEffect(()=>{setOpen(false);setPosition(null);},[article?.href,period,marketSession,stock.asOf]);
  useEffect(()=>{
    if (!open||!trigger.current||!panel.current) return;
    const rect=trigger.current.getBoundingClientRect(),height=panel.current.getBoundingClientRect().height,width=Math.min(340,window.innerWidth-24);
    setPosition({left:Math.max(12,Math.min(rect.right-width,window.innerWidth-width-12)),top:Math.max(12,rect.bottom+height+12<window.innerHeight?rect.bottom+8:rect.top-height-8)});
    const dismiss=(e:PointerEvent)=>{if(!panel.current?.contains(e.target as Node)&&!trigger.current?.contains(e.target as Node))setOpen(false);};
    const escape=(e:KeyboardEvent)=>{if(e.key==='Escape'){setOpen(false);trigger.current?.focus();}};
    const close=(e:Event)=>{if(!panel.current?.contains(e.target as Node))setOpen(false);};
    document.addEventListener('pointerdown',dismiss);document.addEventListener('keydown',escape);window.addEventListener('scroll',close,true);window.addEventListener('resize',close);
    return()=>{document.removeEventListener('pointerdown',dismiss);document.removeEventListener('keydown',escape);window.removeEventListener('scroll',close,true);window.removeEventListener('resize',close);};
  },[open]);
  useEffect(()=>{if(open&&position)panel.current?.querySelector<HTMLAnchorElement>('a')?.focus({preventScroll:true});},[open,position]);
  if(!article)return null;
  const explanation=isSessionExplanation(article,period,stock.asOf,stock.changes[period],marketSession),label=article.kind==='signal'?'Signal':explanation?'Why it’s moving':article.kind==='recap'?'Mentioned in recap':article.kind==='coverage'?'Related coverage':article.kind==='headline'?'Related news':'Recent news';
  const date=new Date(article.publishedAt).toLocaleString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'America/New_York'});
  return <>
    <button ref={trigger} type="button" className={`${styles.trigger} ${compact?styles.compactTrigger:''}`} title={label} aria-label={`${label}: ${stock.symbol}`} aria-expanded={open} aria-controls={open?id:undefined} aria-haspopup="dialog" onClick={()=>{setPosition(null);setOpen(!open);}}><span aria-hidden="true">✦</span><span className={styles.fullLabel}>{label}</span>{compact&&<span className={styles.shortLabel} aria-hidden="true">{article.kind==='signal'?'Signal':explanation?'Why':article.kind==='recap'?'Recap':'News'}</span>}</button>
    {open&&createPortal(<div ref={panel} id={id} className={styles.popover} role="dialog" aria-label={`${stock.symbol} recent article`} style={{left:position?.left||12,top:position?.top||12,visibility:position?'visible':'hidden'}}>
      <button className={styles.close} type="button" aria-label="Close article preview" onClick={()=>{setOpen(false);trigger.current?.focus();}}>×</button>
      <a href={article.href} className={styles.article}>
        <span className={styles.eyebrow}>{stock.symbol} · {article.kind==='signal'?'AI Signal':article.kind==='preview'?'Earnings preview':article.kind==='earnings'?'Earnings review':article.kind==='recap'?'Market recap':article.kind==='coverage'?'Feed coverage':article.kind==='headline'?'Market news':explanation?'Move context':'Recent research'}</span>
        <strong>{article.title}</strong>{article.source&&<span className={styles.source}>{article.source}</span>}<time dateTime={article.publishedAt}>{date}</time>
        {article.summary&&<p>{article.summary}</p>}<span className={styles.read}>{article.kind==='headline'?'Read news':article.kind==='signal'?'View Signal':'Read article'} <span aria-hidden="true">↗</span></span>
      </a>
    </div>,document.body)}
  </>;
}
