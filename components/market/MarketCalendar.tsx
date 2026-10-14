import {marketEventIcon} from '../../lib/market-event-icons';
import {useEffect, useState} from 'react';
import schedule from '../../data/market-calendar.json';
import {day, shortDate, weekStart} from '../../lib/earnings';

const categories: Record<string,string> = {indices:'Index announcements',filings:'13F filings',trading:'Trading dates',macro:'Economy',fed:'Federal Reserve'};
type MarketEvent = typeof schedule.events[number];
export default function MarketCalendar() {
  const [from,setFrom] = useState(''), [category,setCategory] = useState('all');
  const [busy,setBusy] = useState(false), [error,setError] = useState('');
  useEffect(() => {
    const parts = new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
    const part = (t:string) => parts.find(p=>p.type===t)!.value;
    setFrom(weekStart(`${part('year')}-${part('month')}-${part('day')}`));
  },[]);
  const to = from ? day(from,6) : '';
  const events = schedule.events.filter(e=>e.date>=from && e.date<=to && (category==='all'||e.category===category))
    .sort((a,b)=>a.date.localeCompare(b.date)||(a.minutesET??1440)-(b.minutesET??1440));
  const dates = Array.from(new Set(events.map(e=>e.date)));
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
      text('Your market week ahead',48,134,48,'#ecf1ff',true);
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
      if(!events.length)text('No selected events are listed for this week.',48,325,28);
      text('Selected events · Dates may change.',48,canvas.height-105,23);
      text(`Schedule checked ${schedule.checked} · Sources on the website`,48,canvas.height-70,20,'#9eb0cc');
      text('www.StocksToBuyNow.ai/#market-calendar',48,canvas.height-30,24,'#ecf1ff',true);
      const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Could not export image')),'image/png'));
      const file=new File([blob],`market-calendar-${from}.png`,{type:'image/png'});
      if(navigator.canShare?.({files:[file]})) await navigator.share({files:[file],title:'Market calendar · Stocks To Buy Now AI'});
      else {const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=file.name;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);}
    } catch(e) {if((e as Error).name!=='AbortError')setError('Could not share the image. Please try again.');}
    finally {setBusy(false);}
  }
  return <section id="market-calendar" className="market-calendar" aria-labelledby="market-calendar-title">
    <header><div><span className="eyebrow">PLAN YOUR WEEK</span><h2 id="market-calendar-title">Market calendar</h2><p>Economic releases, Fed decisions, 13F filings and index reviews.</p></div>
      <button className="share" disabled={busy||!covered} onClick={shareImage}>{busy?'Preparing image…':'↗ Share calendar image'}</button></header>
    {!from?<p role="status">Loading your week…</p>:<>
      <div className="week"><button aria-label="Previous market week" disabled={busy||day(from,-1)<schedule.from} onClick={()=>setFrom(day(from,-7))}>←</button>
        <strong>{shortDate(from)} – {shortDate(to)}, {to.slice(0,4)}</strong>
        <button aria-label="Next market week" disabled={busy||day(from,7)>schedule.to} onClick={()=>setFrom(day(from,7))}>→</button></div>
      <div className="filters" role="group" aria-label="Market event categories">
        {Object.entries({all:'All events',...categories}).map(([id,label])=><button key={id} aria-pressed={category===id} disabled={busy} onClick={()=>setCategory(id)}>{label}</button>)}
      </div>
      <p className="meta">U.S. Eastern time · {events.length} selected events · Schedule checked {schedule.checked}</p>
      {!covered?<p>This week is outside the saved schedule ({shortDate(schedule.from)}, {schedule.from.slice(0,4)} – {shortDate(schedule.to)}, {schedule.to.slice(0,4)}).</p>:
        !events.length?<p>No matching events are listed for this week.</p>:null}
      <div className="events" style={{'--market-days':Math.min(dates.length,5)} as React.CSSProperties}>{dates.map(date=><section className="market-day" key={date} aria-label={shortDate(date)+' market events'}><div className="day-heading"><span>{new Date(date+'T12:00:00Z').toLocaleDateString('en-US',{weekday:'short',timeZone:'UTC'})}</span><strong>{shortDate(date)}</strong></div>{events.filter(e=>e.date===date).map(e=><article key={e.id}>
        <span className="time">{e.timeLabel}</span><h3><span className="event-icon" aria-hidden="true">{marketEventIcon(e.category,e.title)}</span>{e.title}</h3><p>{e.summary}</p>
        <details><summary>What to watch</summary><p>{e.watch}</p></details>
        <a href={e.sourceUrl} target="_blank" rel="noopener noreferrer">{e.status} · {e.sourceName} ↗</a>
      </article>)}</section>)}</div>
    </>}
    {error&&<p role="alert">{error}</p>}
    <p className="meta">Selected events, not a complete live calendar. Dates can change; consult the linked official sources. Scheduled index reviews do not guarantee a stock’s inclusion.</p>
    <style jsx>{`
      .market-calendar{max-width:1120px;margin:28px auto 64px;padding:24px;border:1px solid #38415a;border-radius:22px;background:#101a2b;color:#ecf1ff;scroll-margin-top:100px}
      header{display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap}.eyebrow{font-size:11px;letter-spacing:1.5px;color:#b494ff;font-weight:700}h2{margin:8px 0;font-size:30px;color:#fff}header p{font-size:14px;color:#acbcd0;margin:0}button{cursor:pointer;border:1px solid #46506a;border-radius:12px;background:#19243a;color:#ecf1ff;padding:10px 14px;min-height:44px;font-size:13px}.share{background:#b494ff;color:#111827;font-weight:700;border-color:#b494ff}button:disabled{opacity:.45;cursor:default}button:focus-visible,a:focus-visible,summary:focus-visible{outline:2px solid #b494ff;outline-offset:3px}.week{display:flex;align-items:center;justify-content:space-between;margin:22px 0 12px;gap:8px}.week strong{font-size:17px;text-align:center}.filters{display:flex;flex-wrap:wrap;gap:8px}.filters button[aria-pressed=true]{background:#40335d;border-color:#b494ff}.meta{font-size:12px;color:#acbcd0;line-height:1.6;margin:16px 0}.events{display:grid;grid-template-columns:repeat(var(--market-days),minmax(0,1fr));gap:10px;align-items:start}.market-day{min-width:0;border:1px solid #303d54;border-radius:14px;background:#0b1423;padding:5px}.day-heading{display:flex;flex-direction:column;gap:5px;padding:12px 8px;color:#acbcd0}.day-heading strong{color:#fff}.event-icon{display:block;font-size:24px;margin-bottom:8px}article{padding:12px;margin-top:6px;border:1px solid #303d54;border-radius:14px;background:#152238;min-width:0}.time{font-size:12px;color:#b494ff}h3{font-size:18px;color:#fff;margin:9px 0}article p{font-size:13px;line-height:1.6;color:#c9d4e5}article a{display:block;font-size:12px;color:#9ac8ff;margin-top:12px}summary{font-size:13px;color:#c8b4ff;cursor:pointer} @media(max-width:650px){.market-calendar{margin:20px 10px 40px;padding:16px}.events{grid-template-columns:repeat(var(--market-days),minmax(145px,1fr));overflow-x:auto;scroll-snap-type:x proximity;padding-bottom:8px}.market-day{scroll-snap-align:start}article h3{font-size:15px}header .share{width:100%}h2{font-size:25px}.week strong{font-size:14px}}
    `}</style>
  </section>;
}
