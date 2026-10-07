import Link from 'next/link';
import {useState} from 'react';
import ResearchPage from '../components/ResearchPage';

type Point = {x?:number;y1?:number;y2?:number;y3?:number};
type Signal = {id:string; content:string; graph1:Point[]; graph2:Point[]; graph3?:Point[]; graphType3?:string; likes:number; comments:number; shares:number};
function Chart({points = [], bars = false, title = 'Price trend'}:{points?:Point[]; bars?:boolean; title?:string}) {
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
const metricOptions = [
  'Earnings per Share', 'Revenues', 'Net Income', 'Profit Margins', 'Bubble Hype',
  'Price to Earnings ratio', 'Short Interest Ratio', 'Debt to Equity ratio',
  'Quick ratio', 'Dividends', 'Social Hype', 'Ownership Retail',
  'Ownership Insiders', 'Ownership Institutions',
];
function formatSignalText(content:string) {
  return (content.split('\n')[0].trim() || 'New stock prediction setup')
    .replace(/(Stock\s+To\s+Buy\s+Signals?:)\s*/i, '$1\n\n')
    .replace(/\.(?!\d)\s*/g, '.\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
function SignalCard({item}:{item:Signal}) {
  const [selectedMetric,setSelectedMetric] = useState<string | null>(null);
  const title = item.graphType3 || 'Financial metric';
  const bars = title !== 'Price' && !title.includes('Value');
  return <article className="research-card research-card-compact signal-card">
    <span className="insight-bubble">STOCK TO BUY</span>
    <div className="chart-label price-label">PRICE TREND</div>
    <Chart points={item.graph1}/>
    <label className="metric-picker">
      <span className="sr-label">Select a metric</span>
      <select aria-label="Select a metric" value={selectedMetric ?? title} onChange={event=>setSelectedMetric(event.target.value)}>
        {Array.from(new Set([title, ...metricOptions])).map(metric=><option key={metric} value={metric}>{metric}</option>)}
      </select>
    </label>
    {selectedMetric !== null ? <div className="metric-app-gate" aria-live="polite">
      <Link href="/web-app" className="metric-app-button">Get the app to view {selectedMetric} →</Link>
      <button type="button" onClick={()=>setSelectedMetric(null)}>Back to {title} preview</button>
    </div> : <Chart points={item.graph3} bars={bars} title={title}/>}
    <style jsx>{`
      .metric-picker {display:block;margin-top:16px;}
      .sr-label {position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);}
      select {width:100%;min-height:44px;background:#151d2b;color:white;border:1px solid #556079;border-radius:10px;padding:10px;font-size:16px;cursor:pointer;}
      option {background:#151d2b;color:white;}
      .metric-app-gate {min-height:180px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:18px;background:rgba(136,89,230,.12);border:1px solid rgba(160,115,250,.3);border-radius:14px;margin:16px 0;}
      .metric-app-gate :global(.metric-app-button) {display:block;width:100%;box-sizing:border-box;text-align:center;padding:18px 14px;background:linear-gradient(120deg,#6943d8,#245bdb);border-radius:14px;color:white;font-size:16px;font-weight:700;line-height:1.4;text-decoration:none;}
      .metric-app-gate button {background:none;border:0;color:#cdb9ff;text-decoration:underline;cursor:pointer;font-size:12px;min-height:32px;}
      select:focus-visible, .metric-app-gate :global(a:focus-visible), button:focus-visible {outline:2px solid #bfa0ff;outline-offset:3px;}
    `}</style>
    <p style={{fontSize:14,lineHeight:1.65,whiteSpace:'pre-line'}}>{formatSignalText(item.content)}</p>
    <Link href="/web-app" className="research-cta">View in the app →</Link>
  </article>;
}
export default function StocksToBuy({items}:{items:Signal[]}) { return <ResearchPage title="Stocks to buy now: latest signals" path="/stocks-to-buy"><div className="hero"><span className="eyebrow">STOCK BUY SIGNALS</span><h1>Stocks to buy now</h1><p>Recent stock setups and market signals. Open each insight in the app for the full analysis.</p></div><div className="research-board">{items.map(item=><SignalCard item={item} key={item.id}/>)}</div></ResearchPage>; }
export async function getStaticProps() { let items:Signal[]=[]; try { const r=await fetch('https://us-central1-stocker-fcda2.cloudfunctions.net/stockSignals'); if(r.ok) items=(await r.json()).items||[]; } catch (_) {} return {props:{items},revalidate:1800}; }
