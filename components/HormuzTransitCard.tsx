import {useEffect,useState,type PointerEvent,type KeyboardEvent} from 'react';
import styles from '../styles/PentagonPizza.module.css';
type Point={date:string;total:number;tankers:number;average7:number|null};
type Data={history:Point[];latest:Point;checkedAt:string};
export default function HormuzTransitCard(){
 const [data,setData]=useState<Data|null>(null),[loading,setLoading]=useState(true),[range,setRange]=useState(365),[selected,setSelected]=useState<Point|null>(null);
 useEffect(()=>{const c=new AbortController();const timer=setTimeout(()=>c.abort(),15000);fetch('https://us-central1-stocker-fcda2.cloudfunctions.net/hormuzActivity',{signal:c.signal}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(d=>{if(!d.history?.length)throw Error();setData(d)}).catch(()=>{}).finally(()=>{clearTimeout(timer);setLoading(false)});return()=>{c.abort();clearTimeout(timer)}},[]);
 const end=Date.now(),start=end-range*86400000,points=(data?.history??[]).filter(p=>Date.parse(p.date)>=start);
 const max=Math.max(10,...points.map(p=>p.total));
 const x=(p:Point)=>40+(Date.parse(p.date)-start)/(end-start)*600,y=(v:number)=>170-v/max*145;
 function path(key:'total'|'tankers'|'average7'){return points.map((p,i)=>p[key]===null?'':`${i&&points[i-1][key]!==null&&Date.parse(p.date)-Date.parse(points[i-1].date)===86400000?'L':'M'}${x(p)},${y(p[key] as number)}`).join(' ')}
 function inspect(event:PointerEvent<SVGSVGElement>){
  const svg=event.currentTarget, matrix=svg.getScreenCTM();
  if(!matrix||!points.length)return;
  const cursor=svg.createSVGPoint();cursor.x=event.clientX;cursor.y=event.clientY;
  const position=cursor.matrixTransform(matrix.inverse());
  const date=start+Math.max(0,Math.min(1,(position.x-40)/600))*(end-start);
  setSelected(points.reduce((nearest,p)=>Math.abs(Date.parse(p.date)-date)<Math.abs(Date.parse(nearest.date)-date)?p:nearest));
 }
 function inspectKey(event:KeyboardEvent<SVGSVGElement>){
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)||!points.length)return;
  event.preventDefault();
  const index=selected?points.findIndex(p=>p.date===selected.date):points.length-1;
  const next=event.key==='Home'?0:event.key==='End'?points.length-1:Math.max(0,Math.min(points.length-1,index+(event.key==='ArrowLeft'?-1:1)));
  setSelected(points[next]);
 }
 const current=selected??data?.latest;
 return <section className={styles.card} aria-labelledby="hormuz-title"><div className={styles.top}><div><span className={styles.eyebrow}>MARITIME ACTIVITY</span><h2 id="hormuz-title">Hormuz Transit Index</h2></div><span className={styles.badge}>Daily vessel crossings</span></div>
 <p>Shipping activity through the Strait of Hormuz.</p>
 {current&&<><div className={styles.rows}><div><span>Total crossings</span><strong>{current.total}</strong></div><div><span>Tanker crossings</span><strong>{current.tankers}</strong></div><div><span>7-day average · all vessels</span><strong>{current.average7?.toFixed(1)??'Unavailable'}</strong></div><div><span>{selected?'Selected date':'Latest observation'}</span><strong>{current.date}</strong></div></div>{selected&&<button className={styles.resetSelection} onClick={()=>setSelected(null)}>Show latest</button>}</>}
 <div className={styles.historyHead}><h3>Transit history</h3><div className={styles.ranges} aria-label="Hormuz history period">{[[30,'1M'],[90,'3M'],[365,'1Y']].map(([n,label])=><button key={n} aria-pressed={range===n} onClick={()=>{setRange(Number(n));setSelected(null)}}>{label}</button>)}</div></div>
 <p className={styles.meta}><span style={{color:'#62d4c2'}}>● Total crossings</span> · <span style={{color:'#bfa6ff'}}>● Tankers</span> · <span style={{color:'#efba79'}}>● 7-day average</span></p>
 {points.length?<><div className={styles.chartReadout} aria-live="polite" aria-atomic="true">
 <strong>{current?.date}</strong><span style={{color:'#62d4c2'}}>Total: {current?.total??'—'}</span><span style={{color:'#bfa6ff'}}>Tankers: {current?.tankers??'—'}</span><span style={{color:'#efba79'}}>7-day average: {current?.average7?.toFixed(1)??'Unavailable'}</span>
 </div><svg className={`${styles.chart} ${styles.interactiveChart}`} viewBox="0 0 680 210" role="slider" tabIndex={0} aria-label="Inspect Hormuz transit history by date" aria-valuemin={0} aria-valuemax={points.length-1} aria-valuenow={selected?points.findIndex(p=>p.date===selected.date):points.length-1} aria-valuetext={current?`${current.date}: ${current.total} crossings, ${current.tankers} tankers, seven-day average ${current.average7??'unavailable'}`:undefined} onKeyDown={inspectKey} onPointerDown={event=>{event.currentTarget.setPointerCapture(event.pointerId);inspect(event)}} onPointerMove={event=>{if(event.pointerType==='mouse'||event.currentTarget.hasPointerCapture(event.pointerId))inspect(event)}} onPointerUp={event=>{if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId)}}>{[0,Math.round(max/2),max].map(v=><g key={v}><line x1="40" x2="640" y1={y(v)} y2={y(v)} stroke="#344055"/><text x="0" y={y(v)+4} fill="#aebdd1" fontSize="11">{v}</text></g>)}{(['total','tankers','average7'] as const).map((key,i)=><path key={key} d={path(key)} fill="none" stroke={['#62d4c2','#bfa6ff','#efba79'][i]} strokeWidth={key==='average7'?2.5:1.3}/>)}{selected&&<g pointerEvents="none"><line x1={x(selected)} x2={x(selected)} y1="20" y2="175" stroke="#d4c0ff" strokeDasharray="3 3"/>{(['total','tankers','average7'] as const).map((key,i)=>selected[key]!==null&&<circle key={key} cx={x(selected)} cy={y(selected[key] as number)} r="3.5" fill={['#62d4c2','#bfa6ff','#efba79'][i]} stroke="#101927" strokeWidth="1.5"/>)}</g>}<text x="40" y="200" fill="#aebdd1" fontSize="11">{new Date(start).toISOString().slice(0,10)}</text><text x="640" y="200" textAnchor="end" fill="#aebdd1" fontSize="11">{new Date(end).toISOString().slice(0,10)}</text></svg><p className={styles.meta}>{points.length} daily observations · {points[0].date} to {points[points.length-1].date}. Click and drag, or slide horizontally on mobile, to inspect dates. Keyboard: use arrow keys.</p></>:<div className={styles.empty} role="status">{loading?'Loading transit history…':'Transit history is temporarily unavailable.'}</div>}
 <div className={styles.bottom}><small>AIS-based vessel counts, not oil volumes. Tankers are included in total crossings. Reporting is delayed; missing days remain gaps. Latest observation: {data?.latest.date??'unavailable'}.</small></div></section>
}
