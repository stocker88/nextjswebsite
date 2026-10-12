import {useEffect,useState} from 'react';
import {useRouter} from 'next/router';
import HeadlinePreview from '../../components/HeadlinePreview';
import ResearchPage from '../../components/ResearchPage';
import {Headline,loadHeadlines} from '../../lib/market-news';
export default function LatestStory(){const {query}=useRouter(),[item,setItem]=useState<Headline|null>(null),[loaded,setLoaded]=useState(false);useEffect(()=>{if(!query.id)return;let active=true;loadHeadlines().then(d=>{if(active){setItem(d.items.find(n=>n.id===query.id)||null);setLoaded(true)}});return()=>{active=false}},[query.id]);return item?<HeadlinePreview item={item}/>:<ResearchPage title="Market headline" path="/market-news/"><p role="status">{loaded?'This headline is no longer in the recent feed.':'Loading headline…'}</p><a href="/market-news/">Back to latest news</a></ResearchPage>}
