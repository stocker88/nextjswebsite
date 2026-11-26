import {HistoryPoint,scenario} from './seo-tools';
import {PredictionEvent,macroStressPath} from './prediction-events';
export function cryptoProjection(history:HistoryPoint[],days:number,growth:number,selected:'low'|'central'|'high',events:PredictionEvent[],stress:boolean):HistoryPoint[]{
 const model=scenario(history,days,growth,'crypto');if(!model)return [];
 const start=history.at(-1)!;
 const offsets=Array.from(new Set(Array.from({length:Math.min(days,120)+1},(_,i)=>Math.round(i*days/Math.min(days,120)))));
 const points=offsets.map(offset=>({date:new Date(Date.parse(start[0])+offset*86400000).toISOString().slice(0,10),close:offset===0?start[1]:scenario(history,offset,growth,'crypto')![selected]}));
 return macroStressPath(points,events,stress).map(p=>[p.date,p.close]);
}
