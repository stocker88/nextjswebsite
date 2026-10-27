import DesktopAppLink, {DesktopActionText} from '../../components/DesktopAppLink';
import {overnightOptionsResult, resolveResearchArticle} from '../../lib/featured-research';
import {isEarningsFirst} from '../../lib/research';
import AttachedThreads from '../../components/AttachedThreads';
import ResearchImages from "../../components/ResearchImages";
import SnowSignalStory from "../../components/SnowSignalStory";
import ResearchCompanyLogo from '../../components/ResearchCompanyLogo';
import Head from "next/head";
import Link from "next/link";
import { publicArticles, publicResearchArticleSchema } from "../../lib/public-articles";
import { stocks } from "../../lib/stocks";
import { SITE, jsonLd, isoDate, displayDate, breadcrumbs } from "../../lib/seo";
import ResearchPage from "../../components/ResearchPage";
import { researchUrl, ResearchPreview, displayEngagementCount } from "../../lib/research";
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
              __html: jsonLd(publicResearchArticleSchema(article, item)),
            }}
          />
        )}
        {article && <meta property="article:published_time" content={article.publishedAt} />}
        {article && <meta property="article:modified_time" content={article.updatedAt} />}
      </Head>
      <article>
        <span className="insight-bubble">
          {item.symbols[0]
            ? `$${item.symbols[0].toUpperCase()} INSIGHTS`
            : "MARKET INSIGHTS"}{" "}
          →
        </span>
        <p className="research-meta">
          {item.symbols.join(" · ")} ·{" "}
          {Math.max(1, Math.ceil(item.title.length / 55))} min read · ♡{" "}
          {displayEngagementCount(item.likes)} · ▢ {displayEngagementCount(item.comments)} · ↗{" "}
          {displayEngagementCount(item.shares)}
        </p>
        <h1><ResearchCompanyLogo symbols={item.symbols} title={item.title}/>{item.title}</h1>
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
        {!isEarningsFirst(item.symbols) && item.educationPreview &&
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

        {item.id !== overnightOptionsResult.id && (
        <div className="research-card">
          <h2><DesktopActionText>{'Read the full research in the app'}</DesktopActionText></h2>
          <p>A subscription is required to access the full thread.</p>
          <DesktopAppLink
            className="research-cta"
            href={`/insight_details_page?postId=${encodeURIComponent(item.id)}&utm_source=research&utm_medium=organic&utm_campaign=research_hub`}
          >
            {'Open in the app →'}
          </DesktopAppLink>
        </div>
        )}
        {item.id === overnightOptionsResult.id
          ? <SnowSignalStory />
          : <ResearchImages appOnly images={item.images} />}
        <AttachedThreads item={item} />
        {item.id === overnightOptionsResult.id && (
          <section className="research-card" aria-labelledby="more-options-results">
            <h2 id="more-options-results">Explore more options results</h2>
            <p>Browse more call and put results, with the prices and research behind each move.</p>
            <Link className="research-cta" href="/results/">
              View options results →
            </Link>
          </section>
        )}
      </article>
    </ResearchPage>
  );
}
export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}
export async function getStaticProps({ params }: { params: { id: string } }) {
  const item = await resolveResearchArticle(params.id, fetchResearch);
  if (!item) return {notFound:true, revalidate:60};
  const canonical = researchUrl(item.id, item.title);
  if (decodeURIComponent(canonical.slice('/stock-market-news/'.length)) !== params.id) {
    return {redirect:{destination:canonical, permanent:true}, revalidate:60};
  }
  return {props:{item}, revalidate:60};
}
