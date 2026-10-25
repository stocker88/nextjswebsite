import Head from 'next/head';
import Link from 'next/link';
import ResearchPage from '../../components/ResearchPage';
import {InsiderArticle,insiderArticlePath,insiderArticleSchema,articleDate,filingUrl} from '../../lib/insider-news';
import {findInsiderArticle,insiderArticles} from '../../lib/insider-news-server';
import {SITE,jsonLd,breadcrumbs} from '../../lib/seo';
import s from '../../styles/InsiderNews.module.css';
export default function InsiderNewsArticle({article:a,related}:{article:InsiderArticle;related:Pick<InsiderArticle,'slug'|'title'>[]}){const path=insiderArticlePath(a);return <ResearchPage title={a.title} path={path} description={a.summary.slice(0,180)} ogType="article" noindex={a.noActivity} socialImageUrl={SITE+'/assets/images/insider-news-social.png'} socialImageAlt="Insider and fund disclosure research">
 <Head><meta property="article:published_time" content={a.publishedAt}/><meta property="article:modified_time" content={a.updatedAt}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(insiderArticleSchema(a))}}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(breadcrumbs([{name:'Home',path:'/'},{name:'Insider & fund news',path:'/insider-news/'},{name:a.title,path}]))}}/></Head>
 <article className={s.article}><header><Link href="/insider-news/" className={s.eyebrow}>← THE DISCLOSURE DESK</Link><h1>{a.title}</h1><p className={s.meta}>By Stocks To Buy Now AI · Automated disclosure reporting<br/><time dateTime={a.publishedAt}>Published {articleDate(a.publishedAt)}</time>{a.updatedAt!==a.publishedAt&&<> · Updated {articleDate(a.updatedAt)}</>}</p><p className={s.lead}>{a.summary}</p></header>
 <p className={s.note}>These are newly observed filings, not necessarily trades made today. <Link href="/smart-money-guide/">How to read the dates and figures →</Link></p>
 {!!a.images?.length&&<section aria-label="Financial and technical research images"><h2>Financials &amp; technicals</h2><div className={s.gallery}>{a.images.map(image=><figure key={image.title}><a href={image.url} target="_blank" rel="noopener noreferrer"><img src={image.url} alt={`${a.symbols?.[0]||'Company'} ${image.title.toLowerCase()} with dated research figures`} width={image.width} height={image.height} loading="lazy"/></a><figcaption>{image.title} · Open full-size image ↗</figcaption></figure>)}</div></section>}
 {a.sections.map((section,i)=><section key={i}><h2>{section.heading}</h2>{section.text.split(/\n\n+/).map((p,j)=><p key={j}>{p}</p>)}</section>)}
 <section className={s.sources}><h2>Read the original filings</h2>{a.sources.length?<ul>{a.sources.map(source=><li key={source.url}><a href={filingUrl(source.url)!} target="_blank" rel="noopener noreferrer">{source.title} ↗</a></li>)}</ul>:<p>No new qualifying records in the covered feeds.</p>}</section>
 <div className={s.links}>{(a.symbols||[]).slice(0,8).map(symbol=><Link key={symbol} href={'/smart-money/?q='+encodeURIComponent(symbol)}>Inspect {symbol} activity →</Link>)}<Link href="/smart-money/?view=signals">Research signals ↗</Link>{a.recapSlug&&<Link href={'/insider-news/'+a.recapSlug+'/'}>Read the full daily recap →</Link>}</div>
 <p className={s.note}>{a.disclosure} <Link href="/editorial-policy/">Editorial standards</Link> · <Link href="/smart-money-guide/#sources">Sources and coverage</Link></p></article>
 {!!related.length&&<section><h2>Continue reading</h2><div className={s.grid}>{related.map(r=><Link className={s.card} key={r.slug} href={insiderArticlePath(r)}><h3>{r.title}</h3><span>Read the article →</span></Link>)}</div></section>}
 </ResearchPage>;}
export function getStaticPaths(){return {paths:insiderArticles.map(a=>({params:{slug:a.slug}})),fallback:false};}
export function getStaticProps({params}:any){const article=findInsiderArticle(params.slug);return article?{props:{article,related:insiderArticles.filter(a=>a.slug!==article.slug&&!a.noActivity).slice(0,3).map(({slug,title})=>({slug,title}))}}:{notFound:true};}
