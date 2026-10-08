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
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const items: ResearchPreview[] = [];
    const cursors = new Set<string>();
    let cursor: string | null = null;
    do {
      const response = await fetch(
        "https://us-central1-stocker-fcda2.cloudfunctions.net/researchPreviews" +
          (cursor ? "?after=" + encodeURIComponent(cursor) : ""),
        { signal: controller.signal },
      );
      if (!response.ok)
        throw new Error(`Research request failed: ${response.status}`);
      const payload = await response.json();
      if (!Array.isArray(payload.items))
        throw new Error("Invalid research response");
      items.push(...payload.items);
      cursor = payload.next || null;
      if (cursor && cursors.has(cursor))
        throw new Error("Repeated research cursor");
      if (cursor) cursors.add(cursor);
    } while (cursor);
    return Array.from(
      new Map(items.map((item) => [item.id, item])).values(),
    ).sort((a, b) => (b.time || 0) - (a.time || 0) || a.id.localeCompare(b.id));
  } finally {
    clearTimeout(timeout);
  }
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
