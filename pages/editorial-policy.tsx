import Link from "next/link";
import ResearchPage from "../components/ResearchPage";
export default function Policy() {
  return (
    <ResearchPage
      title="Editorial standards, sources and corrections"
      path="/editorial-policy"
    >
      <div className="public-copy">
        <h1>Editorial standards</h1>
        <p>
          Our public research distinguishes original analysis, reported
          developments and app previews. An archive headline is not a
          recommendation or independent confirmation of its claims.
        </p>
        <h2>Sources and dates</h2>
        <p>
          Full public articles should identify primary sources, their author and
          publication date. Updated timestamps reflect substantive revisions,
          not automatic page refreshes. Quotes and market data must identify
          their source and observation time.
        </p>
        <h2>Review and AI disclosure</h2>
        <p>
          The public-article publishing workflow requires an identified
          reviewer, sources and an explicit publication decision. AI assistance
          must be disclosed. Legacy previews without that information are
          labeled as previews, not presented as reviewed full articles.
        </p>
        <h2>Conflicts and performance</h2>
        <p>
          Authors always disclose relevant positions and commercial
          relationships on the article. Selected success stories are not a
          complete track record. Engagement counts should reflect recorded
          activity.
        </p>
        <h2>Corrections</h2>
        <p>
          Send the page URL, disputed claim and supporting evidence to{" "}
          <a href="mailto:support@stockstobuynow.ai">
            support@stockstobuynow.ai
          </a>
          . Corrections should explain material changes on the affected article.
        </p>
        <h2>About the publisher</h2>
        <p>
          Stocks To Buy Now AI is an investing research app founded by Aness
          Hussein Ali.{" "}
          <Link href="/authors/aness-hussein-ali">
            Read the founder profile
          </Link>{" "}
          and <Link href="/methodology">research limitations</Link>.
        </p>
      </div>
    </ResearchPage>
  );
}
