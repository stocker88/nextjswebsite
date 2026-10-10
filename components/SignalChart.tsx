export type Point = {x?:number;y1?:number;y2?:number;y3?:number};
export default function SignalChart({points = [], bars = false, title = 'Price trend'}:{points?:Point[]; bars?:boolean; title?:string}) {
  const values = points.map(p => p.y1 ?? p.y2 ?? p.y3).filter(v => v != null && String(v) !== '' && Number.isFinite(Number(v))).map(Number);
  if (!values.length) return <p className="research-meta">Chart unavailable. Check in the app.</p>;
  const min = bars ? Math.min(0, ...values) : Math.min(...values);
  const max = Math.max(...values), range = max - min || 1;
  const y = (v:number) => 90 - (v-min)/range*80;
  const x = (i:number) => 8 + i/Math.max(1, values.length-1)*84;
  return <svg className="signal-chart" viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label={title}>
    {[10,30,50,70,90].map(n => <line key={n} x1="4" x2="96" y1={n} y2={n} stroke="#ffffff" strokeOpacity=".12" strokeWidth=".3"/>)}
    {bars ? values.map((v,i) => <line key={i} x1={x(i)} x2={x(i)} y1={y(0)} y2={y(v)} stroke="#16d59b" strokeWidth={Math.min(2,50/values.length)} strokeLinecap="round"/>) : <polyline points={values.map((v,i)=>`${x(i)},${y(v)}`).join(' ')} fill="none" stroke="#35d477" strokeWidth="2" vectorEffect="non-scaling-stroke"/>}
  </svg>;
}
