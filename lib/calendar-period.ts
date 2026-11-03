import {day,weekStart} from './earnings';
export function monthRange(date:string,offset=0):[string,string]{
 const d=new Date(date+'T12:00:00Z');
 const start=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+offset,1,12)).toISOString().slice(0,10);
 const end=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+offset+1,0,12)).toISOString().slice(0,10);
 return [start,end];
}
export function periodRange(date:string,monthly:boolean,offset=0):[string,string]{
 if(monthly)return monthRange(date,offset);
 const start=day(weekStart(date),offset*7);return [start,day(start,6)];
}

// Calendar defaults follow the US market day, independent of the viewer's zone.
export function marketToday(now=new Date()):string {
 const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
 const part=(type:string)=>parts.find(p=>p.type===type)!.value;
 return `${part('year')}-${part('month')}-${part('day')}`;
}
export function defaultCalendarWeek(date:string,mode='calendar'):string {
 const start=weekStart(date),weekday=new Date(date+'T12:00:00Z').getUTCDay();
 if(mode==='this-week')return start;
 return mode==='next-week'||weekday===0||weekday>=5?day(start,7):start;
}

export function earningsSessionWindow(today:string, incoming=false) {
 const weekday=new Date(today+'T12:00:00Z').getUTCDay();
 const weekend=weekday===0||weekday===6;
 if(weekend){const date=day(today,incoming?(weekday===0?1:2):(weekday===0?-2:-1));return {from:date,to:date,label:incoming?'Monday before open and after close':'Friday before open and after close',matches:(e:{date:string;session:string})=>e.date===date};}
 const previous=day(today,weekday===1?-3:-1),next=day(today,weekday===5?3:1);
 return {from:incoming?today:previous,to:incoming?next:today,label:incoming?'Tonight and next trading day before open':'Previous trading day after close and today before open',matches:(e:{date:string;session:string})=>e.session==='unknown'&&(e.date===today||e.date===(incoming?next:previous))|| (incoming?(e.date===today&&e.session==='amc')||(e.date===next&&e.session==='bmo'):(e.date===previous&&e.session==='amc')||(e.date===today&&e.session==='bmo'))};
}
