import {useEffect, useState} from 'react';
import Link from 'next/link';
import SignalChart, {type Point} from './SignalChart';

type Preview = {id:string; content:string; graph1:Point[]; graph3?:Point[]; graphType3?:string};

export default function HomeSignalPreview() {
  const [items, setItems] = useState<Preview[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    let disposed = false;
    async function load() {
      try {
        const response = await fetch('https://us-central1-stocker-fcda2.cloudfunctions.net/stockSignals', {signal:controller.signal});
        if (!response.ok) throw new Error('Signals unavailable');
        const payload = await response.json();
        if (!disposed && Array.isArray(payload.items)) {
          setItems(payload.items.filter((item:Preview) => item && typeof item.id === 'string' && typeof item.content === 'string' && Array.isArray(item.graph1)).slice(0,2));
        }
      } catch (_) { /* Keep the catalog link available if the preview cannot load. */ }
      finally { clearTimeout(timeout); if (!disposed) setLoading(false); }
    }
    load();
    return () => { disposed = true; controller.abort(); clearTimeout(timeout); };
  }, []);

  return <section className="signal-preview" aria-labelledby="signal-preview-title">
    <header className="editorial-heading">
      <span>Inside the app</span>
      <h2 id="signal-preview-title">Explore stock signals</h2>
      <p>A preview of recent setups, with price trends and business metrics. Open the signals page to explore more.</p>
    </header>
    <div className="preview-grid" aria-busy={loading}>
      {loading ? [0,1].map(i => <div className="loading-card" key={i} aria-hidden="true" />) : items.map(item => {
        const metric = item.graphType3 || 'Financial metric';
        return <Link href="/stocks-to-buy" className="preview-card" key={item.id}>
          <span className="badge">STOCK TO BUY</span>
          <h3>Price trend</h3>
          <SignalChart points={item.graph1} />
          {Array.isArray(item.graph3) && item.graph3.length > 0 && <>
            <h3 className="metric-title">{metric}</h3>
            <SignalChart points={item.graph3} bars={metric !== 'Price' && !metric.includes('Value')} title={metric} />
          </>}
          <p className="summary">{item.content.split('\n').find(line => line.trim()) || 'Explore this stock setup.'}</p>
          <span className="card-link">Explore this setup →</span>
        </Link>;
      })}
    </div>
    {loading && <p className="status" role="status">Loading signal previews…</p>}
    {!loading && !items.length && <p className="status">Signal previews are temporarily unavailable. Explore the signals page for more.</p>}
    <div className="preview-action"><Link href="/stocks-to-buy" className="preview-cta">Explore stock signals →</Link></div>
    <style jsx>{`
      .signal-preview{max-width:1000px;margin:0 auto;padding:48px 24px 64px;color:#e5edf8;}
      .preview-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px;}
      .preview-grid :global(.preview-card),.loading-card{min-width:0;padding:22px;border:1px solid #2b3c55;border-radius:20px;background:linear-gradient(145deg,#121c2d,#0c1220);}
      .preview-grid :global(.preview-card){display:block;color:inherit;text-decoration:none;transition:border-color .2s,transform .2s;}
      .preview-grid :global(.preview-card:hover){border-color:#9971ef;transform:translateY(-2px);}
      .badge{display:inline-block;font-size:11px;font-weight:750;letter-spacing:.04em;color:#d3bcff;border:1px solid #9160ec;background:#895cff20;border-radius:999px;padding:7px 10px;}
      h3{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#35d477;margin:18px 0 8px;}
      h3.metric-title{color:#c7d3e6;text-transform:none;letter-spacing:0;}
      .preview-grid :global(.signal-chart){display:block;width:100%;height:120px;border-radius:12px;background:linear-gradient(180deg,#35d47718,#131f3240);}
      .summary{font-size:14px;line-height:1.6;margin:18px 0 12px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}
      .card-link{color:#93caff;font-size:13px;font-weight:650;}
      .preview-action{text-align:center;margin-top:28px;}
      .preview-action :global(.preview-cta){display:inline-flex;justify-content:center;background:#1985ff;color:white;font-size:18px;font-weight:750;border-radius:999px;padding:17px 28px;text-decoration:none;}
      .preview-action :global(.preview-cta:hover){background:#096bd8;}
      .signal-preview :global(a:focus-visible){outline:2px solid #c3a6ff;outline-offset:4px;}
      .loading-card{height:350px;background:#121c2d;}
      .status{text-align:center;font-size:14px;color:#b9c5d8;}
      @media(max-width:600px){.signal-preview{padding:36px 16px 48px;}.preview-grid{gap:10px;}.preview-grid :global(.preview-card){padding:12px;border-radius:14px;}.badge{font-size:9px;padding:6px 8px;}.summary{font-size:13px;}.card-link{font-size:12px;}.preview-grid :global(.signal-chart){height:100px;}}
      @media(prefers-reduced-motion:reduce){.preview-grid :global(.preview-card){transition:none;}}
    `}</style>
  </section>;
}
