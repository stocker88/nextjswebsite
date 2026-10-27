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
}: {
  stock: (typeof stocks)[number];
  items: ResearchPreview[];
  bundle: ResearchBundle;
  calendar: Calendar | null;
}) {
  const path = `/stocks/${stock.slug}`;
  return (
    <ResearchPage
      title={`${stock.name} (${stock.ticker}) stock: news, earnings and research`}
      path={path}
      hideAppDownload
      description={`${stock.overview} Explore recent research headlines, earnings sources, business drivers and investment risks.`}
    >
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd(
              breadcrumbs([
                { name: "Home", path: "/" },
                { name: "Stocks", path: "/stocks" },
                { name: stock.ticker, path },
              ]),
            ),
          }}
        />
      </Head>
      <div className="public-copy">
        <h1>
          {stock.name} (<span data-stock-symbol={stock.ticker}>{stock.ticker}</span>) stock research
        </h1>
        <p>{stock.overview}</p>
        <p>
          <Link href={`${path}/earnings`}>Earnings research</Link> ·{" "}
          <Link href={`${path}/forecast`}>Valuation scenarios</Link> ·{" "}
          <a href={stock.investorUrl}>Company investor relations</a>
        </p>
      </div>
<div id="earnings" style={{scrollMarginTop:120}}><StockEarnings symbol={stock.ticker} initialCalendar={calendar} detail={bundle.snapshot?.detail}/></div>
      <StockResearchHub symbol={stock.ticker} name={stock.name} bundle={bundle} earningsDate={calendar?.items.filter(e=>e.date>=bundle.today).sort((a,b)=>a.date.localeCompare(b.date))[0]?.date}/>
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
      <StockPeerPerformance symbol={stock.ticker}/>
      <RelatedStockResearch items={items}/>
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
