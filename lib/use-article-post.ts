import {useEffect,useState} from 'react';
import {savedArticlePosts,cachedArticlePost,loadArticlePosts,type ArticlePost} from './article-posts';
export function useArticlePost(postId:string){
 // Start with the same build snapshot during SSR and hydration.
 const [post,setPost]=useState<ArticlePost|undefined>(()=>savedArticlePosts.find(p=>p.id===postId));
 useEffect(()=>{
  let disposed=false;
  const refresh=()=>{if(document.visibilityState==='hidden')return;setPost(cachedArticlePost(postId));void loadArticlePosts().then(items=>{if(!disposed)setPost(items.get(postId));});};
  refresh();const timer=window.setInterval(refresh,5*60000);window.addEventListener('focus',refresh);
  return()=>{disposed=true;window.clearInterval(timer);window.removeEventListener('focus',refresh);};
 },[postId]);
 return post?.id===postId?post:undefined;
}
