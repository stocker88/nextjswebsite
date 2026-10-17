// Missing observations are excluded, never converted to zero.
export function signalChartValues(points:unknown):number[] {
 if(!Array.isArray(points))return [];
 return points.flatMap(point=>{
  if(!point||typeof point!=='object')return [];
  const value=point.y1??point.y2??point.y3;
  if(typeof value!=='number'&&typeof value!=='string')return [];
  if(typeof value==='string'&&!value.trim())return [];
  const number=Number(value);
  return Number.isFinite(number)?[number]:[];
 });
}
