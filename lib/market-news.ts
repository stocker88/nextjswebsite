import snapshot from '../data/market-news.json';
export type Headline={id:string;title:string;source:string;sourceUrl:string;symbol:string;publishedAt:string};
export type NewsSnapshot={updatedAt:string|null;items:Headline[]};
export const savedNews=snapshot as NewsSnapshot;
export const newsEndpoint='https://us-central1-stocker-fcda2.cloudfunctions.net/generalNews';
export const newsSlug=(n:Headline)=>n.id+'-'+n.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,100);
export const newsUrl=(n:Headline)=>savedNews.items.some(x=>x.id===n.id)?'/market-news/'+newsSlug(n)+'/':'/market-news/story/?id='+n.id;
export async function loadHeadlines():Promise<NewsSnapshot>{let old=savedNews;try{const cached=JSON.parse(localStorage.getItem('market-headlines.v1')||'null');if(cached?.items?.length&&Date.parse(cached.updatedAt)>Date.parse(old.updatedAt||''))old=cached;}catch{}try{const res=await fetch(newsEndpoint,{signal:AbortSignal.timeout(15000)});if(!res.ok)throw Error();const data=await res.json();if(!Array.isArray(data.items)||!data.items.length)throw Error();try{localStorage.setItem('market-headlines.v1',JSON.stringify(data));}catch{}return data;}catch{return old;}}
