import saved from '../data/featured-research.json';
import {findResearchByRoute, findAttachedResearchByRoute, ResearchPreview} from './research';

// Curated, durable snapshots. Never replaced by the rolling research sync.
// Remove or edit entries only deliberately, not when the feed expires them.
export const featuredResearch: ResearchPreview[] = saved;
export const overnightOptionsResult = featuredResearch.find(
  item => item.id === 'Z1DGRFrLd7Gl7ZuAV712',
)!;

export async function resolveResearchArticle(
  route: string,
  loadResearch: () => Promise<ResearchPreview[]>,
): Promise<ResearchPreview | undefined> {
  const featured = findResearchByRoute(featuredResearch, route);
  if (featured) return featured;
  const items = await loadResearch();
  return findResearchByRoute(items, route) || findAttachedResearchByRoute(items, route);
}
