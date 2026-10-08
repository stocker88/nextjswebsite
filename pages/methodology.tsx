import ResearchPage from "../components/ResearchPage";
export default function Methodology() {
  return (
    <ResearchPage
      title="Stock research methodology and limitations"
      path="/methodology"
    >
      <div className="public-copy">
        <h1>How to read our stock research</h1>
        <p>
          Stocks To Buy Now AI brings together company research, market context
          and app-based analytical tools. Public previews and historical
          examples are not a complete trading strategy or a promise of
          performance.
        </p>
        <h2>Business fundamentals</h2>
        <p>
          Review revenue, profitability, cash flow, debt and valuation using
          company filings. Compare consistent reporting periods and distinguish
          reported figures from estimates and non-GAAP adjustments.
        </p>
        <h2>Market and technical context</h2>
        <p>
          Price action, earnings expectations, macroeconomic events and
          sentiment can help frame a scenario. A correlation between a headline
          and a move does not prove causation.
        </p>
        <h2>Signals and scenarios</h2>
        <p>
          Signals are inputs to research. Assess the time horizon, evidence,
          position size and invalidation conditions before acting. This page
          does not disclose a validated proprietary scoring formula or imply
          that any model has been independently audited.
        </p>

        <h2>AI assistance</h2>
        <p>
          AI-generated text can contain errors. Verify material claims against
          the cited primary documents. Articles that use AI assistance should
          identify that assistance and their reviewer.
        </p>
        <h2>Risk</h2>
        <p>
          Investments can lose value. Forecasts depend on assumptions and can
          change. Public educational content does not assess your financial
          circumstances.
        </p>
      </div>
    </ResearchPage>
  );
}
