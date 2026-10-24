import Link from 'next/link';
import {useState} from 'react';
import {briefingUrl,type Briefing} from '../lib/market-briefings';
import {useArticlePost} from '../lib/use-article-post';
import ArticlePostEngagement from './ArticlePostEngagement';
export default function MarketInsightCard({article:a}:{article:Briefing}){
 const post=useArticlePost(a.postId),[coverFailed,setCoverFailed]=useState(false);
 const images=a.images?.length?(a.kind==='post_close'&&a.images.length===3?[a.images[0],{...a.images[2],title:'After-hours heatmap & movers'}]:a.images.slice(0,2)):(post?.images||[]).slice(0,2).map((i,n)=>({...i,title:i.filename?.replace(/\.[^.]+$/,'').replace(/[-_]+/g,' ').replace(/^./,c=>c.toUpperCase())||'Market insight '+(n+1),alt:i.filename||'Market insight '+(n+1)}));
 const date=new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(a.sessionDate+'T12:00:00Z'));
 return <article className="market-insight-card" data-app-post-id={a.postId}>
  <Link className="card-link" href={briefingUrl(a)}>
   <div className="card-top"><span className="topic">Market insights <span aria-hidden="true">↗</span></span><time dateTime={a.sessionDate}>{date}</time></div>
   <h2>{a.title}</h2><p className="preview">{a.summary}</p>
   {a.leadImage&&!coverFailed&&<figure className="cover"><img src={a.leadImage.url} alt={a.leadImage.alt} width={a.leadImage.width} height={a.leadImage.height} loading="lazy" onError={()=>setCoverFailed(true)}/><figcaption>{a.leadImage.caption} Photo: {a.leadImage.credit} · {a.leadImage.license}</figcaption></figure>}
   {!!images.length&&<div className="image-pair" aria-label="Images from the original market insight post">{images.map(i=><figure key={i.url}><img src={i.url} alt={i.alt} width={i.width||1200} height={i.height||1200} loading="lazy" decoding="async"/><figcaption>{i.title}</figcaption></figure>)}</div>}
   <div className="card-footer"><ArticlePostEngagement postId={a.postId}/><span className="read-link">Read market insights <span aria-hidden="true">→</span></span></div>
  </Link>
  <style jsx>{`
   .market-insight-card{display:flex;flex-direction:column;min-width:0;border:1px solid #2c3b52;border-radius:24px;overflow:hidden;background:linear-gradient(145deg,#111d2e,#0c1422);color:#f1f4fc}
   .market-insight-card :global(.card-link){display:flex;flex:1;flex-direction:column;padding:26px;color:inherit;text-decoration:none;outline-offset:-4px}
   .market-insight-card:focus-within{border-color:#ad8dff;box-shadow:0 0 0 3px #ad8dff44}
   .market-insight-card :global(.card-link:focus-visible){outline:2px solid #c2a9ff}
   .card-top{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:24px}.topic{display:inline-flex;gap:14px;border:1px solid #8660d8;background:#8b5cf61a;border-radius:999px;padding:8px 13px;color:#d8c7ff;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}time{font-size:12px;color:#a9b6ca;white-space:nowrap}
   h2{font-size:23px;line-height:1.35;letter-spacing:-.025em;margin:0 0 12px;color:#f0f4fc}.preview{font-size:14px;line-height:1.65;color:#aabbd0;margin:0 0 22px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
   figure{min-width:0;margin:0}.cover{margin-bottom:20px}.cover img{width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;border-radius:13px}.cover figcaption{text-align:left;font-size:10px}.image-pair{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:auto;margin-bottom:20px}.image-pair img{display:block;width:100%;height:auto;aspect-ratio:1;object-fit:contain;border-radius:13px;background:#080f20}figcaption{padding-top:9px;font-size:12px;line-height:1.5;color:#b9c8dc;text-align:center}
   .card-footer{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;border-top:1px solid #29394c;padding-top:16px;margin-top:auto}.read-link{display:flex;gap:10px;margin-left:auto;color:#c8afff;font-size:13px;font-weight:600}
   @media(hover:hover){.market-insight-card:hover{border-color:#9877e5}}
   @media(max-width:700px){.market-insight-card :global(.card-link){padding:20px}.topic{font-size:10px;padding:7px 10px;gap:8px}time{font-size:11px}h2{font-size:21px}.preview{font-size:13px}.image-pair{gap:10px}}
  `}</style>
 </article>;
}
