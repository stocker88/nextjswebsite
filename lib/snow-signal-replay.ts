import saved from '../data/snow-signal-replay.json';

export type ReplayPoint = Readonly<{x:number;y1:number}>;
export type ReplaySeries = Readonly<{price:readonly ReplayPoint[];financials:readonly ReplayPoint[]}>;
export type FrozenSignalReplay = Readonly<{
 version:number;symbol:string;signalId:string;signalTime:number;cachedAt:string;reviewDate:string;
 original:ReplaySeries & Readonly<{priceProjection:readonly ReplayPoint[];financialProjection:readonly ReplayPoint[]}>;
 review:ReplaySeries;
}>;

// A versioned, committed copy: visiting, signing in or rebuilding never refreshes it.
export const snowSignalReplay:FrozenSignalReplay = saved;
export const replayDate = (seconds:number, short=false) => new Intl.DateTimeFormat('en-US', {
 month:'short',...(short?{}:{day:'numeric'}),year:short?'2-digit':'numeric',timeZone:'UTC',
}).format(new Date(seconds*1000));
export const replayMoney = (value:number) => new Intl.NumberFormat('en-US', {
 style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:2,
}).format(value);
export const replayRevenue = (value:number) => new Intl.NumberFormat('en-US', {
 notation:'compact',maximumFractionDigits:2,
}).format(value);

export function replayGeometry(history:readonly ReplayPoint[], projection:readonly ReplayPoint[]=[], bars=false) {
 const all=[...history,...projection];
 const min=Math.min(...all.map(p=>p.y1)),max=Math.max(...all.map(p=>p.y1));
 const first=history[0].x,last=all.at(-1)!.x;
 const slotCount=Math.max(1,(history.length-1)*(projection.length?1.3:1));
 const slots=new Map(history.map((p,i)=>[p.x,i]));
 const horizon=projection.length?projection.at(-1)!.x-history.at(-1)!.x:0;
 const x=(point:ReplayPoint) => {
  const slot=slots.get(point.x) ?? history.length-1+(point.x-history.at(-1)!.x)/(horizon||1)*(history.length-1)*.3;
  return 4+(bars?slot/slotCount:(point.x-first)/(last-first||1))*92;
 };
 const y=(value:number) => 87-(value-min)/(max-min||1)*73;
 const path=(points:readonly ReplayPoint[]) => points.map((p,i)=>`${i?'L':'M'} ${(x(p)*7.2).toFixed(3)} ${(y(p.y1)*2.8).toFixed(3)}`).join(' ');
 const projectedBarCount=Math.max(2,Math.min(12,Math.round((history.length-1)*.3)));
 const projectedBars=projection.length?Array.from({length:projectedBarCount},(_,i)=>projection[Math.round((i+1)/projectedBarCount*(projection.length-1))]):[];
 return {x,y,path,min,max,baseline:min,projectedBars};
}

export function nearestReplayPoint(points:readonly ReplayPoint[], position:number, x:(point:ReplayPoint)=>number) {
 return points.reduce((best,p,i)=>Math.abs(x(p)-position)<Math.abs(x(points[best])-position)?i:best,0);
}
