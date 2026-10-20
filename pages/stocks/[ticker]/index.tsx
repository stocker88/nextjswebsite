import Head from 'next/head';
import Link from 'next/link';
import ResearchPage from '../../../components/ResearchPage';
import StockEarnings from '../../../components/earnings/StockEarnings';
import StockResearchHub from '../../../components/StockResearchHub';
import StockAppCTA from '../../../components/StockAppCTA';
import {stocks,findStock,recentStockNews} from '../../../lib/stocks';
import {loadStockResearch,loadStockEarnings} from '../../../lib/stock-research-server';
import type {ResearchBundle} from '../../../lib/stock-research';
import {decimal,type Calendar} from '../../../lib/earnings';
import {fetchResearch} from '../../../lib/research-server';
import {researchUrl,ResearchPreview} from '../../../lib/research';
import {breadcrumbs,jsonLd,displayDate,SITE} from '../../../lib/seo';
import styles from '../../../styles/StockResearch.module.css';
export default function Stock({stock,items,bundle,calendar}:{stock:(typeof stocks)[number];items:ResearchPreview[];bundle:ResearchBundle;calendar:Calendar|null}){
 const path=`/stocks/${stock.slug}`,d=bundle.snapshot?.detail;
 const next=calendar?.items.filter(e=>e.date>=bundle.today).sort((a,b)=>a.date.localeCompare(b.date))[0];
 const title=`${stock.name} (${stock.ticker}) stock: financials, technicals & earnings`;
 const description=`Explore ${stock.name} (${stock.ticker}) stock price history, financial statements, technical indicators, earnings, event catalysts, macro trends and peer comparisons.`;
 const faq=[{q:`Where can I see ${stock.ticker} financials and technical analysis?`,a:`The financials section shows saved revenue, earnings and balance-sheet metrics. The technicals section includes price history, moving averages, RSI, MACD and Bollinger Bands, with dates for the available observations.`},{q:`When does ${stock.name} report earnings?`,a:next?`The saved calendar lists the next expected report for ${next.date}. Dates can change; review the earnings section and confirm with company investor relations.`:`The next expected date is not available in the saved calendar. Check company investor relations for the latest reporting schedule.`},{q:`Is this a live ${stock.ticker} stock price or a guaranteed prediction?`,a:`Prices and financials are dated snapshots, not live quotes. Forecasts depend on assumptions about future results, valuation and market conditions; no outcome is guaranteed.`}];
 return <ResearchPage title={title} description={description} path={path} stockPage>
 <Head><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd([breadcrumbs([{name:'Home',path:'/'},{name:'Stocks',path:'/stocks'},{name:stock.ticker,path}]),{'@context':'https://schema.org','@type':'WebPage',name:title,url:SITE+path,description,about:{'@type':'Corporation',name:stock.name,tickerSymbol:stock.ticker},hasPart:['financials','technicals','catalysts','macro','peers'].map(id=>({'@type':'WebPageElement',name:id,url:SITE+path+'#'+id}))},{'@context':'https://schema.org','@type':'FAQPage',mainEntity:faq.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}}))}])}}/></Head>
 <header className={styles.hero}><span className={styles.eyebrow}>{d?.sector||'COMPANY RESEARCH'}{d?.industry?' / '+d.industry:''}</span><h1>{stock.name} (<span data-stock-symbol={stock.ticker}>{stock.ticker}</span>) stock research</h1><p>{stock.overview}</p>{d?.price!=null&&<div className={styles.quote}><strong>{decimal(d.price)}</strong><span>{d.currency||'Currency unconfirmed'}</span><small>Price snapshot · {d.priceDate||'Date unavailable'} · Not live</small></div>}<nav className={styles.nav} aria-label={`${stock.ticker} research sections`}>{[['earnings','Earnings'],['financials','Financials'],['technicals','Technicals'],['catalysts','Event catalysts'],['macro','Macro'],['peers','Compare peers']].map(([id,label])=><a key={id} href={'#'+id}>{label}</a>)}<Link href={`${path}/forecast`}>Forecast scenarios ↗</Link></nav></header>
 <div id="earnings" style={{scrollMarginTop:120}}><StockEarnings symbol={stock.ticker} initialCalendar={calendar} detail={d} compact/></div>
 <StockResearchHub symbol={stock.ticker} name={stock.name} bundle={bundle} earningsDate={next?.date}/>
 <div className="public-copy"><h2>What can move {stock.ticker}?</h2><p>A price move may reflect company news, sector conditions or changes in the wider market. Review these business drivers alongside the dated figures above.</p><ul>{stock.drivers.map(driver=><li key={driver}>{driver}</li>)}</ul>
 {items.length>=5&&<><h2>Recent {stock.name} research headlines</h2><p>Archive entries retain their original dates. Headlines alone do not confirm why a stock moved.</p><ul>{items.map(item=><li key={item.id}><Link href={researchUrl(item.id,item.title)}>{item.title}</Link><br/><small>{displayDate(item.time)}</small></li>)}</ul></>}
 <h2>{stock.ticker} forecasts & valuation scenarios</h2><p>Consider how different earnings and valuation assumptions could affect the share price. Compare those scenarios with the company’s financial results, competitors and upcoming catalysts.</p><p><Link href={`${path}/forecast`}>Explore {stock.ticker} forecast scenarios →</Link> · <Link href={`${path}/earnings`}>Read {stock.ticker} earnings research →</Link></p><p><a href={stock.investorUrl}>Company investor relations ↗</a> · <Link href="/methodology">Research methodology</Link> · <Link href="/editorial-policy">Editorial standards</Link></p></div>
 <section className={styles.faq} aria-label={`${stock.ticker} research questions`}><h2>Common questions about {stock.ticker}</h2>{faq.map(f=><details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</section>
 <StockAppCTA symbol={stock.ticker}/>
 </ResearchPage>;
}
export function getStaticPaths(){return {paths:stocks.map(s=>({params:{ticker:s.slug}})),fallback:false};}
export async function getStaticProps({params}:{params:{ticker:string}}){const stock=findStock(params.ticker);if(!stock)return {notFound:true};return {props:{stock,items:recentStockNews(await fetchResearch(),stock.ticker),bundle:loadStockResearch(stock.ticker),calendar:loadStockEarnings(stock.ticker)},revalidate:3600};}
