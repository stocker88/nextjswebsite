// Missing observations are excluded, never converted to zero.
export function signalChartObservations(points:unknown, signalTimestamp?:number):{value:number;x?:number}[] {
 if(!Array.isArray(points))return [];
 const cutoff = signalChartDate(signalTimestamp) ? signalTimestamp : undefined;
 return points.flatMap(point=>{
  if(!point||typeof point!=='object')return [];
  const value=point.y1??point.y2??point.y3;
  if(typeof value!=='number'&&typeof value!=='string')return [];
  if(typeof value==='string'&&!value.trim())return [];
  const number=Number(value);
  if(!Number.isFinite(number))return [];
  const x=typeof point.x==='number'&&Number.isFinite(point.x)?point.x:undefined;
  if(cutoff!==undefined&&signalChartDate(x)&&x!==undefined&&x>cutoff)return [];
  return [{value:number,x}];
 });
}
export function signalChartValues(points:unknown):number[] {
 return signalChartObservations(points).map(point=>point.value);
}
// Chart x values can also be simple indexes: only format plausible epoch seconds.
export function signalChartDate(seconds:unknown):string|null {
 if(typeof seconds!=='number'||!Number.isFinite(seconds)||seconds<631152000||seconds>4133980799)return null;
 return new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(seconds*1000));
}

/** Rescale upside only when price is more than 40% below the displayed high. */
export function capSignalPriceProjection(history:{value:number}[],projection:{value:number;x:number}[]):{value:number;x:number}[] {
 if(!history.length||!projection.length)return projection;
 const last=history[history.length-1].value,high=Math.max(...history.map(p=>p.value));
 if(last<=0||high<=0||last>=high*.6)return projection;
 const gain=projection[projection.length-1].value-last;
 if(gain<=0||!Number.isFinite(gain))return projection;
 const scale=Math.min(1,(high-last)/gain);
 return projection.map(point=>({x:point.x,value:Math.min(high,last+(point.value-last)*scale)}));
}

/** A visual scenario, never market data or a model forecast. Uses an earlier
 * low-to-high move and its elapsed time, then deterministic small fluctuations. */
export function signalChartProjection(points:{value:number;x?:number}[], direction:'up'|'down'='up',mode:'price'|'financial'='price'):{value:number;x:number}[] {
 if(points.length<2||points.some(p=>!signalChartDate(p.x)||!Number.isFinite(p.value)))return [];
 if(points.some((p,i)=>i>0&&p.x!<=points[i-1].x!))return [];
 const first=points[0],last=points[points.length-1];
 const span=last.x!-first.x!;
 if(span<=0)return [];
 if(mode==='financial'){
  const median=(values:number[])=>{const sorted=[...values].sort((a,b)=>a-b),middle=Math.floor(sorted.length/2);return sorted.length%2?sorted[middle]:(sorted[middle-1]+sorted[middle])/2};
  const intervals=points.slice(1).map((point,i)=>({elapsed:point.x!-points[i].x!,change:point.value-points[i].value}));
  const cadence=median(intervals.map(interval=>interval.elapsed));
  // Prefer the latest year of reporting when growth has changed pace.
  // Require a consistent fit; isolated jumps still use the bounded fallback.
  for(const window of [4,8]) {
  const recent=points.slice(-window);
  if(direction==='up' && recent.length>=4 && recent.every(p=>p.value>0)) {
   const elapsed=recent.at(-1)!.x!-recent[0].x!;
   const xs=recent.map(p=>(p.x!-recent[0].x!)/elapsed);
   const meanX=xs.reduce((a,b)=>a+b,0)/xs.length,meanY=recent.reduce((sum,p)=>sum+p.value,0)/recent.length;
   let xx=0,yy=0,xy=0,rising=0,regular=true;
   recent.forEach((p,i)=>{
    const dx=xs[i]-meanX,dy=p.value-meanY;xx+=dx*dx;yy+=dy*dy;xy+=dx*dy;
    if(i>0){if(p.value>recent[i-1].value)rising++;const gap=p.x!-recent[i-1].x!;regular=regular&&gap>=cadence*.5&&gap<=cadence*1.5;}
   });
   const fit=xx>0&&yy>0?xy*xy/(xx*yy):0;
   if(regular&&xy>0&&fit>=.95&&rising/(recent.length-1)>=.8){
    const horizon=span*.3,growth=xy/xx/elapsed*horizon;
    if(Number.isFinite(growth))return Array.from({length:41},(_,i)=>({x:last.x!+horizon*i/40,value:last.value+growth*i/40}));
   }
  }
  }
  // Ignore near-duplicate reporting dates, then use the typical recent change,
  // including flat/negative periods, rather than the largest historical jump.
  const rates=intervals.filter(interval=>interval.elapsed>=cadence*.5).slice(-8).map(interval=>interval.change/interval.elapsed);
  if(!rates.length)return [];
  const signedRate=median(rates),horizon=span*.3;
  const historicalSpan=Math.max(0,...points.map(p=>p.value))-Math.min(0,...points.map(p=>p.value));
  if(!historicalSpan)return [];
  const rate=direction==='down'?Math.max(0,-signedRate):Math.max(0,signedRate);
  // Illustrative direction stays visible even when the typical change is flat.
  // Use the chart scale (including zero) so negative EPS also drifts upward.
  // At most 25% extra range: history always retains >=80% of the chart scale.
  const minimumDrift=historicalSpan*.08;
  const drift=Math.min(Math.max(rate*horizon*.5,minimumDrift),historicalSpan*.25);
  if(!Number.isFinite(drift))return [];
  if(direction==='down'){
   if(last.value<=0)return [];
   const drop=Math.min(drift,last.value*.4),decay=-Math.log(1-drop/last.value);
   return Array.from({length:41},(_,i)=>({x:last.x!+horizon*i/40,value:last.value*Math.exp(-decay*i/40)}));
  }
  return Array.from({length:41},(_,i)=>{
   const t=i/40,ripple=.025*Math.sin(4*Math.PI*t);
   return {x:last.x!+horizon*t,value:last.value+drift*Math.max(0,Math.min(1,t+ripple))};
  });
 }
 if(direction==='down'){
  if(last.value<=0)return [];
  let high=first,fall=0,rate=0;
  points.slice(1).forEach(point=>{
   const drop=high.value-point.value;
   if(drop>fall){fall=drop;rate=drop/(point.x!-high.x!);}
   if(point.value>high.value)high=point;
  });
  if(rate<=0)return [];
  const horizon=span*.3;
  const drop=Math.min(last.value*.4,rate*horizon*.25);
  const decay=-Math.log(1-drop/last.value);
  return Array.from({length:41},(_,i)=>({x:last.x!+horizon*i/40,value:last.value*Math.exp(-decay*i/40)}));
 }
 let low=first, gain=0, slope=0;
 points.slice(1).forEach(point=>{
  const rise=point.value-low.value;
  if(rise>gain){gain=rise;slope=rise/(point.x!-low.x!);}
  if(point.value<low.value)low=point;
 });
 if(slope<=0)return [];
 const horizon=span*.3, drift=slope*horizon;
 if(!Number.isFinite(drift))return [];
 return capSignalPriceProjection(points,Array.from({length:41},(_,i)=>{
  const t=i/40;
  const ripple=.06*Math.sin(6*Math.PI*t)+.025*Math.sin(14*Math.PI*t);
  return {x:last.x!+horizon*t,value:last.value+drift*(t+ripple)};
 }));
}
