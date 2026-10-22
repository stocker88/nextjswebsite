import Head from 'next/head';
import Link from 'next/link';
import ResearchPage from '../../components/ResearchPage';
import MoverNewsList from '../../components/MoverNewsList';
import {MoverArticle,moverArticles,moverArticleUrl,moverArticleSchema} from '../../lib/mover-research';
import {stockPageHref} from '../../lib/stock-page';
import {jsonLd,breadcrumbs} from '../../lib/seo';
export default function MoverStory({article:a}:{article:MoverArticle}){
 const c=a.stockContext;const path=moverArticleUrl(a);const money=(v:number)=>v.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2});
 const quoted=new Intl.DateTimeFormat('en-US',{dateStyle:'medium',timeStyle:'short',timeZone:'America/New_York'}).format(new Date(a.quoteAsOf));
 return <ResearchPage title={a.title} path={path} description={a.summary} socialImageUrl={a.images[0].url} socialImageAlt={a.images[0].alt} socialImageWidth={1200} socialImageHeight={1200} ogType="article">
 <Head><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(moverArticleSchema(a))}}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(breadcrumbs([{name:'Home',path:'/'},{name:'Stock Movers News',path:'/news/'},{name:a.title,path}]))}}/><meta property="article:published_time" content={a.publishedAt}/><meta property="article:modified_time" content={a.updatedAt}/></Head>
 <article className="mover-story"><Link href="/news/">← Stock movers news</Link><p className="eyebrow">{a.symbol} · {a.earningsPeriod?'EARNINGS RESULTS':'MARKET MOVERS'} · {a.sessionDate}</p><h1>{a.title}</h1>
 <p className="meta">By {a.author.name} · Published <time dateTime={a.publishedAt}>{new Date(a.publishedAt).toISOString().slice(0,16).replace('T',' ')} UTC</time></p>
 <div className="move" data-direction={a.direction}><span>{a.symbol} {a.move>0?'+':''}{a.move.toFixed(2)}%</span><p>{money(a.quotePrice)} · Snapshot as of <time dateTime={a.quoteAsOf}>{quoted} New York time</time></p></div>
 <p className="meta">This is a dated snapshot, not a live quote. “Today” refers to the {a.sessionDate} U.S. market session.</p>
 <h2>{a.earningsPeriod?'Earnings and the stock move':'What is behind the stock move?'}</h2><p>{a.catalyst}</p>
 <h2>{a.earningsPeriod?a.earningsPeriod+' earnings recap':'Latest company research'}</h2><p>{a.recap[0]}</p><ul>{a.recap.slice(1,7).map((point,i)=><li key={i}>{point}</li>)}</ul><p>{a.recap[7]}</p>
 <h2>Financials and technicals</h2><p>Technical charts use the {a.technicalDate} completed close. The intraday move above may reflect news released after that close.</p>
 <div className="report-images">{a.images.map((image,i)=><figure key={image.url}><h3>{image.title}</h3><a href={image.url} target="_blank" rel="noopener noreferrer" aria-label={'Open full-size '+a.symbol+' '+image.title}><img src={image.url} alt={image.alt} width="1200" height="1200" loading={i===0?'eager':'lazy'}/></a><figcaption>{image.title} · Open image to inspect the full-size report.</figcaption></figure>)}</div>
 <h2>{a.companyName} ({a.symbol}) stock information</h2><p>{c.business}</p><p>{c.industry}. Financial and valuation snapshot at the {c.priceDate} completed close; estimates and reporting dates are shown in the financial infographic.</p>
 <dl><div><dt>Completed close · {c.priceDate}</dt><dd>{money(c.close)}</dd></div><div><dt>Indicative market capitalization</dt><dd>${c.marketCapB.toFixed(2)} billion</dd></div><div><dt>{c.fiscalLabel} revenue</dt><dd>${c.annualRevenueB.toFixed(2)} billion</dd></div>{c.ttmPE>0&&<div><dt>P/E · TTM GAAP</dt><dd>{c.ttmPE.toFixed(2)}×</dd></div>}{c.forwardPE>0&&<div><dt>Forward P/E · FY{c.forwardYear}E</dt><dd>{c.forwardPE.toFixed(2)}×</dd></div>}<div><dt>RSI (14) · {c.priceDate}</dt><dd>{c.rsi14.toFixed(1)}</dd></div></dl>
 <p><Link href={stockPageHref(a.symbol)}>Explore {a.companyName} stock financials, earnings and research →</Link></p>
 <h2>Technical setup and risks</h2><p>{a.setup}</p>
 <h2>Research references</h2><ul>{a.sources.map((source,i)=><li key={source.url+'_'+i}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a></li>)}</ul><p className="meta">{a.disclosure}</p>
 <div className="app-link"><h2>Follow the research in the app</h2><p>Open this report and follow the discussion.</p><a href={'/insight_details_page?postId='+encodeURIComponent(a.postId)+'&utm_source=website&utm_medium=organic&utm_campaign=mover_research'}>Open {a.symbol} research in the app →</a></div>
 <MoverNewsList symbol={a.symbol}/></article>
 <style jsx>{`.mover-story{max-width:1100px;margin:auto}.mover-story h1{font-size:clamp(32px,5vw,52px);line-height:1.15}.mover-story h2{margin-top:36px;font-size:28px}.mover-story p,.mover-story li{font-size:18px;line-height:1.75;color:#c6d1e3}.mover-story li{margin:12px 0}.mover-story :global(a){color:#a5d6ff}.meta{font-size:14px!important;color:#9fafc8!important}.eyebrow{font-size:14px!important;letter-spacing:.1em;color:#a9b7ff!important}.move{padding:24px;border:1px solid #33506a;border-radius:18px;background:#101e32}.move span{font-size:36px;color:#74e4b6}.move[data-direction=down] span{color:#ff929f}.move p{margin-bottom:0}.report-images{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}.report-images figure{margin:0}.report-images img{display:block;width:100%;height:auto;border-radius:14px}.report-images figcaption{font-size:14px;color:#afbdd4;margin-top:10px}.report-images h3{font-size:22px}dl{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}dl div{padding:20px;background:#111e32;border-radius:14px}dt{color:#afbdd4;font-size:14px}dd{margin:10px 0 0;font-size:24px}.app-link{padding:24px;background:#202242;border:1px solid #60528d;border-radius:18px;margin-top:32px}@media(max-width:700px){.report-images{grid-template-columns:1fr}dl{grid-template-columns:repeat(2,minmax(0,1fr))}.mover-story p,.mover-story li{font-size:17px}}`}</style>
 </ResearchPage>
}
export function getStaticPaths(){return {paths:moverArticles.map(a=>({params:{slug:a.slug}})),fallback:false};}
export function getStaticProps({params}:{params:{slug:string}}){const article=moverArticles.find(a=>a.slug===params.slug);return article?{props:{article}}:{notFound:true};}
