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
