import ResearchImages from "../../components/ResearchImages";
import FallbackLogo from '../../components/FallbackLogo';
import Head from "next/head";
import Link from "next/link";
import { publicArticles } from "../../lib/public-articles";
import { stocks } from "../../lib/stocks";
import { SITE, jsonLd, isoDate, displayDate, breadcrumbs } from "../../lib/seo";
import ResearchPage from "../../components/ResearchPage";
import { researchUrl, findResearchByRoute, ResearchPreview } from "../../lib/research";
import { fetchResearch } from "../../lib/research-server";
export default function ResearchArticle({ item }: { item: ResearchPreview }) {
  const article = publicArticles.find((a) => a.postId === item.id);
  const related = stocks.filter((s) =>
    item.symbols.some((t) => t.toUpperCase().replace(/^[#$]/, "") === s.ticker),
  );
  const published = article?.publishedAt || isoDate(item.time);
  return (
    <ResearchPage
      title={item.title}
      path={researchUrl(item.id, item.title)}
      description={article?.summary || item.educationPreview || item.title}
    >
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd(
              breadcrumbs([
                { name: "Home", path: "/" },
                { name: "Stock Market News", path: "/stock-market-news" },
                { name: item.title, path: researchUrl(item.id, item.title) },
              ]),
            ),
          }}
        />
        {article && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: jsonLd({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: item.title,
                description: article.summary,
                datePublished: article.publishedAt,
                dateModified: article.updatedAt,
                author: { "@type": "Person", ...article.author },
                publisher: {
                  "@type": "Organization",
                  name: "Stocks To Buy Now AI",
                  url: SITE,
                },
                mainEntityOfPage: SITE + researchUrl(item.id, item.title),
                isAccessibleForFree: true,
              }),
            }}
          />
        )}
      </Head>
      <article>
        <span className="insight-bubble">
          <FallbackLogo className="ticker-logo" src={item.symbols[0] ? `/assets/logo/${item.symbols[0].toUpperCase()}.webp` : null} />
          {item.symbols[0]
            ? `$${item.symbols[0].toUpperCase()} INSIGHTS`
            : "MARKET INSIGHTS"}{" "}
          →
        </span>
        <p className="research-meta">
          {item.symbols.join(" · ")} ·{" "}
          {Math.max(1, Math.ceil(item.title.length / 55))} min read · ♡{" "}
          {Number(item.likes) || 0} · ▢ {Number(item.comments) || 0} · ↗{" "}
          {Number(item.shares) || 0}
        </p>
        <h1>{item.title}</h1>
        <p className="research-meta">
          {published && (
            <time dateTime={published}>
              {article
                ? new Date(published).toISOString().slice(0, 10)
                : displayDate(item.time)}
            </time>
          )}{" "}
          ·{" "}
          {article
            ? `By ${article.author.name} · Reviewed by ${article.reviewer}`
            : "App research preview"}{" "}
          · <Link href="/editorial-policy">Editorial standards</Link>
        </p>
        {related.length > 0 && (
          <p>
            {related.map((stock) => (
              <Link
                key={stock.slug}
                href={`/stocks/${stock.slug}`}
                style={{ marginRight: 16, color: "#8dc8ff" }}
              >
                {stock.name} ({stock.ticker}) research →
              </Link>
            ))}
          </p>
        )}
        {article && (
          <div className="public-copy">
            <p>{article.summary}</p>
            {article.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <h2>Sources</h2>
            <ul>
              {article.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url}>{s.title}</a>
                </li>
              ))}
            </ul>
            <p>Disclosure: {article.disclosure}</p>
            {article.aiAssisted && (
              <p>
                Prepared with AI assistance and reviewed by {article.reviewer}.
              </p>
            )}
            {article.correction && <p>Correction: {article.correction}</p>}
          </div>
        )}
        {item.educationPreview &&
          item.symbols.some(
            (symbol) =>
              symbol.trim().replace(/^[#$]/, "").toLowerCase() === "education",
          ) && (
            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.5,
                color: "#b9c5d8",
                margin: "8px 0 14px",
              }}
            >
              {item.educationPreview}
            </p>
          )}
        <ResearchImages images={item.images} />
        {item.attachedTitle && (
          <div className="research-card">
            <strong>Attached thread</strong>
            <h2>{item.attachedTitle}</h2>
            <p className="research-meta">Related insight from the community.</p>
          </div>
        )}
        <div className="research-card">
          <h2>Read the full research in the app</h2>
          <p>A subscription is required to access the full thread.</p>
          <a
            className="research-cta"
            href={`/insight_details_page?postId=${encodeURIComponent(item.id)}&utm_source=research&utm_medium=organic&utm_campaign=research_hub`}
          >
            Open in the app →
          </a>
        </div>
      </article>
    </ResearchPage>
  );
}
export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}
export async function getStaticProps({ params }: { params: { id: string } }) {
  const items = await fetchResearch();
  const item = findResearchByRoute(items, params.id);
  if (!item) return {notFound:true, revalidate:60};
  const canonical = researchUrl(item.id, item.title);
  if (decodeURIComponent(canonical.slice('/stock-market-news/'.length)) !== params.id) {
    return {redirect:{destination:canonical, permanent:true}, revalidate:60};
  }
  return {props:{item}, revalidate:60};
}
