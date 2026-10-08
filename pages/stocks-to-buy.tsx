import {useEffect, useRef, useState} from 'react';
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
function SignalCard({item, onGetApp}:{item:Signal; onGetApp:()=>void}) {
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
      <button type="button" className="metric-app-button" onClick={onGetApp}>Get the app to view {selectedMetric} →</button>
      <button type="button" onClick={()=>setSelectedMetric(null)}>Back to {title} preview</button>
    </div> : <Chart points={item.graph3} bars={bars} title={title}/>}
    <style jsx>{`
      .research-cta {border:0;cursor:pointer;font:inherit;}
      .metric-picker {display:block;margin-top:16px;}
      .sr-label {position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);}
      select {width:100%;min-height:44px;background:#151d2b;color:white;border:1px solid #556079;border-radius:10px;padding:10px;font-size:16px;cursor:pointer;}
      option {background:#151d2b;color:white;}
      .metric-app-gate {min-height:180px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:18px;background:rgba(136,89,230,.12);border:1px solid rgba(160,115,250,.3);border-radius:14px;margin:16px 0;}
      .metric-app-gate :global(.metric-app-button) {display:block;width:100%;box-sizing:border-box;text-align:center;padding:18px 14px;background:linear-gradient(120deg,#6943d8,#245bdb);border-radius:14px;color:white;font-size:16px;font-weight:700;line-height:1.4;text-decoration:none;border:0;cursor:pointer;}
      .metric-app-gate button:not(.metric-app-button) {background:none;border:0;color:#cdb9ff;text-decoration:underline;cursor:pointer;font-size:12px;min-height:32px;}
      select:focus-visible, .metric-app-gate :global(a:focus-visible), button:focus-visible {outline:2px solid #bfa0ff;outline-offset:3px;}
    `}</style>
    <p style={{fontSize:14,lineHeight:1.65,whiteSpace:'pre-line'}}>{formatSignalText(item.content)}</p>
    <button type="button" className="research-cta" onClick={onGetApp}>View in the app →</button>
  </article>;
}
const SIGNAL_PREVIEW_LIMIT = 21;
export default function StocksToBuy({items: initialItems}:{items:Signal[]}) {
  const [items, setItems] = useState(initialItems);
  useEffect(() => {
    let disposed = false;
    const controller = new AbortController();
    const refresh = async () => {
      try {
        const response = await fetch('https://us-central1-stocker-fcda2.cloudfunctions.net/stockSignals', {signal: controller.signal});
        if (!response.ok) return;
        const payload = await response.json();
        // Old endpoints paginate; keep the complete server-rendered archive
        // until the scheduled snapshot is available.
        if (!disposed && Array.isArray(payload.items) && !payload.next) setItems(payload.items);
      } catch (_) { /* Keep the last successful preview on network failure. */ }
    };
    refresh();
    const timer = setInterval(refresh, 30 * 60 * 1000);
    return () => { disposed = true; controller.abort(); clearInterval(timer); };
  }, []);

  const [showAppLink, setShowAppLink] = useState(false);
  const downloadDialog = useRef<HTMLDialogElement>(null);
  const openDownloads = () => downloadDialog.current?.showModal();
  return <ResearchPage title="Stocks to buy now: latest signals" path="/stocks-to-buy">
    <div className="hero"><span className="eyebrow">STOCK BUY SIGNALS</span><h1>Stocks to buy now</h1><p>Recent stock setups and market signals. Open each insight in the app for the full analysis.</p></div>
    <div className="research-board">{items.slice(0, SIGNAL_PREVIEW_LIMIT).map(item=><SignalCard item={item} key={item.id} onGetApp={openDownloads}/>)}</div>
    {items.length > 0 && <div className="more-signals" aria-live="polite">
      {showAppLink ? <button type="button" className="research-cta" onClick={openDownloads}>View more signals in the app →</button> : <button type="button" className="research-cta" onClick={()=>setShowAppLink(true)}>More ↓</button>}
    </div>}
    <dialog ref={downloadDialog} className="download-dialog" aria-labelledby="download-title" onClick={event=>{if(event.target === event.currentTarget) downloadDialog.current?.close();}}>
      <button type="button" className="close-download" aria-label="Close download options" onClick={()=>downloadDialog.current?.close()}>×</button>
      <h2 id="download-title">Get the app</h2>
      <p>Explore all signals and metrics on iPhone or Android.</p>
      <div className="store-buttons">
        <a href="https://apps.apple.com/us/app/stocks-to-buy-now-ai-signals/id1565527320" target="_blank" rel="noopener noreferrer">Download for iOS →</a>
        <a href="https://play.google.com/store/apps/details?id=com.newcompany.stocker" target="_blank" rel="noopener noreferrer">Download for Android →</a>
      </div>
      <div className="download-qr"><img src="/assets/images/qrcode.webp" width={176} height={176} alt="Scan to download the app on your phone" /></div>
      <p className="scan-caption">Scan with your phone to get the app</p>
    </dialog>
    <style jsx>{`
      .download-dialog {position:fixed;inset:0;margin:auto;width:440px;max-width:calc(100vw - 32px);max-height:85vh;overflow:auto;box-sizing:border-box;padding:32px 24px 24px;border:1px solid #65558d;border-radius:24px;background:#111a2b;color:white;text-align:center;box-shadow:0 24px 80px #0008;}
      .download-dialog::backdrop {background:rgba(3,7,18,.8);backdrop-filter:blur(5px);}
      .download-dialog h2 {font-size:26px;margin:8px 0 12px;}
      .download-dialog p {font-size:14px;line-height:1.5;color:#bdc9dd;}
      .close-download {position:absolute;right:10px;top:6px;width:44px;height:44px;background:transparent;border:0;color:white;font-size:28px;cursor:pointer;}
      .store-buttons {display:grid;gap:10px;margin:22px 0;}
      .store-buttons a {display:block;padding:15px 12px;border-radius:12px;background:linear-gradient(120deg,#6943d8,#245bdb);color:white;font-size:16px;font-weight:700;text-decoration:none;}
      .download-qr {display:inline-flex;padding:8px;background:white;border-radius:14px;}
      .download-dialog .scan-caption {font-size:12px;margin:12px 0 0;}
      .download-dialog a:focus-visible,.download-dialog button:focus-visible {outline:2px solid #bfa0ff;outline-offset:3px;}
      .more-signals {display:flex;justify-content:center;margin:24px 0 40px;}
      .more-signals button {border:0;cursor:pointer;font:inherit;}
      .more-signals button:focus-visible {outline:2px solid #bfa0ff;outline-offset:4px;}
    `}</style>
  </ResearchPage>;
}
export async function getStaticProps() { let items:Signal[]=[]; try { const r=await fetch('https://us-central1-stocker-fcda2.cloudfunctions.net/stockSignals'); if(r.ok) items=(await r.json()).items||[]; } catch (_) {} return {props:{items:items.slice(0, SIGNAL_PREVIEW_LIMIT)},revalidate:1800}; }
