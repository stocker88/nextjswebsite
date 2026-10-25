import saved from '../data/insider-news.json';
import {validInsiderArticle,InsiderArticle,insiderPageSize} from './insider-news';
export const insiderArticles=(saved.items as unknown[]).filter(validInsiderArticle).filter(a=>Date.parse(a.publishedAt)<=Date.now()).sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt)||Number(b.kind==='daily_recap')-Number(a.kind==='daily_recap')||a.slug.localeCompare(b.slug));
export function insiderArchiveProps(page=1){return {props:{items:insiderArticles.slice((page-1)*insiderPageSize,page*insiderPageSize),page,pages:Math.max(1,Math.ceil(insiderArticles.length/insiderPageSize))}};}
export function findInsiderArticle(slug:string):InsiderArticle|undefined{return insiderArticles.find(a=>a.slug===slug);}
