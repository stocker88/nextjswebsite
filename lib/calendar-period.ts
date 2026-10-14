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
