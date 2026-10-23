import StockResults from '../../components/StockResults';
import EditorialPhoto from '../../components/EditorialPhoto';
import Head from 'next/head';
import Link from 'next/link';
import ResearchPage from '../../components/ResearchPage';
import StockLogo from '../../components/StockLogo';
import ResearchImages from '../../components/ResearchImages';
import {type InstrumentResearchProps} from '../../components/InstrumentResearch';
import CompanyResearchSection from '../../components/CompanyResearchSection';
import StockAppCTA from '../../components/StockAppCTA';
import {MoverArticle,moverArticles,moverArticleUrl,moverArticleSchema} from '../../lib/mover-research';
import {stockPageHref} from '../../lib/stock-page';
import {jsonLd,breadcrumbs} from '../../lib/seo';
import {catalog} from '../../lib/catalog';
import {loadStockResearch,loadStockEarnings} from '../../lib/stock-research-server';
import {recentStockNews} from '../../lib/stocks';
import {fetchResearch} from '../../lib/research-server';
import styles from '../../styles/MoverStory.module.css';

export default function MoverStory({article:a,research}:{article:MoverArticle;research:InstrumentResearchProps|null}){
 const path=moverArticleUrl(a);
 const money=(v:number)=>v.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2});
 const date=(value:string)=>new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'America/New_York'}).format(new Date(value));
 const time=(value:string)=>new Intl.DateTimeFormat('en-US',{hour:'numeric',minute:'2-digit',timeZone:'America/New_York'}).format(new Date(value));
 const session=date(a.sessionDate+'T12:00:00Z');
 return <ResearchPage title={a.title} path={path} description={a.summary} socialImageUrl={a.leadImage?.url||a.images[0].url} socialImageAlt={a.leadImage?.alt||a.images[0].alt} socialImageWidth={a.leadImage?.width||1200} socialImageHeight={a.leadImage?.height||1200} ogType="article" hideAppDownload>
 <Head><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(moverArticleSchema(a))}}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(breadcrumbs([{name:'Home',path:'/'},{name:'Stock Movers News',path:'/news/'},{name:a.title,path}]))}}/><meta property="article:published_time" content={a.publishedAt}/><meta property="article:modified_time" content={a.updatedAt}/></Head>
 <article className={styles.story}>
 <Link className={styles.back} href="/news/">← Stock movers news</Link>
 <header className={styles.hero}>
 <div className={styles.topline}><span className={styles.tag}>{a.earningsPeriod?'Earnings results':'Market movers'}</span><time dateTime={a.sessionDate}>{session}</time></div>
 <div className={styles.identity}><StockLogo symbol={a.symbol} src={'/assets/logo/'+encodeURIComponent(a.symbol)+'.webp'}/><span><strong>{a.companyName}</strong><small>{a.symbol} · {research?.item.industry||a.stockContext.industry}</small></span></div>
 <h1>{a.title}</h1>
 <p className={styles.byline}>By {a.author.name}<span>Published <time dateTime={a.publishedAt}>{date(a.publishedAt)} · {time(a.publishedAt)} ET</time></span></p>
 <div className={styles.quote}>
 {a.move!==null&&a.quotePrice!==null&&a.quoteAsOf!==null?<>
 <div><span className={styles.label}>Price snapshot</span><strong>{money(a.quotePrice)}</strong></div>
 <div className={a.move>0?styles.up:styles.down}><span className={styles.label}>{a.marketSession==='afterhours'?'After-hours move':'Session move'}</span><strong>{a.move>0?'↑ +':'↓ '}{a.move.toFixed(2)}%</strong></div>
 <p><time dateTime={a.quoteAsOf}>{date(a.quoteAsOf)}<br/>{time(a.quoteAsOf)} ET</time><span>Delayed snapshot</span></p>
 </> : <div><span className={styles.label}>Reported quarter</span><strong>{a.earningsPeriod}</strong></div>}
 </div>
 {a.kind!=='earnings_review'&&<p className={styles.note}>{a.marketSession==='afterhours'?<>After-hours change versus the {session} regular close of {money(a.regularClose!)}.</>:<>“Today” refers to the {session} U.S. market session.</>}</p>}
 <nav className={styles.jumps} aria-label="In this research"><a href="#recap">The recap</a><a href="#reports">Financials & technicals</a><a href="#company-research">Explore {a.symbol} ↓</a></nav>
 </header>
 <EditorialPhoto photo={a.leadImage} priority/>
 <section className={styles.textSection}><span className={styles.kicker}>THE CATALYST</span><h2>{a.kind==='earnings_review'?'What the company reported':a.earningsPeriod?'Earnings and the stock move':'What is behind the stock move?'}</h2><p>{a.catalyst}</p></section>
 <section id="recap" className={styles.recap}><span className={styles.kicker}>AT A GLANCE</span><h2>{a.earningsPeriod?a.earningsPeriod+' earnings recap':'Latest company research'}</h2><p>{a.recap[0]}</p><ul>{a.recap.slice(1,7).map((point,i)=><li key={i}>{point}</li>)}</ul><p>{a.recap[7]}</p></section>
 <section id="reports" className={styles.reports}><span className={styles.kicker}>THE VISUAL RESEARCH</span><h2>{a.kind==='earnings_review'?'Financials, technicals and earnings':'Financials and technicals'}</h2><p className={styles.note}>Charts through {/^\d{4}-\d{2}-\d{2}$/.test(a.technicalDate)?date(a.technicalDate+'T12:00:00Z'):a.technicalDate}. {a.kind!=='earnings_review'&&'The session move above may reflect later news.'}</p>
 <ResearchImages appOnly={false} images={a.images.map(image=>({url:image.url,filename:image.title+'.png',width:image.width,height:image.height}))}/>
</section>
 <section className={styles.textSection}><span className={styles.kicker}>WHAT TO WATCH</span><h2>Technical setup and risks</h2><p>{a.setup}</p></section>
 <p className={styles.disclosure}>{a.disclosure}</p>
 </article>
 <StockResults symbol={a.symbol}/>
 <div id="company-research">{research?<CompanyResearchSection research={research}/>:<StockAppCTA symbol={a.symbol}/>}</div>
 </ResearchPage>;
}
export function getStaticPaths(){return {paths:moverArticles.map(a=>({params:{slug:a.slug}})),fallback:false};}
export async function getStaticProps({params}:{params:{slug:string}}){
 const article=moverArticles.find(a=>a.slug===params.slug);if(!article)return {notFound:true};
 const item=catalog.find(i=>i.symbol===article.symbol);
 const research=item?{item,news:recentStockNews(await fetchResearch(),item.symbol),bundle:item.type==='EQUITY'?loadStockResearch(item.symbol):null,calendar:item.type==='EQUITY'?loadStockEarnings(item.symbol):null}:null;
 return {props:{article,research}};
}
