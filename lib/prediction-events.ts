export type PredictionEvent={id:string;date:string;title:string;kind:'earnings'|'macro';sourceUrl?:string};
type Point={date:string;close:number};
const day=86400000;
// User-selected stress illustration, not a forecast inferred from the calendar.
// Retain historical anchor and terminal value; only complete future windows are drawn.
export function macroStressPath(points:Point[],events:PredictionEvent[],enabled=true):Point[]{
 if(!enabled||points.length<2)return points;
 const start=Date.parse(points[0].date),end=Date.parse(points.at(-1)!.date);
 const releases=events.filter(e=>e.kind==='macro').map(e=>({time:Date.parse(e.date),amplitude:/\b(CPI|PCE|PPI)\b|inflation/i.test(e.title)?.04:.02})).filter(e=>e.time-3*day>=start&&e.time+2*day<=end);
 const dates=Array.from(new Set(releases.map(e=>e.time)));
 if(!dates.length)return points;
 const knots=Array.from(new Set([...points.map(p=>Date.parse(p.date)),...dates.flatMap(t=>[-3,-1,0,2].map(n=>t+n*day))])).sort((a,b)=>a-b);
 const base=(t:number)=>{const right=points.findIndex(p=>Date.parse(p.date)>=t);if(right<=0)return points[0].close;const a=points[right-1],b=points[right],fraction=(t-Date.parse(a.date))/(Date.parse(b.date)-Date.parse(a.date));return a.close+(b.close-a.close)*fraction;};
 return knots.map(t=>{const depth=Math.max(0,...releases.map(event=>{const offset=(t-event.time)/day;return event.amplitude*(offset<-3||offset>2?0:offset<=-1?(offset+3)/2:(2-offset)/3);}));return {date:new Date(t).toISOString().slice(0,10),close:base(t)*(1-depth)};});
}

// Synthetic cadence is deliberately separate from published calendar records.
export function illustrativeEventCalendar(known:PredictionEvent[],start:string,end:string,symbol:string):PredictionEvent[]{
 const result=[...known],last=(kind:PredictionEvent['kind'],pattern:RegExp)=>known.filter(e=>e.kind===kind&&pattern.test(e.title)).map(e=>e.date).sort().at(-1)||start;
 const limits={CPI:last('macro',/CPI/i),PPI:last('macro',/PPI/i),FOMC:last('macro',/FOMC/i),earnings:last('earnings',/.*/)};
 const first=new Date(start),finish=Date.parse(end);
 for(let year=first.getUTCFullYear();year<=new Date(end).getUTCFullYear();year++)for(let month=0;month<12;month++){
  const entries:[string,number,PredictionEvent['kind']][]=[['CPI',12,'macro'],['PPI',15,'macro']];
  if([0,2,3,5,6,8,10,11].includes(month))entries.push(['FOMC',20,'macro']);
  if([1,4,7,10].includes(month))entries.push(['earnings',22,'earnings']);
  for(const [name,date,kind] of entries){const d=new Date(Date.UTC(year,month,date)).toISOString().slice(0,10);if(d>limits[name as keyof typeof limits]&&Date.parse(d)<=finish)result.push({id:`estimated-${name}-${d}`,date:d,kind,title:`${name==='earnings'?symbol+' earnings':name} · estimated recurring window (not a confirmed date)`});}
 }
 return result.sort((a,b)=>a.date.localeCompare(b.date));
}

export function spacedEvents(events:PredictionEvent[],start:string,end:string,max=12):PredictionEvent[]{
 const gap=(Date.parse(end)-Date.parse(start))/max;let previous=-Infinity;
 return [...events].sort((a,b)=>a.date.localeCompare(b.date)).filter(e=>{const t=Date.parse(e.date);if(t-previous<gap)return false;previous=t;return true;});
}

// User-directed sensitivity shape, not an empirical seasonality model.
export function seasonalEventPath(points:Point[],events:PredictionEvent[],enabled=true):Point[]{
 if(!enabled||points.length<2)return points;
 const start=Date.parse(points[0].date),end=Date.parse(points.at(-1)!.date),span=(end-start)/day;
 if(span<=0)return points;
 const releases=events.map(e=>({time:Date.parse(e.date),amplitude:e.kind==='earnings'?.06:/CPI|PPI|PCE/i.test(e.title)?.04:.02})).filter(e=>e.time-4*day>=start&&e.time+4*day<=end);
 const knots=new Set(points.map(p=>Date.parse(p.date)));
 for(let t=start;t<end;t+=7*day)knots.add(t);
 for(const e of releases)for(const n of [-4,-2,0,2,4])knots.add(e.time+n*day);
 const season=(t:number)=>{const d=new Date(t),month=d.getUTCMonth(),fraction=(d.getUTCDate()-1)/new Date(Date.UTC(d.getUTCFullYear(),month+1,0)).getUTCDate();const levels=[.04,-.035,0,.01,0,-.01,.01,0,-.06,-.01,.02,.05];return levels[month]*(1-fraction)+levels[(month+1)%12]*fraction;};
 let index=1;
 return Array.from(knots).sort((a,b)=>a-b).map(t=>{
  while(index<points.length-1&&Date.parse(points[index].date)<t)index++;
  const a=points[index-1],b=points[index],fraction=(t-Date.parse(a.date))/(Date.parse(b.date)-Date.parse(a.date));
  const base=a.close+(b.close-a.close)*fraction,u=(t-start)/(end-start);
  const seasonal=(season(t)-season(start)*(1-u)-season(end)*u)*Math.min(1,span/180);
  let swing=0;
  for(const event of releases){const offset=(t-event.time)/day;const wave=offset<-4||offset>4?0:offset<=-2?-(offset+4)/2:offset<=2?offset/2:(4-offset)/2;const candidate=wave*event.amplitude;if(Math.abs(candidate)>Math.abs(swing))swing=candidate;}
  return {date:new Date(t).toISOString().slice(0,10),close:t===start?points[0].close:t===end?points.at(-1)!.close:base*Math.exp(seasonal+swing)};
 });
}
