import {SITE} from './seo';

export type NewsSitemapEntry = {
  path: string;
  title: string;
  publishedAt: string;
};

const TWO_DAYS_MS = 48 * 60 * 60 * 1000;
const CLOCK_SKEW_MS = 5 * 60 * 1000;

export const escapeNewsXml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

export function currentNewsEntries(entries: NewsSitemapEntry[], now = Date.now()) {
  const earliest = now - TWO_DAYS_MS;
  const latest = now + CLOCK_SKEW_MS;
  const deduped = new Map<string, NewsSitemapEntry>();
  for (const entry of entries) {
    const published = Date.parse(entry.publishedAt);
    if (!entry.path.startsWith('/') || !entry.title.trim() || !Number.isFinite(published)) continue;
    if (published < earliest || published > latest) continue;
    const existing = deduped.get(entry.path);
    if (!existing || Date.parse(existing.publishedAt) < published) deduped.set(entry.path, entry);
  }
  return Array.from(deduped.values())
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt) || a.path.localeCompare(b.path))
    .slice(0, 1000);
}

export function newsSitemapXml(entries: NewsSitemapEntry[], now = Date.now()) {
  const urls = currentNewsEntries(entries, now).map(entry => {
    const loc = escapeNewsXml(SITE + entry.path);
    const title = escapeNewsXml(entry.title);
    const date = escapeNewsXml(new Date(entry.publishedAt).toISOString());
    return `<url><loc>${loc}</loc><news:news><news:publication><news:name>Stocks To Buy Now AI</news:name><news:language>en</news:language></news:publication><news:publication_date>${date}</news:publication_date><news:title>${title}</news:title></news:news></url>`;
  }).join('');
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${urls}</urlset>`;
}
