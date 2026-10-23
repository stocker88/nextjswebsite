import {useEffect,useState} from 'react';
import saved from '../data/mover-trades.json';
import {findMoverTrade,type MoverTrade as Trade} from '../lib/mover-trades';
import styles from '../styles/MoverContext.module.css';
export default function MoverTrade({symbol,compact=false}:{symbol:string;compact?:boolean}){
 const [now,setNow]=useState<number|null>(null);
 useEffect(()=>{setNow(Date.now());const timer=window.setInterval(()=>setNow(Date.now()),60000);return()=>window.clearInterval(timer);},[]);
 const trade=now===null?undefined:findMoverTrade(saved as Trade[],symbol,now);
 if(!trade)return null;
 const date=new Date(trade.sessionDate+'T12:00:00Z').toLocaleDateString('en-US',{month:'short',day:'numeric',timeZone:'UTC'});
 return <a className={`${styles.trigger} ${styles.trade} ${compact?styles.compactTrigger:''}`} href={trade.href} data-result-post-id={trade.postId} aria-label={`View recent options results: ${symbol}`} title={`Options results · ${date}: ${trade.title}`}><span>Trade</span><span aria-hidden="true">↗</span></a>;
}
