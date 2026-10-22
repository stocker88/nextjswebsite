import Link from 'next/link';
import ResearchPage from '../../components/ResearchPage';
import MarketFeedTabs from '../../components/MarketFeedTabs';
import ResearchImages from '../../components/ResearchImages';
import ResearchCTA from '../../components/ResearchCTA';
import reports from '../../data/option-results.json';
import styles from '../../styles/OptionResults.module.css';
const money=(n:number)=>n.toLocaleString('en-US',{style:'currency',currency:'USD'});
export default function Results(){
 const result=reports[0];
 return <ResearchPage title="Options results" path="/results/" description="Review verified call-price moves with dated prices, contract values and related stock research." socialImageUrl={result.images[0].url} socialImageAlt={result.title} socialImageWidth={1200} socialImageHeight={1200}>
  <MarketFeedTabs active="results"/>
  <header className={styles.heading}><span className={styles.eyebrow}>RESEARCH IN REVIEW</span><h1>Results</h1><p>Dated option-price moves, with the numbers and research behind them.</p></header>
  {reports.map(result=><article key={result.id} className={styles.report} id={result.id}>
   <div className={styles.top}><span className={styles.tag}>${result.symbol} · OPTIONS PERFORMANCE</span><time dateTime={result.sessionDay}>{new Date(result.sessionDay+'T12:00:00Z').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'})}</time></div>
   <div className={styles.company}><img src={`/assets/logo/${result.symbol}.webp`} alt="" width={48} height={48}/><div><strong>{result.companyName}</strong><span>Earnings &amp; option results</span></div></div>
   <h2>{result.title}</h2>
   <p className={styles.intro}>{result.moves[0].previousSession} daily close → {result.sessionDay} session aggregate close. These are historical price changes, before costs.</p>
   <div className={styles.calls}>{result.moves.map(m=><section key={m.id} className={styles.call} aria-label={`${result.symbol} $${m.strike} call performance`}>
    <div className={styles.callLabel}>${m.strike} CALL <span>{m.expiry} expiry</span></div>
    <strong className={styles.performance}>+{m.sessionPct.toFixed(2)}%</strong><span className={styles.basis}>Since previous session close</span>
    <div className={styles.prices}>{money(m.previousClose)} <span>→</span> {money(m.sessionClose)}</div>
    <p>Per 100-share contract: {money(m.previousClose*100)} → {money(m.sessionClose*100)}</p>
    <small>Snapshot: {m.aggregateAsOf?new Date(m.aggregateAsOf).toLocaleString('en-US',{timeZone:'America/New_York',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}):'Not available'} ET</small>
   </section>)}</div>
   <ResearchImages images={result.images} appOnly={false}/>
   <section className={styles.recap}><h3>What happened</h3><ul>{result.recap.map((bullet,i)=><li key={i}>{bullet}</li>)}</ul></section>
   {result.earningsUrl&&<Link className={styles.attachment} href={result.earningsUrl}><span>RELATED RESEARCH</span><strong>{result.companyName} · Latest insight <span aria-hidden="true">↗</span></strong><p>Read the related company research.</p></Link>}
   <footer className={styles.footer}>Source: <a href="https://www.StocksToBuyNow.ai">www.StocksToBuyNow.ai</a><p>Historical option-price results, not a record of executed trades or realized profits. Options can lose their entire premium.</p></footer>
  </article>)}
  <ResearchCTA placement="option_results" variant="stock"/>
 </ResearchPage>;
}
