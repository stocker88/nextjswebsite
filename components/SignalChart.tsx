import {useEffect, useRef, useId, type CSSProperties} from 'react';
import {signalChartObservations, signalChartDate, signalChartProjection} from '../lib/signal-chart';
import styles from '../styles/SignalChart.module.css';
export type Point = {x?:number;y1?:number;y2?:number;y3?:number};

export default function SignalChart({points = [], bars = false, title = 'Price trend', signalTimestamp, projectionDirection, projectionMode = bars ? 'financial' : 'price'}:{points?:Point[]; bars?:boolean; title?:string; signalTimestamp?:number; projectionDirection?:'up'|'down'; projectionMode?:'price'|'financial'}) {
  const root = useRef<HTMLDivElement>(null);
  const clipId = useId().replace(/:/g,'');
  const observations = signalChartObservations(points, signalTimestamp);
  const values = observations.map(point => point.value);
  const sentDate = signalChartDate(signalTimestamp);
  const projection = projectionDirection || (!bars && sentDate) ? signalChartProjection(observations, projectionDirection || 'up', projectionMode) : [];
  const animationKey = JSON.stringify([bars, observations, signalTimestamp, projectionDirection, projectionMode]);
  useEffect(() => {
    const element = root.current;
    if (!element || !('IntersectionObserver' in window)) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer:IntersectionObserver|undefined;
    const setup = () => {
      observer?.disconnect();
      element.dataset.chartMotion = reduced.matches ? 'complete' : 'waiting';
      if (reduced.matches) return;
      observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          element.dataset.chartMotion = 'playing';
          observer?.disconnect();
        }
      }, {threshold:0.2});
      observer.observe(element);
    };
    setup();
    reduced.addEventListener('change', setup);
    return () => {observer?.disconnect();reduced.removeEventListener('change', setup);delete element.dataset.chartMotion;};
  }, [animationKey]);

  if (!values.length) return <p className="research-meta">Chart unavailable. Check in the app.</p>;
  const displayValues = [...values,...projection.map(point=>point.value)];
  const min = bars ? Math.min(0, ...displayValues) : Math.min(...displayValues);
  const max = bars ? Math.max(0, ...displayValues) : Math.max(...displayValues);
  const range = max - min || 1;
  const y = (value:number) => 90 - (value-min)/range*80;
  const firstX = observations[0].x!;
  const lastTime = projection.length ? projection[projection.length-1].x : 0;
  const timeX = (time:number) => 8+(time-firstX)/(lastTime-firstX)*84;
  const x = (index:number) => projection.length ? timeX(observations[index].x!) : 8 + index/Math.max(1, values.length-1)*84;
  const last = observations[observations.length - 1];
  const lastX = x(values.length - 1), lastY = y(last.value);
  const projectedBarCount = Math.max(2, Math.min(12, Math.round((values.length-1)*.3)));
  const projectedBars = projection.length ? Array.from({length:projectedBarCount},(_,index)=>projection[Math.round((index+1)/projectedBarCount*40)]) : [];
  const priceDate = signalChartDate(last.x);
  const showSignal = !bars && Boolean(sentDate);
  const price = new Intl.NumberFormat('en-US',{maximumFractionDigits:2}).format(last.value);
  return <div ref={root} className={styles.chart}>
    <div className={styles.plot} title={showSignal ? `Buy signal sent ${sentDate}. Last saved chart price ${price}${priceDate ? ` on ${priceDate}` : ''}.${projection.length ? ' Purple path is an illustration from past price movement, not a forecast.' : ''}` : `${title}${projection.length ? '. Purple projections are illustrative trend scenarios, not forecasts.' : ''}`}>
      <svg className="signal-chart" viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label={title+(projection.length ? '. Includes illustrative scenarios, not forecasts.' : '')}>
        <title>{title}{showSignal ? ` · Buy signal sent ${sentDate}. Last saved chart price ${price}${priceDate ? ` on ${priceDate}` : ''}.` : ''}</title>
        <defs><clipPath id={clipId}><rect className={styles.wipe} x="0" y="0" width="100" height="100" style={{'--history-width':`${lastX+1}px`} as CSSProperties}/></clipPath><clipPath id={clipId+'-projection'}><rect className={styles.projectionWipe} x={lastX} y="0" width={100-lastX} height="100" style={{'--projection-width':`${93-lastX}px`} as CSSProperties}/></clipPath></defs>
        {projection.length>0&&<g className={styles.projectionArea}><rect x={lastX} y="0" width={100-lastX} height="100" fill="#a879ed" fillOpacity=".13"/><line x1={lastX} x2={lastX} y1="4" y2="96" stroke="#c7a3f5" strokeWidth="1" strokeDasharray="3 4" vectorEffect="non-scaling-stroke"/></g>}
        {[10,30,50,70,90].map(n => <line key={n} x1="4" x2="96" y1={n} y2={n} stroke="#ffffff" strokeOpacity=".12" strokeWidth=".3"/>)}
        {bars ? values.map((value,index) => <line className={styles.bar} key={index} x1={x(index)} x2={x(index)} y1={y(0)} y2={y(value)} stroke="#16d59b" strokeWidth={Math.min(2,50/values.length)} strokeLinecap="round" style={{transformOrigin:`${x(index)}px ${y(0)}px`,'--bar-delay':`${index / Math.max(1,values.length - 1) * 1000}ms`} as CSSProperties}/>) : <g clipPath={`url(#${clipId})`}><polyline className={styles.line} points={values.map((value,index)=>`${x(index)},${y(value)}`).join(' ')} fill="none" stroke="#35d477" strokeWidth="2" vectorEffect="non-scaling-stroke"/>{values.length===1&&<circle cx={x(0)} cy={y(values[0])} r="1" fill="#35d477"/>}</g>}
        {projection.length>0&&<g clipPath={`url(#${clipId}-projection)`}>{bars ? projectedBars.map((point,index)=><line key={index} x1={timeX(point.x)} x2={timeX(point.x)} y1={y(0)} y2={y(point.value)} stroke="#c9a4ff" strokeWidth={Math.min(2,50/values.length)} strokeLinecap="round"/>) : <polyline points={projection.map(point=>`${timeX(point.x)},${y(point.value)}`).join(' ')} fill="none" stroke="#c9a4ff" strokeWidth="2" strokeDasharray="4 3" vectorEffect="non-scaling-stroke"/>}</g>}
      </svg>
      {projection.length>0&&<span className={styles.illustration} style={{left:`${lastX}%`}}>Projections</span>}
      {showSignal && <div className={styles.endpoint} style={{left:`${lastX}%`,top:`${lastY}%`}} aria-hidden="true"><i/><span className={lastY < 35 ? styles.below : ''}>Buy signal</span></div>}
    </div>

  </div>;
}
