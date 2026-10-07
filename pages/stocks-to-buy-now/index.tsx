import Link from 'next/link';
import {useState} from 'react';
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
    <div className="research-meta">{item.symbols.slice(0,4).map(s => `$${s.toUpperCase()}`).join(' · ')}</div>
    <div className="metrics"><span>◷ {Math.max(1, Math.ceil(item.title.length / 55))} min read</span><span>♡ {(Number(item.likes) || 0) * 3}</span><span>▢ {(Number(item.comments) || 0) * 3}</span><span>↗ {(Number(item.shares) || 0) * 3}</span></div>
  </Link>;
}

function Column({items}: {items:ResearchPreview[]}) { return <div className="research-column">{items.map(item => <Card item={item} compact key={item.id} />)}</div>; }

export default function ResearchHub({items}: {items:ResearchPreview[]}) {
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
 return <ResearchPage title="Stocks to buy now: research and stock analysis" path="/stocks-to-buy-now">
   <div className="hero"><span className="eyebrow">AI MARKET INSIGHTS</span><h1>Stocks to buy now</h1><p>Research previews, market catalysts and investor insights. Subscribe in the app to read the full analysis.</p></div>
   {!items.length && <p>No research previews are available yet.</p>}
   <div className="research-board"><Column items={columns[0]} /><Column items={columns[1]} /><Column items={columns[2]} /></div>
   {visibleCount < items.length && <button style={{display:'block',margin:'32px auto',padding:'14px 24px',borderRadius:'999px',border:'1px solid #895cff',background:'#171d31',color:'white',cursor:'pointer'}} onClick={() => setVisibleCount(count => count + 40)}>Load more research ({Math.min(40, items.length-visibleCount)} more)</button>}
 </ResearchPage>;
}
export async function getStaticProps() {return {props:{items:await fetchResearch()}, revalidate:1800};}
