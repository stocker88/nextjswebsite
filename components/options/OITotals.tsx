import {ReactNode} from 'react';
import {Contract,oiTotals} from '../../lib/options';
import styles from './OptionsExplorer.module.css';
const count=(v:number)=>v.toLocaleString('en-US',{maximumFractionDigits:1});
export default function OITotals({rows,view,loading=false}:{rows:Contract[];view:(label:string)=>ReactNode;loading?:boolean}){
 const t=oiTotals(rows),value=(v:number|null,label:string)=>v===null?view(label):count(v);
 return <aside className={styles.oiTotals} aria-label="Call and put totals"><section className={styles.oiTotalCard}><h4>Open interest</h4><p>Outstanding contracts</p><dl><div><dt>● Calls</dt><dd>{value(t.calls.oi,'call open interest')}</dd></div><div><dt>● Puts</dt><dd>{value(t.puts.oi,'put open interest')}</dd></div><div className={styles.oiCombined}><dt>Total</dt><dd>{value(t.total,'total open interest')}</dd></div></dl></section>
 <section className={styles.oiTotalCard}><h4>Delta-weighted OI</h4><p>OI × |delta| · contract equivalents</p><dl><div><dt>● Calls</dt><dd>{value(t.calls.weighted,'call delta-weighted open interest')}</dd></div><div><dt>● Puts</dt><dd>{value(t.puts.weighted,'put delta-weighted open interest')}</dd></div><div className={styles.oiCombined}><dt>{t.weightedTotal!==null&&!t.weightedComplete?'Subtotal':'Total'}</dt><dd>{value(t.weightedTotal,'delta-weighted open interest')}</dd></div></dl>
 {t.weightedRatio!==null&&<p>Put / call: <strong>{t.weightedRatio.toFixed(2)}×</strong></p>}
 {!loading&&!t.weightedComplete&&<p className={styles.oiCoverage}>{t.weightedTotal===null?'Delta is unavailable for these contracts.':`OI with delta: calls ${t.calls.coverage===null?'—':Math.round(t.calls.coverage*100)+'%'} · puts ${t.puts.coverage===null?'—':Math.round(t.puts.coverage*100)+'%'}. Includes available values only.`}</p>}
 </section><p className={styles.note}>All matching contracts, including strikes outside the chart. Delta weighting compares sensitivity, not net buying or market direction.</p></aside>
}
