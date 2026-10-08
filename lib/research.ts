export type ResearchPreview = {id: string; title: string; time: number | null; symbols: string[]; likes: number; comments: number; shares: number; educationPreview?: string; attachedTitle?: string};
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
