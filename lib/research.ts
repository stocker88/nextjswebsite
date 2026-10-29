export type ResearchImage = {url: string; filename?: string; width?: number; height?: number};
export type AttachedThread = {id: string; title: string; time: number | null; symbols: string[]; likes?: number; comments?: number; shares?: number; quickTake?: string; images?: ResearchImage[]};
export type ResearchPreview = {cardKind?:'market'|'options';companySymbol?:string;researchSessionSnapshot?:{symbol:string;move:number;sessionDate:string;quoteAsOf:string;marketSession?:'premarket'|'intraday'|'afterhours'};href?:string;category?:string;id: string; title: string; time: number | null; symbols: string[]; likes: number; comments: number; shares: number; quickTake?: string; images?: ResearchImage[]; educationPreview?: string; attachedTitle?: string; attachedThreads?: AttachedThread[]};
export function researchSlug(title: string) {
  const words = title.split(/\r?\n/)[0].normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const shortened = words.length > 90 ? words.slice(0, 90).replace(/-[^-]*$/, '') : words;
  return shortened || 'market-update';
}
export const researchUrl = (id: string, title: string) =>
  `/stock-market-news/${researchSlug(title)}--${encodeURIComponent(id)}`;

// Keep the immutable ID as the lookup key, including after a headline edit.
export function findResearchByRoute(items: ResearchPreview[], route: string) {
  return items.find(item => item.id === route) || items
    .filter(item => route.endsWith('--' + item.id))
    .sort((a,b) => b.id.length - a.id.length)[0];
}

// Main archive entries take precedence over older embedded snapshots. Keep one
// canonical page per ID, even when several posts attach the same thread.
export function researchPages(items: ResearchPreview[]): ResearchPreview[] {
  const pages = new Map(items.map(item => [item.id, item]));
  for (const item of items) for (const thread of item.attachedThreads || []) {
    if (thread.id && !pages.has(thread.id)) {
      pages.set(thread.id, {...thread, likes: thread.likes ?? 0, comments: thread.comments ?? 0, shares: thread.shares ?? 0});
    }
  }
  return Array.from(pages.values());
}

export function findAttachedResearchByRoute(items: ResearchPreview[], route: string): ResearchPreview | undefined {
  return findResearchByRoute(researchPages(items), route);
}

export function displayEngagementCount(value: number): number {
  const original = Number(value) || 0;
  return original * 7 + (original % 3);
}

export const isEarningsFirst = (symbols: string[] = []) => symbols[0]?.trim().replace(/^[#$]/, '').toLowerCase() === 'earnings';
