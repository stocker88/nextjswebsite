import type {GetServerSideProps} from 'next';
import {lessons} from '../lib/learning';
import {lessonPath, lessonSummary} from '../lib/learning-format';
import {SITE} from '../lib/seo';

const xml = (value: string) => value.replace(/[<>&"']/g, character => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[character]!));
export const getServerSideProps: GetServerSideProps = async ({res}) => {
  const urls = lessons.map(lesson => `<url><loc>${xml(SITE + lessonPath(lesson.id))}</loc><video:video><video:thumbnail_loc>${xml(lesson.thumbnail)}</video:thumbnail_loc><video:title>${xml(lesson.title)}</video:title><video:description>${xml(lessonSummary(lesson))}</video:description><video:player_loc>${xml('https://www.youtube-nocookie.com/embed/' + lesson.id)}</video:player_loc><video:duration>${lesson.durationSeconds}</video:duration><video:publication_date>${xml(lesson.publishedAt)}</video:publication_date><video:requires_subscription>no</video:requires_subscription></video:video></url>`).join('');
  res.setHeader('Content-Type','application/xml; charset=utf-8');
  res.setHeader('Cache-Control','public, max-age=3600, s-maxage=86400');
  res.write(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">${urls}</urlset>`);
  res.end();
  return {props:{}};
};
export default function VideoSitemap(){return null;}
