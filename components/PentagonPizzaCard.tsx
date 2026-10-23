import {useEffect,useState} from 'react';
import styles from '../styles/PentagonPizza.module.css';
type Snapshot={timestamp:string|null;available:number;total:number;spikes:number|null;restaurants:{name:string;percentOfUsual:number|null;spike:boolean;timestamp:string|null}[]};
export default function PentagonPizzaCard(){
 const [data,setData]=useState<Snapshot|null>(null),[loading,setLoading]=useState(true);
 useEffect(()=>{const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),15000);fetch('https://us-central1-stocker-fcda2.cloudfunctions.net/pentagonPizzaActivity',{signal:controller.signal}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(d=>{if(!Array.isArray(d.restaurants))throw Error();setData(d)}).catch(()=>{}).finally(()=>{clearTimeout(timer);setLoading(false)});return()=>{controller.abort();clearTimeout(timer)}},[]);
 return <section className={styles.card} aria-labelledby="pizza-title"><div className={styles.top}><div><span className={styles.eyebrow}>ALTERNATIVE INDICATOR</span><h2 id="pizza-title">Pentagon Pizza Index</h2></div><span className={styles.badge}>{loading?'Loading…':!data?.available?'No current reading':`${data.spikes} activity ${data.spikes===1?'spike':'spikes'}`}</span></div>
 <p>Public activity at pizza shops near the Pentagon. An unconventional geopolitical curiosity, separate from the Fear &amp; Greed score.</p>
 {data&&<><div className={styles.rows}>{data.restaurants.map((r,i)=><div key={i}><span>{r.name}</span><strong className={r.spike?styles.spike:undefined}>{r.percentOfUsual===null?'Unavailable':`${Math.round(r.percentOfUsual)}% of usual`}</strong></div>)}</div><p className={styles.meta}>{data.available} of {data.total} locations reporting{data.timestamp?` · Source updated ${new Date(data.timestamp).toLocaleString('en-US',{timeZone:'America/New_York',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})} ET`:''}</p></>}
 {!loading&&!data&&<p role="status">Activity data is temporarily unavailable.</p>}
 <div className={styles.bottom}><small>Foot traffic, not verified orders or a prediction of military action.</small><a href="https://www.pizzint.watch/" target="_blank" rel="noopener noreferrer">Source: PizzINT ↗</a></div></section>
}
