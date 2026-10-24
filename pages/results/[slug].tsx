import Head from 'next/head';
import Link from 'next/link';
import ResearchPage from '../../components/ResearchPage';
import MarketFeedTabs from '../../components/MarketFeedTabs';
import OptionResultCard from '../../components/OptionResultCard';
import ArticlePostEngagement from '../../components/ArticlePostEngagement';
import CompanyResearchSection from '../../components/CompanyResearchSection';
import ResearchCTA from '../../components/ResearchCTA';
import type {InstrumentResearchProps} from '../../components/InstrumentResearch';
import {loadInstrumentResearch} from '../../lib/instrument-research-server';
import {optionResults,optionResultSlug,optionResultUrl,optionResultHighlight,findOptionResult,type OptionResult} from '../../lib/option-results';
import {jsonLd,breadcrumbs} from '../../lib/seo';
import styles from '../../styles/OptionResults.module.css';
export default function ResultDetails({result,research}:{result:OptionResult;research:InstrumentResearchProps|null}){
 const path=optionResultUrl(result),{image}=optionResultHighlight(result);
 const title=result.symbol+' Options · '+result.sessionDay;
 const description=`${result.companyName} option-price results for ${result.sessionDay}: dated premium changes, contract values, charts and related stock research.`;
 return <ResearchPage title={title} path={path} description={description} socialImageUrl={image?.url} socialImageAlt={result.title} socialImageWidth={1200} socialImageHeight={1200} ogType="article">
  <Head><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(breadcrumbs([{name:'Home',path:'/'},{name:'Results',path:'/results/'},{name:title,path}]))}}/></Head>
  <MarketFeedTabs active="results"/><Link className={styles.backLink} href="/results/">← All results</Link>
  <header className={styles.heading}><span className={styles.eyebrow}>OPTIONS PERFORMANCE</span><h1>{result.companyName} options</h1><ArticlePostEngagement postId={result.id}/></header>
  <div data-app-post-id={result.id}><OptionResultCard result={result}/></div>
  {research&&<CompanyResearchSection research={research}/>}
  <ResearchCTA placement="option_result_details" variant="stock"/>
 </ResearchPage>;
}
export function getStaticPaths(){return {paths:optionResults.map(result=>({params:{slug:optionResultSlug(result)}})),fallback:false};}
export async function getStaticProps({params}:{params:{slug:string}}){
 const result=findOptionResult(params.slug);if(!result)return {notFound:true};
 return {props:{result,research:await loadInstrumentResearch(result.symbol)}};
}
