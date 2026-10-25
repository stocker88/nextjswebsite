import Head from 'next/head';
import Link from 'next/link';
import {useMemo,useState} from 'react';
import ResearchPage from './ResearchPage';
import {InsiderArticle,insiderArticlePath,insiderPagePath,articleDate} from '../lib/insider-news';
import {SITE,jsonLd,breadcrumbs} from '../lib/seo';
import s from '../styles/InsiderNews.module.css';
const kinds=[['all','All disclosures'],['daily_recap','Daily recaps'],['signals','Signal reports'],['insider_sales','Insider sales'],['insider_buys','Insider purchases'],['fund_activity','Fund activity'],['politician_activity','Politicians']];
export default function InsiderNewsArchive({items,page,pages}:{items:InsiderArticle[];page:number;pages:number}){
 const [kind,setKind]=useState('all'),[query,setQuery]=useState('');
 const matches=useMemo(()=>items.filter(a=>(kind==='all'||(kind==='signals'?!!a.signalCategory:a.kind===kind))&&[a.title,a.summary,...(a.symbols||[])].join(' ').toLowerCase().includes(query.toLowerCase())),[items,kind,query]);
 const path=insiderPagePath(page),title='Insider & Hedge Fund News'+(page>1?' · Page '+page:'');
 return <ResearchPage title={title} path={path} description="Daily insider buying and selling recaps, hedge fund holding changes and politician disclosures. See who reported each move, transaction dates and original filings." socialImageUrl={SITE+'/assets/images/insider-news-social.png'} socialImageAlt="Insider and fund disclosure research" noindex={!items.length}>
 <Head><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(breadcrumbs([{name:'Home',path:'/'},{name:'Insider & fund news',path:'/insider-news/'}]))}}/></Head>
 <header className={s.hero}><p className={s.eyebrow}>THE DAILY DISCLOSURE DESK</p><h1>The filings.<br/><em>The people behind them.</em></h1><p className={s.lead}>Who bought, who sold, and what changed in reported portfolios. A daily recap and focused stories, grounded in original filings.</p><div className={s.links}><Link href="/smart-money/">Explore all activity ↗</Link><Link href="/insider-trades/">Insider trade tools ↗</Link><Link href="/hedge-fund-activity/">Fund holdings ↗</Link></div></header>
 <aside className={s.note}>One recap is scheduled daily at 6:45 p.m. New York time. Stories cover newly observed disclosures; the underlying trades may be older. Institutional changes describe quarter-end holdings.</aside>
 <div className={s.filters}><label>Search this page<input type="search" placeholder="Ticker, reporter or company" value={query} onChange={e=>setQuery(e.target.value)}/></label><label>Coverage<select value={kind} onChange={e=>setKind(e.target.value)}>{kinds.map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label></div>
 <p className={s.meta}>Page {page} of {pages} · {matches.length} matching articles on this page</p><div className={s.grid}>{matches.map(a=><Link href={insiderArticlePath(a)} key={a.slug} className={s.card}><div className={s.cardTop}><span>{a.signalCategory?'Signal report':kinds.find(k=>k[0]===a.kind)?.[1]||'Disclosure research'}</span><span>↗</span></div><h2>{a.title}</h2><p>{a.summary}</p><footer>{articleDate(a.publishedAt)} · {a.sources.length} original filing{a.sources.length===1?'':'s'}</footer></Link>)}</div>
 {!matches.length&&<div className={s.empty}><h2>{items.length?'No matches on this page.':'The first recap is on its way.'}</h2><p>{items.length?'Try a different search, coverage filter or archive page.':'Published recaps will appear here after the daily job runs. Explore the disclosure tools and original filings in the meantime.'}</p><Link href="/smart-money/">Open the disclosure tools →</Link></div>}
 <nav aria-label="Article archive pages" className={s.links}>{page>1&&<Link href={insiderPagePath(page-1)}>← Newer articles</Link>}{page<pages&&<Link href={insiderPagePath(page+1)}>Older articles →</Link>}</nav><p className={s.note}>Automated reporting by Stocks To Buy Now AI. Disclosures can be delayed or amended, and coverage is limited to the feeds and managers shown in the tools. <Link href="/smart-money-guide/">Read the sources and methodology →</Link></p>
 </ResearchPage>;
}
