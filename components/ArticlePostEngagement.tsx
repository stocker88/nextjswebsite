import {useEffect,useState,type MouseEvent} from 'react';
import EngagementIcon from './EngagementIcon';
import {useArticlePost} from '../lib/use-article-post';
import {useSiteAccount} from './SiteAccount';
import {cachedMembershipStatus,refreshMembershipStatus} from '../lib/membership-status';
export default function ArticlePostEngagement({postId,interactive=false}:{postId:string;interactive?:boolean}){
 const post=useArticlePost(postId);
 const {user,ready}=useSiteAccount();
 const [busy,setBusy]=useState<'likes'|'comments'|null>(null);
 const [message,setMessage]=useState('');
 const [canInteract,setCanInteract]=useState(false);
 useEffect(()=>{
  if(!interactive||!ready||!user){setCanInteract(false);return}
  let current=true;
  const cached=cachedMembershipStatus(user.uid);
  if(cached)setCanInteract(cached.isActive&&cached.hasPro===true);
  void refreshMembershipStatus(user.uid).then(value=>{if(current)setCanInteract(value.isActive&&value.hasPro===true)}).catch(()=>{if(current)setCanInteract(false)});
  return()=>{current=false};
 },[interactive,ready,user?.uid]);
 if(!post||post.likes===null||post.comments===null)return null;
 async function open(kind:'likes'|'comments',event:MouseEvent<HTMLButtonElement>){
  event.preventDefault();event.stopPropagation();
  if(!ready||busy||!user||!canInteract)return;
  setBusy(kind);setMessage('');
  try{
   const cached=cachedMembershipStatus(user.uid);
   const membership=cached?.status==='active'&&cached.isActive&&cached.hasPro?cached:await refreshMembershipStatus(user.uid);
   if(!membership.isActive||!membership.hasPro){setCanInteract(false);return}
   const action=kind==='comments'?'comments':'like';
   window.location.assign(`/insight_details_page?postId=${encodeURIComponent(postId)}&action=${action}&utm_source=website&utm_medium=article_engagement&utm_campaign=pro_community`);
  }catch{setMessage('We could not verify Pro access. Please try again.')}finally{setBusy(null)}
 }
 return <div className="post-engagement" data-app-post-id={postId} aria-label="App post engagement">
  {(['likes','comments'] as const).map(kind=>interactive&&canInteract?<button key={kind} type="button" disabled={!!busy} aria-label={`${kind==='likes'?'Like this post':'View comments'}; ${post[kind]} ${kind}. Pro members only.`} onClick={event=>void open(kind,event)}><EngagementIcon kind={kind}/>{new Intl.NumberFormat('en-US').format(post[kind]!)}<small>{kind==='likes'?'Like':'Comments'}</small></button>:<span key={kind} aria-label={`${post[kind]} ${kind}`}><EngagementIcon kind={kind}/>{new Intl.NumberFormat('en-US').format(post[kind]!)}</span>)}
  {interactive&&canInteract&&<em>PRO</em>}{message&&<span role="status">{message}</span>}
  <style jsx>{`.post-engagement{display:flex;align-items:center;gap:12px;flex-wrap:wrap;color:#a4b3ca;font-size:12px;font-variant-numeric:tabular-nums}.post-engagement span,.post-engagement button{display:inline-flex;align-items:center;gap:6px;white-space:nowrap}.post-engagement button{padding:7px 10px;border:1px solid #34445d;border-radius:999px;background:#111c2c;color:#b8c7dc;font:inherit;cursor:pointer;transition:border-color .15s,color .15s,background .15s}.post-engagement button:hover{border-color:#9b7bdf;background:#211c35;color:#f1eaff}.post-engagement button:focus-visible{outline:2px solid #b89af3;outline-offset:2px}.post-engagement button:disabled{cursor:wait;opacity:.65}.post-engagement button small{font-size:10px;color:inherit}.post-engagement em{padding:3px 6px;border-radius:5px;background:#8b5cf622;color:#cbb5fb;font-size:8px;font-style:normal;font-weight:800;letter-spacing:.08em}@media(max-width:480px){.post-engagement button small{display:none}}@media(prefers-reduced-motion:reduce){.post-engagement button{transition:none}}`}</style>
 </div>;
}
