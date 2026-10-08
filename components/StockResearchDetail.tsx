import Link from "next/link";
import ResearchPage from "./ResearchPage";
import ResearchCTA from "./ResearchCTA";
import { stocks } from "../lib/stocks";
export default function StockResearchDetail({
  stock,
  mode,
}: {
  stock: (typeof stocks)[number];
  mode: "earnings" | "forecast";
}) {
  const earnings = mode === "earnings";
  return (
    <ResearchPage
      title={`${stock.name} (${stock.ticker}) ${earnings ? "earnings: what to review" : "stock forecast: valuation scenarios and risks"}`}
      path={`/stocks/${stock.slug}/${mode}`}
      noindex
    >
      <div className="public-copy">
        <p>
          <Link href={`/stocks/${stock.slug}`}>
            {stock.name} stock research
          </Link>
        </p>
        <h1>
          {stock.ticker}{" "}
          {earnings ? "earnings research" : "valuation and forecast scenarios"}
        </h1>
        {earnings ? (
          <>
            <p>
              Start with {stock.name}'s published results and earnings
              materials. Confirm the reporting date directly with the company;
              estimated calendar dates can change.
            </p>
            <p>
              <a href={stock.earningsUrl}>
                View {stock.name}'s earnings materials →
              </a>
            </p>
            <h2>Numbers to compare</h2>
            <ul>
              {stock.drivers.map((x) => (
                <li key={x}>
                  {x}: compare the current report with the prior period,
                  management's previous guidance and dated consensus estimates
                  where available.
                </li>
              ))}
            </ul>
            <h2>A beat is not the whole story</h2>
            <p>
              Shares can fall after a headline earnings beat if guidance
              disappoints, margins weaken or the price already reflects stronger
              growth. Check reported versus adjusted earnings, one-off items and
              free cash flow before drawing a conclusion.
            </p>
            <h2>Reporting date and estimates</h2>
            <p>
              A verified upcoming reporting date and consensus feed are not
              available on this page yet. Use the company source above; no
              estimated dates or earnings numbers are presented as confirmed.
            </p>
          </>
        ) : (
          <>
            <p>
              A forecast is a set of assumptions, not a promised return. For{" "}
              {stock.name}, evaluate the following business drivers before
              assigning a future share price.
            </p>
            <ul>
              {stock.drivers.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <h2>Three scenarios to build</h2>
            <p>
              <strong>Bull case:</strong> growth or profitability exceeds
              expectations and the market sustains a higher valuation multiple.
              Specify what evidence would support those assumptions.
            </p>
            <p>
              <strong>Base case:</strong> performance broadly matches a
              documented set of operating assumptions. Use the same earnings
              definition and time horizon consistently.
            </p>
            <p>
              <strong>Bear case:</strong> demand, margins or cash flow weaken,
              and the valuation multiple contracts. Include dilution and
              financing risk where relevant.
            </p>
            <h2>Valuation calculation</h2>
            <p>
              For a profitable company, one approach is scenario earnings per
              share × scenario P/E multiple. This is a framework, not a
              published price target. It can be misleading for cyclical,
              loss-making or rapidly changing businesses.
            </p>
            <p>
              This page does not publish a numerical target until dated inputs
              and their sources are available. A lower share price or P/E alone
              does not establish that a stock is cheap.
            </p>
          </>
        )}
        <p>
          <Link href="/methodology">
            How to assess evidence and uncertainty
          </Link>
        </p>
        <ResearchCTA placement={`${stock.slug}_${mode}`} />
      </div>
    </ResearchPage>
  );
}
