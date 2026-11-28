import StockAppCTA from './StockAppCTA';
import Link from 'next/link';
import PublicEducationPage from './PublicEducationPage';
import guides from '../data/search-question-guides.json';
import {SITE} from '../lib/seo';
import s from '../styles/InvestingGuides.module.css';
import q from '../styles/SearchQuestions.module.css';
export type SearchGuide = typeof guides[number];
export default function SearchQuestionGuide({guide:g}:{guide:SearchGuide}) {
 const path='/guides/'+g.slug+'/';
 const related=guides.filter(x=>x.category===g.category && x.slug!==g.slug).slice(0,3);
 const schema={'@context':'https://schema.org','@graph':[
 {'@type':'Article',headline:g.title,description:g.description,mainEntityOfPage:SITE+path,datePublished:'2026-11-27',dateModified:'2026-11-27',author:{'@type':'Organization',name:'Stocks to Buy Now Research',url:SITE},publisher:{'@type':'Organization',name:'Stocks to Buy Now Research',url:SITE}},
 {'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Investing guides',item:SITE+'/guides/'},{'@type':'ListItem',position:2,name:'Trading questions',item:SITE+'/guides/questions/'},{'@type':'ListItem',position:3,name:g.title,item:SITE+path}]},
 {'@type':'FAQPage',mainEntity:g.faq.map(f=>({'@type':'Question',name:f.question,acceptedAnswer:{'@type':'Answer',text:f.answer}}))}]};
 return <PublicEducationPage title={g.title} description={g.description} path={path} schema={schema}>
 <div className={s.page}><nav className={s.breadcrumb} aria-label="Breadcrumb"><Link href="/guides/">Guides</Link><span>/</span><Link href="/guides/questions/">Trading questions</Link><span>/</span><span>{g.category}</span></nav>
 <header className={s.hero}><p className={s.kicker}>{g.category.toUpperCase()}</p><h1>{g.title}</h1><p className={s.meta}>By Stocks to Buy Now Research</p></header>
 <div className={s.layout}><article><div className={s.answer}><p className={s.kicker}>THE SHORT ANSWER</p><p className={q.lead}>{g.answer}</p></div>
 {g.sections.map((section,i)=><section id={'section-'+i} key={section.title}><h2>{section.title}</h2><p>{section.body}</p>{i===0 && <div className={q.tableWrap}><table><caption>{g.category==='Trading income'?'Illustrative numbers · before costs and taxes':'A practical checklist'}</caption><thead><tr>{g.table.headers.map(x=><th scope="col" key={x}>{x}</th>)}</tr></thead><tbody>{g.table.rows.map(row=><tr key={row[0]}><th scope="row">{row[0]}</th><td>{row[1]}</td></tr>)}</tbody></table></div>}</section>)}
 {g.category==='Trading income' && <aside className={q.note}><strong>Try the capital calculation</strong><p>Change your monthly target, assumed return and costs to see how the account size changes.</p><Link href="/guides/how-to-make-1000-a-month-trading-stocks/#calculator">Open the trading income calculator →</Link></aside>}
 <section id="questions"><p className={s.kicker}>GO A LITTLE DEEPER</p><h2>Frequently asked questions</h2>{g.faq.map(f=><div className={s.faq} key={f.question}><h3>{f.question}</h3><p>{f.answer}</p></div>)}</section>
 </article><aside className={s.sidebar}><h2>In this guide</h2><nav aria-label="On this page">{g.sections.map((x,i)=><a key={x.title} href={'#section-'+i}>{x.title}</a>)}<a href="#questions">Common questions</a></nav><h2>Explore the tools</h2><nav aria-label="Related tools">{g.tools.map(t=><Link key={t.href} href={t.href}>{t.label} →</Link>)}</nav><Link className={s.course} href="/learn/lessons/">Browse free lessons</Link></aside></div>
 <section><h2>Keep exploring</h2><div className={s.grid}>{related.map(x=><Link className={s.card} key={x.slug} href={'/guides/'+x.slug+'/'}><span className={s.kicker}>{x.category}</span><h3>{x.title}</h3><p>{x.description}</p><strong>Read the answer →</strong></Link>)}</div><p><Link href="/guides/questions/">See all trading questions →</Link></p></section>
 <StockAppCTA symbol={"guide_"+g.slug} pro downloadPicker/>
 </div></PublicEducationPage>;
}
