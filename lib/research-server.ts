import {fetchResearchPage, researchEndpoint} from './research-feed';
import data from "../data/research.json";
import type { ResearchPreview } from "./research";
const research = data as ResearchPreview[];
const CACHE_WINDOW = 60 * 1000; // Firebase owns the 30-minute snapshot cadence.
type ResearchCache = {
  items: ResearchPreview[];
  updatedAt: number;
  retryAt: number;
  pending?: Promise<ResearchPreview[]>;
};
// Keep the cache through development module reloads and share concurrent requests.
const cacheHost = globalThis as typeof globalThis & {
  __researchArchiveCache?: ResearchCache;
};
const cache: ResearchCache = cacheHost.__researchArchiveCache || {
  items: research,
  updatedAt: 0,
  retryAt: 0,
};
cacheHost.__researchArchiveCache = cache;

async function loadResearch(): Promise<ResearchPreview[]> {
  const items: ResearchPreview[] = [];
  const cursors = new Set<string>();
  let cursor: string | null = null;
  do {
    const {payload} = await fetchResearchPage(researchEndpoint +
      (cursor ? '?after=' + encodeURIComponent(cursor) : ''));
    items.push(...payload.items);
    cursor = payload.next || null;
    if (cursor && cursors.has(cursor))
      throw new Error("Repeated research cursor");
    if (cursor) cursors.add(cursor);
  } while (cursor);
  return Array.from(
    new Map(items.map((item) => [item.id, item])).values(),
  ).sort((a, b) => (b.time || 0) - (a.time || 0) || a.id.localeCompare(b.id));
}

export async function fetchResearch(): Promise<ResearchPreview[]> {
  if (Date.now() - cache.updatedAt < CACHE_WINDOW || Date.now() < cache.retryAt)
    return cache.items;
  if (!cache.pending) {
    cache.pending = loadResearch()
      .then((items) => {
        cache.items = items;
        cache.updatedAt = Date.now();
        cache.retryAt = 0;
        return items;
      })
      .catch((error) => {
        console.warn("Research refresh failed; using saved articles:", error);
        cache.retryAt = Date.now() + 60000;
        return cache.items;
      })
      .finally(() => {
        cache.pending = undefined;
      });
  }
  // Next dev reruns getStaticProps on every navigation. Serve the snapshot while
  // refreshing in its long-lived process. Production awaits refresh so ISR never
  // depends on background work that a serverless host might suspend.
  if (process.env.NODE_ENV === "development" && cache.items.length)
    return cache.items;
  return cache.pending;
}
