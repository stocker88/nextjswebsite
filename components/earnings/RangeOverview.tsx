import {useEffect,useState} from 'react';
import {Event,day,weekStart,shortDate,sessionName} from '../../lib/earnings';

export default function RangeOverview({events,from,to,showBeat,onSelect}:{events:Event[];from:string;to:string;showBeat:boolean;onSelect:(symbol:string)=>void}) {
 const [selected,setSelected]=useState(''),[all,setAll]=useState(false);
 useEffect(()=>{setSelected('');setAll(false)},[from,to]);
 const start=weekStart(from),end=day(weekStart(to),6);
 const dates=Array.from({length:Math.round((Date.parse(end)-Date.parse(start))/86400000)+1},(_,i)=>day(start,i));
 const reports=events.filter(e=>e.date===selected);
 const beat=(e:Event)=>e.research?.beat.total?Math.round(e.research.beat.rate!)+'%':'—';
 return <div className="erm">
  <div className="erm-grid">
   {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=><div className="erm-weekday" key={d}>{d}</div>)}
   {dates.map(date=>{const outside=date<from||date>to;const rows=events.filter(e=>e.date===date);return outside?<div key={date} className="erm-outside" aria-hidden="true"/>:<button key={date} className={'erm-day'+(selected===date?' is-selected':'')} aria-label={`${shortDate(date)}: ${rows.length} reports. Show companies`} aria-expanded={selected===date} onClick={()=>{setSelected(selected===date?'':date);setAll(false)}}>
    <span className="erm-date">{shortDate(date)}</span><small>{rows.length} <span>reports</span></small>
    <span className="erm-picks">{rows.slice(0,3).map(e=><span className={'erm-pick '+e.session} key={e.symbol}><img src={'/assets/logo/'+encodeURIComponent(e.symbol)+'.webp'} alt="" width={20} height={20} loading="lazy" onError={e=>{e.currentTarget.style.display='none'}}/><b>{e.symbol}</b>{showBeat&&<em>{beat(e)}</em>}</span>)}</span>
    {rows.length>3&&<span className="erm-count">+{rows.length-3} more</span>}
   </button>})}
  </div>
  <p className="erm-legend"><span>● Before open</span><span>● After close</span><span>Tap a date for all companies</span></p>
  {selected&&<section className="erm-expanded" aria-label={shortDate(selected)+' reports'}><header><h3>{shortDate(selected)} · {reports.length} reports</h3><button onClick={()=>setSelected('')} aria-label="Close day reports">×</button></header>
   {!reports.length?<p>No reports match the current filters.</p>:<div className="erm-companies">{reports.slice(0,all?reports.length:9).map(e=><button key={e.symbol} onClick={()=>onSelect(e.symbol)}><strong>{e.symbol}</strong><span>{e.name}</span><small>{sessionName(e.session)}{showBeat&&' · EPS beats '+beat(e)}</small></button>)}</div>}
   {reports.length>9&&<button className="ews-unknown-toggle" onClick={()=>setAll(v=>!v)}>{all?'Show fewer':`Show all ${reports.length} companies`}</button>}
  </section>}
  <style jsx>{`
   .erm-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:7px}.erm-weekday{text-align:center;text-transform:uppercase;font-size:10px;color:#9baccb;letter-spacing:.8px;padding:6px}.erm-day{display:flex;flex-direction:column;text-align:left;min-width:0;min-height:145px;padding:10px;border:1px solid #2b3a52;border-radius:9px;background:#0d1729;color:#e6edfa;cursor:pointer}.erm-day:hover,.erm-day.is-selected{border-color:#a28add;background:#1c2540}.erm-date{font-size:13px;font-weight:600}.erm-day>small{font-size:9px;color:#859bb9;margin:3px 0 8px}.erm-picks{display:flex;flex-direction:column;gap:4px;width:100%}.erm-pick{display:flex;align-items:center;gap:4px;border-left:2px solid #e1b976;padding-left:4px;min-width:0;min-height:24px}.erm-pick.amc{border-color:#84bcea}.erm-pick.unknown{border-color:#aa9bc7}.erm-pick img{border-radius:50%;background:white;object-fit:contain;flex-shrink:0}.erm-pick b{font-size:10px;overflow:hidden;text-overflow:ellipsis;min-width:0}.erm-pick em{font-style:normal;font-size:9px;color:#89d8ba;margin-left:auto}.erm-count{font-size:9px;color:#a8b8d2;margin-top:7px}.erm-legend{display:flex;flex-wrap:wrap;gap:12px;font-size:10px;color:#9badc8;margin:12px 0 0}.erm-legend span:first-child{color:#e1b976}.erm-legend span:nth-child(2){color:#84bcea}.erm-expanded{margin-top:14px;padding:15px;background:#101c30;border:1px solid #3a4a68;border-radius:10px}.erm-expanded header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}.erm-expanded h3{font-size:15px;margin:0}.erm-expanded header button{background:none;color:#bfd0eb;border:0;font-size:24px}.erm-companies{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.erm-companies button{display:flex;flex-direction:column;text-align:left;background:#19283e;border:1px solid #30425e;border-radius:7px;padding:10px;color:#e8eef9;gap:4px}.erm-companies strong{font-size:13px}.erm-companies span,.erm-companies small{font-size:10px;color:#a0b3ce}.erm-expanded p{font-size:12px;color:#a0b3ce}
   @media(max-width:700px){.erm-grid{gap:3px}.erm-weekday{font-size:8px;letter-spacing:0;padding:3px 0}.erm-day{padding:5px 2px;min-height:114px;border-radius:5px}.erm-date{font-size:8px;white-space:nowrap}.erm-day>small{font-size:7px;margin:3px 0 5px}.erm-day>small>span{display:none}.erm-pick{gap:0;padding-left:2px;flex-wrap:wrap;min-height:22px;border-left-width:1px}.erm-pick img{display:none}.erm-pick b{font-size:7px;letter-spacing:-.2px;width:100%}.erm-pick em{font-size:7px;margin:0}.erm-count{font-size:7px;margin-top:4px}.erm-legend{font-size:8px;gap:7px}.erm-companies{grid-template-columns:1fr 1fr}.erm-expanded{padding:10px}}
  `}</style>
 </div>;
}
