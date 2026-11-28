import SpanishContent from './localization/SpanishContent';
import {useEffect,useState} from 'react';
import styles from '../styles/PentagonPizza.module.css';
import {PizzaBaselines} from './PizzaTypicalWeek';
import PizzaShopBreakdown from './PizzaShopBreakdown';
import ShareControl from './ShareControl';
import {useSiteLanguage} from '../lib/localization/use-site-language';
type HistoryPoint={date:string;value:number;coverage:number;samples:number};
type Snapshot={baselines?:PizzaBaselines|null;history?:HistoryPoint[];aggregate?:number|null;timestamp:string|null;available:number;total:number;spikes:number|null;restaurants:{name:string;percentOfUsual:number|null;spike:boolean;timestamp:string|null}[]};
export default function PentagonPizzaCard(){
 const {href,t}=useSiteLanguage();
 const [range,setRange]=useState(30);
 const [data,setData]=useState<Snapshot|null>(null),[loading,setLoading]=useState(true);
 useEffect(()=>{const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),15000);fetch('https://us-central1-stocker-fcda2.cloudfunctions.net/pentagonPizzaActivity',{signal:controller.signal}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(d=>{if(!Array.isArray(d.restaurants))throw Error();setData(d)}).catch(()=>{}).finally(()=>{clearTimeout(timer);setLoading(false)});return()=>{controller.abort();clearTimeout(timer)}},[]);
 const end=Date.now(), start=end-range*86400000;
 const history=(data?.history??[]).filter(p=>Number.isFinite(p.value)&&p.value>=0&&Number.isFinite(Date.parse(p.date))&&Date.parse(p.date)<=end).sort((a,b)=>a.date.localeCompare(b.date));
 const points=history.filter(p=>Date.parse(p.date)>=start);
 const ceiling=Math.max(50,...points.map(p=>Math.ceil(Math.abs(p.value-100)/50)*50));
 const x=(p:HistoryPoint)=>48+(Date.parse(p.date)-start)/(end-start)*592;
 const y=(deviation:number)=>98-deviation/ceiling*72;
 const signed=(value:number)=>`${value>0?'+':''}${Math.round(value)}%`;
 const dateLabel=(value:string|number)=>new Date(value).toLocaleDateString('en-US',{month:'short',day:'numeric',timeZone:'UTC'});
 const path=points.map((p,i)=>`${i&&Date.parse(p.date)-Date.parse(points[i-1].date)<=86400000?'L':'M'}${x(p)},${y(p.value-100)}`).join(' ');
 const today=new Date(end).toISOString().slice(0,10);
 const completedDayEnd=Date.parse(today);
 const week=history.filter(p=>Date.parse(p.date)>=completedDayEnd-7*86400000&&Date.parse(p.date)<completedDayEnd);
 const weeklyDeviation=week.length===7?week.reduce((sum,p)=>sum+p.value-100,0)/7:null;
 return <SpanishContent><section className={styles.card} aria-labelledby="pizza-title"><div className={styles.top}><div><span className={styles.eyebrow}>ALTERNATIVE INDICATOR</span><h2 id="pizza-title">Pentagon Pizza Index</h2></div>{!!data?.available&&<span className={styles.badge}>{`${data.spikes} activity ${data.spikes===1?'spike':'spikes'}`}</span>}<ShareControl title={t('Pentagon Pizza Index & Tracker')} path={href('/pentagon-pizza-index/')}/></div>
 <p>Public activity at pizza shops near the Pentagon.</p>
 {data&&<p className={styles.meta}>{data.available} of {data.total} locations reporting{data.timestamp?` · Observation updated ${new Date(data.timestamp).toLocaleString('en-US',{timeZone:'America/New_York',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})} ET`:''}</p>}
 <PizzaShopBreakdown restaurants={data?.restaurants??[]} loading={loading} baselines={data?.baselines}/>
 <div className={styles.historyHead}><h3>Activity above or below usual</h3><div className={styles.ranges} aria-label="Pizza history period">{[[7,'1W'],[30,'1M'],[90,'3M'],[365,'1Y']].map(([n,label])=><button key={n} aria-pressed={range===n} onClick={()=>setRange(Number(n))}>{label}</button>)}</div></div>
 <p className={styles.meta}>0% = usual activity · Positive = busier than usual · Negative = quieter than usual</p>
 <p className={styles.meta}>Each reading compares activity with the usual level for that shop at the same weekday and hour.</p>
 {weeklyDeviation!==null?<p><strong>Last 7 complete days: {signed(weeklyDeviation)} versus usual</strong></p>:<p className={styles.meta}>A weekly comparison needs seven complete days of measured history.</p>}
 {points.length?<><svg className={styles.chart} viewBox="0 0 680 210" role="img" aria-label="Daily pizza shop activity deviation from usual activity">{[-ceiling,0,ceiling].map(v=><g key={v}><line x1="48" x2="640" y1={y(v)} y2={y(v)} stroke={v===0?'#aebdd1':'#344055'} strokeDasharray={v===0?'4 4':undefined}/><text x="0" y={y(v)+4} fill="#aebdd1" fontSize="11">{signed(v)}</text></g>)}<path d={path} fill="none" stroke="#bfa6ff" strokeWidth="2.5"/>{points.map(p=><circle key={p.date} cx={x(p)} cy={y(p.value-100)} r="3" fill={p.value>=100?'#53d5b8':'#f1a4aa'}><title>{dateLabel(p.date)}: {signed(p.value-100)} versus usual; {Math.round(p.coverage*100)}% of shops reporting</title></circle>)}<text x="48" y="200" fill="#aebdd1" fontSize="11">{dateLabel(start)}</text><text x="640" y="200" textAnchor="end" fill="#aebdd1" fontSize="11">{dateLabel(end)}</text></svg><p className={styles.meta}>Daily averages of available readings · At least half of tracked shops reporting · Missing days remain gaps. Today may be incomplete.</p></>:<p className={styles.meta}>{loading?'Loading measured activity…':'No measured activity history is available for this period yet. Typical popularity alone cannot show whether this week is busier than usual.'}</p>}
 </section></SpanishContent>
}
