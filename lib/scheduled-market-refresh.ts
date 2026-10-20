import closedDates from '../data/market-closed-dates.json';
const closed = new Set(closedDates);
const formatter = new Intl.DateTimeFormat('en-CA', {timeZone:'America/New_York', year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
function nyParts(time:number) {
 const p = Object.fromEntries(formatter.formatToParts(time).map(part=>[part.type,part.value]));
 return {date:`${p.year}-${p.month}-${p.day}`,minutes:Number(p.hour)*60+Number(p.minute)};
}
/** One fetch after a scheduled collection's processing allowance, no live connection. */
export function nextMarketRefresh(now:number):number {
 const today=nyParts(now).date;
 for(let day=0;day<10;day++) {
  const noon=Date.parse(today+'T12:00:00Z')+day*86400000;
  const date=new Date(noon).toISOString().slice(0,10), d=new Date(noon);
  if([0,6].includes(d.getUTCDay())||closed.has(date))continue;
  const local=nyParts(noon), offset=(local.minutes-720)*60000;
  const midnight=Date.parse(date+'T00:00:00Z')-offset;
  const month=d.getUTCMonth(), dom=d.getUTCDate();
  const close=(month===10&&d.getUTCDay()===5&&dom>=23&&dom<=29)||(month===11&&dom===24)||(month===6&&dom===3)?780:960;
  const slots=[450,510,540,565,571,576,581,591];
  for(let minute=606;minute<close;minute+=15)slots.push(minute);
  slots.push(close+1);
  slots.push(close+5,close+10);
  for(let minute=close+40;minute<=1200;minute+=30)slots.push(minute);
  const checks=slots.map(minute=>midnight+(minute+(minute<570?9.5:minute>close?5.5:minute>=606&&(minute-606)%30===0?2:5.5))*60000).sort((a,b)=>a-b);
  const next=checks.find(check=>check>now);
  if(next)return next;
 }
 return now+86400000;
}
export function scheduleMarketRefresh(refresh:()=>void|Promise<unknown>):()=>void {
 let stopped=false, timer:ReturnType<typeof setTimeout>;
 const arm=()=>{
  clearTimeout(timer);
  if(stopped||document.visibilityState==='hidden')return;
  timer=setTimeout(async()=>{try{await refresh();}finally{arm();}},Math.max(1,nextMarketRefresh(Date.now())-Date.now()));
 };
 const visible=()=>{if(document.visibilityState==='visible')void refresh();arm();};
 arm();document.addEventListener('visibilitychange',visible);
 return()=>{stopped=true;clearTimeout(timer);document.removeEventListener('visibilitychange',visible);};
}
