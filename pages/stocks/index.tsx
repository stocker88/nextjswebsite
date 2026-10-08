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
 <h1>Find stocks and market instruments</h1><p>Search {count.toLocaleString('en-US')} instruments from the app’s catalog by symbol, company, sector or industry.</p>
 <form action="/stocks" method="get"><label htmlFor="stock-query">Company name or symbol</label><div className="search-row"><input id="stock-query" name="q" defaultValue={query} placeholder="NVDA, Nvidia, semiconductors…" type="search"/><button type="submit">Search</button></div></form>
 <p role="status">{total} results{query?` for “${query}”`:''} · Page {page} of {Math.max(1,Math.ceil(total/SIZE))} {query&&<Link href="/stocks">Clear search</Link>}</p>
 <div className="stock-grid">{items.map(i=>{const curated=stocks.find(s=>s.ticker===i.symbol);return <Link className="research-card" key={i.symbol} href={curated?`/stocks/${curated.slug}`:`/instruments/${encodeURIComponent(i.symbol)}`}><div className="stock-heading"><StockLogo key={i.symbol} symbol={i.symbol} src={i.logo}/><h2>{i.symbol}</h2></div><p>{i.name}</p><small>{[i.sector,i.industry].filter(Boolean).join(' · ') || i.type}</small><p>View research →</p></Link>})}</div>
 {!total&&<p>No matches. Try a shorter name or another symbol.</p>}
 <nav className="pagination" aria-label="Stock directory pages">{page>1&&<Link href={url(page-1)}>← Previous</Link>}{page*SIZE<total&&<Link href={url(page+1)}>Next →</Link>}</nav>
 <p>Catalog information comes from the app. Listings may include historical symbols; this directory does not provide live quotes.</p>
 <style jsx>{`.stock-heading{display:flex;align-items:center;gap:14px;margin-bottom:16px}.stock-heading h2{margin:0}.search-row{display:flex;gap:12px;margin:12px 0 24px}.search-row input{min-width:0;flex:1;padding:14px;border:1px solid #596780;border-radius:12px;background:#111d30;color:white}.search-row button{padding:12px 24px;border-radius:12px;background:#187aff;color:white;border:0}label{display:block}`}</style>
 </ResearchPage>;
}
export function getServerSideProps({query,res}:any){
 const q=typeof query.q==='string'?query.q.slice(0,100):'';
 const page=Number(query.page||1);const all=searchCatalog(q);
 if(!Number.isSafeInteger(page)||page<1||(page>1&&(page-1)*SIZE>=all.length))return {notFound:true};
 res.setHeader('Cache-Control','public, s-maxage=300');
 return {props:{items:all.slice((page-1)*SIZE,page*SIZE).map(i=>({...i,logo:fs.existsSync(path.join(process.cwd(),"public/assets/logo",i.symbol+".webp"))?`/assets/logo/${encodeURIComponent(i.symbol)}.webp`:null})),total:all.length,page,query:q,count:catalog.length}};
}
