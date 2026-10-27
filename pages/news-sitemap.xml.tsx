import {getAllPosts} from '../lib/api';
import {insiderArticlePath} from '../lib/insider-news';
import {insiderArticles} from '../lib/insider-news-server';
import {briefings,briefingUrl} from '../lib/market-briefings';
import {moverArticles,moverArticleUrl} from '../lib/mover-research';
import {newsSitemapXml,type NewsSitemapEntry} from '../lib/news-sitemap';
import {publicArticles} from '../lib/public-articles';
import {researchUrl} from '../lib/research';
import {fetchResearch} from '../lib/research-server';

export default function NewsSitemap() { return null; }

export async function getServerSideProps({res}: any) {
  const research = publicArticles.length ? await fetchResearch() : [];
  const researchById = new Map(research.map(item => [item.id, item]));
  const entries: NewsSitemapEntry[] = [];

  moverArticles.forEach(article => entries.push({
    path: moverArticleUrl(article),
    title: article.title,
    publishedAt: article.publishedAt,
  }));
  briefings.forEach(article => entries.push({
    path: briefingUrl(article),
    title: article.title,
    publishedAt: article.publishedAt,
  }));
  insiderArticles.filter(article => !article.noActivity).forEach(article => entries.push({
    path: insiderArticlePath(article),
    title: article.title,
    publishedAt: article.publishedAt,
  }));
  publicArticles.forEach(article => {
    const item = researchById.get(article.postId);
    if (item) entries.push({
      path: researchUrl(item.id, item.title),
      title: item.title,
      publishedAt: article.publishedAt,
    });
  });
  getAllPosts(['slug','title','date']).filter(post => post.slug !== 'privacypolicy').forEach(post => entries.push({
    path: `/posts/${post.slug}`,
    title: post.title,
    publishedAt: post.date,
  }));

  const xml = newsSitemapXml(entries);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
  res.setHeader('X-Robots-Tag', 'noindex, follow');
  res.end(xml);
  return {props:{}};
}
