import {useEffect,useState} from 'react';
import styles from '../styles/PentagonPizza.module.css';
type HistoryPoint={date:string;value:number;coverage:number;samples:number};
type Snapshot={history?:HistoryPoint[];aggregate?:number|null;timestamp:string|null;available:number;total:number;spikes:number|null;restaurants:{name:string;percentOfUsual:number|null;spike:boolean;timestamp:string|null}[]};
export default function PentagonPizzaCard(){
 const [range,setRange]=useState(365);
 const [data,setData]=useState<Snapshot|null>(null),[loading,setLoading]=useState(true);
 useEffect(()=>{const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),15000);fetch('https://us-central1-stocker-fcda2.cloudfunctions.net/pentagonPizzaActivity',{signal:controller.signal}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(d=>{if(!Array.isArray(d.restaurants))throw Error();setData(d)}).catch(()=>{}).finally(()=>{clearTimeout(timer);setLoading(false)});return()=>{controller.abort();clearTimeout(timer)}},[]);
 const end=Date.now(), start=end-range*86400000;
 const points=(data?.history??[]).filter(p=>Date.parse(p.date)>=start&&Number.isFinite(p.value));
 const ceiling=Math.max(200,...points.map(p=>Math.ceil(p.value/50)*50));
 const x=(p:HistoryPoint)=>40+(Date.parse(p.date)-start)/(end-start)*600;
 const y=(value:number)=>170-value/ceiling*145;
 const path=points.map((p,i)=>`${i&&Date.parse(p.date)-Date.parse(points[i-1].date)<=86400000?'L':'M'}${x(p)},${y(p.value)}`).join(' ');
 return <section className={styles.card} aria-labelledby="pizza-title"><div className={styles.top}><div><span className={styles.eyebrow}>ALTERNATIVE INDICATOR</span><h2 id="pizza-title">Pentagon Pizza Index</h2></div><span className={styles.badge}>{loading?'Loading…':!data?.available?'No current reading':`${data.spikes} activity ${data.spikes===1?'spike':'spikes'}`}</span></div>
 <p>Public activity at pizza shops near the Pentagon. An unconventional geopolitical curiosity, separate from the Fear &amp; Greed score.</p>
 {data&&<><div className={styles.rows}>{data.restaurants.map((r,i)=><div key={i}><span>{r.name}</span><strong className={r.spike?styles.spike:undefined}>{r.percentOfUsual===null?'Unavailable':`${Math.round(r.percentOfUsual)}% of usual`}</strong></div>)}</div><p className={styles.meta}>{data.available} of {data.total} locations reporting{data.timestamp?` · Observation updated ${new Date(data.timestamp).toLocaleString('en-US',{timeZone:'America/New_York',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})} ET`:''}</p></>}
 {!loading&&!data&&<p role="status">Activity data is temporarily unavailable.</p>}
 <div className={styles.historyHead}><h3>Combined activity over time</h3><div className={styles.ranges} aria-label="Pizza history period">{[[30,'1M'],[90,'3M'],[365,'1Y']].map(([n,label])=><button key={n} aria-pressed={range===n} onClick={()=>setRange(Number(n))}>{label}</button>)}</div></div>
 <p className={styles.meta}>100% = usual activity · Equal-weight daily average · At least half of tracked shops reporting</p>
 {points.length?<><svg className={styles.chart} viewBox="0 0 680 210" role="img" aria-label="Daily combined pizza shop activity relative to usual activity">{[0,100,ceiling].map((v,i)=><g key={i}><line x1="40" x2="640" y1={y(v)} y2={y(v)} stroke="#344055" strokeDasharray={v===100?'4 4':undefined}/><text x="0" y={y(v)+4} fill="#aebdd1" fontSize="11">{v}%</text></g>)}<path d={path} fill="none" stroke="#bfa6ff" strokeWidth="2.5"/>{points.map(p=><circle key={p.date} cx={x(p)} cy={y(p.value)} r="3" fill="#bfa6ff"><title>{p.date}: {Math.round(p.value)}% of usual; {Math.round(p.coverage*100)}% coverage; {p.samples} observations</title></circle>)}<text x="40" y="200" fill="#aebdd1" fontSize="11">{new Date(start).toISOString().slice(0,10)}</text><text x="640" y="200" textAnchor="end" fill="#aebdd1" fontSize="11">{new Date(end).toISOString().slice(0,10)}</text></svg><p className={styles.meta}>{points.length} measured days · {points[0].date} to {points[points.length-1].date} · UTC · Missing days remain gaps.</p></>:<div className={styles.empty} role="status">{loading?'Loading history…':'No measured history available for this period yet. We save valid observations every 10 minutes. A full past-year dataset is not available.'}</div>}
 <div className={styles.bottom}><small>Foot traffic, not verified orders or a prediction of military action.</small></div></section>
}
