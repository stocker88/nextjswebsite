import {useSiteAccount} from './SiteAccount';
import {useEffect,useState} from 'react';
import {dailyAlertPreviewCounts} from '../lib/alert-preview-counts';
import AppDownloadButton from './formStocker';
import s from '../styles/HomeSmartMoneySignals.module.css';

const previews = [
  {kind:'insiders',label:'INSIDER BUYING CLUSTER',who:'insiders',subtitle:'Earnings next week.',description:'One stock. Multiple buyers. A cluster of purchases one week before earnings gives you a reason to look closer.',context:'Review the buyers, original filings, financials and technicals.',event:'EARNINGS · ONE WEEK AWAY'},
  {kind:'politicians',label:'POLITICIAN BUYING OVERLAP',who:'politicians',subtitle:'A meeting ahead.',description:'Politicians disclose purchases in the same stock ahead of Trump’s next meeting.',context:'Review the buyers, original filings, financials and technicals.',event:'POLICY · EVENT CONTEXT'},
] as const;

export default function HomeSmartMoneySignals(){
 const {desktop}=useSiteAccount();
 const [counts,setCounts]=useState<ReturnType<typeof dailyAlertPreviewCounts>|null>(null);
 useEffect(()=>{
  const update=()=>{if(document.visibilityState==='hidden')return;const next=dailyAlertPreviewCounts();setCounts(old=>old?.insiders===next.insiders&&old?.politicians===next.politicians?old:next)};
  update();const timer=window.setInterval(update,60000);
  window.addEventListener('focus',update);document.addEventListener('visibilitychange',update);
  return()=>{clearInterval(timer);window.removeEventListener('focus',update);document.removeEventListener('visibilitychange',update)};
 },[]);
 return <section className={s.section} aria-labelledby="smart-money-preview-title">
  <header className={s.header}><span className={s.eyebrow}>CONNECT THE DISCLOSURES</span><h2 id="smart-money-preview-title">The activity is the beginning.<br/><span>The context is your edge.</span></h2><p>See the pattern. Check the evidence. Take the next step.</p></header>
  <div className={s.grid}>{previews.map(preview=><article key={preview.kind} className={`${s.card} ${s[preview.kind]}`}>
   <div className={s.top}><span className={s.category}><i aria-hidden="true"/>{preview.label}</span>{!desktop&&<span className={s.example}>IN-APP ALERTS</span>}</div>
   <div className={s.visual} aria-hidden="true"><div className={s.reporters}>{Array.from({length:Math.min(counts?.[preview.kind]??0,4)},(_,i)=><span key={i}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="12" cy="8" r="3"/><path d="M5 21v-3a7 7 0 0 1 14 0v3"/></svg></span>)}{(counts?.[preview.kind]??0)>4&&<span className={s.extraReporters}>+{counts![preview.kind]-4}</span>}</div><span className={s.connection}>→</span><div className={s.stock}><img src="/assets/images/stockerRobotIcon.png" alt="" width="38" height="38"/><span>ONE STOCK</span></div></div>
   <span className={s.event}>{preview.event}</span><h3>{counts?.[preview.kind]??'—'} {preview.who} buying.<br/>{preview.subtitle}</h3><p>{preview.description}</p><p className={s.context}>{preview.context}</p>
   <div className={s.action}><AppDownloadButton popup from={`home_${preview.kind}_signal_preview`} label="Review the signals now ↗"/>{!desktop&&<small>Explore in the app</small>}</div>
  </article>)}</div>

 </section>;
}
