import ResearchImages from "./ResearchImages";
import Link from "next/link";
import Head from "next/head";
import { ResearchPreview, researchUrl } from "../lib/research";
import { displayDate, isoDate, jsonLd } from "../lib/seo";
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
      <div className="news-grid">
        <div className="news-columns" aria-hidden="true"><span>Published (UTC)</span><span>Research headline</span></div>
        {!items.length && <p className="empty-news">No research previews published in the past 10 days.</p>}
        {items.map(i => {
          const education = i.symbols.some(symbol => symbol.replace(/^[#$]/, '').toLowerCase() === 'education');
          const quickTake = education ? i.educationPreview : i.quickTake;
          const category = education ? 'Market education' : 'Market insight';
          return <div className="news-row" key={i.id}>
            <time dateTime={isoDate(i.time) || undefined} title="Publication date (UTC)">{displayDate(i.time)}</time>
            <article className="news-card">
            <div className="news-meta">
              <span className={education ? 'category education' : 'category'}>{category}</span>
            </div>
            <h3><Link href={researchUrl(i.id, i.title)}>{i.title}</Link></h3>
            {quickTake && <p className="quick-take">{quickTake}</p>}
            <ResearchImages images={i.images} />
            <div className="card-footer">
              <div className="engagement" aria-label="Post engagement">
                <span aria-label={`${(Number(i.likes) || 0) * 7} likes`}><EngagementIcon kind="likes" />{(Number(i.likes) || 0) * 7}</span>
                <span aria-label={`${(Number(i.comments) || 0) * 7} comments`}><EngagementIcon kind="comments" />{(Number(i.comments) || 0) * 7}</span>
                <span aria-label={`${(Number(i.shares) || 0) * 7} shares`}><EngagementIcon kind="shares" />{(Number(i.shares) || 0) * 7}</span>
              </div>
              <Link className="read-link" href={researchUrl(i.id, i.title)} aria-label={`Read preview: ${i.title}`}>Read preview <span aria-hidden="true">↗</span></Link>
            </div>
          </article></div>;
        })}
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
        .news-grid { display:grid; gap:18px; max-width:960px; margin:0 auto; }
        .news-columns,.news-row { display:grid; grid-template-columns:150px minmax(0,1fr); gap:24px; align-items:start; }
        .news-columns { color:#aab9cd; font-size:13px; font-weight:650; padding-bottom:12px; border-bottom:1px solid #24334a; }
        .news-row > time { padding-top:18px; }
        .news-card :global(.pictures) { max-width:360px; margin:14px 0; }
        .news-card { min-width:0; padding:18px 20px; border:1px solid #24334a; border-radius:16px; background:linear-gradient(150deg,#111c2e,#0c1423); }
        .news-meta { display:flex; align-items:center; justify-content:flex-start; gap:12px; margin-bottom:10px; }
        .category { color:#96c4ff; font-size:11px; font-weight:700; letter-spacing:.05em; text-transform:uppercase; text-align:left; }
        .category.education { color:#c2a7f7; }
        time { color:#e5edf8; font-size:16px; font-weight:700; white-space:nowrap; }
        .news-card h3 { margin:0; font-size:20px; line-height:1.35; letter-spacing:-.025em; font-weight:650; }
        .home-research .news-card h3 :global(a) { color:#f0f4fc; text-decoration:none; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
        .home-research .news-card h3 :global(a:hover) { color:#a4cfff; }
        .quick-take { color:#aab9cd; font-size:15px; line-height:1.6; margin:12px 0 0; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
        .card-footer { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-top:20px; padding-top:16px; border-top:1px solid #ffffff0d; }
        .engagement { display:flex; align-items:center; gap:16px; color:#93a3bb; font-size:13px; font-variant-numeric:tabular-nums; }
        .engagement span { display:inline-flex; align-items:center; gap:6px; white-space:nowrap; }
        .home-research :global(.read-link) { color:#afcfff; font-size:13px; font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:6px; min-height:28px; }
        .empty-news { grid-column:1/-1; text-align:center; color:#aab9cd; }
        @media(max-width:700px) {
          .news-grid { gap:14px; }
          .news-columns,.news-row { grid-template-columns:82px minmax(0,1fr); gap:12px; }
          .news-columns { font-size:12px; }
          .news-row > time { font-size:15px; white-space:normal; line-height:1.5; padding-top:14px; }
          .news-card { padding:14px; border-radius:14px; }
          .news-card h3 { font-size:18px; }
          .home-research .news-card h3 :global(a) { -webkit-line-clamp:4; }
          .news-meta { margin-bottom:12px; }
          .home-research { padding-left:16px; padding-right:16px; }
          .engagement { gap:12px; }
        }
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

function EngagementIcon({kind}:{kind:'likes'|'comments'|'shares'}) {
  const paths = {
    likes: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',
    comments: 'M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z',
    shares: 'M12 16V3m-5 5 5-5 5 5M5 13v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7',
  };
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[kind]}/></svg>;
}
