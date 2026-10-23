import snapshot from '../data/market-news.json';
export type Headline={id:string;title:string;source:string;sourceUrl:string;symbol:string;publishedAt:string;imageUrl?:string|null};
export type NewsSnapshot={updatedAt:string|null;items:Headline[]};
export const savedNews=snapshot as NewsSnapshot;
export const newsEndpoint='https://us-central1-stocker-fcda2.cloudfunctions.net/generalNews';
export const newsSlug=(n:Headline)=>n.id+'-'+n.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,100);
export const newsUrl=(n:Headline)=>{const saved=savedNews.items.find(x=>x.id===n.id);return saved?'/market-news/'+newsSlug(saved)+'/':'/market-news/story/?id='+encodeURIComponent(n.id);};
let headlineRequest:Promise<NewsSnapshot>|undefined;
let latestHeadlines=savedNews,lastHeadlineCheck=0;
async function refreshHeadlines():Promise<NewsSnapshot>{
 let old=latestHeadlines;
 try{const cached=JSON.parse(localStorage.getItem('market-headlines.v1')||'null');if(cached?.items?.length&&Date.parse(cached.updatedAt)>Date.parse(old.updatedAt||''))old=cached;}catch{}
 try{
  const res=await fetch(newsEndpoint,{signal:AbortSignal.timeout(15000)});if(!res.ok)throw Error();
  const data=await res.json();if(!Array.isArray(data.items)||!data.items.length)throw Error();
  try{localStorage.setItem('market-headlines.v1',JSON.stringify(data));}catch{}
  return data;
 }catch{return old;}
}
// All mover rows and the news feed share one request, including failures.
export function loadHeadlines():Promise<NewsSnapshot>{
 if(headlineRequest)return headlineRequest;
 if(Date.now()-lastHeadlineCheck<60000)return Promise.resolve(latestHeadlines);
 headlineRequest=refreshHeadlines().then(data=>{latestHeadlines=data;lastHeadlineCheck=Date.now();return data;}).finally(()=>{headlineRequest=undefined;});
 return headlineRequest;
}

export function firstNewsSymbol(symbols:string):string {
 const first=(symbols.trim().split(/[,;\s]+/)[0]||'').split(':').pop()!.replace(/^\$/, '').toUpperCase();
 return /^[A-Z0-9][A-Z0-9.-]{0,14}$/.test(first)?first:'';
}
