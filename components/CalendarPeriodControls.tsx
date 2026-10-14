import {shortDate} from '../lib/earnings';
import {periodRange} from '../lib/calendar-period';
export default function CalendarPeriodControls({from,to,onChange,minDate,maxDate,detail,disabled=false}:{from:string;to:string;onChange:(from:string,to:string)=>void;minDate?:string;maxDate?:string;detail?:string;disabled?:boolean}){
 const monthly=(Date.parse(to)-Date.parse(from))/86400000>6;
 const previous=periodRange(from,monthly,-1),next=periodRange(from,monthly,1);
 return <div className="calendar-period">
  <div className="period-navigation"><button aria-label={'Previous '+(monthly?'month':'week')} disabled={disabled||!!minDate&&previous[1]<minDate} onClick={()=>onChange(...previous)}>←</button>
   <span aria-live="polite">{monthly?new Date(from+'T12:00:00Z').toLocaleDateString('en-US',{month:'long',year:'numeric',timeZone:'UTC'}):`${shortDate(from)} – ${shortDate(to)}`}<small>{detail||from.slice(0,4)}</small></span>
   <button aria-label={'Next '+(monthly?'month':'week')} disabled={disabled||!!maxDate&&next[0]>maxDate} onClick={()=>onChange(...next)}>→</button></div>
  <div className="period-mode" role="group" aria-label="Calendar view">{[false,true].map(month=><button key={String(month)} disabled={disabled} aria-pressed={monthly===month} onClick={()=>onChange(...periodRange(from,month))}>{month?'Month':'Week'}</button>)}</div>
  <style jsx>{`
   .calendar-period{display:flex;align-items:center;flex-wrap:wrap;gap:16px}.period-navigation{display:flex;align-items:center;gap:12px}.period-navigation>span{font-size:14px;font-weight:600;color:#ecf1ff}.period-navigation small{display:block;font-size:10px;color:#95a8c7;margin-top:5px;font-weight:400}button{cursor:pointer;min-height:38px;padding:8px 12px;border:1px solid #3b4965;border-radius:9px;background:#1a2840;color:#c5d4eb;font-size:12px}.period-mode{display:flex;gap:3px;border:1px solid #3b4965;border-radius:11px;padding:3px;background:#0d1626}.period-mode button{border:0;background:transparent;min-height:32px}.period-mode button[aria-pressed=true]{background:#41335d;color:#e0ceff}button:disabled{opacity:.4;cursor:default}button:focus-visible{outline:2px solid #b494ff;outline-offset:3px}@media(max-width:600px){.calendar-period{gap:10px}.period-navigation{gap:8px}.period-navigation>span{font-size:12px}.period-mode{margin-left:auto}}
  `}</style>
 </div>;
}
