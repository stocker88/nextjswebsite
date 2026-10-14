import {isEarningsFirst} from '../lib/research';
import ResearchCompanyLogo from './ResearchCompanyLogo';
import MarketNewsFeed from './MarketNewsFeed';
import NewsMentionsPromo from './NewsMentionsPromo';
import AppDownloadButton from './formStocker';
import EngagementIcon from './EngagementIcon';
import {loadRecentResearch} from '../lib/research-feed';
import AttachedThreads from './AttachedThreads';
import { useEffect, useState } from "react";
import ResearchImages from "./ResearchImages";
import Link from "next/link";
import Head from "next/head";
import { ResearchPreview, researchUrl, displayEngagementCount } from "../lib/research";
import { displayDate, isoDate, jsonLd } from "../lib/seo";
import { stocks } from "../lib/stocks";
import faq from "../data/research-faq.json";
export default function HomeResearch({ items, section = "all" }: { items: ResearchPreview[]; section?: "all" | "news" | "resources" }) {
  const [recovered, setRecovered] = useState<ResearchPreview[] | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const news = recovered ?? items;
  useEffect(() => {
    if (section === "resources") return;
    let disposed = false;
    const controller = new AbortController();
    setStatus("loading");
    // Revalidate populated static HTML too; GitHub Pages rebuilds can be delayed.
    (async () => {
      try {
        const recent = await loadRecentResearch(controller.signal, partial => {
          if (!disposed && partial.length) setRecovered(partial);
        });
        if (!disposed) { setRecovered(recent); setStatus("ready"); }
      } catch {
        if (!disposed) setStatus("error");
      }
    })();
    const retryOnRestore = (event: PageTransitionEvent) => {
      if (event.persisted) setAttempt(value => value + 1);
    };
    const refreshVisible = () => {
      if (document.visibilityState === "visible") setAttempt(value => value + 1);
    };
    const interval = window.setInterval(refreshVisible, 5 * 60 * 1000);
    document.addEventListener("visibilitychange", refreshVisible);
    window.addEventListener("pageshow", retryOnRestore);
    return () => {
      disposed = true;
      controller.abort();
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refreshVisible);
      window.removeEventListener("pageshow", retryOnRestore);
    };
  }, [items, section, attempt]);
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
      <header className="editorial-heading"><span>Market updates · Past week</span>
      <h2>Stock market news today</h2>
      <p>
        All app research previews published in the past week. These are not live
        quotes or a ranked list of buys.
      </p></header>
      <div className="news-grid">
        <div className="news-columns" aria-hidden="true"><span>Published (UTC)</span><span>Research headline</span></div>
        {!news.length && <div className="empty-news" role="status">
          {status === "loading" ? <div className="research-loading">
            <span className="research-spinner" aria-hidden="true" />
            <div><strong>Loading recent research previews</strong>
              <p>Fetching the latest headlines and images. Please wait…</p></div>
          </div> :
            status === "error" ? <>Recent previews could not be loaded. <button type="button" onClick={() => setAttempt(value => value + 1)}>Try again</button></> :
            "No research previews published in the past week."}
        </div>}
        {news.map(i => {
          const education = i.symbols.some(symbol => symbol.replace(/^[#$]/, '').toLowerCase() === 'education');
          const quickTake = isEarningsFirst(i.symbols) ? undefined : education ? i.educationPreview : i.quickTake;
          const category = education ? 'Market education' : 'Market insight';
          return <div className="news-row" key={i.id}>
            <time dateTime={isoDate(i.time) || undefined} title="Publication date (UTC)">{displayDate(i.time)}</time>
            <article className="news-card">
            <div className="news-meta">
              <span className={education ? 'category education' : 'category'}>{category}</span>
            </div>
            <h3><Link href={researchUrl(i.id, i.title)}><ResearchCompanyLogo symbols={i.symbols} title={i.title}/>{i.title}</Link></h3>
            {quickTake && <p className="quick-take">{quickTake}</p>}
            <ResearchImages appOnly images={i.images} />
            <AttachedThreads item={i} />
            <div className="card-footer">
              <div className="engagement" aria-label="Post engagement">
                <span aria-label={`${displayEngagementCount(i.likes)} likes`}><EngagementIcon kind="likes" />{displayEngagementCount(i.likes)}</span>
                <span aria-label={`${displayEngagementCount(i.comments)} comments`}><EngagementIcon kind="comments" />{displayEngagementCount(i.comments)}</span>
                <span aria-label={`${displayEngagementCount(i.shares)} shares`}><EngagementIcon kind="shares" />{displayEngagementCount(i.shares)}</span>
              </div>
              <Link className="read-link" href={researchUrl(i.id, i.title)} aria-label={`Read preview: ${i.title}`}>Read preview <span aria-hidden="true">↗</span></Link>
            </div>
          </article></div>;
        })}
      </div>
      <MarketNewsFeed compact/>
      <p className="section-action market-news-action">
        <Link className="research-cta" href="/stock-market-news">All market news →</Link>
      </p>
      <NewsMentionsPromo/>
      <div className="section-action hottest-stocks-action">
        <AppDownloadButton from="home_hottest_stocks" label="Hottest stock now →"/>
        <p>Explore in the app · iOS & Android</p>
      </div>
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
        .empty-news { grid-column:1 / -1; color:#aab9cd; }
        .research-loading { display:flex; align-items:center; justify-content:center; gap:16px; padding:30px 20px; border:1px solid #293b56; border-radius:16px; background:linear-gradient(135deg,#122038,#19172d); text-align:left; }
        .research-loading strong { display:block; color:#edf3ff; font-size:16px; line-height:1.4; }
        .research-loading p { margin:6px 0 0; font-size:14px; line-height:1.5; color:#aebed5; }
        .research-spinner { display:block; flex:0 0 34px; width:34px; height:34px; box-sizing:border-box; border:3px solid #334360; border-top-color:#86baff; border-right-color:#b598f5; border-radius:50%; animation:research-spin .9s linear infinite; }
        @keyframes research-spin { to { transform:rotate(360deg); } }
        @media(prefers-reduced-motion:reduce) { .research-spinner { animation:none; } }
        .empty-news button { background:transparent; border:0; color:#8cc8ff; text-decoration:underline; cursor:pointer; font:inherit; }
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
        .hottest-stocks-action :global(a.app-download-cta) { display:inline-flex; align-items:center; justify-content:center; min-height:48px; padding:15px 28px; border:1px solid #c5a5ff; border-radius:999px; background:#c5a5ff; color:#171024!important; font-size:17px; font-weight:750; text-decoration:none; }
        .hottest-stocks-action :global(a.app-download-cta:hover) { background:#d4bdff; }
        .hottest-stocks-action p { margin:10px 0 0; color:#9eafc9; font-size:12px; }
        .section-action { text-align: center; margin: 30px 0 0; }
        .market-news-action { margin-bottom: 56px; }
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
