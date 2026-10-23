import {usd} from '../lib/options-strategies';
import type {OptionResult} from '../lib/option-results';
import styles from '../styles/OptionResults.module.css';
export default function OptionResultPayoff({result}:{result:OptionResult}){
 const m=result.moves.reduce((a,b)=>a.sessionPct>b.sessionPct?a:b),before=result.stock?.previousClose,after=result.stock?.price;
 const gain=(m.sessionClose-m.previousClose)*100,low=Math.min(m.previousClose,m.sessionClose),high=Math.max(m.previousClose,m.sessionClose);
 const y=(v:number)=>high===low?68:112-(v-low)/(high-low)*84;
 return <section className={styles.resultTool} aria-label={`${result.symbol} results payoff`}>
  <strong>{result.symbol} · Call result</strong><small>Expiry {m.expiry} · Result {m.sessionDay}</small>
  <div className={styles.resultHorizontal}>
   <dl><dt>Previous stock price</dt><dd>{before?usd(before):'Unavailable'}</dd><dt>Strike</dt><dd>{usd(m.strike)}</dd><dt>Breakeven at expiry</dt><dd>{usd(m.strike+m.previousClose)}</dd></dl>
   {before&&after?<svg viewBox="0 0 220 160" role="img" aria-label={`Observed contract value ${usd(m.previousClose*100)} to ${usd(m.sessionClose*100)}, stock ${usd(before)} to ${usd(after)}`}>
    <text x="0" y="12">One contract</text>
    <path d="M60 28V112H212" fill="none" stroke="#293d50"/>
    <text x="55" y="32" textAnchor="end">{usd(high*100)}</text>{high!==low&&<text x="55" y="116" textAnchor="end">{usd(low*100)}</text>}
    <line x1="60" y1={y(m.previousClose)} x2="212" y2={y(m.sessionClose)} stroke="#79d5c8" strokeWidth="2.5"/>
    <circle cx="60" cy={y(m.previousClose)} r="3.5" fill="#79d5c8"/><circle cx="212" cy={y(m.sessionClose)} r="3.5" fill="#79d5c8"/>
    <text x="50" y="132">{usd(before)}</text><text x="218" y="132" textAnchor="end">{usd(after)}</text><text x="0" y="154">Stock · previous → observed</text>
   </svg>:<small>Stock endpoints unavailable</small>}
  </div>
  <p className={styles.resultPayoffLine}><strong>Payoff · {usd(m.previousClose)} → {usd(m.sessionClose)} / share · {m.sessionPct>=0?'+':''}{m.sessionPct.toFixed(2)}%</strong><br/>One contract: {usd(m.previousClose*100)} → {usd(m.sessionClose*100)} · {gain>=0?'+':''}{usd(gain)} gain before costs</p>
 </section>;
}
