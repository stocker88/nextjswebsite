import {useEffect,useState} from 'react';
import {Calendar,Event,shortDate,sessionName,decimal,money} from '../../lib/earnings';
import CompanyResearch from './CompanyResearch';
import EarningsStyles from './EarningsStyles';
export default function StockEarnings({symbol}:{symbol:string}) {
 const [calendar,setCalendar]=useState<Calendar|null>(null),[error,setError]=useState(false);
 useEffect(()=>{let active=true;fetch('/earnings-calendar.json',{signal:AbortSignal.timeout(15000)}).then(r=>{if(!r.ok)throw new Error('Calendar unavailable');return r.json()}).then(d=>{if(active&&Array.isArray(d.items))setCalendar(d)}).catch(()=>{if(active)setError(true)});return()=>{active=false}},[symbol]);
 const upcoming:Event|undefined=calendar?.items.filter(i=>i.symbol===symbol&&i.date>=calendar.today).sort((a,b)=>a.date.localeCompare(b.date))[0];
 return <section className="earnings-page stock-earnings" aria-label={symbol+' earnings and valuation'}><header><div><span className="ec-eyebrow">EARNINGS & COMPANY RESEARCH</span><h2>{symbol} earnings, valuation & price action</h2></div><a href={'/earnings-calendar/?symbol='+encodeURIComponent(symbol)}>View in calendar ↗</a></header>
 {upcoming?<div className="se-next"><div><span>NEXT EXPECTED REPORT</span><strong>{shortDate(upcoming.date)} {upcoming.date.slice(0,4)}</strong><small>{sessionName(upcoming.session)} · ET</small></div><div><span>EPS ESTIMATE</span><strong>{decimal(upcoming.epsEstimate)}</strong></div><div><span>REVENUE ESTIMATE</span><strong>{money(upcoming.revenueEstimate)}</strong></div></div>:<p className="ec-footnote">{error?'The calendar is temporarily unavailable. Company research is shown below.':calendar?'No upcoming report date is available in the current calendar window.':'Loading upcoming earnings…'}</p>}
 <p className="ec-footnote">Expected dates may change. Estimates use the source’s reporting currency. Quotes and research are snapshots, not live prices.</p>
 <CompanyResearch symbol={symbol}/><EarningsStyles/>
 <style jsx>{`.stock-earnings{padding:26px 0!important;max-width:100%;margin:20px 0;line-height:1.5}.stock-earnings>header{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:18px}.stock-earnings h2{margin:0;font-size:24px;line-height:1.3}.stock-earnings>header>a{white-space:nowrap;font-size:12px}.se-next{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:16px;padding:20px;border:1px solid #354360;border-radius:12px;background:#141e32}.se-next span{display:block;font-size:10px;color:#9baecb;letter-spacing:.6px}.se-next strong{display:block;font-size:20px;color:#e9effb;margin-top:8px;font-weight:600}.se-next small{display:block;font-size:11px;color:#b5a2df;margin-top:6px}@media(max-width:700px){.stock-earnings>header{align-items:flex-start;flex-direction:column;gap:10px}.stock-earnings h2{font-size:22px}.se-next{grid-template-columns:1fr 1fr;padding:15px}.se-next>div:first-child{grid-column:1/-1}.se-next strong{font-size:18px}}`}</style>
 </section>;
}
