import fs from 'fs';
import path from 'path';
import StockLogo from '../../components/StockLogo';
import Link from 'next/link';
import ResearchPage from '../../components/ResearchPage';
import {stocks} from '../../lib/stocks';
import {catalog,searchCatalog} from '../../lib/catalog';
const SIZE=48;
export default function Stocks({items,total,page,query,count}:{items:(typeof catalog[number]&{logo:string|null})[];total:number;page:number;query:string;count:number}) {
 const url=(n:number)=>'/stocks?'+new URLSearchParams({...query?{q:query}:{},page:String(n)});
 return <ResearchPage title="Stock search: companies, sectors and research" path={page===1?'/stocks':`/stocks?page=${page}`} noindex={!!query}>
 <header className="directory-heading"><span>COMPANY RESEARCH</span><h1>Find your next idea.</h1><p>Search {count.toLocaleString('en-US')} stocks and instruments by name, symbol or sector.</p></header>
 <form action="/stocks" method="get"><label htmlFor="stock-query">Company name or symbol</label><div className="search-row"><input id="stock-query" name="q" defaultValue={query} placeholder="NVDA, Nvidia, semiconductors…" type="search"/><button type="submit">Search</button></div></form>
 <p className="result-count" role="status">{total} results{query?` for “${query}”`:''} · Page {page} of {Math.max(1,Math.ceil(total/SIZE))} {query&&<Link href="/stocks">Clear search</Link>}</p>
 <div className="stock-grid directory-grid">{items.map(i=>{const curated=stocks.find(s=>s.ticker===i.symbol);return <Link data-depth-card data-stock-link className="directory-card" key={i.symbol} href={curated?`/stocks/${curated.slug}`:`/instruments/${encodeURIComponent(i.symbol)}`}><div className="stock-heading"><StockLogo key={i.symbol} symbol={i.symbol} src={i.logo}/><h2 data-stock-symbol={i.symbol}>{i.symbol}</h2></div><p className="company-name">{i.name}</p><small>{[i.sector,i.industry].filter(Boolean).join(' · ') || i.type}</small><span className="card-arrow" aria-hidden="true">↗</span></Link>})}</div>
 {!total&&<p>No matches. Try a shorter name or another symbol.</p>}
 <nav className="pagination" aria-label="Stock directory pages">{page>1&&<Link href={url(page-1)}>← Previous</Link>}{page*SIZE<total&&<Link href={url(page+1)}>Next →</Link>}</nav>
 <p className="catalog-note">Listings may include historical symbols. Quotes are not live.</p>
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
export function getServerSideProps({query,res}:any){
 const q=typeof query.q==='string'?query.q.slice(0,100):'';
 const page=Number(query.page||1);const all=searchCatalog(q);
 if(!Number.isSafeInteger(page)||page<1||(page>1&&(page-1)*SIZE>=all.length))return {notFound:true};
 res.setHeader('Cache-Control','public, s-maxage=300');
 return {props:{items:all.slice((page-1)*SIZE,page*SIZE).map(i=>({...i,logo:fs.existsSync(path.join(process.cwd(),"public/assets/logo",i.symbol+".webp"))?`/assets/logo/${encodeURIComponent(i.symbol)}.webp`:null})),total:all.length,page,query:q,count:catalog.length}};
}
