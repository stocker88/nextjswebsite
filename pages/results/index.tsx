import CompanyResearchSection from '../../components/CompanyResearchSection';
import type {InstrumentResearchProps} from '../../components/InstrumentResearch';
import {loadInstrumentResearch} from '../../lib/instrument-research-server';
import ResearchPage from '../../components/ResearchPage';
import MarketFeedTabs from '../../components/MarketFeedTabs';
import OptionResultCard from '../../components/OptionResultCard';
import ResearchCTA from '../../components/ResearchCTA';
import reports from '../../data/option-results.json';
import styles from '../../styles/OptionResults.module.css';
export default function Results({researchBySymbol}:{researchBySymbol:Record<string,InstrumentResearchProps|null>}){
 const result=reports[0];
 return <ResearchPage title="Options results" path="/results/" description="Review verified call-price moves with dated prices, contract values and related stock research." socialImageUrl={result.images[0].url} socialImageAlt={result.title} socialImageWidth={1200} socialImageHeight={1200}>
  <MarketFeedTabs active="results"/>
  <header className={styles.heading}><span className={styles.eyebrow}>RESEARCH IN REVIEW</span><h1>Results</h1><p>Dated option-price moves, with the numbers and research behind them.</p></header>
  {reports.map(result=><div key={result.id}><OptionResultCard result={result}/>{researchBySymbol[result.symbol]&&<CompanyResearchSection research={researchBySymbol[result.symbol]!}/>}</div>)}
  <ResearchCTA placement="option_results" variant="stock"/>
 </ResearchPage>;
}

export async function getStaticProps(){
 const symbols=Array.from(new Set(reports.map(result=>result.symbol)));
 const researchBySymbol=Object.fromEntries(await Promise.all(symbols.map(async symbol=>[symbol,await loadInstrumentResearch(symbol)])));
 return {props:{researchBySymbol}};
}
