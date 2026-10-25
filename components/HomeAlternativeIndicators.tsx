import {useEffect,useState} from 'react';
import Link from 'next/link';
import s from '../styles/AlternativeIndicators.module.css';
type Hormuz={latest:{date:string;total:number;tankers:number;average7:number|null};history:{date:string;total:number}[]};
export default function HomeAlternativeIndicators(){
 const [h,setH]=useState<Hormuz|null>(null),[loading,setLoading]=useState(true);
 useEffect(()=>{const c=new AbortController(),timer=setTimeout(()=>c.abort(),12000);const get=(name:string)=>fetch('https://us-central1-stocker-fcda2.cloudfunctions.net/'+name,{signal:c.signal}).then(r=>{if(!r.ok)throw Error();return r.json()});get('hormuzActivity').then(d=>{if(d.latest&&Array.isArray(d.history))setH(d)}).catch(()=>{}).finally(()=>{clearTimeout(timer);setLoading(false)});return()=>{clearTimeout(timer);c.abort()}},[]);
 const points=h?.history.slice(-30)??[],max=Math.max(1,...points.map(d=>d.total)),first=Date.parse(points[0]?.date??'')||0,last=Date.parse(points[points.length-1]?.date??'')||0;
 const path=points.map((d,i)=>`${i&&Date.parse(d.date)-Date.parse(points[i-1].date)===86400000?'L':'M'}${(Date.parse(d.date)-first)/Math.max(1,last-first)*500},${55-d.total/max*50}`).join(' ');
 return <section className={s.home} aria-labelledby="alternative-indicators-title"><header className={s.homeHeader}><div><span className={s.eyebrow}>BEYOND THE HEADLINES</span><h2 id="alternative-indicators-title">Unusual signals. Useful context.</h2></div><p>Explore shipping flows and the context behind unusual market activity.</p></header><div className={`${s.cards} ${s.homeCards}`}>
 <Link href="/hormuz-transit-index/" className={s.snapshot}><span className={s.eyebrow}>MARITIME ACTIVITY</span><h3>Hormuz Transit Index</h3><strong>{h?`${h.latest.total} crossings`:loading?'Loading…':'Data unavailable'}</strong><p>{h?`${h.latest.tankers} tankers · ${h.latest.average7?.toFixed(1)??'—'} daily crossings, 7-day average`:'Daily vessel traffic through the Strait of Hormuz.'}</p>{points.length>0&&<svg className={s.spark} viewBox="0 0 500 60" role="img" aria-label="Last 30 daily Hormuz transit observations"><path d={path} stroke="#62d4c2" strokeWidth="2" fill="none"/></svg>}<small>{h?`Latest observation ${h.latest.date} · Reporting delayed`:'Explore available history and methodology'}</small><span>Explore transit history →</span></Link>
 </div></section>
}
