import {useId,useState} from 'react';
import ExpirationChart from './options/ExpirationChart';
import {expirationPnl,usd,Leg} from '../lib/options-strategies';
import type {OptionResult} from '../lib/option-results';
import styles from '../styles/OptionResults.module.css';
export default function OptionResultPayoff({result}:{result:OptionResult}){
 const m=result.moves.reduce((a,b)=>a.sessionPct>b.sessionPct?a:b);
 const id=useId(),[open,setOpen]=useState(false),[price,setPrice]=useState(m.strike);
 const high=Math.max(m.strike,result.stock?.price||m.strike)*1.4;
 const legs:Leg[]=[{type:'call',side:'buy',strike:m.strike,premium:m.previousClose,quantity:1}];
 const scenario=expirationPnl(legs,price),gain=(m.sessionClose-m.previousClose)*100;
 return <section className={styles.resultTool} aria-label={`${result.symbol} interactive results payoff`}>
  <strong>{result.symbol} · Call result · {usd(m.strike)} strike</strong>
  <small>Expiry {m.expiry} · Result {m.sessionDay}</small>
  <div className={styles.resultToolPrices}><b>{usd(m.previousClose)} → {usd(m.sessionClose)}</b><strong>{m.sessionPct>=0?'+':''}{m.sessionPct.toFixed(2)}%</strong></div>
  <small>Previous close → ending premium · Per share</small>
  <p>One contract: {usd(m.previousClose*100)} → {usd(m.sessionClose*100)}<br/><strong>{gain>=0?'+':''}{usd(gain)} gain</strong> · Before costs</p>
  <button type="button" aria-expanded={open} aria-controls={id} onClick={()=>setOpen(!open)}>{open?'Close':'Explore'} payoff at expiry {open?'−':'+'}</button>
  {open&&<div id={id}>
   <p>Hypothetical expiry scenarios using the starting premium; the measured return above uses the dated option prices.</p>
   <ExpirationChart legs={legs} low={0} high={high} price={price}/>
   <label htmlFor={id+'-price'}>Stock price at expiry: {usd(price)}</label>
   <input id={id+'-price'} type="range" min={0} max={high} step={0.01} value={price} onChange={e=>setPrice(Number(e.target.value))}/>
   <p>Hypothetical P&amp;L: <strong>{usd(scenario)} per contract</strong> · {(scenario/(m.previousClose*100)*100).toFixed(2)}% return, before costs.</p>
  </div>}
 </section>;
}
