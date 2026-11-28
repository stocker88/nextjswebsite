import {useState} from 'react';
import Link from 'next/link';
import PublicEducationPage from '../../../components/PublicEducationPage';
import StockAppCTA from '../../../components/StockAppCTA';
import guides from '../../../data/investment-management-guides.json';
import {SITE} from '../../../lib/seo';
import s from '../../../styles/InvestmentManagement.module.css';
const base='/guides/investment-management/';
export default function InvestmentManagement(){
 const [query,setQuery]=useState('');
 const q=query.trim().toLocaleLowerCase();
 const matches=guides.flatMap(g=>g.terms.filter(t=>!q||`${t.name} ${t.body}`.toLocaleLowerCase().includes(q)).map(t=>({...t,slug:g.slug})));
 return <PublicEducationPage title="Investment management: funds, styles and portfolio theory" description="Explore investment management with guides to ETFs, fund structures, investing styles, NAV, fees, bond theory and robo-advisors. Find clear explanations and examples." path={base} schema={{'@context':'https://schema.org','@type':'CollectionPage',name:'Investment management guides',url:SITE+base,mainEntity:{'@type':'ItemList',itemListElement:guides.map((g,i)=>({'@type':'ListItem',position:i+1,name:g.title,url:SITE+base+g.slug+'/'}))}}}>
 <div className={s.page}><nav className={s.breadcrumb} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/guides/">Guides</Link><span>/ Investment management</span></nav>
 <header className={s.hero}><p className={s.kicker}>INVESTMENT MANAGEMENT</p><h1>Understand what your money is invested in.</h1><p>Compare fund structures, investment styles and the ideas behind portfolio decisions. Start with a guide or find a specific term.</p></header>
 <div className={s.grid}>{guides.map((g,i)=><Link className={s.card} key={g.slug} href={base+g.slug+'/'}><div className={s.cardTitle}><span className={s.number} aria-hidden="true">{String(i+1).padStart(2,'0')}</span><h2>{g.title}</h2></div><p>{g.description}</p><strong>Read guide →</strong></Link>)}</div>
 <section className={s.directory}><h2>Find an investment topic</h2><label htmlFor="investment-search">Search funds, styles and terminology</label><input id="investment-search" type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try ETF, duration or performance fee"/><p role="status">{matches.length} topics{q?' matching your search':''}</p><div className={s.topicGrid}>{matches.map(t=><Link key={t.slug+t.id} href={base+t.slug+'/#'+t.id}>{t.name}<span aria-hidden="true"> ↗</span></Link>)}</div>{!matches.length&&<p>Try a broader term such as fund, bond or management.</p>}</section>
 <aside className={s.certificate}><span className={s.kicker}>KEEP LEARNING</span><h2>Put your knowledge into practice.</h2><p>Complete the academy to receive your digital certificate, ready to download and share on LinkedIn.</p><Link href="/learn/get-certified/">Get Certified →</Link></aside></div><StockAppCTA symbol="investment_management" pro downloadPicker/>
 </PublicEducationPage>;
}
