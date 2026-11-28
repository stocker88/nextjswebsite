import Link from 'next/link';
import PublicEducationPage from '../../../components/PublicEducationPage';
import StockAppCTA from '../../../components/StockAppCTA';
import guides from '../../../data/investment-management-guides.json';
import {SITE} from '../../../lib/seo';
import s from '../../../styles/InvestmentManagement.module.css';
const base='/guides/investment-management/';
type Guide=typeof guides[number];
export const getStaticPaths=()=>({paths:guides.map(g=>({params:{slug:g.slug}})),fallback:false});
export const getStaticProps=({params}:{params:{slug:string}})=>{const guide=guides.find(g=>g.slug===params.slug);return guide?{props:{guide}}:{notFound:true};};
export default function InvestmentGuide({guide:g}:{guide:Guide}){
 const path=base+g.slug+'/';
 const schema={'@context':'https://schema.org','@graph':[
 {'@type':'Article',headline:g.title,description:g.description,inLanguage:'en',mainEntityOfPage:SITE+path,author:{'@type':'Organization',name:'Stocks to Buy Now Research',url:SITE},publisher:{'@type':'Organization',name:'Stocks to Buy Now Research',url:SITE},about:g.terms.map(t=>({'@type':'Thing',name:t.name}))},
 {'@type':'DefinedTermSet',name:g.title,url:SITE+path,hasDefinedTerm:g.terms.map(t=>({'@type':'DefinedTerm',name:t.name,description:t.body,url:SITE+path+'#'+t.id,inDefinedTermSet:SITE+path}))},
 {'@type':'BreadcrumbList',itemListElement:[['Home','/'],['Guides','/guides/'],['Investment management',base],[g.title,path]].map(([name,url],i)=>({'@type':'ListItem',position:i+1,name,item:SITE+url}))}
 ]};
 return <PublicEducationPage title={g.title} description={g.description} path={path} schema={schema}><div className={s.page}>
 <nav className={s.breadcrumb} aria-label="Breadcrumb"><Link href="/guides/">Guides</Link><span>/</span><Link href={base}>Investment management</Link></nav>
 <header className={s.hero}><p className={s.kicker}>INVESTMENT MANAGEMENT · GUIDE</p><h1>{g.title}</h1><p>{g.intro}</p></header>
 <div className={s.layout}><article><aside className={s.example}><h2>A practical example</h2><p>{g.example}</p></aside>{g.terms.map(t=><section className={s.term} id={t.id} key={t.id}><h2><a href={'#'+t.id}>{t.name}</a></h2><p>{t.body}</p><div className={s.practice}><h3>What to check</h3><p>{t.practice}</p></div></section>)}</article>
 <aside className={s.sidebar}><nav aria-label="On this page"><h2>On this page</h2>{g.terms.map(t=><a href={'#'+t.id} key={t.id}>{t.name}</a>)}</nav></aside></div>
 <section className={s.related}><h2>Keep exploring investment management</h2><div className={s.topicGrid}>{guides.filter(other=>other.slug!==g.slug).map(other=><Link href={base+other.slug+'/'} key={other.slug}>{other.title} →</Link>)}</div></section>
 <aside className={s.certificate}><span className={s.kicker}>KEEP LEARNING</span><h2>Build your understanding. Get Certified.</h2><p>Complete the academy to receive your digital certificate, ready to download and share on LinkedIn.</p><Link href="/learn/get-certified/">Get Certified →</Link></aside></div><StockAppCTA symbol={'investment_'+g.slug} pro downloadPicker/></PublicEducationPage>;
}
