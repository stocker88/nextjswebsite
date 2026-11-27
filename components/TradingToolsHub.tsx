import {useSiteLanguage} from '../lib/localization/use-site-language';
import {useState} from 'react';
import Link from 'next/link';
import ResearchPage from './ResearchPage';
import s from './TradingToolsHub.module.css';

type Tool = {name:string;path:string;detail?:string};
const groups = [
 {id:'markets',name:'Market overview',description:'See what is moving and what comes next.',paths:['/stock-market-heatmap/','/premarket-stock-heatmap/','/after-hours-stock-heatmap/','/fear-and-greed-index/','/stock-market-news/','/earnings-calendar/','/ipo-calendar/','/stock-market-calendar/','/hormuz-transit-index/','/pentagon-pizza-index/']},
 {id:'research',name:'Company research',description:'Compare businesses, explore outlooks and follow disclosures.',paths:['/stocks/','/stock-comparison/','/industries/','/prediction/','/stocks-to-buy/','/insider-news/','/methodology/']},
 {id:'options',name:'Options',description:'Explore contract activity, payoffs and historical outcomes.',paths:['/options-activity/','/options-profit-calculator/','/results/']},
 {id:'calculators',name:'Trading calculators',description:'Work through position sizes, pip values and futures ticks.',paths:['/tools/position-size-calculator/','/tools/forex-pip-value-calculator/','/tools/futures-tick-value-calculator/']},
 {id:'crypto',name:'Crypto & forex',description:'Explore price scenarios across other markets.',paths:['/crypto-prediction/','/forex-prediction/']},
 {id:'guides',name:'Practical guides',description:'Build a clearer research and charting workflow.',paths:[]},
];
const descriptions:Record<string,string> = {
 '/tools/position-size-calculator/':'Calculate position size from your account balance, entry price and risk limit.',
 '/tools/forex-pip-value-calculator/':'Calculate how much a pip is worth for your currency trade.',
 '/tools/futures-tick-value-calculator/':'Translate tick movements into the value of a futures position.',
 '/options-profit-calculator/':'Explore how strikes, premiums and expiry affect an options payoff.',
 '/options-activity/':'Review unusual call and put volume alongside open interest.',
};
function Icon({kind}:{kind:string}) {const paths:Record<string,string>={markets:'M3 3h7v7H3z M14 3h7v11h-7z M3 14h7v7H3z M14 18h7v3h-7z',research:'M4 20V10h4v10 M10 20V4h4v16 M16 20v-7h4v7',options:'M3 18h7l10-12 M3 6h7l10 12',calculators:'M5 3h14v18H5z M8 7h8 M8 12h1 M15 12h1 M8 17h1 M15 17h1',crypto:'M4 8h16l-4-4 M20 16H4l4 4',guides:'M12 5v16 M12 5C8 2 4 3 2 4v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-2-1-6-2-10 1'};return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[kind]||paths.research}/></svg>}
export default function TradingToolsHub({title,description,path,items}:{title:string;description:string;path:string;items:Tool[]}) {
 const {t,href,language}=useSiteLanguage();
 const [query,setQuery]=useState('');const [category,setCategory]=useState('all');
 const term=query.trim().toLowerCase();
 const sections=groups.map(group=>({...group,tools:items.filter(item=>(group.id==='guides'?item.path.startsWith('/trading-guides/'):group.paths.includes(item.path))&&(!term||(t(item.name)+' '+t(item.detail||'')+' '+t(descriptions[item.path]||'')).toLowerCase().includes(term)))})).filter(group=>(category==='all'||category===group.id)&&group.tools.length);
 const count=sections.reduce((sum,group)=>sum+group.tools.length,0);
 const featured=[{path:'/stock-market-heatmap/',label:'Read the market',name:'Stock Market Heatmap',detail:'See sector leaders and laggards at a glance.',kind:'markets'},{path:'/stock-comparison/',label:'Compare opportunities',name:'Stock Comparison',detail:'Put prices and company fundamentals side by side.',kind:'research'},{path:'/options-profit-calculator/',label:'Understand the payoff',name:'Options Profit Calculator',detail:'Explore potential outcomes before a trade.',kind:'options'}];
 return <ResearchPage title={title} description={description} path={path} hideResearchNavigation><div className={s.hub}>
 <header className={s.hero}><p className={s.eyebrow}>{t("THE RESEARCH WORKSPACE")}</p><h1>{t("Trading tools.")}<br/><span>{t("A clearer view of the market.")}</span></h1><p className={s.intro}>{t("From the market\u2019s next move to your next research question. Explore heatmaps, compare companies and work through the numbers.")}</p><a className={s.browse} href="#tool-library">{language==='es'?`Explorar las ${items.length} herramientas y guías`:`Browse all ${items.length} tools & guides`}</a></header>
 {!term&&category==='all'&&<section className={s.featured} aria-label={t("Start exploring")}>{featured.map((tool,i)=><Link prefetch={false} href={href(tool.path)} key={tool.path} className={`${s.feature} ${s['feature'+i]}`}><div className={s.featureTop}><span>{t(tool.label)}</span><Icon kind={tool.kind}/></div><h2>{t(tool.name)}</h2><p>{t(tool.detail)}</p><span className={s.open}>{t('Open tool')} <span aria-hidden="true">↗</span></span></Link>)}</section>}
 <section id="tool-library" className={s.library} aria-labelledby="library-title"><div className={s.libraryHeading}><div><p className={s.eyebrow}>{t("EXPLORE THE TOOLKIT")}</p><h2 id="library-title">{t("Find the right tool.")}</h2></div><div className={s.search}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></svg><input aria-label={t("Search trading tools")} type="search" placeholder={t("Search tools, e.g. earnings")} value={query} onChange={e=>setQuery(e.target.value)}/></div></div>
 <div className={s.filters} role="group" aria-label={t("Tool categories")}>{[{id:'all',name:'All tools'},...groups].map(group=><button key={group.id} type="button" aria-pressed={category===group.id} onClick={()=>setCategory(group.id)}>{t(group.name)}</button>)}</div>
 <p className={s.count} role="status">{language==='es'?`${count} herramientas y guías`:`${count} tools & guides`}{term?(language==='es'?' para «':' matching “')+query.trim()+(language==='es'?'»':'”'):''}</p>
 {sections.map(group=><section className={s.category} key={group.id} aria-labelledby={'category-'+group.id}><div className={s.categoryHeading}><span className={s.categoryIcon}><Icon kind={group.id}/></span><div><h2 id={'category-'+group.id}>{t(group.name)}</h2><p>{t(group.description)}</p></div></div><div className={s.grid}>{group.tools.map(tool=><Link prefetch={false} className={s.card} key={tool.path} href={href(tool.path)}><h3>{t(tool.name)}</h3><p>{t(descriptions[tool.path]||tool.detail)}</p><span className={s.cardEnd}>{t(group.id==='guides'?'Read guide':'Explore tool')}<span aria-hidden="true">↗</span></span></Link>)}</div></section>)}
 {!count&&<div className={s.empty}><h3>{t("No tools found.")}</h3><p>{t("Try a broader search or browse all categories.")}</p><button type="button" onClick={()=>{setQuery('');setCategory('all')}}>{t("Reset filters")}</button></div>}
 </section><aside className={s.lesson}><div><p className={s.eyebrow}>{t("BUILD YOUR RESEARCH ROUTINE")}</p><h2>{t("New to investing? Start with the foundations.")}</h2><p>{t("Learn how to read stock charts, understand options and manage risk.")}</p></div><Link href={href('/learn/')}>{t("Explore free lessons")}</Link></aside>
 </div></ResearchPage>;
}
