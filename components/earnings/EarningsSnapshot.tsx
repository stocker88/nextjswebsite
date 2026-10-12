import {useEffect,useState} from 'react';
import {useRouter} from 'next/router';
import {Calendar,day,endpoint,weekStart} from '../../lib/earnings';
import WeeklySummary from './WeeklySummary';

export default function EarningsSnapshot({home=false}:{home?:boolean}) {
 const router=useRouter();
 const [calendar,setCalendar]=useState<Calendar|null>(null),[from,setFrom]=useState(''),[error,setError]=useState(false),[attempt,setAttempt]=useState(0);
 useEffect(()=>{
  let active=true;
  const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
  const value=(type:string)=>parts.find(p=>p.type===type)!.value;
  const start=weekStart(`${value('year')}-${value('month')}-${value('day')}`);
  setFrom(start);setError(false);
  async function load(){
   for(const url of ['/earnings-calendar.json',endpoint]){
    try{
     const response=await fetch(url,{signal:AbortSignal.timeout(15000)});
     if(!response.ok)continue;
     const data=await response.json();
     if(!Array.isArray(data.items)||data.from>start||data.to<day(start,6))continue;
     if(active)setCalendar(data);
     return;
    }catch{}
   }
   if(active)setError(true);
  }
  load();return()=>{active=false};
 },[attempt]);
 return <div id="weekly-earnings" className={'earnings-snapshot'+(home?' earnings-snapshot-home':'')}>
  {calendar&&from?<WeeklySummary rows={calendar.items} from={from} to={day(from,6)} calendarHref="/earnings-calendar/" onSelect={symbol=>router.push('/earnings-calendar/?symbol='+encodeURIComponent(symbol))}/>:<section className="snapshot-status" aria-label="This week’s earnings snapshot">
   <h2>Earnings snapshot</h2>
   {error?<><p>This week’s earnings could not load.</p><button onClick={()=>setAttempt(n=>n+1)}>Try again</button> <a href="/earnings-calendar/">Open earnings calendar ↗</a></>:<p role="status"><span className="snapshot-spinner" aria-hidden="true"/>Loading this week’s earnings…</p>}
  </section>}
  <style jsx global>{`
   .earnings-snapshot{color:#e9eefb;line-height:1.5;min-width:0;scroll-margin-top:90px}
   .earnings-snapshot-home{max-width:1160px;margin:auto;padding:0 20px}
   .earnings-snapshot .ews{margin-top:20px}
   .earnings-snapshot *{box-sizing:border-box}
   .earnings-snapshot a{color:#acbff0;text-decoration:none}.earnings-snapshot a:hover{text-decoration:underline}
   .earnings-snapshot button{cursor:pointer}.earnings-snapshot button:disabled{opacity:.4;cursor:default}
   .earnings-snapshot :is(a,button,summary,input):focus-visible{outline:2px solid #ba9eee;outline-offset:3px}
   .earnings-snapshot .ec-eyebrow{display:block;font-size:10px;font-weight:700;letter-spacing:1.6px;color:#aaa7e4}
   .earnings-snapshot .ec-footnote{font-size:10px;line-height:1.8;color:#93a7c5;margin:14px 0 0}
   .earnings-snapshot .ec-positive{color:#7ad1b1!important}.earnings-snapshot .ec-negative{color:#f19ba8!important}
   .snapshot-status{padding:24px;margin:20px 0 32px;border:1px solid #30394e;border-radius:16px;background:#111b2d}
   .snapshot-status h2{font-size:24px;margin:0 0 12px;color:#e9eefb}.snapshot-status p{font-size:13px;color:#9baecb;display:flex;align-items:center;gap:10px}
   .snapshot-status button{padding:8px 12px;background:#29233f;border:1px solid #655789;border-radius:8px;color:#d9c7fc;font-size:12px}.snapshot-status a{font-size:12px;margin-left:10px}
   .snapshot-spinner{width:18px;height:18px;border:2px solid #38425c;border-top-color:#b29bf5;border-radius:50%;animation:snapshot-spin .8s linear infinite}
   @keyframes snapshot-spin{to{transform:rotate(360deg)}}
   @media(max-width:700px){.earnings-snapshot-home{padding:0 10px}}
   @media(prefers-reduced-motion:reduce){.snapshot-spinner{animation:none}}
  `}</style>
 </div>;
}
