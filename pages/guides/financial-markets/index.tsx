import {useState} from 'react';
import Link from 'next/link';
import PublicEducationPage from '../../../components/PublicEducationPage';
import StockAppCTA from '../../../components/StockAppCTA';
import guides from '../../../data/market-education-guides.json';
import {SITE} from '../../../lib/seo';
import s from '../../../styles/InvestmentManagement.module.css';
const base='/guides/financial-markets/';
export default function FinancialMarkets(){
 const [query,setQuery]=useState('');
 const q=query.trim().toLocaleLowerCase();
 const matches=guides.flatMap(g=>g.terms.filter(t=>!q||`${t.name} ${t.body}`.toLocaleLowerCase().includes(q)).map(t=>({...t,slug:g.slug})));
 return <PublicEducationPage title="Financial markets: stocks, trading and valuation" description="Learn how financial markets work. Explore share classes, exchanges, valuation, trading strategies, corporate actions and market risks with practical examples." path={base} schema={{'@context':'https://schema.org','@type':'CollectionPage',name:'Financial markets guides',url:SITE+base,mainEntity:{'@type':'ItemList',itemListElement:guides.map((g,i)=>({'@type':'ListItem',position:i+1,name:g.title,url:SITE+base+g.slug+'/'}))}}}>
 <div className={s.page}><nav className={s.breadcrumb} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/guides/">Guides</Link><span>/ Financial markets</span></nav>
 <header className={s.hero}><p className={s.kicker}>FINANCIAL MARKETS</p><h1>Understand how financial markets work.</h1><p>Explore stocks, trading venues, valuation and the ideas behind market decisions. Start with a guide or find a specific term.</p></header>
 <div className={s.grid}>{guides.map((g,i)=><Link className={s.card} key={g.slug} href={base+g.slug+'/'}><div className={s.cardTitle}><span className={s.number} aria-hidden="true">{String(i+1).padStart(2,'0')}</span><h2>{g.title}</h2></div><p>{g.description}</p><strong>Read guide →</strong></Link>)}</div>
 <section className={s.directory}><h2>Find an investment topic</h2><label htmlFor="investment-search">Search markets, strategies and terminology</label><input id="investment-search" type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try common stock, beta or short selling"/><p role="status">{matches.length} topics{q?' matching your search':''}</p><div className={s.topicGrid}>{matches.map(t=><Link key={t.slug+t.id} href={base+t.slug+'/#'+t.id}>{t.name}<span aria-hidden="true"> ↗</span></Link>)}</div>{!matches.length&&<p>Try a broader term such as stock, market or trading.</p>}</section>
 <aside className={s.certificate}><span className={s.kicker}>KEEP LEARNING</span><h2>Put your knowledge into practice.</h2><p>Complete the academy to receive your digital certificate, ready to download and share on LinkedIn.</p><Link href="/learn/get-certified/">Get Certified →</Link></aside></div><StockAppCTA symbol="financial_markets" pro downloadPicker/>
 </PublicEducationPage>;
}
