import StockAppCTA from '../../components/StockAppCTA';
import Link from 'next/link';
import PublicEducationPage from '../../components/PublicEducationPage';
import guides from '../../data/investing-guides.json';
import questionGuides from '../../data/search-question-guides.json';
import SearchQuestionGuide, {type SearchGuide} from '../../components/SearchQuestionGuide';
import {SITE} from '../../lib/seo';
import s from '../../styles/InvestingGuides.module.css';
type Guide=typeof guides[number];
export default function GuidePage({guide,questionGuide}:{guide?:Guide;questionGuide?:SearchGuide}){
 if(questionGuide) return <SearchQuestionGuide guide={questionGuide}/>;
 if(!guide) return null;
 const g=guide;
 const path='/guides/'+g.slug+'/';
 const schema={'@context':'https://schema.org','@graph':[
 {'@type':'Article','@id':SITE+path+'#article',headline:g.title,description:g.description,mainEntityOfPage:SITE+path,author:{'@type':'Organization',name:'Stocks To Buy Now Research',url:SITE+'/company/'},publisher:{'@type':'Organization',name:'Stocks To Buy Now Research',url:SITE},datePublished:'2026-11-23',dateModified:g.dateModified||'2026-11-24'},
 {'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Guides',item:SITE+'/guides/'},{'@type':'ListItem',position:2,name:g.title,item:SITE+path}]},
 {'@type':'FAQPage',mainEntity:g.faq.map(f=>({'@type':'Question',name:f.question,acceptedAnswer:{'@type':'Answer',text:f.answer}}))}]};
 return <PublicEducationPage title={g.seoTitle||g.title} description={g.description} path={path} schema={schema}><div className={s.page}>
 <nav className={s.breadcrumb} aria-label="Breadcrumb"><Link href="/guides/">Investing guides</Link><span aria-hidden="true">/</span><span>{g.title}</span></nav>
 <header className={s.hero}><p className={s.kicker}>THE INVESTOR’S FIELD GUIDE</p><h1>{g.title}</h1><p>{g.description}</p><p className={s.meta}>By Stocks To Buy Now Research · Educational guide</p></header>
 <div className={s.layout}><article><div className={s.answer}><h2>The short answer</h2><p>{g.answer}</p></div>
 {g.sections.map((x,i)=><section key={x.title} id={'step-'+i}><h2>{x.title}</h2><p>{x.body}</p></section>)}
 <section id="questions"><p className={s.kicker}>COMMON QUESTIONS</p><h2>Questions, answered.</h2>{g.faq.map(f=><div className={s.faq} key={f.question}><h3>{f.question}</h3><p>{f.answer}</p></div>)}</section>
 <section className={s.sources}><h2>Sources and further reading</h2><ul>{g.sources.map(x=><li key={x.href}><a href={x.href}>{x.label}</a></li>)}</ul><p><Link href="/editorial-policy/">Editorial standards</Link> · <Link href="/methodology/">Research methodology</Link></p></section>
 </article><aside className={s.sidebar}><h2>In this guide</h2><nav aria-label="On this page">{g.sections.map((x,i)=><a key={x.title} href={'#step-'+i}>{x.title}</a>)}<a href="#questions">Frequently asked questions</a></nav><h2>Put it into practice</h2><nav aria-label="Research tools">{g.tools.map(t=><Link key={t.href} href={t.href}>{t.label}</Link>)}</nav><Link className={s.course} href="/learn/">Learn with free video courses</Link></aside></div>
 <section><h2>Continue learning</h2><div className={s.grid}>{guides.filter(x=>x.slug!==g.slug).slice(0,3).map(x=><Link className={s.card} key={x.slug} href={'/guides/'+x.slug+'/'}><h3>{x.title}</h3><p>{x.description}</p></Link>)}</div><p><Link href="/guides/">Explore all investing guides</Link></p></section>
 <StockAppCTA symbol={"guide_"+g.slug} pro downloadPicker/>
 </div></PublicEducationPage>;
}
export function getStaticPaths(){return {paths:[...guides,...questionGuides].map(g=>({params:{slug:g.slug}})),fallback:false}}
export function getStaticProps({params}:{params:{slug:string}}){const questionGuide=questionGuides.find(g=>g.slug===params.slug);if(questionGuide)return {props:{questionGuide}};const guide=guides.find(g=>g.slug===params.slug);return guide?{props:{guide}}:{notFound:true}}
