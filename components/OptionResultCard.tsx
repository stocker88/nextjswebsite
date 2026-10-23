import Link from 'next/link';
import ResearchImages from './ResearchImages';
import type {OptionResult} from '../lib/option-results';
import styles from '../styles/OptionResults.module.css';
const money=(n:number)=>n.toLocaleString('en-US',{style:'currency',currency:'USD'});
const date=(value:string)=>new Date(value+'T12:00:00Z').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'});
export default function OptionResultCard({result,compact=false}:{result:OptionResult;compact?:boolean}){
 return <article className={styles.report} id={compact?undefined:result.id}>
  <div className={styles.top}><span className={styles.tag}>${result.symbol} · OPTIONS PERFORMANCE</span><time dateTime={result.sessionDay}>{date(result.sessionDay)}</time></div>
  <div className={styles.company}><img src={`/assets/logo/${result.symbol}.webp`} alt="" width={48} height={48}/><div><strong>{result.companyName}</strong><span>Earnings &amp; option results</span></div></div>
  <h2>{result.title}</h2>
  <p className={styles.intro}>{date(result.moves[0].previousSession)} daily close → {date(result.sessionDay)} session aggregate close. These are historical price changes, before costs.</p>
  {result.stock&&<p className={styles.intro}><strong>{result.symbol} stock: {result.stock.movePct>=0?'+':''}{result.stock.movePct.toFixed(2)}%</strong> {result.stock.basis==='past_24_hours'?'over the measured 24 hours':'since the previous close'} · {money(result.stock.price)} at {new Date(result.stock.asOf).toLocaleString('en-US',{timeZone:'America/New_York',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})} ET.</p>}
  <div className={styles.calls}>{result.moves.map(m=><section key={m.id} className={styles.call} aria-label={`${result.symbol} $${m.strike} call performance`}>
   <div className={styles.callLabel}>${m.strike} CALL <span>{date(m.expiry)} expiry</span></div>
   <strong className={styles.performance}>{m.sessionPct>0?'+':''}{m.sessionPct.toFixed(2)}%</strong><span className={styles.basis}>Since previous session close</span>
   <div className={styles.prices}>{money(m.previousClose)} <span>→</span> {money(m.sessionClose)}</div>
   <p>Per {m.multiplier}-share contract: {money(m.previousClose*m.multiplier)} → {money(m.sessionClose*m.multiplier)}</p>
   <p><strong>Maximum premium loss: {money(m.previousClose*m.multiplier)}</strong> if the stock falls 100% to $0 and the bought call becomes worthless.</p>
   <p><strong>Ending value: {money(m.sessionClose*m.multiplier)}</strong> · Gain: {money((m.sessionClose-m.previousClose)*m.multiplier)}, before costs.</p>
   <small>Snapshot: {m.aggregateAsOf?new Date(m.aggregateAsOf).toLocaleString('en-US',{timeZone:'America/New_York',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}):'Not available'} ET</small>
  </section>)}</div>
  {compact?<Link className={styles.attachment} href={'/results/#'+encodeURIComponent(result.id)}><strong>View {result.symbol} full results <span aria-hidden="true">↗</span></strong><p>See the option charts and the research behind these moves.</p></Link>:<>
   <ResearchImages images={result.images} appOnly={false}/>
   <section className={styles.recap}><h3>What happened</h3><ul>{result.recap.map((bullet,i)=><li key={i}>{bullet}</li>)}</ul></section>
   {result.quickTake&&<section className={styles.recap}><h3>Quick Take</h3><p className={styles.intro}>{result.quickTake}</p></section>}
   {result.earningsUrl&&<Link className={styles.attachment} href={result.earningsUrl}><span>RELATED RESEARCH</span><strong>{result.companyName} · Latest insight <span aria-hidden="true">↗</span></strong><p>Read the related company research.</p></Link>}
   <footer className={styles.footer}>Source: <a href="https://www.StocksToBuyNow.ai">www.StocksToBuyNow.ai</a><p>Options can lose their entire premium.</p></footer>
  </>}
 </article>;
}
