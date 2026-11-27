import {useRouter} from 'next/router';
import {useSiteLanguage} from '../lib/localization/use-site-language';
import {message} from '../lib/localization/translate';
import SpanishContent from './localization/SpanishContent';
import ShareControl from './ShareControl';
import {predictionSeo} from '../lib/prediction-seo';
import {illustrativeEventCalendar,seasonalEventPath,type PredictionEvent} from '../lib/prediction-events';
import {useState} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import PriceChart from './earnings/PriceChart';
import EarningsStyles from './earnings/EarningsStyles';
import StockResearchHub from './StockResearchHub';
import StockEarnings from './earnings/StockEarnings';
import StockPeerPerformance from './heatmap/StockPeerPerformance';
import RelatedStockResearch from './RelatedStockResearch';
import type {ResearchBundle} from '../lib/stock-research';
import type {Calendar} from '../lib/earnings';
import type {ResearchPreview} from '../lib/research';
import ResearchPage from './ResearchPage';
import StockAppCTA from './StockAppCTA';
import PredictionPeriodSelector from './PredictionPeriodSelector';
import type {Detail} from '../lib/earnings';
import type {Catalyst} from '../lib/stock-research';
import {predictionStocks,predictionPath,predictionName} from '../lib/stock-predictions';
import {periods,periodPath,projection,readableDate,horizonEnd,predictionContext,scenarios,scenarioStocks} from '../lib/prediction-periods';
import {breadcrumbs,jsonLd} from '../lib/seo';
import styles from '../styles/PredictionPeriods.module.css';
export type PeriodProps={stock:typeof predictionStocks[number];period:string;detail:Detail|null;today:string;events:Catalyst[];bundle:ResearchBundle;calendar:Calendar|null;items:ResearchPreview[]};
export default function PredictionPeriodPage({stock,period:initialPeriod,detail,today,events,bundle,calendar,items}:PeriodProps){
 const {language,href,t}=useSiteLanguage();
 const router=useRouter();
 const [period,setPeriod]=useState(initialPeriod);
 const changePeriod=(next:string)=>{setPeriod(next);void router.replace(href(periodPath(stock,next)),undefined,{shallow:true,scroll:false});const defaults=projection(detail,next,today);setGrowth(defaults?.growthRates[selected]??20);setValuation(defaults?.valuationRates[selected]??0);};
 const original=projection(detail,period,today);
 const [selected,setSelected]=useState(2);
 const [growth,setGrowth]=useState(()=>original?.growthRates[2]??20),[valuation,setValuation]=useState(0);
 const model=projection(detail,period,today,growth,valuation,selected);
 const researchBundle={...bundle,snapshot:bundle.snapshot?{...bundle.snapshot,detail}:null};
 const chooseScenario=(index:number)=>{setSelected(index);setGrowth(original?.growthRates[index]??10);setValuation(original?.valuationRates[index]??-3)};
 const selectedLabel=model?(model.long?model.labels[selected]:['Lower range','Reference case','Upper range'][selected]):'Price history';
 const englishContext=predictionContext(stock,detail);
 const context=language!=='en'?{...englishContext,focus:message('Earnings, valuation and outlook for {name}. Explore the horizon, the figures and the changes needed to support them.',language,{name:predictionName(stock)}),check:t('Compare revenue and per-share earnings growth with margins, investment, debt and the expectations reflected in the share price.'),up:t('Profitable growth, stronger cash generation and sustained valuation can support a higher price.'),down:t('Slower growth, margin pressure, dilution or a lower valuation multiple can reduce the share price.')}:englishContext;
 const name=stock.ticker==='NVDA'?'NVIDIA':predictionName(stock),path=href(periodPath(stock,period));
 const label=period==='tomorrow'?'tomorrow / next session':period==='2026'?'end of 2026':periods.find(p=>p.id===period)!.label.toLowerCase();
 const end=horizonEnd(period,today),expired=end<today;
 const {title,description}=predictionSeo(name,stock.ticker,t(label),language);




 const relevantEvents=events.filter(e=>e.date>=today&&e.date<=end);
 const knownEvents:PredictionEvent[]=[...relevantEvents.filter(e=>/CPI|PCE|PPI|GDP|payroll|jobs report|FOMC|Fed chair|retail sales|ISM|JOLTS/i.test(e.title)).map(e=>({id:e.id,date:e.date,title:e.title,kind:'macro' as const,sourceUrl:e.sourceUrl})),...(calendar?.items||[]).filter(e=>e.symbol===stock.ticker&&e.date>=today&&e.date<=end).map(e=>({id:'earnings-'+e.symbol+'-'+e.date,date:e.date,title:stock.ticker+' earnings (expected)',kind:'earnings' as const}))].sort((a,b)=>a.date.localeCompare(b.date));
 const chartEvents=illustrativeEventCalendar(knownEvents,today,end,stock.ticker);
 const projectedPoints=model?seasonalEventPath(model.points.map(point=>({date:point.date,close:[point.low,point.central,point.high][selected]})),chartEvents,true,detail?.prices||[],stock.ticker):[];
 const faq=[
  {q:`What is the ${name} stock price prediction for ${label}?`,a:`Explore the interactive ${stock.ticker} price chart and ${label} outlook, then compare earnings growth, valuation assumptions and company research. Select a scenario and adjust the controls to see how the projection changes. These are conditional illustrations, not analyst consensus or guaranteed prices.`},
  {q:`What growth is already priced into ${stock.ticker}?`,a:`A higher share price can already reflect strong growth expectations. In the long-term model, earnings growth raises the price while a falling valuation multiple offsets it. ${context.check} The default assumptions are sensitivity examples, not a claim about what the market expects.`},
  {q:`Will ${stock.ticker} fall before inflation data or an interest-rate decision?`,a:'The calendar does not predict direction. The optional seasonal and event overlay draws hypothetical dips and rebounds around available dates and estimated recurring windows. Seasonal tendencies and volatility use available history; event reactions and the simulated path are assumptions, not forecasts. Actual reactions can be positive, negative or absent.'},
  {q:`How should I use ${name} price predictions on Reddit?`,a:'Treat community posts as ideas to investigate. Check the author’s assumptions, price date, sources, position disclosures and track record. Compare claims with company filings; votes and comments are not evidence that a target will be reached.'},
  {q:'How often are the figures updated?',a:'Price data refreshes with website updates. Check the timestamp on the chart to see which price is available; this is not a streaming quote feed. The illustrative growth and valuation assumptions are a versioned methodology, not automatically revised analyst forecasts. Review short-term views when new prices or events arrive, and long-term assumptions after earnings or material changes—not only every six months.'},
  {q:'Does the chart include dividends, dilution or a guaranteed trading result?',a:'No. The chart shows price scenarios, excluding dividends, fees and taxes. Long-term growth is per share, so any dilution must be reflected in that assumption. The short-term ranges are not calibrated confidence intervals. Actual prices can fall outside every illustrated range.'},
 ];
 return <SpanishContent><ResearchPage title={title} path={path} description={description} noindex={expired||!detail?.priceDate||Date.parse(detail.priceDate)>Date.parse(today)||Date.parse(today)-Date.parse(detail.priceDate)>7*86400000} hideAppDownload predictionLayout>
 <Head><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd({'@context':'https://schema.org','@type':'WebPage',name:title,description,url:'https://www.stockstobuynow.ai'+path,about:{'@type':'Corporation',name:stock.name,tickerSymbol:stock.ticker},isAccessibleForFree:true,inLanguage:language==='en'?'en-US':language})}}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(breadcrumbs([{name:'Home',path:'/'},{name:'Stock predictions',path:'/prediction/'},{name:stock.ticker,path:predictionPath(stock)+'/'},{name:label,path}]))}}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd({'@context':'https://schema.org','@type':'FAQPage',mainEntity:faq.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}}))})}}/></Head>
 <div className="public-copy"><span className={styles.eyebrow}>{stock.ticker} · Price scenarios · {label}</span><h1 className={styles.heading}>{message('{name} stock price prediction for {period}: price chart & forecast',language,{name,period:t(label)})}</h1><p>{language!=='en'?context.focus:<>{context.focus}. Explore the horizon, the numbers and what would have to change to support them.</>}</p></div>{!detail&&<PredictionPeriodSelector stock={stock} selected={period}/>}
 <section className={`${styles.panel} ${styles.chartPanel}`} id={`${stock.ticker.toLowerCase()}-${period}-price-chart`}>
 <div className={styles.chartHeading}><h2>{message('{symbol} price chart and {period} outlook',language,{symbol:stock.ticker,period:t(label)})}</h2></div>
 <p>Explore the interactive price chart, compare scenarios and adjust the assumptions. The chart shows the available price and its timestamp.</p>
 {expired?<p>This period has ended. Choose a later period for current scenarios.</p>:period==='today'?<p>For today’s research and available alerts, sign up on desktop or get the app on mobile. No public intraday target is shown.</p>:!model?<p>A price range is unavailable until sufficiently recent prices and suitable history are available.</p>:<>


 </>}
 {detail&&<div className="earnings-page prediction-chart-shell" data-nosnippet=""><PriceChart key={stock.ticker} data={detail} predictionControls={model?.long&&!expired&&<div className={styles.controls}><label>EPS growth: {growth.toFixed(1)}% / year<input aria-label="Annual earnings per share growth" type="range" min="-20" max={Math.max(80,Math.ceil(growth))} step="0.1" value={growth} onChange={e=>setGrowth(Number(e.target.value))}/></label><label>Valuation change: {valuation}% / year<input aria-label="Annual valuation multiple change" type="range" min="-15" max="10" step="1" value={valuation} onChange={e=>setValuation(Number(e.target.value))}/></label></div>} periodAction={<ShareControl title={title} path={path}/>} predictionSelector={<PredictionPeriodSelector stock={stock} selected={period} compact onSelect={changePeriod}/>} initialPeriod={/^20/.test(period)?756:252} projection={model?{label:selectedLabel,color:scenarios[selected].color,points:projectedPoints,events:chartEvents}:undefined}/><EarningsStyles/></div>}

 <p className={styles.small}><Link prefetch={false} href={path}>Open or share this {label} prediction page →</Link></p>
 <p className={styles.small}>Blue: historical prices. Dashed lines: illustrations. Hover or tap the chart to see prices and dates. Reporting-date markers show historical earnings. The projection is a conditional illustration, not a predicted path.</p>
 {period==='tomorrow'&&<p className={styles.small}>“Next session” skips weekends and scheduled U.S. market holidays. Unscheduled closures may change the date.</p>}
 {model&&<details className={styles.alternatives}><summary>Compare the green, purple and red scenarios</summary><p>Select a scenario to show it on the chart and adjust its growth and valuation assumptions. These illustrations are not probabilities or guaranteed returns.</p><div className={styles.stats}>{[2,1,0].map(i=><button type="button" className={styles.scenarioButton} key={i} aria-pressed={selected===i} onClick={()=>chooseScenario(i)}><span style={{color:scenarios[i].color}}>{model.long?model.labels[i]:['Lower range','Reference case','Upper range'][i]}</span></button>)}</div></details>}

 </section>
 <StockAppCTA symbol={stock.ticker} pro/>

 <div data-nosnippet=""><StockResearchHub symbol={stock.ticker} name={name} bundle={researchBundle} afterFinancials={<section id="earnings"><StockEarnings symbol={stock.ticker} initialCalendar={calendar} detail={detail} hidePriceChart/></section>} earningsDate={calendar?.items.find(e=>e.date>=today)?.date}/>
 <StockPeerPerformance symbol={stock.ticker}/>
 <RelatedStockResearch items={items}/></div>
 <section className={styles.panel} id={`${stock.ticker.toLowerCase()}-${period}-fundamentals`}><h2>{message('What could change the {period} outcome?',language,{period:t(label)})}</h2><p>{context.check}</p><div className={styles.grid}><div><h3>What supports a higher price?</h3><p>{context.up}</p></div><div><h3>What could pull the price lower?</h3><p>{context.down}</p></div></div><p>{model?.long?`By ${end.slice(0,4)}, the result depends on the durability of per-share earnings growth and the valuation investors pay. Even growing earnings can produce a lower stock price when the multiple falls faster.`:'Over a short horizon, the surprise relative to expectations and positioning can matter more than a change in long-term business value.'}</p><a href={context.source} target="_blank" rel="noopener noreferrer">Review {name} company and earnings information ↗</a></section>
 <div data-nosnippet=""><section className={styles.panel} id={`${stock.ticker.toLowerCase()}-${period}-events`}><h2>{message('Events to watch for {period}',language,{period:t(label)})}</h2><p className={styles.small}>This watchlist uses the available calendar dates. The chart separately includes clearly labelled hypothetical recurring windows beyond the available dates.</p>{relevantEvents.length?<ul>{relevantEvents.map(e=><li key={e.id}><strong>{readableDate(e.date)} · {e.title}</strong><p>{e.watch} <a href={e.sourceUrl}>Source ↗</a></p></li>)}</ul>:<p>Check the current calendar for confirmed earnings and economic releases within this horizon. Dates can change; a scheduled release does not imply a dip or rally.</p>}<Link href="/stock-market-calendar/">Economic calendar →</Link>{' · '}<Link href={predictionPath(stock)+'/#earnings'}>{stock.ticker} earnings and peer analysis →</Link></section></div>
 <section className={styles.panel} id="scenario-methodology"><h2>How these numbers are calculated</h2><p>{model?.long?'Price scenario = reference price × (1 + annual earnings-per-share growth)^years × (1 + annual valuation-multiple change)^years. This normalized model tests how growth and what investors pay for that growth interact. It does not infer future earnings from a potentially inconsistent forward P/E.':'Short-term range = reference price × exp(± daily volatility × √estimated trading sessions). Daily volatility is the sample standard deviation of up to 60 recent daily log returns; the horizon uses a five-trading-days-per-seven-calendar-days approximation. No directional return is assumed.'}</p><p>For 2030, each featured upside price is a chosen illustration. The model works backward to find the required per-share earnings growth, assuming the valuation multiple declines 3% annually. The stretch case uses a higher chosen price and an unchanged valuation multiple; the downside case assumes declining earnings and valuation. Other long-term periods use common sensitivity presets. None are company guidance, analyst estimates, price floors or calibrated probabilities. Monthly patterns are estimated from available stock history, relative to its average monthly return, and reduced toward neutral because a few years are a small sample. Months with fewer than two observations have no fitted seasonal effect before centering. A repeatable simulation adds irregular rises and pullbacks scaled to observed daily volatility. Event swings remain hypothetical: a dip two calendar days before and a rebound two days after. Assumed swings are larger for inflation and earnings. Estimated recurring event windows extend beyond the published calendar; they are not confirmed dates or expected returns. The starting price and final target stay unchanged. The paths do not predict day-to-day fluctuations.</p><p>Prices refresh with available website data; the price timestamp remains visible on the chart. Review long-term assumptions after results and material changes, with a six-month review as a backstop. Short-term views need fresh prices and events rather than a once-monthly update.</p><p><a href={`https://www.nasdaq.com/market-activity/stocks/${stock.ticker.toLowerCase()}/historical`}>Compare historical market prices ↗</a>{' · '}<Link href="/methodology/">Research methodology</Link>{' · '}<Link href="/editorial-policy/">Editorial standards</Link></p></section>
 <section className={styles.panel} id={`${stock.ticker.toLowerCase()}-${period}-faq`}><h2>{name} prediction {label}: questions answered</h2>{faq.map(f=><details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</section>
 <section className={styles.panel}><h2>Compare other company scenarios</h2><div className={styles.links}>{scenarioStocks.filter(s=>s.ticker!==stock.ticker).map(s=><Link key={s.ticker} href={periodPath(s,period)}>{s.ticker} · {label} →</Link>)}</div><p><Link href={predictionPath(stock)+'/'}>All {stock.ticker} prediction research →</Link></p></section>
 {period!=='today'&&<StockAppCTA symbol={stock.ticker}/>}
 </ResearchPage></SpanishContent>;
}
