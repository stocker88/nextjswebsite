import Link from 'next/link';
import {useEffect, useState} from 'react';
import ResearchPage from '../../components/ResearchPage';
import {fetchResearch, researchUrl, ResearchPreview} from '../../lib/research';

const educationTags = new Set(['education', 'educational', 'learning', 'course', 'investing', 'strategy', 'q&a']);
const marketTags = new Set(['market', 'markets', 'macro', 'economicdata', 'fed', 'economy']);

function categoryOf(item: ResearchPreview): 'market' | 'education' | 'other' {
  const tags = item.symbols.map(tag => tag.toLowerCase().replace(/^[#$]/, '').trim());
  if (tags.some(tag => educationTags.has(tag))) return 'education';
  if (tags.some(tag => marketTags.has(tag))) return 'market';
  return 'other';
}

function Card({item, compact = false}: {item: ResearchPreview; compact?: boolean}) {
  const ticker = item.symbols[0]?.toUpperCase();
  return <Link className={`research-card ${compact ? 'research-card-compact' : ''}`} href={researchUrl(item.id)}>
    <span className="insight-bubble">
      {ticker ? <img className="ticker-logo" src={`/assets/logo/${ticker}.webp`} alt="" onError={(event) => { event.currentTarget.style.display = 'none'; }} /> : <span className="insight-dot" />}
      {ticker ? `$${ticker} INSIGHTS` : 'MARKET INSIGHTS'} →
    </span>
    <h2>{item.title}</h2>
    {item.educationPreview && item.symbols.some(symbol => symbol.trim().replace(/^[#$]/, '').toLowerCase() === 'education') && <p style={{fontSize:'clamp(10px, 1.1vw, 14px)',lineHeight:1.5,color:'#b9c5d8',margin:'8px 0 14px'}}>{item.educationPreview}</p>}
    <div className="research-meta">{item.symbols.slice(0,4).map(s => `$${s.toUpperCase()}`).join(' · ')}</div>
    <div className="metrics"><span>◷ {Math.max(1, Math.ceil(item.title.length / 55))} min read</span><span>♡ {(Number(item.likes) || 0) * 7}</span><span>▢ {(Number(item.comments) || 0) * 3}</span><span>↗ {(Number(item.shares) || 0) * 3}</span></div>
  </Link>;
}

function Column({items}: {items:ResearchPreview[]}) { return <div className="research-column">{items.map(item => <Card item={item} compact key={item.id} />)}</div>; }

export default function ResearchHub({items: initialItems}: {items:ResearchPreview[]}) {
  const [items, setItems] = useState(initialItems);
  useEffect(() => {
    let disposed = false;
    const controller = new AbortController();
    const refresh = async () => {
      try {
        const response = await fetch('https://us-central1-stocker-fcda2.cloudfunctions.net/researchPreviews', {signal: controller.signal});
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
 const [visibleCount, setVisibleCount] = useState(40);
 const columns: ResearchPreview[][] = [[], [], []];
 const heights = [0, 0, 0];
 // Allocate each batch independently; Load more never moves existing cards.
 for (let offset = 0; offset < Math.min(visibleCount, items.length); offset += 40) {
   const batch = items.slice(offset, Math.min(offset + 40, visibleCount));
   const queues = ['market', 'education', 'other'].map(category => batch.filter(item => categoryOf(item) === category));
   while (queues.some(queue => queue.length)) {
     const column = heights.indexOf(Math.min(...heights));
     let source = column;
     if (!queues[source].length) {
       const remaining = queues.map(queue => queue.reduce((size, item) => size + 160 + item.title.length, 0));
       source = remaining.indexOf(Math.max(...remaining));
     }
     const item = queues[source].shift()!;
     columns[column].push(item);
     heights[column] += 160 + item.title.length;
   }
 }
 return <ResearchPage title="Stock Market News: latest news and analysis" path="/stocks-to-buy-now">
   <div className="hero"><span className="eyebrow">STOCK MARKET NEWS</span><h1>Stock Market News</h1><p>Research previews, market catalysts and investor insights. Subscribe in the app to read the full analysis.</p></div>
   {!items.length && <p>No research previews are available yet.</p>}
   <div className="research-board"><Column items={columns[0]} /><Column items={columns[1]} /><Column items={columns[2]} /></div>
   {visibleCount < items.length && <button style={{display:'block',margin:'32px auto',padding:'14px 24px',borderRadius:'999px',border:'1px solid #895cff',background:'#171d31',color:'white',cursor:'pointer'}} onClick={() => setVisibleCount(count => count + 40)}>Load more research ({Math.min(40, items.length-visibleCount)} more)</button>}
 </ResearchPage>;
}
export async function getStaticProps() {return {props:{items:await fetchResearch()}, revalidate:1800};}
