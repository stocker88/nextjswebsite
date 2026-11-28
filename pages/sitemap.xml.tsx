import legalDisclosures from '../data/legal-disclosures.json';
import marketEducationGuides from '../data/market-education-guides.json';
import investmentManagementGuides from '../data/investment-management-guides.json';
import {spanishRoutes,hasSpanish,englishPath,routePath,languages,languageOf,languagePath,availableLanguages,hasTranslation} from '../lib/localization/routes';
import {toolEntries} from '../lib/seo-tools-server';
import {workflows} from '../lib/trading-workflows';
import {cachedPredictionStocks,predictionCatalog,cachedPredictionDetail} from '../lib/prediction-cache-server';
import {periods,periodPath,horizonEnd} from '../lib/prediction-periods';
import investingGuides from '../data/investing-guides.json';
import questionGuides from '../data/search-question-guides.json';
import {learningPaths} from '../lib/learning';
import {optionResults,optionResultUrl} from '../lib/option-results';
import {insiderArticles} from '../lib/insider-news-server';
import {insiderArticlePath,insiderPagePath,insiderPageSize} from '../lib/insider-news';
import {indexableStockPages} from '../lib/indexable-stock-pages';
import {briefings,briefingUrl} from '../lib/market-briefings';
import {moverArticles,moverArticleUrl} from '../lib/mover-research';
import {loadIndustryDirectory} from '../lib/stock-research-server';
import {featuredResearch} from '../lib/featured-research';
import {savedNews,newsSlug} from '../lib/market-news';
import earningsCalendar from '../data/earnings-calendar.json';
import {researchUrl} from '../lib/research';
import {catalog} from '../lib/catalog';
import { fetchResearch } from "../lib/research-server";
import {predictionPath, predictionStocks} from '../lib/stock-predictions';
import { stocks } from "../lib/stocks";
import terms from "../data/glossary.json";
import { publicArticles } from "../lib/public-articles";
import { getAllPosts } from "../lib/api";
import { SITE, isoDate } from "../lib/seo";
import {publicInvestors,investorPath} from '../lib/public-investors';
const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
export default function Sitemap() {
  return null;
}
export async function getServerSideProps({ res, sitemapPart }: any) {
  const items = await fetchResearch();
  const entries: { path: string; modified?: string | null }[] = [
    "/",
    "/stocks-to-buy",
    "/prediction/",
    "/earnings-calendar/",
    "/premarket-stock-heatmap/",
    "/after-hours-stock-heatmap/",
    "/stock-market-heatmap/",
    "/options-activity/",
    "/smart-money/",
    "/insider-news/",
    "/politician-trades/",
    "/hedge-fund-activity/",
    "/insider-trades/",
    "/smart-money-guide/",
    "/results/",
    "/fear-and-greed-index/",
    "/hormuz-transit-index/",
    "/pentagon-pizza-index/",
    "/options-profit-calculator/",
    "/options-strategies/",
    "/stock-market-calendar/",
    "/ipo-calendar/",
    "/earnings-calendar/this-week/",
    "/earnings-calendar/next-week/",
    "/stock-market-news",
    "/how-to-predict-index-inclusions/",
    "/how-to-research-hedge-fund-buys/",
    "/how-to-research-market-direction/",
    "/stock-market-predictions/",
    "/how-to-research-pre-earnings-moves/",
    "/how-to-research-earnings-predictions/",
    "/how-to-research-post-earnings-moves/",


    "/market-news/",
    "/stocks",
    "/facts",
    "/company/",
    "/company/culture/",
    "/company/careers/",
    "/methodology",
    "/editorial-policy",
    "/authors/aness-hussein-ali",
    "/glossary",
    "/guides/how-to-make-1000-a-month-trading-stocks/",
  ].map((path) => ({ path }));
  entries.push(...toolEntries(),...['/trading-tools/','/stock-analysis/','/stock-comparison/','/crypto-prediction/','/forex-prediction/','/tools/position-size-calculator/','/tools/forex-pip-value-calculator/','/tools/futures-tick-value-calculator/'].map(path=>({path})),...workflows.map(g=>({path:'/trading-guides/'+g.slug+'/'})));
  entries.push({path:'/legal/'},...legalDisclosures.map(p=>({path:'/legal/'+p.slug+'/'})));
  entries.push({path:'/guides/financial-markets/'},...marketEducationGuides.map(g=>({path:'/guides/financial-markets/'+g.slug+'/'})));
  entries.push({path:'/guides/investment-management/'},...investmentManagementGuides.map(g=>({path:'/guides/investment-management/'+g.slug+'/'})));
  entries.push({path:'/guides/questions/'},...questionGuides.map(g=>({path:'/guides/'+g.slug+'/'})));
  entries.push({path:'/broker-comparison/'},{path:'/guides/'},...investingGuides.map(g=>({path:'/guides/'+g.slug+'/'})));
  entries.push(...learningPaths().map(path=>({path})),{path:'/reviews/'});
  entries.push({path:'/smart-money/investors/'},...publicInvestors.map(p=>({path:investorPath(p.id)})));
  insiderArticles.filter(a=>!a.noActivity).forEach(a=>entries.push({path:insiderArticlePath(a),modified:a.updatedAt}));
  for(let page=2;page<=Math.ceil(insiderArticles.length/insiderPageSize);page++)entries.push({path:insiderPagePath(page)});
  optionResults.forEach(result=>entries.push({path:optionResultUrl(result)}));
  entries.push({path:'/news/'});
  entries.push({path:'/catalysts/'});
  entries.push(...indexableStockPages());
  briefings.forEach(a=>entries.push({path:briefingUrl(a),modified:a.updatedAt}));
  moverArticles.forEach(a=>entries.push({path:moverArticleUrl(a),modified:a.updatedAt}));
  entries.push({path:'/industries/'});
  loadIndustryDirectory().forEach(i=>entries.push({path:'/industries/'+i.slug+'/'}));
  earningsCalendar.detailSymbols.forEach(s=>entries.push({path:`/earnings-calendar/${s.toLowerCase()}/`,modified:earningsCalendar.updatedAt}));
  savedNews.items.forEach(n=>entries.push({path:'/market-news/'+newsSlug(n)+'/',modified:n.publishedAt}));
  stocks.forEach((s) => entries.push({ path: `/stocks/${s.slug}` }));
  predictionCatalog().forEach(stock=>entries.push({path:predictionPath(stock)+"/",modified:cachedPredictionDetail(stock.ticker)?.updatedAt}));
  const predictionToday=new Date().toISOString().slice(0,10);
  cachedPredictionStocks().filter(stock=>{const date=cachedPredictionDetail(stock.ticker)?.priceDate;return date&&Date.parse(date)<=Date.parse(predictionToday)&&Date.parse(predictionToday)-Date.parse(date)<=7*86400000;}).forEach(stock=>periods.filter(p=>horizonEnd(p.id,predictionToday)>=predictionToday).forEach(p=>entries.push({path:periodPath(stock,p.id),modified:cachedPredictionDetail(stock.ticker)?.updatedAt})));
  terms.forEach((t) => entries.push({ path: `/glossary/${t.slug}` }));
  getAllPosts(["slug", "date"]).forEach((p) =>
    entries.push({ path: `/posts/${p.slug}` }),
  );
  [...items.filter(i => !featuredResearch.some(featured => featured.id === i.id)), ...featuredResearch].forEach((i) =>
    entries.push({
      path: researchUrl(i.id, i.title),
      modified:
        publicArticles.find((a) => a.postId === i.id)?.updatedAt ||
        isoDate(i.time),
    }),
  );
  for (let page = 2; page <= Math.ceil(items.length / 40); page++)
    entries.push({ path: `/stock-market-news/page/${page}` });
  for(let page=2;page<=Math.ceil(catalog.length/48);page++) entries.push({path:`/stocks?page=${page}`});
 const originalEntries=[...entries];
 for(const language of languages.filter(l=>l!=='en'))entries.push(...originalEntries.filter(e=>hasTranslation(e.path,language)).map(e=>({...e,path:languagePath(e.path,language)})));
 entries.push(...spanishRoutes.map(path=>({path:'/es'+path})));
 const unique = Array.from(new Map(entries.map((e) => [e.path, e])).values());
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=300",
  );
  const chunkSize=10000;
  if(!sitemapPart){
    const groups=languages.flatMap(language=>{
      const count=unique.filter(e=>languageOf(e.path)===language).length;
      return Array.from({length:Math.ceil(count/chunkSize)},(_,i)=>`${language}-${i+1}`);
    });
    res.end('<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+groups.map(part=>`<sitemap><loc>${SITE}/sitemaps/${part}.xml</loc></sitemap>`).join('')+'</sitemapindex>');
    return {props:{}};
  }
  const match=/^(en|es|de|fr|ja|ko)-([1-9][0-9]*)$/.exec(sitemapPart.replace(/\.xml$/, ''));
  if(!match)return {notFound:true};
  const selected=unique.filter(e=>languageOf(e.path)===match[1]).slice((Number(match[2])-1)*chunkSize,Number(match[2])*chunkSize);
  if(!selected.length)return {notFound:true};
  res.end(
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' +
      selected
        .map(
          (e) =>
            `<url><loc>${escapeXml(SITE + e.path)}</loc>${availableLanguages(e.path).length>1?[...availableLanguages(e.path),'x-default'].map(lang=>`<xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(SITE+languagePath(routePath(englishPath(e.path)),lang==='x-default'?'en':lang as typeof languages[number]))}"/>`).join(''):''}${e.modified ? `<lastmod>${escapeXml(e.modified)}</lastmod>` : ""}</url>`,
        )
        .join("") +
      "</urlset>",
  );
  return { props: {} };
}
