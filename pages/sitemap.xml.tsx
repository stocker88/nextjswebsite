import {researchUrl} from '../lib/research';
import {catalog} from '../lib/catalog';
import { fetchResearch } from "../lib/research-server";
import { stocks } from "../lib/stocks";
import terms from "../data/glossary.json";
import { publicArticles } from "../lib/public-articles";
import { getAllPosts } from "../lib/api";
import { SITE, isoDate } from "../lib/seo";
const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
export default function Sitemap() {
  return null;
}
export async function getServerSideProps({ res }: any) {
  const items = await fetchResearch();
  const entries: { path: string; modified?: string | null }[] = [
    "/",
    "/stocks-to-buy",
    "/stock-market-news",
    "/stocks",
    "/facts",
    "/methodology",
    "/editorial-policy",
    "/authors/aness-hussein-ali",
    "/glossary",
  ].map((path) => ({ path }));
  stocks.forEach((s) => entries.push({ path: `/stocks/${s.slug}` }));
  terms.forEach((t) => entries.push({ path: `/glossary/${t.slug}` }));
  getAllPosts(["slug", "date"]).forEach((p) =>
    entries.push({ path: `/posts/${p.slug}` }),
  );
  items.forEach((i) =>
    entries.push({
      path: researchUrl(i.id, i.title),
      modified:
        publicArticles.find((a) => a.postId === i.id)?.updatedAt ||
        isoDate(i.time),
    }),
  );
  for (let page = 2; page <= Math.ceil(items.length / 40); page++)
    entries.push({ path: `/stock-market-news/page/${page}` });
  for(let page=2;page<=Math.ceil(catalog.length/48);page++) entries.push({path:`/stocks?page=${page}`});
 const unique = Array.from(new Map(entries.map((e) => [e.path, e])).values());
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=300",
  );
  res.end(
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
      unique
        .map(
          (e) =>
            `<url><loc>${escapeXml(SITE + e.path)}</loc>${e.modified ? `<lastmod>${escapeXml(e.modified)}</lastmod>` : ""}</url>`,
        )
        .join("") +
      "</urlset>",
  );
  return { props: {} };
}
