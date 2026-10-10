import ResearchImages from "./ResearchImages";
import Link from "next/link";
import Head from "next/head";
import { ResearchPreview, researchUrl } from "../lib/research";
import { displayDate, jsonLd } from "../lib/seo";
import { stocks } from "../lib/stocks";
import faq from "../data/research-faq.json";
export default function HomeResearch({ items, section = "all" }: { items: ResearchPreview[]; section?: "all" | "news" | "resources" }) {
  return (
    <section className={"home-research " + section}>
      {section !== "news" && <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }),
          }}
        />
      </Head>}
      {section !== "resources" && <>
      <header className="editorial-heading"><span>Market updates · Past 10 days</span>
      <h2>Stock market news today</h2>
      <p>
        All app research previews published in the past 10 days. These are not live
        quotes or a ranked list of buys.
      </p></header>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Published (UTC)</th>
              <th>Research headline</th>
            </tr>
          </thead>
          <tbody>
            {!items.length && <tr><td colSpan={2}>No research previews published in the past 10 days.</td></tr>}
            {items.map((i) => (
              <tr key={i.id}>
                <td>{displayDate(i.time)}</td>
                <td>
                  <div className="headline-with-pictures">
                    <div className="headline-content">
                      <Link href={researchUrl(i.id, i.title)}>{i.title}</Link>
                      <div className="engagement" aria-label="Post engagement">
                        <span aria-label={`${(Number(i.likes) || 0) * 7} likes`}>♡ {(Number(i.likes) || 0) * 7}</span>
                        <span aria-label={`${(Number(i.comments) || 0) * 7} comments`}>▢ {(Number(i.comments) || 0) * 7}</span>
                        <span aria-label={`${(Number(i.shares) || 0) * 7} shares`}>↗ {(Number(i.shares) || 0) * 7}</span>
                      </div>
                    </div>
                    <ResearchImages images={i.images} compact thumbnailSize={120} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="section-action">
        <Link className="research-cta" href="/stock-market-news">All market news →</Link>
      </p>
      </>}
      {section !== "news" && <>
      <header className="editorial-heading subsection-heading"><span>Company insights</span><h2>Explore company research</h2></header>
      <div className="tickers">
        {stocks.map((s) => (
          <Link href={`/stocks/${s.slug}`} key={s.slug}>
            {s.name} ({s.ticker})
          </Link>
        ))}
      </div>
      <p className="section-action"><Link className="research-cta" href="/stocks">Search the app’s full stock catalog →</Link></p>
      <header className="editorial-heading subsection-heading"><span>Research essentials</span><h2>Stock research questions</h2></header>
      {faq.map((f) => (
        <details key={f.q}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
      <nav className="resource-links" aria-label="Research resources">
        <Link href="/methodology">Methodology</Link>
        <Link href="/editorial-policy">Editorial standards</Link>
        <Link href="/glossary">Investing glossary</Link>
      </nav>
      </>}
      <style jsx>{`
        .home-research {
          max-width: 1168px;
          margin: 0 auto;
          padding: clamp(56px, 7vw, 96px) 24px;
          color: #e5edf8;
          line-height: 1.65;
        }
        .subsection-heading { margin-top: 80px; }
        .resources .subsection-heading:first-child { margin-top: 0; }
        .headline-content { min-width: 0; }
        .engagement { display: flex; flex-wrap: wrap; gap: 18px; margin-top: 12px; color: #abb9cd; font-size: 16px; }
        .engagement span { white-space: nowrap; }
        .section-action { text-align: center; margin: 30px 0 0; }
        .home-research :global(.research-cta) {
          display: inline-flex; align-items: center; justify-content: center;
          background: #1985ff; color: #fff; border-radius: 999px;
          padding: 17px 28px; font-size: 18px; font-weight: 750;
          line-height: 1.4; text-decoration: none; transition: background .2s;
        }
        .home-research :global(.research-cta:hover) { background: #096bd8; }
        .resource-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 30px; }
        .home-research .resource-links :global(a) {
          color: #d0b5ff; background: rgba(139,92,246,.12);
          border: 1px solid rgba(167,139,250,.4); border-radius: 999px;
          padding: 10px 18px; font-weight: 650; text-decoration: none;
        }
        .resource-links :global(a:hover) { background: rgba(139,92,246,.25); }
        .home-research :global(a:focus-visible), summary:focus-visible { outline: 2px solid #b99aff; outline-offset: 4px; }
        .tickers :global(a) {
          background: #101a2b; border: 1px solid #29344b; border-radius: 12px;
          padding: 12px 16px; text-decoration: none;
        }
        .tickers :global(a:hover) { border-color: #51a5ff; }

        .home-research :global(a) {
          color: #8dc8ff;
        }
        .headline-with-pictures {display:flex;align-items:center;justify-content:space-between;gap:16px;}
        @media(max-width:800px){.headline-with-pictures{flex-direction:column;align-items:flex-start;gap:8px;}}
        @media(max-width:600px){
          thead { display: none; }
          tr { display: block; padding: 16px 0; border-bottom: 1px solid #29344b; }
          td { display: block; padding: 6px 0; border: 0; }
          .home-research :global(.compact .picture) { width: min(120px, calc((100vw - 60px) / 2)); height: auto; aspect-ratio: 1; }
        }
        .table-wrap {
          overflow: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th,
        td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #29344b;
        }
        td:first-child {
          min-width: 120px;
          font-size: 13px;
        }
        .tickers {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
        }
        details {
          padding: 16px 0;
          border-bottom: 1px solid #29344b;
        }
        summary {
          cursor: pointer;
          font-weight: 600;
        }
      `}</style>
    </section>
  );
}
