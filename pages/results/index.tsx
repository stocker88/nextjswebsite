import ResearchPage from '../../components/ResearchPage';
import MarketFeedTabs from '../../components/MarketFeedTabs';
import OptionResultCard from '../../components/OptionResultCard';
import ResearchCTA from '../../components/ResearchCTA';
import reports from '../../data/option-results.json';
import styles from '../../styles/OptionResults.module.css';
export default function Results(){
 const result=reports[0];
 return <ResearchPage title="Options results" path="/results/" description="Review verified call-price moves with dated prices, contract values and related stock research." socialImageUrl={result.images[0].url} socialImageAlt={result.title} socialImageWidth={1200} socialImageHeight={1200}>
  <MarketFeedTabs active="results"/>
  <header className={styles.heading}><span className={styles.eyebrow}>RESEARCH IN REVIEW</span><h1>Results</h1><p>Dated option-price moves, with the numbers and research behind them.</p></header>
  {reports.map(result=><OptionResultCard key={result.id} result={result}/>)}
  <ResearchCTA placement="option_results" variant="stock"/>
 </ResearchPage>;
}
