import {useState} from 'react';
import {usd} from '../lib/options-strategies';
import type {OptionResult} from '../lib/option-results';
import styles from '../styles/OptionResults.module.css';
export default function OptionResultPayoff({result}:{result:OptionResult}){
 const [selected,setSelected]=useState<number|null>(null);
 const m=result.moves.reduce((a,b)=>a.sessionPct>b.sessionPct?a:b),before=result.graphStock?.previousClose??result.stock?.previousClose,after=result.graphStock?.price??result.stock?.price;
 const isPut=m.optionType==='put';
 const intrinsic=(v:number)=>Math.max(0,isPut?m.strike-v:v-m.strike);
 const gain=(m.sessionClose-m.previousClose)*100,high=Math.max(m.previousClose,m.sessionClose,intrinsic(before??0),intrinsic(after??0));
 const y=(v:number)=>112-v/(high||1)*84;
 const x=(v:number)=>60+(v-(before??0))/((after??0)-(before??0)||1)*152;
 const kink=before&&after&&m.strike>Math.min(before,after)&&m.strike<Math.max(before,after)?` L${x(m.strike)} ${y(0)}`:'';
 const t=selected??0, premium=m.previousClose+(m.sessionClose-m.previousClose)*t*t;
 const inspect=(event:React.PointerEvent<SVGSVGElement>)=>{const box=event.currentTarget.getBoundingClientRect();setSelected(Math.max(0,Math.min(1,((event.clientX-box.left)/box.width*220-60)/152)));};
 return <section className={styles.resultTool} aria-label={`${result.symbol} results payoff`}>
  <strong>{result.symbol} · {isPut?'Put':'Call'} result</strong><small>Expiry {m.expiry} · Result {m.sessionDay}</small>
  <div className={styles.resultHorizontal}>
   <dl><dt>Previous stock price</dt><dd>{before?usd(before):'Unavailable'}</dd><dt>Strike</dt><dd>{usd(m.strike)}</dd><dt>Breakeven at expiry</dt><dd>{usd(isPut?m.strike-m.previousClose:m.strike+m.previousClose)}</dd></dl>
   {before&&after?<svg viewBox="0 0 220 160" style={{touchAction:'pan-y',cursor:'crosshair'}} tabIndex={0} role="slider" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(t*100)} aria-valuetext={`Return ${((premium/m.previousClose-1)*100).toFixed(2)} percent`} onPointerDown={event=>{event.currentTarget.setPointerCapture(event.pointerId);inspect(event);}} onPointerMove={event=>{if(event.buttons)inspect(event);}} onKeyDown={event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();setSelected(event.key==='Home'?0:event.key==='End'?1:Math.max(0,Math.min(1,t+(event.key==='ArrowRight'?.05:-.05))));}}} aria-label={`Observed contract value ${usd(m.previousClose*100)} to ${usd(m.sessionClose*100)}, stock ${usd(before)} to ${usd(after)}`}>
    <text x="0" y="12">One contract</text>
    <path d="M60 28V112H212" fill="none" stroke="#293d50"/>
    <text x="55" y="32" textAnchor="end">{usd(high*100)}</text><text x="55" y="116" textAnchor="end">$0</text>
    <path d={`M60 ${y(intrinsic(before))}${kink} L212 ${y(intrinsic(after))}`} fill="none" stroke="#c7b5e8" strokeWidth="2"/>
    <path d={`M60 ${y(m.previousClose)} Q136 ${y(m.previousClose)} 212 ${y(m.sessionClose)}`} fill="none" stroke="#79d5c8" strokeWidth="2.5" strokeDasharray="4 2"/>
    {selected!==null&&<><path d={`M${60+152*t} 28V112`} stroke="#93a8c4" strokeWidth="0.7"/><circle cx={60+152*t} cy={y(premium)} r="4" fill="white"/></>}
    <circle cx="60" cy={y(m.previousClose)} r="3.5" fill="#79d5c8"/><circle cx="212" cy={y(m.sessionClose)} r="3.5" fill="#79d5c8"/>
    <text x="50" y="132">{usd(before)}</text><text x="218" y="132" textAnchor="end">{usd(after)}</text><text x="0" y="154">Stock · previous → observed</text>
   </svg>:<small>Stock endpoints unavailable</small>}
  </div>
  {selected!==null&&<small aria-live="polite" style={{color:'#79d5c8'}}>{t===1&&result.graphStock?.approximate?'Approximate time match':t===0||t===1?'Saved observation':'Illustrative'} · Stock {usd((before??0)+((after??0)-(before??0))*t)} · Contract {usd(premium*100)} · Return {premium>=m.previousClose?'+':''}{((premium/m.previousClose-1)*100).toFixed(2)}%</small>}
  {result.graphStock&&<small>{result.graphStock.note}</small>}
  <small>Tap or drag the mint curve (arrow keys also work). Mint dashed: illustrative guide between saved values · Purple: expiry value, before premium cost.</small>
  <p className={styles.resultPayoffLine}><strong>Payoff · {usd(m.previousClose)} → {usd(m.sessionClose)} / share · {m.sessionPct>=0?'+':''}{m.sessionPct.toFixed(2)}%</strong><br/>One contract: {usd(m.previousClose*100)} → {usd(m.sessionClose*100)} · {gain>=0?'+':''}{usd(gain)} gain before costs</p>
 </section>;
}
