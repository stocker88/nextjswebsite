import data from "../data/public-articles.json";
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
