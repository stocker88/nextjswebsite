import ResearchImages from "./ResearchImages";
import Link from "next/link";
import Head from "next/head";
import { ResearchPreview, researchUrl } from "../lib/research";
import { displayDate, jsonLd } from "../lib/seo";
import { stocks } from "../lib/stocks";
import faq from "../data/research-faq.json";
export default function HomeResearch({ items }: { items: ResearchPreview[] }) {
  return (
    <section className="home-research">
      <Head>
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
      </Head>
      <h2>Stock market news today</h2>
      <p>
        Recent app research previews, dated when published. These are not live
        quotes or a ranked list of buys.
      </p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Published (UTC)</th>
              <th>Research headline</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id}>
                <td>{displayDate(i.time)}</td>
                <td>
                  <div className="headline-with-pictures">
                    <Link href={researchUrl(i.id, i.title)}>{i.title}</Link>
                    <ResearchImages images={i.images} compact />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        <Link href="/stock-market-news">All market news →</Link>
      </p>
      <h2>Explore company research</h2><p><Link href="/stocks">Search the app’s full stock catalog →</Link></p>
      <div className="tickers">
        {stocks.map((s) => (
          <Link href={`/stocks/${s.slug}`} key={s.slug}>
            {s.name} ({s.ticker})
          </Link>
        ))}
      </div>
      <h2>Stock research questions</h2>
      {faq.map((f) => (
        <details key={f.q}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
      <p>
        <Link href="/methodology">Methodology</Link> ·{" "}
        <Link href="/editorial-policy">Editorial standards</Link> ·{" "}
        <Link href="/glossary">Investing glossary</Link>
      </p>
      <style jsx>{`
        .home-research {
          max-width: 1080px;
          margin: 0 auto;
          padding: 56px 24px;
          color: #e5edf8;
          line-height: 1.65;
        }
        .home-research h2 {
          font-size: 30px;
          margin-top: 38px;
        }
        .home-research :global(a) {
          color: #8dc8ff;
        }
        .headline-with-pictures {display:flex;align-items:center;justify-content:space-between;gap:16px;}
        @media(max-width:600px){.headline-with-pictures{flex-direction:column;align-items:flex-start;gap:8px;}}
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
          gap: 16px;
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
