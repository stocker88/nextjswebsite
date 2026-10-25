import Head from 'next/head';
import Link from 'next/link';
import ResearchPage from './ResearchPage';
import HormuzTransitCard from './HormuzTransitCard';
import PentagonPizzaCard from './PentagonPizzaCard';
import {SITE,breadcrumbs,jsonLd} from '../lib/seo';
import s from '../styles/AlternativeIndicators.module.css';
const content={
 hormuz:{path:'/hormuz-transit-index/',title:'Hormuz Transit Index: Shipping History & Stock Research',heading:'Hormuz transit. A clearer view of the flow.',description:'Track Strait of Hormuz vessel crossings, tanker traffic and one-year history. Explore shipping trends and their role in oil, energy and stock-market research.',label:'SHIPPING · ENERGY · MARKET CONTEXT',intro:'Follow daily vessel crossings through the Strait of Hormuz, compare tanker activity and explore how shipping conditions fit into your stock research.',questions:[
 ['What does the Hormuz Transit Index measure?','The tracker shows daily AIS-based vessel crossings through the Strait of Hormuz. Total crossings include tankers and other tracked vessel types. The seven-day average smooths daily variation; tanker counts are a subset of the total, not an additional figure.'],
 ['Can Hormuz transit predict which stocks to buy?','Transit activity is context for stock-market predictions, not a standalone buy or sell signal. A vessel count does not tell you cargo volume, company earnings or the direction of a stock price. Compare the trend with energy prices, company disclosures, valuation and the wider market before forming an investment view.'],
 ['How should investors use the history?','Switch between one month, three months and one year to compare recent activity with a longer period. Inspect both total crossings and tanker traffic. A change in traffic is a research question; the chart does not establish its cause.'],
 ['How often is the tracker refreshed?','The backend checks for updated observations every six hours. The chart displays the latest observation date because reported transit data can lag the current day. Missing days remain gaps, and the seven-day average requires seven consecutive daily observations.']
 ]},
 pizza:{path:'/pentagon-pizza-index/',title:'Pentagon Pizza Index: Activity Tracker & Market Context',heading:'The pizza index. Curiosity, with context.',description:'Explore the Pentagon Pizza Index, activity near the Pentagon and available historical trends. Understand its limits for geopolitical and stock-market predictions.',label:'ALTERNATIVE DATA · ACTIVITY · RESEARCH',intro:'Explore reported activity at pizza shops near the Pentagon, with a combined history chart and a clear distinction between measured observations and speculation.',questions:[
 ['What is the Pentagon Pizza Index?','The Pentagon Pizza Index tracks reported activity at selected pizza shops near the Pentagon. It is an unconventional activity indicator, not verified Pentagon orders, deliveries or spending.'],
 ['Does the pizza index predict military events or stock prices?','This tracker does not establish that pizza-shop activity predicts military action or stock returns. It should not be used on its own to decide which stocks to buy. Use it as a curiosity alongside independently verified news and company research.'],
 ['How is the combined activity calculated?','Each reporting shop contributes equally to the average of activity relative to its usual level. A reading of 100% means usual activity. At least half of the tracked shops must report for a combined observation to be recorded; daily history averages valid observations in UTC.'],
 ['Why might the chart show no data?','The feed can return no valid observations. Unavailable readings are not treated as zero, and historical activity is not invented or replaced with typical weekday patterns. Valid observations are checked every ten minutes. The 1Y view shows available measured history, not a guarantee of a full year of coverage.']
 ]}
};
export default function AlternativeIndicatorPage({kind}:{kind:'hormuz'|'pizza'}){
 const c=content[kind];
 return <ResearchPage title={c.title} description={c.description} path={c.path} socialImageUrl={`${SITE}/assets/images/${kind}-index-social.png`} socialImageAlt={kind==='hormuz'?'Hormuz Transit Index: vessel crossings and history':'Pentagon Pizza Index: activity and market context'}>
 <Head><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(breadcrumbs([{name:'Home',path:'/'},{name:kind==='hormuz'?'Hormuz Transit Index':'Pentagon Pizza Index',path:c.path}]))}}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd({'@context':'https://schema.org','@type':'FAQPage',mainEntity:c.questions.map(([name,text])=>({'@type':'Question',name,acceptedAnswer:{'@type':'Answer',text}}))})}}/></Head>
 <header className={s.hero}><span className={s.eyebrow}>{c.label}</span><h1>{c.heading}</h1><p>{c.intro}</p><nav className={s.links} aria-label="Alternative indicators"><Link href="/hormuz-transit-index/">Hormuz transit →</Link><Link href="/pentagon-pizza-index/">Pentagon pizza →</Link></nav></header>
 {kind==='hormuz'?<HormuzTransitCard/>:<PentagonPizzaCard/>}
 <section className={s.explainer}><span className={s.eyebrow}>READ THE DATA</span><h2>{kind==='hormuz'?'From shipping trends to stock research':'What the pizza index can tell you'}</h2>{c.questions.map(([q,a])=><article key={q}><h3>{q}</h3><p>{a}</p></article>)}</section>
 <aside className={s.related}><h2>Build the rest of your investment view</h2><p>Pair alternative indicators with company fundamentals, market performance and upcoming events.</p><nav className={s.links}><Link href="/stocks-to-buy/">Stocks to buy: research ideas →</Link><Link href="/stock-market-heatmap/">Explore the stock market →</Link><Link href="/stock-market-calendar/">Market calendar →</Link></nav></aside>
 </ResearchPage>
}
