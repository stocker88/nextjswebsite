import data from '../data/research.json';
export type ResearchPreview = {id: string; title: string; time: number | null; symbols: string[]; likes: number; comments: number; shares: number; attachedTitle?: string};
export const research = data as ResearchPreview[];
export const researchUrl = (id: string) => `/stocks-to-buy-now/${encodeURIComponent(id)}`;

export async function fetchResearch(): Promise<ResearchPreview[]> {
  try {
    const items: ResearchPreview[] = [];
    const cursors = new Set<string>();
    let cursor: string | null = null;
    do {
      const response = await fetch('https://us-central1-stocker-fcda2.cloudfunctions.net/researchPreviews' + (cursor ? '?after=' + encodeURIComponent(cursor) : ''));
      if (!response.ok) throw new Error(`Research request failed: ${response.status}`);
      const payload = await response.json();
      if (!Array.isArray(payload.items)) throw new Error('Invalid research response');
      items.push(...payload.items);
      cursor = payload.next || null;
      if (cursor && cursors.has(cursor)) throw new Error('Repeated research cursor');
      if (cursor) cursors.add(cursor);
    } while (cursor);
    return Array.from(new Map(items.map(item => [item.id, item])).values())
      .sort((a,b) => (b.time || 0) - (a.time || 0) || a.id.localeCompare(b.id));
  } catch {
    return research;
  }
}
