import type {EditorialImage} from '../components/EditorialPhoto';
import saved from '../data/mover-research.json';
import {NEWS_PUBLISHER} from './seo';
export type MoverArticle={leadImage?:EditorialImage|null;symbols?:string[];kind?:'earnings_review'|'manual_news'|'sector_news';priceBasis?:'regular_close';sections?:{heading:string;text:string}[];researchContentKind?:'earnings_results';earningsHighlightStyle?:'kpi-cards-v1';earningsHighlights?:string[];researchSessionSnapshot?:{symbol:string;move:number;sessionDate:string;quoteAsOf:string;marketSession?:'premarket'|'intraday'|'afterhours';regularClose?:number;quotePrice?:number;priceBasis?:'regular_close';returnBasis?:string};version:number;id:string;postId:string;slug:string;title:string;symbol:string;companyName:string;sessionDate:string;marketSession?:'intraday'|'afterhours'|'premarket';regularClose?:number;direction:'up'|'down'|'flat';move:number|null;quoteAsOf:string|null;quotePrice:number|null;publishedAt:string;updatedAt:string;summary:string;catalyst:string;earningsPeriod?:string;recap:string[];setup:string;technicalDate:string;images:{url:string;title:string;width:number;height:number;alt:string}[];sources:{title:string;url:string}[];author:{name:string;url:string};aiAssisted:boolean;disclosure:string;stockContext:{industry:string;business:string;priceDate:string;close:number;marketCapB:number;fiscalLabel:string;annualRevenueB:number;ttmPE:number;forwardPE:number;forwardYear:number;rsi14:number;atr14:number}};
// Some generated articles provide separate scenarios instead of one paragraph.
// Normalize at the boundary so both React and structured data receive text.
export function normalizeMoverSetup(value:unknown):string{
 if(typeof value==='string')return value;
 if(value&&typeof value==='object'&&!Array.isArray(value)){
  const labels:Record<string,string>={bullish:'Bullish scenario',bearish:'Bearish scenario',confirmation:'Confirmation'};
  const entries=Object.entries(value);
  if(entries.length&&entries.every(([key,text])=>key in labels&&typeof text==='string'))
   return entries.map(([key,text])=>`${labels[key]}: ${text}`).join('\n\n');
 }
 throw new Error('Unsupported mover research setup format');
}
export const moverArticles=(saved as MoverArticle[]).map(article=>({...article,setup:normalizeMoverSetup(article.setup)})).sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt));
export const moverArticleUrl=(a:Pick<MoverArticle,'slug'>)=>'/news/'+a.slug+'/';
export function moverArticleSchema(a:MoverArticle){return {'@context':'https://schema.org','@type':'NewsArticle',headline:a.title,description:a.summary,datePublished:a.publishedAt,dateModified:a.updatedAt,image:[a.leadImage?.url,...a.images.map(i=>i.url)].filter(Boolean),author:{'@type':'Organization',...a.author},publisher:NEWS_PUBLISHER,mainEntityOfPage:'https://www.stockstobuynow.ai'+moverArticleUrl(a),isAccessibleForFree:true,inLanguage:'en-US',articleSection:a.kind==='sector_news'?'Sector News':a.kind==='manual_news'?'Company News':a.kind==='earnings_review'?'Earnings Reviews':a.marketSession==='afterhours'?'After-Hours Stock Movers':a.marketSession==='premarket'?'Pre-Market Stock Movers':a.earningsPeriod?'Earnings and Stock Movers':'Stock Movers',about:a.kind==='sector_news'?(a.symbols||[]).map(symbol=>({'@type':'Corporation',tickerSymbol:symbol})):{'@type':'Corporation',name:a.companyName,tickerSymbol:a.symbol},citation:a.sources.map(s=>s.url),articleBody:[a.catalyst,...(a.sections||[]).flatMap(s=>[s.heading,s.text]),...a.recap,a.setup].join('\n\n')};}
