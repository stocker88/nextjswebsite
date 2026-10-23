import EngagementIcon from './EngagementIcon';
import {useArticlePost} from '../lib/use-article-post';
export default function ArticlePostEngagement({postId}:{postId:string}){
 const post=useArticlePost(postId);
 if(!post||post.likes===null||post.comments===null)return null;
 return <div className="post-engagement" data-app-post-id={postId} aria-label="App post engagement">
  {(['likes','comments'] as const).map(kind=><span key={kind} aria-label={`${post[kind]} ${kind}`}><EngagementIcon kind={kind}/>{new Intl.NumberFormat('en-US').format(post[kind]!)}</span>)}
  <style jsx>{`.post-engagement{display:flex;align-items:center;gap:16px;flex-wrap:wrap;color:#a4b3ca;font-size:12px;font-variant-numeric:tabular-nums}.post-engagement span{display:inline-flex;align-items:center;gap:6px;white-space:nowrap}`}</style>
 </div>;
}
