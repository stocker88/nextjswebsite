import data from "../data/public-articles.json";
import type {ResearchPreview} from './research';
import {researchUrl} from './research';
import {absoluteUrl,NEWS_PUBLISHER,SITE} from './seo';
export type PublicArticle = {
  postId: string;
  summary: string;
  paragraphs: string[];
  sources: { title: string; url: string }[];
  author: { name: string; url: string };
  reviewer: string;
  publishedAt: string;
  updatedAt: string;
  aiAssisted: boolean;
  disclosure: string;
  correction?: string;
};
export const publicArticles = data as PublicArticle[];

export function publicResearchArticleSchema(article: PublicArticle, item: ResearchPreview) {
  const images = (item.images || []).map(image => absoluteUrl(image.url));
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    description: article.summary,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {"@type": "Person", ...article.author},
    publisher: NEWS_PUBLISHER,
    mainEntityOfPage: SITE + researchUrl(item.id, item.title),
    image: images.length ? images : [SITE + '/assets/images/founder-trade-chart-social.jpg'],
    articleBody: [article.summary, ...article.paragraphs].join('\n\n'),
    citation: article.sources.map(source => source.url),
    articleSection: 'Stock Market News',
    inLanguage: 'en-US',
    isAccessibleForFree: true,
  };
}
