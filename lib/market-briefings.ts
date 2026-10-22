import type {EditorialImage} from '../components/EditorialPhoto';
import saved from '../data/market-briefings.json';
import type {Event} from './earnings';
import {SITE} from './seo';
export type Briefing={leadImage?:EditorialImage|null;version:number;id:string;postId:string;kind:'premarket'|'earnings_preview'|'earnings_daily'|'earnings_weekly';slug:string;title:string;summary:string;sessionDate:string;publishedAt:string;updatedAt:string;symbols:string[];sections:{heading:string;text:string}[];events:(Event&{dateStatus:'expected'|'issuer_confirmed'})[];rows:{symbol:string;name:string;price:number;move:number;quoteAsOf:string}[];sources:{title:string;url:string}[];author:{name:string;url:string};disclosure:string;collectedAt?:string;coverage?:number;images?:{url:string;title:string;width:number;height:number;alt:string}[]};
export const briefings=(saved as Briefing[]).sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
export const briefingUrl=(a:Briefing)=>(a.kind==='premarket'?'/news/briefings/':'/catalysts/')+a.slug+'/';
export const stockBriefings=(symbol:string)=>briefings.filter(a=>a.symbols.includes(symbol)).slice(0,4);
export const briefingSchema=(a:Briefing)=>({'@context':'https://schema.org','@type':'NewsArticle',headline:a.title,description:a.summary,datePublished:a.publishedAt,dateModified:a.updatedAt,mainEntityOfPage:SITE+briefingUrl(a),author:{'@type':'Organization',...a.author},publisher:{'@type':'Organization',name:'Stocks To Buy Now AI',url:SITE},about:a.symbols.map(s=>({'@type':'Corporation',tickerSymbol:s})),image:[a.leadImage?.url,...(a.images||[]).map(i=>i.url)].filter(Boolean),articleBody:a.sections.map(s=>s.heading+'\n'+s.text).join('\n\n'),isAccessibleForFree:true});
