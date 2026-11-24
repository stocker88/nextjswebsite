import {predictionCatalog,cachedPredictionStocks} from '../../lib/prediction-cache-server';
import {useState} from 'react';
import Link from 'next/link';
import StockLogo from '../../components/StockLogo';
import ResearchPage from '../../components/ResearchPage';
import {predictionStocks,predictionPath,predictionName} from '../../lib/stock-predictions';
import {catalog,searchCatalog} from '../../lib/catalog';
const SIZE=48;
export function getStaticProps(){return {props:{allStocks:predictionCatalog(),cachedStocks:cachedPredictionStocks()}};}
export default function Predictions({allStocks,cachedStocks}:{allStocks:typeof predictionStocks;cachedStocks:typeof predictionStocks}){
 const [query,setQuery]=useState(''),[page,setPage]=useState(1);
 const matches=new Set(searchCatalog(query).filter(i=>i.type==='EQUITY').map(i=>i.symbol));
 const q=query.trim().toLowerCase();
 const all=allStocks.filter(s=>!q||matches.has(s.ticker)||`${s.ticker} ${predictionName(s)}`.toLowerCase().includes(q));
 const items=all.slice((page-1)*SIZE,page*SIZE);
 return <ResearchPage title="Stock Price Predictions: Search Companies & Outlooks" description="Search stock price prediction research by company, ticker or sector. Explore near-term outlooks, longer-term scenarios, earnings and valuation drivers." path="/prediction/">
 <header className="directory-heading"><span>STOCK PRICE PREDICTION RESEARCH</span><h1>Find a stock. Explore its outlook.</h1><p>Search {allStocks.length.toLocaleString('en-US')} companies for price outlooks, financials and related research—from tomorrow and next week to longer-term scenarios.</p></header>
 <form onSubmit={e=>e.preventDefault()}><label htmlFor="prediction-query">Company name, symbol or sector</label><div className="search-row"><input id="prediction-query" type="search" value={query} onChange={e=>{setQuery(e.target.value);setPage(1)}} placeholder="NVDA, Nvidia, Google, semiconductors…"/>{query&&<button type="button" onClick={()=>{setQuery('');setPage(1)}}>Clear</button>}</div></form>
 <p className="result-count" role="status">{all.length} results · Page {page} of {Math.max(1,Math.ceil(all.length/SIZE))}</p>
 <div className="stock-grid directory-grid">{items.map(stock=>{const profile=catalog.find(i=>i.symbol===stock.ticker);return <Link className="directory-card" key={stock.ticker} href={predictionPath(stock)+'/'}><div className="stock-heading"><StockLogo symbol={stock.ticker} src={null}/><h2>{stock.ticker}</h2></div><p className="company-name">{predictionName(stock)}</p><small>{profile?.sector||'Company research'}</small><small>Price prediction &amp; outlook</small><span className="card-arrow" aria-hidden="true">↗</span></Link>})}</div>
 {!all.length&&<p>No matches. Try another company name or ticker.</p>}
 <nav className="pagination" aria-label="Prediction search pages">{page>1&&<button onClick={()=>setPage(page-1)}>← Previous</button>}<span> {page} / {Math.max(1,Math.ceil(all.length/SIZE))} </span>{page*SIZE<all.length&&<button onClick={()=>setPage(page+1)}>Next →</button>}</nav>
 <p className="catalog-note">Research coverage varies by company. Outlooks and scenarios are not guaranteed future prices. Listings may include historical symbols.</p>
 <section><h2>Companies with price charts and period scenarios</h2><p>{cachedStocks.length} companies have cached price history. Choose a company, then select today, next month or a year through 2030.</p><details><summary>Browse all companies with cached charts</summary><div className="directory-grid">{cachedStocks.map(stock=><Link key={stock.ticker} href={predictionPath(stock)+'/'}>{stock.ticker} · {predictionName(stock)}</Link>)}</div></details></section>
 <style jsx>{`
 .directory-heading{margin-bottom:24px}.directory-heading>span{color:#92aaca;font-size:10px;letter-spacing:.14em}.directory-heading h1{font-size:clamp(27px,3.2vw,38px);letter-spacing:-.035em;margin:10px 0;line-height:1.15}.directory-heading p{color:#9baac0;font-size:14px;line-height:1.6;margin:0}
 label{display:block;font-size:11px;color:#9baac0;margin-bottom:8px}.search-row{display:flex;gap:10px;margin:0 0 18px}.search-row input{min-width:0;flex:1;padding:13px 16px;border:1px solid #34425a;border-radius:10px;background:#101b2d;color:white;font-size:14px}.search-row input:focus{outline:2px solid #75b9ff;outline-offset:2px}.search-row button{padding:12px 22px;border-radius:10px;background:#187aff;color:white;border:0;font-size:13px;cursor:pointer}
 .result-count{font-size:12px;color:#8c9cb4;margin:18px 0 14px}.directory-grid{gap:12px!important;grid-template-columns:repeat(4,minmax(0,1fr))!important}
 .directory-grid :global(.directory-card){display:block;position:relative;min-width:0;padding:20px 18px;border:1px solid #28354b;border-radius:15px;background:#101a2a;color:#e6edf7;text-decoration:none;transition:border-color .15s,background .15s}
 .directory-grid :global(.directory-card:hover){background:#17253b;border-color:#8b9db9}.directory-grid :global(.directory-card:focus-visible){outline:2px solid #94caff;outline-offset:3px}
 .stock-heading{display:flex;align-items:center;gap:10px;margin-bottom:14px;padding-right:12px}.stock-heading h2{font-size:17px!important;font-weight:600;margin:0!important}.stock-heading :global(.stock-logo),.stock-heading :global(.stock-logo img){width:32px;height:32px}.stock-heading :global(.stock-logo){flex-basis:32px}
 .company-name{font-size:13px;line-height:1.4;margin:0 0 6px;font-weight:500}.directory-grid small{display:block;color:#8fa0b8;font-size:11px;line-height:1.5}.card-arrow{position:absolute;right:14px;top:17px;color:#8095b2;font-size:17px}.catalog-note{font-size:11px;color:#7f90aa;margin-top:20px}
 @media(max-width:900px){.directory-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important}}
 @media(max-width:600px){.directory-heading{margin-bottom:20px}.directory-heading p{font-size:12px}.directory-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:9px!important}.directory-grid :global(.directory-card){padding:16px 12px;border-radius:12px}.stock-heading{gap:8px}.stock-heading h2{font-size:14px!important}.stock-heading :global(.stock-logo),.stock-heading :global(.stock-logo img){width:28px;height:28px}.stock-heading :global(.stock-logo){flex-basis:28px}.company-name{font-size:12px}.directory-grid small{font-size:10px}.card-arrow{right:9px;top:11px;font-size:14px}.search-row button{padding:12px 15px}}
 `}</style>
 </ResearchPage>;
}
