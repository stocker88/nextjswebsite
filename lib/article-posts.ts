import saved from '../data/article-posts.json';
import type {ResearchImage,ResearchPreview} from './research';
import {fetchResearchPage,researchEndpoint} from './research-feed';
export type ArticlePost={id:string;likes:number|null;comments:number|null;images:ResearchImage[]};
export const savedArticlePosts=saved as ArticlePost[];
export function articlePostIndex(items:ResearchPreview[]):Map<string,ArticlePost>{
 const count=(v:unknown)=>typeof v==='number'&&Number.isFinite(v)&&v>=0?Math.floor(v):null;
 const unique=new Map(items.map(p=>[p.id,p]));
 for(const item of items)for(const child of item.attachedThreads||[])if(!unique.has(child.id))unique.set(child.id,child as ResearchPreview);
 return new Map(Array.from(unique.values()).map(p=>[p.id,{id:p.id,likes:count(p.likes),comments:count(p.comments),images:(p.images||[]).filter(i=>typeof i?.url==='string'&&/^https:\/\//.test(i.url)).slice(0,3)}]));
}
let latest=new Map(savedArticlePosts.map(p=>[p.id,p]));
let updatedAt=0,retryAt=0,pending:Promise<Map<string,ArticlePost>>|undefined;
export function cachedArticlePost(id:string){return latest.get(id);}
export function loadArticlePosts():Promise<Map<string,ArticlePost>>{
 if(Date.now()-updatedAt<5*60000||Date.now()<retryAt)return Promise.resolve(latest);
 if(!pending)pending=(async()=>{
  const items:ResearchPreview[]=[],seen=new Set<string>();let cursor:string|null=null;
  do{
   const {payload}=await fetchResearchPage(researchEndpoint+(cursor?'?after='+encodeURIComponent(cursor):''));
   items.push(...payload.items);cursor=payload.next||null;
   if(cursor&&(typeof cursor!=='string'||seen.has(cursor)))throw Error('Invalid post archive cursor');
   if(cursor)seen.add(cursor);
  }while(cursor);
  const refreshed=articlePostIndex(items);
  // Keep saved data for older posts omitted from a bounded public feed.
  latest=new Map([...Array.from(latest),...Array.from(refreshed)]);updatedAt=Date.now();retryAt=0;return latest;
 })().catch(()=>{retryAt=Date.now()+60000;return latest;}).finally(()=>{pending=undefined;});
 return pending;
}
