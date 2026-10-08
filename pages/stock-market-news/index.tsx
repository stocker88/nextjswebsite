import Link from 'next/link';

import ResearchPage from '../../components/ResearchPage';
import {researchUrl, ResearchPreview} from '../../lib/research';
import {fetchResearch} from '../../lib/research-server';

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
  return <Link className={`research-card ${compact ? 'research-card-compact' : ''}`} href={researchUrl(item.id, item.title)}>
    <span className="insight-bubble">
      {ticker ? <img className="ticker-logo" src={`/assets/logo/${ticker}.webp`} alt="" onError={(event) => { event.currentTarget.style.display = 'none'; }} /> : <span className="insight-dot" />}
      {ticker ? `$${ticker} INSIGHTS` : 'MARKET INSIGHTS'} →
    </span>
    <h2>{item.title}</h2>
    {item.educationPreview && item.symbols.some(symbol => symbol.trim().replace(/^[#$]/, '').toLowerCase() === 'education') && <p style={{fontSize:'clamp(10px, 1.1vw, 14px)',lineHeight:1.5,color:'#b9c5d8',margin:'8px 0 14px'}}>{item.educationPreview}</p>}
    <div className="research-meta">{item.symbols.slice(0,4).map(s => `$${s.toUpperCase()}`).join(' · ')}</div>
    <div className="metrics"><span>◷ {Math.max(1, Math.ceil(item.title.length / 55))} min read</span><span>♡ {(Number(item.likes) || 0)}</span><span>▢ {(Number(item.comments) || 0)}</span><span>↗ {(Number(item.shares) || 0)}</span></div>
  </Link>;
}

function Column({items}: {items:ResearchPreview[]}) { return <div className="research-column">{items.map(item => <Card item={item} compact key={item.id} />)}</div>; }

export default function ResearchHub({items, page = 1, total = items.length}: {items:ResearchPreview[];page?:number;total?:number}) {
 const visibleCount = items.length;
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
 return <ResearchPage title={page === 1 ? "Stock Market News: latest news and analysis" : `Stock Market News — Page ${page}`} path={page === 1 ? "/stock-market-news" : `/stock-market-news/page/${page}`}>
   <div className="hero"><span className="eyebrow">STOCK MARKET NEWS</span><h1>Stock Market News</h1><p>Research previews, market catalysts and investor insights. Install the app to read the full analysis.</p></div>
   {!items.length && <p>No research previews are available yet.</p>}
   <div className="research-board"><Column items={columns[0]} /><Column items={columns[1]} /><Column items={columns[2]} /></div>
   <nav className="pagination" aria-label="News pagination">
     {page > 1 && <Link href={page === 2 ? '/stock-market-news' : `/stock-market-news/page/${page-1}`}>← Newer articles</Link>}
     {page * 40 < total && <Link href={`/stock-market-news/page/${page+1}`}>More news →</Link>}
   </nav>
 </ResearchPage>;
}
export async function getStaticProps() {const items = await fetchResearch(); return {props:{items:items.slice(0,40), total:items.length, page:1}, revalidate:60};}
