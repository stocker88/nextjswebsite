import {useRef,useState} from 'react';
import useChartEntrance from '../useChartEntrance';
import ChartReveal from '../ChartReveal';
import {Detail,decimal,percent,shortDate} from '../../lib/earnings';
export default function PriceChart({data}:{data:Detail}){
 const [showReports,setShowReports]=useState(false);const [period,setPeriod]=useState(252);const [hover,setHover]=useState<number|null>(null);
 const chartRef=useRef<SVGSVGElement>(null);
 useChartEntrance(chartRef,JSON.stringify([data.symbol,period,data.prices]));
 const all=data.prices;const p=all.slice(-(period+1));if(!p.length)return <div className="ec-empty">Price history is unavailable for this stock.</div>;
 const reportDates=Array.from(new Set((data.history||[]).map(r=>r.date).filter(d=>/^\d{4}-\d{2}-\d{2}$/.test(d)&&Number.isFinite(Date.parse(d))))).sort();
 const visibleReports=reportDates.filter(d=>d>=p[0].date&&d<=p.at(-1)!.date).map(date=>{
  const after=p.findIndex(point=>point.date>=date);
  if(after<=0||p[after].date===date)return {date,index:Math.max(after,0)};
  const before=after-1;return {date,index:before+(Date.parse(date)-Date.parse(p[before].date))/(Date.parse(p[after].date)-Date.parse(p[before].date))};
 });
 const series=(n:number)=>p.map((_,i)=>{const end=all.length-p.length+i;return end+1>=n?all.slice(end-n+1,end+1).reduce((a,b)=>a+b.close,0)/n:null;});
 const sma50=series(50),sma200=series(200);const vals=[...p.map(x=>x.close),...sma50,...sma200].filter(v=>v!==null) as number[];const lo=Math.min(...vals)*.98,hi=Math.max(...vals)*1.02,span=hi-lo||1;const x=(i:number)=>52+i/Math.max(p.length-1,1)*600;const y=(v:number)=>225-(v-lo)/span*195;
 const line=(v:(number|null)[])=>v.map((n,i)=>n===null?'':`${i===0||v[i-1]===null?'M':'L'}${x(i).toFixed(1)},${y(n).toFixed(1)}`).join(' ');
 const index=hover===null?p.length-1:Math.min(hover,p.length-1);const chosen=p[index];const ret=(p.at(-1)!.close/p[0].close-1)*100;
 return <section className="ec-chart"><div className="ec-chart-top"><div><span className="ec-eyebrow">Adjusted closing price · {data.currency||'currency unconfirmed'}</span><strong>{decimal(chosen.close)} <small>{shortDate(chosen.date)}</small></strong></div><div className="ec-segments" aria-label="Chart period">{[[21,'1M'],[63,'3M'],[126,'6M'],[252,'1Y']].map(([n,label])=><button key={n} aria-pressed={period===n} onClick={()=>{setPeriod(Number(n));setHover(null)}}>{label}</button>)}</div></div>
 {reportDates.length>0&&<div className="ec-report-control"><button type="button" aria-pressed={showReports} onClick={()=>setShowReports(v=>!v)}>Reporting dates {showReports?'✓':'＋'}</button>{showReports&&<small>{visibleReports.length?`${visibleReports.length} reports in view · E marks reporting dates`:'No reporting dates in this period'}</small>}</div>}
 <svg ref={chartRef} viewBox="0 0 700 265" role="img" aria-label={`${data.symbol} adjusted closing prices from ${p[0].date} to ${p.at(-1)!.date}, ${percent(ret)}`} onPointerMove={e=>{const r=e.currentTarget.getBoundingClientRect();setHover(Math.max(0,Math.min(p.length-1,Math.round(((e.clientX-r.left)/r.width*700-52)/600*(p.length-1)))))}} onPointerLeave={()=>setHover(null)}>
 {[0,1,2,3].map(i=>{const v=lo+span*i/3;return <g key={i}><line x1="52" x2="652" y1={y(v)} y2={y(v)} stroke="#25334c"/><text x="45" y={y(v)+4} textAnchor="end" fill="#93a5c4" fontSize="11">{v.toFixed(v<10?2:0)}</text></g>})}
 <ChartReveal width={700} height={265}><path d={line(p.map(v=>v.close))+` L${x(p.length-1)},225 L52,225 Z`} fill="#648bff" opacity=".09"/>
 <path d={line(sma200)} fill="none" stroke="#bc96ff" strokeWidth="1.5" strokeDasharray="4 3"/><path d={line(sma50)} fill="none" stroke="#efbe72" strokeWidth="1.5"/><path d={line(p.map(v=>v.close))} fill="none" stroke="#6b9fff" strokeWidth="2.6"/></ChartReveal>
 {showReports&&visibleReports.map(r=><g key={r.date} aria-label={`Earnings reported ${r.date}`}><title>Earnings reported {r.date}</title><line x1={x(r.index)} x2={x(r.index)} y1="30" y2="225" stroke="#82d8c0" strokeWidth="1.2" strokeDasharray="4 4"/><text x={x(r.index)} y="22" textAnchor="middle" fill="#82d8c0" fontSize="10">E</text></g>)}
 {[0,Math.floor((p.length-1)/2),p.length-1].map((i,n)=><text key={n} x={x(i)} y="250" textAnchor={n===0?'start':n===2?'end':'middle'} fill="#93a5c4" fontSize="12">{shortDate(p[i].date)}</text>)}
 {hover!==null&&<g><line x1={x(index)} x2={x(index)} y1="25" y2="225" stroke="#93a5c4" strokeDasharray="3 3"/><circle cx={x(index)} cy={y(chosen.close)} r="4" fill="#fff"/></g>}
 </svg><div className="ec-chart-legend"><span><i style={{background:'#6b9fff'}}/>Price</span><span><i style={{background:'#efbe72'}}/>50-day average</span><span><i style={{background:'#bc96ff'}}/>200-day average</span><span className={ret>=0?'ec-positive':'ec-negative'}>{percent(ret)} in view</span></div><style jsx>{`
 .ec-report-control{display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin:12px 0 0}
 .ec-report-control button{border:1px solid #48516c;border-radius:7px;background:#131e31;color:#c6d2e9;padding:7px 10px;font-size:12px;cursor:pointer}
 .ec-report-control button[aria-pressed=true]{border-color:#82d8c0;color:#82d8c0;background:#15312d}
 .ec-report-control small{color:#9daec8;font-size:10px}
 `}</style></section>;
}
