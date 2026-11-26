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
