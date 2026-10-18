import {monthRange,marketToday,defaultCalendarWeek} from '../../lib/calendar-period';
import CalendarPeriodControls from '../CalendarPeriodControls';
import {marketEventIcon} from '../../lib/market-event-icons';
import {useEffect, useRef, useState} from 'react';
import schedule from '../../data/market-calendar.json';
import {day, shortDate, weekStart} from '../../lib/earnings';

const categories: Record<string,string> = {indices:'Index announcements',filings:'13F filings',trading:'Trading dates',macro:'Economy',fed:'Federal Reserve'};
type MarketEvent = typeof schedule.events[number];
export default function MarketCalendar({fullPage=false}:{fullPage?:boolean}) {
  const [from,setFrom] = useState(''), [category,setCategory] = useState('all');
  const [monthly,setMonthly]=useState(false),[selectedDate,setSelectedDate]=useState('');
  const [selectedEvent,setSelectedEvent]=useState<MarketEvent|null>(null);
  const eventDialog=useRef<HTMLDialogElement>(null);
  useEffect(()=>{if(selectedEvent)eventDialog.current?.showModal();},[selectedEvent]);
  const [busy,setBusy] = useState(false), [error,setError] = useState('');
  useEffect(() => {
    setFrom(defaultCalendarWeek(marketToday()));
  },[]);
  const to = from ? (monthly?monthRange(from)[1]:day(from,6)) : '';
  const changePeriod=(f:string,t:string)=>{setFrom(f);setMonthly((Date.parse(t)-Date.parse(f))/86400000>6);setSelectedDate('')};
  const events = schedule.events.filter(e=>e.date>=from && e.date<=to && (category==='all'||e.category===category))
    .sort((a,b)=>a.date.localeCompare(b.date)||(a.minutesET??1440)-(b.minutesET??1440));
  const dates = Array.from(new Set(events.map(e=>e.date))).filter(date=>!monthly||date===selectedDate);
  const monthDays=from&&monthly?Array.from({length:Math.round((Date.parse(day(weekStart(to),6))-Date.parse(weekStart(from)))/86400000)+1},(_,i)=>day(weekStart(from),i)):[];
  const covered = !!from && from<=schedule.to && to>=schedule.from;
  async function shareImage() {
    if (busy) return;
    setBusy(true); setError('');
    try {
      const canvas = document.createElement('canvas');
      canvas.width=1200; canvas.height=Math.max(1200,360+events.length*175+160);
      const ctx=canvas.getContext('2d'); if(!ctx)throw new Error('Image creation unavailable');
      ctx.fillStyle='#0d1728';ctx.fillRect(0,0,canvas.width,canvas.height);
      const text=(value:string,x:number,y:number,size:number,color='#ecf1ff',bold=false)=>{
        ctx.fillStyle=color;ctx.font=`${bold?'700':'400'} ${size}px Arial`;ctx.fillText(value,x,y);
      };
      const fit=(value:string,max:number)=>{while(ctx.measureText(value).width>max && value.length>1)value=value.slice(0,-2)+'…';return value;};
      text('STOCKS TO BUY NOW AI',48,62,24,'#b494ff',true);
      text('Stock market calendar',48,134,48,'#ecf1ff',true);
      text(`${shortDate(from)} – ${shortDate(to)}, ${to.slice(0,4)}`,48,190,30);
      text('U.S. Eastern time · Selected market events',48,234,22,'#9eb0cc');
      events.forEach((e:MarketEvent,i:number)=>{
        const y=275+i*175;
        ctx.fillStyle='#18263c';ctx.fillRect(35,y,1130,160);
        text(`${shortDate(e.date)} · ${e.timeLabel}`,55,y+30,23,'#b494ff');
        ctx.font='700 28px Arial';text(fit(marketEventIcon(e.category,e.title)+' '+e.title,1080),55,y+70,28,'#ecf1ff',true);
        ctx.font='400 22px Arial';text(fit(e.summary,1080),55,y+106,22);
        ctx.font='400 18px Arial';text(fit(`${categories[e.category]} · ${e.status} · ${e.sourceName}`,1080),55,y+140,18,'#9eb0cc');
      });
      if(!events.length)text('No selected events are listed for this period.',48,325,28);
      text('Selected events · Dates may change.',48,canvas.height-105,23);
      text(`Schedule checked ${schedule.checked} · Sources on the website`,48,canvas.height-70,20,'#9eb0cc');
      text('www.StocksToBuyNow.ai/stock-market-calendar/',48,canvas.height-30,24,'#ecf1ff',true);
      const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Could not export image')),'image/png'));
      const file=new File([blob],`market-calendar-${from}.png`,{type:'image/png'});
      if(navigator.canShare?.({files:[file]})) await navigator.share({files:[file],title:'Stock market calendar · Stocks To Buy Now AI'});
      else {const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=file.name;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);}
    } catch(e) {if((e as Error).name!=='AbortError')setError('Could not share the image. Please try again.');}
    finally {setBusy(false);}
  }
  return <section id="market-calendar" className="market-calendar" aria-labelledby="market-calendar-title">
    <header><div data-motion-reveal><span className="eyebrow">PLAN YOUR WEEK</span><h2 id="market-calendar-title">Market Events Calendar</h2><p>Economic releases, Fed decisions, 13F filings and index reviews.</p></div>
      {!fullPage&&<a className="full-calendar" href="/stock-market-calendar/">Full stock market calendar ↗</a>}<button className="share" disabled={busy||!covered} onClick={shareImage}>{busy?'Preparing image…':'↗ Share calendar image'}</button></header>
    {!from?<p role="status">Loading your week…</p>:<>
      <div className="week"><CalendarPeriodControls from={from} to={to} onChange={changePeriod} minDate={schedule.from} maxDate={schedule.to} disabled={busy} detail={`${events.length} selected events · U.S. Eastern time`}/></div>
      <div className="filters" role="group" aria-label="Market event categories">
        {Object.entries({all:'All events',...categories}).map(([id,label])=><button key={id} aria-pressed={category===id} disabled={busy} onClick={()=>setCategory(id)}>{label}</button>)}
      </div>
      <p className="meta">U.S. Eastern time · {events.length} selected events · Schedule checked {schedule.checked}</p>
      {covered&&(from<schedule.from||to>schedule.to)&&<p className="meta">Partial coverage: saved events run from {shortDate(schedule.from)} to {shortDate(schedule.to)}.</p>}
      {!covered?<p>This period is outside the saved schedule ({shortDate(schedule.from)}, {schedule.from.slice(0,4)} – {shortDate(schedule.to)}, {schedule.to.slice(0,4)}).</p>:
        !events.length?<p>No matching events are listed for this period.</p>:null}
      {monthly&&<><div className="month-grid">
        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=><span className="weekday" key={d}>{d}</span>)}
        {monthDays.map(date=>{const rows=events.filter(e=>e.date===date);return date<from||date>to?<span key={date}/>:<button className="month-day" key={date} aria-pressed={selectedDate===date} disabled={!rows.length} onClick={()=>setSelectedDate(selectedDate===date?'':date)}><strong>{Number(date.slice(-2))}</strong><small>{rows.length?`${rows.length} events`:'N/A'}</small><span className="month-icons">{Array.from(new Set(rows.map(e=>marketEventIcon(e.category,e.title)))).slice(0,3).join(' ')}</span></button>})}
      </div><p className="meta">Select a date to see its events.</p></>}
      <div className="events" style={{'--market-days':Math.min(dates.length,5)} as React.CSSProperties}>{dates.map(date=><section className="market-day" key={date} aria-label={shortDate(date)+' market events'}><div className="day-heading"><span>{new Date(date+'T12:00:00Z').toLocaleDateString('en-US',{weekday:'short',timeZone:'UTC'})}</span><strong>{shortDate(date)}</strong></div>{events.filter(e=>e.date===date).map(e=><article key={e.id}>
        <button className="compact-event" aria-haspopup="dialog" onClick={()=>setSelectedEvent(e)} aria-label={`${e.title}, ${e.timeLabel}. View details`}><span className="time">{e.timeLabel}</span><span className="event-icon" aria-hidden="true">{marketEventIcon(e.category,e.title)}</span><strong>{e.title}</strong><span className="event-more">Details +</span></button>
        <div className="desktop-event">
        <span className="time">{e.timeLabel}</span><h3><span className="event-icon" aria-hidden="true">{marketEventIcon(e.category,e.title)}</span>{e.title}</h3><p>{e.summary}</p>
        <details><summary>What to watch</summary><p>{e.watch}</p></details>
        <a href={e.sourceUrl} target="_blank" rel="noopener noreferrer">{e.status} · {e.sourceName} ↗</a>
      </div></article>)}</section>)}</div>
    </>}
    <dialog ref={eventDialog} className="event-dialog" onClose={()=>setSelectedEvent(null)} onClick={e=>{if(e.target===e.currentTarget)eventDialog.current?.close();}}>
      {selectedEvent&&<div className="event-dialog-body"><button className="close-event" aria-label="Close event details" onClick={()=>eventDialog.current?.close()}>×</button><span className="time">{shortDate(selectedEvent.date)} · {selectedEvent.timeLabel} · Eastern time</span><h3>{marketEventIcon(selectedEvent.category,selectedEvent.title)} {selectedEvent.title}</h3><p>{selectedEvent.summary}</p><h4>What to watch</h4><p>{selectedEvent.watch}</p><a href={selectedEvent.sourceUrl} target="_blank" rel="noopener noreferrer">{selectedEvent.status} · {selectedEvent.sourceName} ↗</a></div>}
    </dialog>
    {error&&<p role="alert">{error}</p>}
    <p className="meta">Selected events, not a complete live calendar. Dates can change; consult the linked official sources. Scheduled index reviews do not guarantee a stock’s inclusion.</p>
    <style jsx>{`
      .compact-event{display:none}.event-dialog{box-sizing:border-box;width:calc(100% - 28px);max-width:520px;max-height:80dvh;overflow:auto;background:#111d30;color:#ecf1ff;border:1px solid #51446e;border-radius:20px;padding:22px}.event-dialog::backdrop{background:#030714b3;backdrop-filter:blur(5px)}.event-dialog-body{position:relative;padding-top:38px}.close-event{position:absolute;right:0;top:-10px;font-size:24px}.event-dialog p{font-size:14px;line-height:1.7;color:#c9d4e5}.event-dialog a{font-size:13px;color:#9ac8ff}.event-dialog h3{font-size:22px}.event-dialog h4{margin:20px 0 8px}
      .month-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px}.weekday{text-align:center;font-size:11px;color:#acbcd0;padding:8px}.month-day{min-width:0;min-height:100px;text-align:left;display:flex;flex-direction:column;gap:8px;padding:10px}.month-day[aria-pressed=true]{border-color:#b494ff;background:#40335d}.month-day small{font-size:10px}.month-icons{font-size:20px}.full-calendar{color:#baa4ed;font-size:13px} @media(max-width:650px){.month-grid{gap:3px}.month-day{padding:5px;min-height:75px}.month-day small{font-size:8px}.month-icons{font-size:12px}.weekday{font-size:9px}}
      .market-calendar{max-width:1120px;margin:28px auto 64px;padding:24px;border:1px solid #38415a;border-radius:22px;background:#101a2b;color:#ecf1ff;scroll-margin-top:100px}
      header{display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap}.eyebrow{font-size:11px;letter-spacing:1.5px;color:#b494ff;font-weight:700}h2{margin:8px 0;font-size:30px;color:#fff}header p{font-size:14px;color:#acbcd0;margin:0}button{cursor:pointer;border:1px solid #46506a;border-radius:12px;background:#19243a;color:#ecf1ff;padding:10px 14px;min-height:44px;font-size:13px}.share{background:#b494ff;color:#111827;font-weight:700;border-color:#b494ff}button:disabled{opacity:.45;cursor:default}button:focus-visible,a:focus-visible,summary:focus-visible{outline:2px solid #b494ff;outline-offset:3px}.week{display:flex;align-items:center;justify-content:flex-start;margin:22px 0 18px;gap:8px}.week strong{font-size:17px;text-align:center}.filters{display:flex;flex-wrap:wrap;gap:8px}.filters button[aria-pressed=true]{background:#40335d;border-color:#b494ff}.meta{font-size:12px;color:#acbcd0;line-height:1.6;margin:16px 0}.events{display:grid;grid-template-columns:repeat(var(--market-days),minmax(0,1fr));gap:10px;align-items:start}.market-day{min-width:0;border:1px solid #303d54;border-radius:14px;background:#0b1423;padding:5px}.day-heading{display:flex;flex-direction:column;gap:5px;padding:12px 8px;color:#acbcd0}.day-heading strong{color:#fff}.event-icon{display:block;font-size:24px;margin-bottom:8px}article{padding:12px;margin-top:6px;border:1px solid #303d54;border-radius:14px;background:#152238;min-width:0}.time{font-size:12px;color:#b494ff}h3{font-size:18px;color:#fff;margin:9px 0}article p{font-size:13px;line-height:1.6;color:#c9d4e5}article a{display:block;font-size:12px;color:#9ac8ff;margin-top:12px}summary{font-size:13px;color:#c8b4ff;cursor:pointer} @media(max-width:650px){
        .market-calendar{margin:20px 10px 40px;padding:10px;border-radius:16px;box-sizing:border-box}
        header{gap:8px}header>div{width:100%}.eyebrow{font-size:9px;letter-spacing:1.2px}h2{font-size:22px;line-height:1.2;margin:6px 0}header p{font-size:11px;line-height:1.5}
        .full-calendar{font-size:10px;flex:1}header .share{width:auto;min-height:36px;padding:7px 10px;font-size:10px;border-radius:9px}
        .week{margin:14px 0 10px}.week :global(.calendar-period){gap:6px;width:100%;justify-content:space-between}.week :global(.period-navigation){gap:5px}.week :global(.period-navigation>span){font-size:11px}.week :global(.period-navigation small){font-size:8px;max-width:140px}.week :global(.calendar-period button){min-height:34px;padding:6px 8px;font-size:10px}.week :global(.period-mode){margin-left:0;padding:2px;gap:1px}.week strong{font-size:12px}
        .filters{flex-wrap:nowrap;overflow-x:auto;gap:6px;padding:2px 0 6px}.filters button{flex-shrink:0;min-height:36px;padding:6px 9px;font-size:10px;border-radius:9px}
        .meta{font-size:9px;line-height:1.5;margin:10px 0}
        .events{grid-template-columns:repeat(var(--market-days),minmax(82px,1fr));gap:4px;overflow-x:auto;scroll-snap-type:x proximity;padding-bottom:6px}
        .market-day{scroll-snap-align:start;padding:3px;border-radius:9px}.day-heading{gap:3px;padding:8px 3px;text-align:center;font-size:10px}.day-heading strong{font-size:12px}
        article{padding:0;margin-top:4px;border-radius:8px;overflow:hidden}.desktop-event{display:none}
        .compact-event{display:flex;width:100%;min-height:120px;flex-direction:column;align-items:center;gap:5px;padding:8px 4px;border:0;border-radius:7px;background:transparent;text-align:center}
        .compact-event .time{font-size:9px;line-height:1.3}.compact-event .event-icon{font-size:21px;margin:0;line-height:1.3}.compact-event strong{font-size:11px;line-height:1.35;font-weight:600;overflow-wrap:anywhere}.event-more{font-size:9px;color:#c8b4ff;margin-top:auto}
      }

    `}</style>
  </section>;
}
