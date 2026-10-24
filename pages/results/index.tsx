import {useEffect} from 'react';
import {useRouter} from 'next/router';
import ResearchPage from '../../components/ResearchPage';
import MarketFeedTabs from '../../components/MarketFeedTabs';
import OptionResultPreview from '../../components/OptionResultPreview';
import ResearchCTA from '../../components/ResearchCTA';
import {optionResults,optionResultHighlight,optionResultUrl} from '../../lib/option-results';
import styles from '../../styles/OptionResults.module.css';
export default function Results(){
 const router=useRouter();
 const reports=optionResults.slice().sort((a,b)=>b.sessionDay.localeCompare(a.sessionDay));
 const first=reports[0],image=first?optionResultHighlight(first).image:undefined;
 useEffect(()=>{
  // Old company pages and bookmarks linked to anchors in the former long list.
  const redirect=()=>{let id;try{id=decodeURIComponent(window.location.hash.slice(1));}catch{return;}const result=optionResults.find(r=>r.id===id);if(result)void router.replace(optionResultUrl(result));};
  redirect();window.addEventListener('hashchange',redirect);return()=>window.removeEventListener('hashchange',redirect);
 },[router]);
 return <ResearchPage title="Options results" path="/results/" description="Review dated option-price moves, contract values and the stock research behind each result." socialImageUrl={image?.url} socialImageAlt={first?.title} socialImageWidth={1200} socialImageHeight={1200}>
  <MarketFeedTabs active="results"/>
  <header className={styles.heading}><span className={styles.eyebrow}>RESEARCH IN REVIEW</span><h1>Results</h1><p>Dated option-price moves, with the numbers and research behind them.</p></header>
  <div className={styles.resultsGrid}>{reports.map(result=><OptionResultPreview key={result.id} result={result}/>)}</div>
  {!reports.length&&<p>New results will appear here as reports are published.</p>}
  <ResearchCTA placement="option_results" variant="stock"/>
 </ResearchPage>;
}
