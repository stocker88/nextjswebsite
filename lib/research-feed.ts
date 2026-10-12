import type {ResearchPreview} from './research';

export const researchEndpoint = 'https://us-central1-stocker-fcda2.cloudfunctions.net/researchPreviews';
export function recentResearch(items: ResearchPreview[], now = Date.now()) {
  const milliseconds = (time: number) => time < 1e12 ? time * 1000 : time;
  return Array.from(new Map(items.map(item => [item.id, item])).values())
    .filter(item => typeof item.time === 'number' && Number.isFinite(item.time) &&
      milliseconds(item.time) >= now - 10 * 86400000 && milliseconds(item.time) <= now)
    .sort((a, b) => milliseconds(b.time!) - milliseconds(a.time!));
}

// Limit each request, not the entire paginated archive. Older iOS webviews do
// not support AbortSignal.timeout, so use an ordinary controller and timer.
export async function fetchResearchPage(url: string, signal?: AbortSignal, fetcher: typeof fetch = fetch) {
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (signal?.aborted) controller.abort();
  signal?.addEventListener('abort', abort);
  const timeout = setTimeout(abort, 15000);
  try {
    const response = await fetcher(url, {signal: controller.signal, cache: 'no-store'});
    if (!response.ok) throw new Error(`Research request failed: ${response.status}`);
    const payload = await response.json();
    if (!Array.isArray(payload.items) || payload.items.some((item: ResearchPreview) =>
      !item || typeof item.id !== 'string' || typeof item.title !== 'string' || !Array.isArray(item.symbols))) {
      throw new Error('Invalid research response');
    }
    return {payload, serverTime: Date.parse(response.headers.get('date') || '') || Date.now()};
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abort);
  }
}

export async function loadRecentResearch(signal: AbortSignal, onProgress: (items: ResearchPreview[]) => void, fetcher: typeof fetch = fetch) {
  try {
    // Generated with the website. Same-origin data also works when an in-app
    // browser blocks or stalls cross-origin requests to Cloud Functions.
    const {payload} = await fetchResearchPage('/research-previews.json', signal, fetcher);
    if (payload.kind !== 'recent-research') throw new Error('Invalid recent snapshot');
    return payload.items as ResearchPreview[];
  } catch (error) {
    if (signal.aborted) throw error;
  }
  const archive: ResearchPreview[] = [];
  const cursors = new Set<string>();
  let cursor: string | null = null;
  let recent: ResearchPreview[] = [];
  do {
    const {payload, serverTime} = await fetchResearchPage(researchEndpoint +
      (cursor ? '?after=' + encodeURIComponent(cursor) : ''), signal, fetcher);
    archive.push(...payload.items);
    recent = recentResearch(archive, serverTime);
    onProgress(recent);
    cursor = payload.next || null;
    if (cursor && (typeof cursor !== 'string' || cursors.has(cursor))) throw new Error('Invalid research cursor');
    if (cursor) cursors.add(cursor);
  } while (cursor);
  return recent;
}
