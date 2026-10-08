import Head from "next/head";
import Link from "next/link";
import ResearchPage from "../../../components/ResearchPage";
import ResearchCTA from "../../../components/ResearchCTA";
import { stocks, findStock, recentStockNews } from "../../../lib/stocks";
import { fetchResearch } from "../../../lib/research-server";
import { researchUrl, ResearchPreview } from "../../../lib/research";
import { breadcrumbs, jsonLd, displayDate } from "../../../lib/seo";
export default function Stock({
  stock,
  items,
}: {
  stock: (typeof stocks)[number];
  items: ResearchPreview[];
}) {
  const path = `/stocks/${stock.slug}`;
  return (
    <ResearchPage
      title={`${stock.name} (${stock.ticker}) stock: news, earnings and research`}
      path={path}
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
          {stock.name} ({stock.ticker}) stock research
        </h1>
        <p>{stock.overview}</p>
        <p>
          <Link href={`${path}/earnings`}>Earnings research</Link> ·{" "}
          <Link href={`${path}/forecast`}>Valuation scenarios</Link> ·{" "}
          <a href={stock.investorUrl}>Company investor relations</a>
        </p>
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
        {items.length >= 5 && <><h2>Recent {stock.name} research headlines</h2>
        <p>
          Archive entries carry their original dates; they are not necessarily
          today's news. Headlines alone do not confirm the cause of a
          stock-price move.
        </p>
        {(
          <ul>
            {items.map((i) => (
              <li key={i.id}>
                <Link href={researchUrl(i.id, i.title)}>{i.title}</Link>
                <br />
                <small>{displayDate(i.time)}</small>
              </li>
            ))}
          </ul>
        )}</>}
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
        <ResearchCTA placement={`ticker_${stock.slug}`} />
      </div>
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
    },
    revalidate: 60,
  };
}
