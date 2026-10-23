import {usd} from '../lib/options-strategies';
import type {OptionResult} from '../lib/option-results';
import styles from '../styles/OptionResults.module.css';
export default function OptionResultPayoff({result}:{result:OptionResult}){
 const m=result.moves.reduce((a,b)=>a.sessionPct>b.sessionPct?a:b),before=result.stock?.previousClose,after=result.stock?.price;
 const gain=(m.sessionClose-m.previousClose)*100,high=Math.max(m.previousClose,m.sessionClose,Math.max(0,(before??0)-m.strike),Math.max(0,(after??0)-m.strike));
 const y=(v:number)=>112-v/(high||1)*84;
 const x=(v:number)=>60+(v-(before??0))/((after??0)-(before??0)||1)*152;
 const intrinsic=(v:number)=>Math.max(0,v-m.strike);
 const kink=before&&after&&m.strike>Math.min(before,after)&&m.strike<Math.max(before,after)?` L${x(m.strike)} ${y(0)}`:'';
 return <section className={styles.resultTool} aria-label={`${result.symbol} results payoff`}>
  <strong>{result.symbol} · Call result</strong><small>Expiry {m.expiry} · Result {m.sessionDay}</small>
  <div className={styles.resultHorizontal}>
   <dl><dt>Previous stock price</dt><dd>{before?usd(before):'Unavailable'}</dd><dt>Strike</dt><dd>{usd(m.strike)}</dd><dt>Breakeven at expiry</dt><dd>{usd(m.strike+m.previousClose)}</dd></dl>
   {before&&after?<svg viewBox="0 0 220 160" role="img" aria-label={`Observed contract value ${usd(m.previousClose*100)} to ${usd(m.sessionClose*100)}, stock ${usd(before)} to ${usd(after)}`}>
    <text x="0" y="12">One contract</text>
    <path d="M60 28V112H212" fill="none" stroke="#293d50"/>
    <text x="55" y="32" textAnchor="end">{usd(high*100)}</text><text x="55" y="116" textAnchor="end">$0</text>
    <path d={`M60 ${y(intrinsic(before))}${kink} L212 ${y(intrinsic(after))}`} fill="none" stroke="#c7b5e8" strokeWidth="2"/>
    <path d={`M60 ${y(m.previousClose)} Q136 ${y(m.previousClose)} 212 ${y(m.sessionClose)}`} fill="none" stroke="#79d5c8" strokeWidth="2.5" strokeDasharray="4 2"/>
    <circle cx="60" cy={y(m.previousClose)} r="3.5" fill="#79d5c8"/><circle cx="212" cy={y(m.sessionClose)} r="3.5" fill="#79d5c8"/>
    <text x="50" y="132">{usd(before)}</text><text x="218" y="132" textAnchor="end">{usd(after)}</text><text x="0" y="154">Stock · previous → observed</text>
   </svg>:<small>Stock endpoints unavailable</small>}
  </div>
  <small>Mint dashed: illustrative guide between saved values · Purple: expiry value, before premium cost.</small>
  <p className={styles.resultPayoffLine}><strong>Payoff · {usd(m.previousClose)} → {usd(m.sessionClose)} / share · {m.sessionPct>=0?'+':''}{m.sessionPct.toFixed(2)}%</strong><br/>One contract: {usd(m.previousClose*100)} → {usd(m.sessionClose*100)} · {gain>=0?'+':''}{usd(gain)} gain before costs</p>
 </section>;
}
