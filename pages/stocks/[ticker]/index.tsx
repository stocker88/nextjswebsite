import {predictionSeo} from '../../../lib/prediction-seo';
import {catalog} from '../../../lib/catalog';
import {projection} from '../../../lib/prediction-periods';
import PredictionPeriodSelector from '../../../components/PredictionPeriodSelector';
import {stockPageHref} from '../../../lib/stock-page';
import {predictionPath, predictionName} from '../../../lib/stock-predictions';
import StockSmartMoney from '../../../components/StockSmartMoney';
import RelatedStockResearch from '../../../components/RelatedStockResearch';
import StockPeerPerformance from '../../../components/heatmap/StockPeerPerformance';
import StockEarnings from '../../../components/earnings/StockEarnings';
import Head from "next/head";
import Link from "next/link";
import ResearchPage from "../../../components/ResearchPage";
import StockResearchHub from '../../../components/StockResearchHub';
import StockAppCTA from '../../../components/StockAppCTA';
import {loadStockResearch,loadStockEarnings} from '../../../lib/stock-research-server';
import type {ResearchBundle} from '../../../lib/stock-research';
import type {Calendar} from '../../../lib/earnings';
import { stocks, findStock } from "../../../lib/stocks";
import {recentStockNews} from "../../../lib/stock-related-research";
import { fetchResearch } from "../../../lib/research-server";
import { researchUrl, ResearchPreview } from "../../../lib/research";
import { breadcrumbs, jsonLd, displayDate } from "../../../lib/seo";
export default function Stock({
  stock,
  items,
  bundle,
  calendar,
  predictionPage = false,
  predictionPeriodsAvailable = false,
}: {
  stock: (typeof stocks)[number];
  items: ResearchPreview[];
  bundle: ResearchBundle;
  calendar: Calendar | null;
  predictionPage?: boolean;
  predictionPeriodsAvailable?: boolean;
}) {
  const path = stockPageHref(stock.ticker).replace(/\/$/,'');
  const cachedOnly=predictionPage&&!catalog.some(s=>s.symbol===stock.ticker);
  const companyPath=cachedOnly?predictionPath(stock)+'/#stock-analysis':path;
  const longScenario=predictionPage&&predictionPeriodsAvailable?projection(bundle.snapshot?.detail||null,'2030',bundle.today):null;
  const {title:predictionTitle,description:predictionDescription}=predictionSeo(predictionName(stock),stock.ticker);
  const curated = stocks.some(item=>item.ticker===stock.ticker);
  const earningsPath = curated ? `${path}/earnings` : '#earnings';
  const canonicalPath = predictionPage ? predictionPath(stock) + "/" : path;
  const outlookYear = Number(bundle.today.slice(0,4)) + 1;
  const researchDate = new Date(`${bundle.today}T12:00:00Z`);
  const upcomingMonths = Array.from({length: 3}, (_, offset) => {
    const month = new Date(Date.UTC(researchDate.getUTCFullYear(), researchDate.getUTCMonth() + offset + 1, 1));
    return month.toLocaleDateString('en-US', {month: 'long', year: 'numeric', timeZone: 'UTC'});
  });
  return (
    <ResearchPage
      title={predictionPage ? predictionTitle : `${stock.name} (${stock.ticker}) Stock Research & Earnings`}
      path={canonicalPath}
      hideAppDownload
      description={predictionPage ? predictionDescription : `Explore ${stock.name} (${stock.ticker}) earnings, financials, technicals, insider activity and related research. Review the stock outlook and valuation drivers.`}
    >
      <Head>
        {predictionPage&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd({'@context':'https://schema.org','@type':'WebPage',name:predictionTitle,url:`https://www.stockstobuynow.ai${canonicalPath}`,about:{'@type':'Corporation',name:stock.name,tickerSymbol:stock.ticker},isAccessibleForFree:true,inLanguage:'en-US'})}}/>}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd(
              breadcrumbs([
                { name: "Home", path: "/" },
                { name: "Stocks", path: "/stocks" },
                { name: stock.ticker, path: companyPath },
                ...(predictionPage ? [{name: 'Stock price prediction', path: canonicalPath}] : []),
              ]),
            ),
          }}
        />
      </Head>
      <div className="public-copy">
        <h1>
          {predictionPage ? predictionName(stock) : stock.name} (<span data-stock-symbol={stock.ticker}>{stock.ticker}</span>) {predictionPage ? 'stock price prediction' : 'stock research'}
        </h1>
        <p>{stock.overview}</p>
        <p>
          <Link href={earningsPath}>Earnings research</Link> ·{" "}
          <Link href={predictionPage ? companyPath : predictionPath(stock)}>{predictionPage ? "Company research overview" : "Stock price prediction & scenarios"}</Link> · <Link href="/prediction/">Search predictions</Link> ·{" "}
          {stock.investorUrl&&<a href={stock.investorUrl}>Company investor relations</a>}
        </p>
      </div>
{predictionPage&&predictionPeriodsAvailable&&<PredictionPeriodSelector stock={stock}/>}
{longScenario&&<div className="public-copy"><h2>Explore {stock.ticker} stock price predictions for 2030</h2><p>Explore the interactive chart, compare growth and valuation assumptions, and review alternative scenarios alongside company research.</p><Link href={predictionPath(stock)+"/2030/"}>Explore the 2030 price chart and forecast →</Link></div>}
<div id="earnings" data-nosnippet={predictionPage?"":undefined} style={{scrollMarginTop:120}}><StockEarnings symbol={stock.ticker} initialCalendar={calendar} detail={bundle.snapshot?.detail}/></div>
      <div id="stock-analysis" data-nosnippet={predictionPage?"":undefined}><StockResearchHub financialsFirst={predictionPage} symbol={stock.ticker} name={stock.name} bundle={bundle} earningsDate={calendar?.items.filter(e=>e.date>=bundle.today).sort((a,b)=>a.date.localeCompare(b.date))[0]?.date}/></div>
      <div id="insider-research" data-nosnippet={predictionPage?"":undefined}><StockSmartMoney symbol={stock.ticker}/></div>
      <div className="public-copy">
        <h2>What can move {stock.ticker}?</h2>
        <p>
          A price move may reflect company news, sector conditions or changes in
          the wider market. Check the timing and primary evidence before
          attributing a move to one headline.
        </p>
        <ul>
          {stock.drivers.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
        {predictionPage ? <section id="price-prediction" aria-labelledby="prediction-heading">
          <h2 id="prediction-heading">{stock.name} stock price prediction: {outlookYear} outlook</h2>
          <p>What could {stock.ticker} be worth in {outlookYear}? A useful prediction starts with dated operating assumptions and a valuation range. This section is a research framework, not a published numerical price target. Use the company’s financial results and guidance to test the assumptions.</p>
          <nav aria-label="Stock prediction time horizons">
            <a href="#tomorrow-outlook">Tomorrow</a>{' · '}<a href="#weekly-outlook">Next week</a>{' · '}<a href="#monthly-outlook">Next month</a>{' · '}<a href="#annual-outlook">{outlookYear}</a>
          </nav>
          <h3 id="tomorrow-outlook">{stock.ticker} stock price prediction for tomorrow</h3>
          <p>For the next trading session, review company news, overnight market moves, trading volume and technical levels alongside the latest dated quote. A move before the open can reverse during regular trading. On weekends and market holidays, the next trading session is not necessarily tomorrow.</p>
          <p><a href="#stock-news">Review {stock.ticker} news</a>{' · '}<a href="#stock-analysis">Review technical analysis</a></p>
          <h3 id="weekly-outlook">{stock.ticker} stock outlook for next week</h3>
          <p>Check whether earnings, company announcements or economic releases fall within the coming week. Compare {stock.ticker} with industry peers to distinguish company-specific moves from a sector-wide shift. A weekly view should identify the catalyst, the scenario it supports and what would invalidate that view.</p>
          <p><a href="#earnings">Check earnings dates and results</a>{' · '}<a href="#peer-performance">Compare industry performance</a>{' · '}<Link href="/stock-market-calendar">Review the market calendar</Link></p>
          <h3 id="monthly-outlook">{stock.name} stock prediction for next month and the coming months</h3>
          <p>For {upcomingMonths[0]}, {upcomingMonths[1]} and {upcomingMonths[2]}, review the earnings calendar, changes in company guidance and the trend in valuation and price. These are research windows, not separate monthly price targets. Reassess the outlook when new results or disclosures change the assumptions.</p>
          <p>Compare insider purchases and sales with their disclosure dates and any verified trading-plan status. Unusual options volume can help identify activity worth investigating, but volume alone does not establish a bullish or bearish forecast.</p>
          <p><a href="#insider-research">Review available insider and fund activity</a>{' · '}<Link href={earningsPath}>Explore earnings research</Link></p>
          <h3 id="annual-outlook">{stock.name} stock price prediction for next year: {outlookYear}</h3>
          <p>A longer-term outlook depends on how the business develops and what investors are willing to pay for its earnings or cash flow. Review revenue growth, margins, debt, dilution and capital investment, then test a range of valuation assumptions. A strong business can still underperform if its share price already assumes stronger results.</p>
          <h3>What to watch for {stock.ticker}</h3>
          <p>{stock.drivers.join('; ')}. Compare changes in these drivers with the assumptions behind any forecast, rather than relying on a target price alone.</p>
          {stock.ticker==='SNDK'&&<p>For Sandisk, distinguish stronger shipment volumes from higher NAND selling prices: they can affect revenue and profitability differently. Check whether margin gains are supported by manufacturing costs and product mix, and whether cash generation keeps pace with investment. Its <a href="https://investor.sandisk.com/events/event-details/2026-sandisk-investor-day">2026 Investor Day materials</a> provide company presentations on NAND technology, market demand and its financial model; they are not a {outlookYear} stock-price guarantee.</p>}
          <h3>2026, 2027, 2028, 2029 and 2030: a longer-term research roadmap</h3>
          <p>These calendar-year checkpoints describe what to investigate, not calculated share-price forecasts. As a year passes, compare the assumptions with reported results. Later years depend on more uncertain growth, profitability and valuation assumptions.</p>
          <dl>
            <dt>2026: establish the starting point</dt><dd>Review reported results, the latest dated share price and the valuation already implied by the market.</dd>
            <dt>2027: test company execution</dt><dd>Track {stock.drivers[0].toLowerCase()} against guidance and assess {stock.drivers[1].toLowerCase()} as new results become available.</dd>
            <dt>2028: assess durability</dt><dd>Review whether growth can translate into sustainable cash flow, considering {stock.drivers[2].toLowerCase()}.</dd>
            <dt>2029: reassess competitive and financial risks</dt><dd>Stress-test the outlook against {stock.drivers[3].toLowerCase()}, funding requirements and potential dilution.</dd>
            <dt>2030: evaluate the long-term valuation range</dt><dd>Compare multiple growth and valuation scenarios, including the effect of {stock.drivers[4].toLowerCase()}. More distant horizons require wider uncertainty ranges.</dd>
          </dl>
          <h3>Bull, base and bear scenarios</h3>
          <ul><li>Bull case: operating results exceed the stated assumptions and investors sustain a higher valuation.</li><li>Base case: revenue, profitability and cash flow broadly follow the assumptions being tested.</li><li>Bear case: business performance weakens, financing needs rise or the market pays a lower multiple.</li></ul>
          <h3>Is a 12-month target the same as a {outlookYear} prediction?</h3>
          <p>No. A rolling 12-month target runs from its publication date; a calendar-year forecast may refer to year-end. Check the analyst or model source, date, currency, earnings definition and horizon. Company guidance describes operating expectations, not a promised share price.</p>
          <p><Link href={curated ? `${path}/forecast` : companyPath}>Explore {stock.ticker} valuation and company research →</Link>{stock.investorUrl&&<>{' · '}<a href={stock.investorUrl}>Check company disclosures →</a></>}</p>
        </section> : <section><h2>{stock.name} stock price prediction research</h2><p>Review short-term catalysts and longer-term business assumptions for tomorrow, next week, the coming months and 2026–2030.</p><Link href={predictionPath(stock)}>Explore {predictionName(stock)} stock price prediction research →</Link></section>}
        <h2>Price and valuation</h2>
        <p>
          This page does not currently provide a verified live quote. Confirm
          the price, currency, market session and quote timestamp with your
          broker before making a decision. Valuation depends on earnings, growth
          expectations and the risks priced into the shares.
        </p>
        <h2>How to assess the next earnings report</h2>
        <p>
          Compare reported results with the previous year and with expectations
          from a dated, identified source. Separate reported earnings from
          adjusted figures, and read forward guidance and the cash-flow
          statement.
        </p>
      </div>
      <div id="peer-performance"><StockPeerPerformance symbol={stock.ticker}/></div>
      <div id="stock-news"><RelatedStockResearch items={items}/></div>
      <StockAppCTA symbol={stock.ticker}/>
    </ResearchPage>
  );
}
export function getStaticPaths() {
  return {
    paths: stocks.map((s) => ({ params: { ticker: s.slug } })),
    fallback: false,
  };
}
export async function getStaticProps({
  params,
}: {
  params: { ticker: string };
}) {
  const stock = findStock(params.ticker);
  if (!stock) return { notFound: true };
  return {
    props: {
      stock,
      items: recentStockNews(await fetchResearch(), stock.ticker),
      bundle: loadStockResearch(stock.ticker),
      calendar: loadStockEarnings(stock.ticker),
    },
    revalidate: 60,
  };
}
