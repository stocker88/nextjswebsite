import FallbackLogo from '../../components/FallbackLogo';
import ResearchImages from '../../components/ResearchImages';
import {useEffect, useState} from 'react';
import {mobileNewsBatch} from '../../lib/news-layout';
import Link from 'next/link';

import ResearchPage from '../../components/ResearchPage';
import {researchUrl, ResearchPreview} from '../../lib/research';
import {fetchResearch} from '../../lib/research-server';

function Card({item, compact = false}: {item: ResearchPreview; compact?: boolean}) {
  const ticker = item.symbols[0]?.toUpperCase();
  const isEducation = item.symbols.some(symbol => symbol.trim().replace(/^[#$]/, '').toLowerCase() === 'education');
  // educationPreview contains the second non-empty source line.
  const quickTake = isEducation ? item.educationPreview : (item.quickTake || item.educationPreview);
  return <article className={`research-card ${compact ? 'research-card-compact' : ''}`} >
    <Link href={researchUrl(item.id, item.title)}><span className="insight-bubble">
      <FallbackLogo className="ticker-logo" src={ticker ? `/assets/logo/${ticker}.webp` : null} />
      {ticker ? `$${ticker} INSIGHTS` : 'MARKET INSIGHTS'} →
    </span>
    <h2 className="news-headline">{item.title}</h2></Link>
    {quickTake && <div className="news-quick-take"><span>Quick take</span><p>{quickTake}</p></div>}
    <ResearchImages images={item.images} />
    <div className="metrics"><span>◷ {Math.max(1, Math.ceil(item.title.length / 55))} min read</span><span>♡ {(Number(item.likes) || 0)}</span><span>▢ {(Number(item.comments) || 0)}</span><span>↗ {(Number(item.shares) || 0)}</span></div>
  </article>;
}

export default function ResearchHub({items, page = 1, total = items.length}: {items:ResearchPreview[];page?:number;total?:number}) {
 const [batches,setBatches]=useState<ResearchPreview[][]>([items]);
 const [loadedPage,setLoadedPage]=useState(page);
 const [loading,setLoading]=useState(false);
 const [error,setError]=useState('');
 useEffect(()=>{setBatches([items]);setLoadedPage(page);setError('');},[items,page]);
 async function loadMore(event:React.MouseEvent<HTMLAnchorElement>){
  if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  event.preventDefault();if(loading)return;
  setLoading(true);setError('');
  try{
   const response=await fetch(`/stock-market-news/page/${loadedPage+1}/`);
   if(!response.ok)throw new Error('Page unavailable');
   const doc=new DOMParser().parseFromString(await response.text(),'text/html');
   const data=JSON.parse(doc.getElementById('__NEXT_DATA__')?.textContent||'{}').props?.pageProps;
   if(!Array.isArray(data?.items)||data.page!==loadedPage+1)throw new Error('Invalid news page');
   setBatches(previous=>{const ids=new Set(previous.flat().map(item=>item.id));return [...previous,data.items.filter(item=>!ids.has(item.id))];});
   setLoadedPage(loadedPage+1);
  }catch(_){setError('Could not load more news. Please try again.');}
  finally{setLoading(false);}
 }
 const orderedItems=batches.flatMap(mobileNewsBatch);
 return <ResearchPage title={page === 1 ? "Stock Market News: latest news and analysis" : `Stock Market News — Page ${page}`} path={page === 1 ? "/stock-market-news" : `/stock-market-news/page/${page}`}>
   <div className="hero"><span className="eyebrow">STOCK MARKET NEWS</span><h1>Stock Market News</h1><p>Research previews, market catalysts and investor insights. Install the app to read the full analysis.</p></div>
   {!items.length && <p>No research previews are available yet.</p>}
   <div className="news-feed">{orderedItems.map(item=><Card item={item} compact key={item.id}/>)}</div>
   {error&&<p role="alert">{error}</p>}
   <nav className="pagination" aria-label="News pagination">
     {page > 1 && <Link href={page === 2 ? '/stock-market-news' : `/stock-market-news/page/${page-1}`}>← Newer articles</Link>}
     {loadedPage * 40 < total && <Link href={`/stock-market-news/page/${loadedPage+1}`} onClick={loadMore} aria-disabled={loading}>{loading?'Loading…':'More news →'}</Link>}
   </nav>
 </ResearchPage>;
}
export async function getStaticProps() {const items = await fetchResearch(); return {props:{items:items.slice(0,40), total:items.length, page:1}, revalidate:60};}
