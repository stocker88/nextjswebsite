import type {ReactNode} from 'react';
import MarketMovers from './MarketMovers';
import SessionMarketPulse from './SessionMarketPulse';
import {useEffect,useState} from 'react';
import HeroOverviewHeatmap from './HeroOverviewHeatmap';
import AppDownloadModal from './AppDownloadModal';
import {ExtendedSession,SessionKind,SessionClock,sessionInfo,sessionRows,sessionTime,validSession} from '../lib/extended-hours';
import {percent} from '../lib/market-heatmap';
import styles from '../styles/ExtendedHours.module.css';
export default function ExtendedHoursSnapshot({session,kind,moversControls,pulseControls}:{session?:ExtendedSession|null;kind:SessionKind;moversControls?:ReactNode;pulseControls?:ReactNode}) {
 const [download,setDownload]=useState(false), info=sessionInfo[kind];
 const [clock,setClock]=useState<SessionClock|null>(null);
 useEffect(()=>{const detect=()=>{try{const {locale,timeZone}=new Intl.DateTimeFormat().resolvedOptions();if(locale&&timeZone)setClock(previous=>previous?.locale===locale&&previous?.timeZone===timeZone?previous:{locale,timeZone});}catch{/* Keep the explicitly labelled Eastern fallback. */}};detect();window.addEventListener('focus',detect);window.addEventListener('languagechange',detect);return()=>{window.removeEventListener('focus',detect);window.removeEventListener('languagechange',detect);};},[]);
 const formatTime=(value:string)=>sessionTime(value,clock??undefined);
 const available=validSession(session,kind), rows=available?sessionRows(session,kind):[];
 const quotes=rows.filter(r=>r.changes.day!==null);
 return <section className={styles.snapshot} aria-label={info.title}>
  <div className={styles.intro}><div><h2>{info.title}</h2><p>Price changes versus the {info.basis}.</p></div><nav aria-label="Extended-hours views"><a href={sessionInfo.preMarket.path}>Premarket</a><a href={sessionInfo.afterHours.path}>After-hours</a><a href="/stock-market-heatmap/">Regular session</a></nav></div>
  {available?<>
   <p className={styles.timestamp}>Latest saved snapshot · <time dateTime={session.quotedAt}>{formatTime(session.quotedAt)}</time><br/>Collected <time dateTime={session.assembledAt}>{formatTime(session.assembledAt)}</time> · {quotes.length} of {rows.length} holdings have a usable session quote.<br/><small>{clock?`Times in your timezone · ${clock.timeZone.replace(/_/g,' ')}`:'Times in U.S. Eastern time'}</small></p>
   <div className={styles.grid}><div className={styles.map}><HeroOverviewHeatmap rows={rows} period="day" asOf={session.asOf}/></div><MarketMovers rows={rows} period="day" periodControls={moversControls}/></div>
   <details className={styles.table}><summary>View all {rows.length} holdings and quote times</summary><div><table><caption>{info.label} stock prices and changes · U.S. session date: {session.asOf}</caption><thead><tr><th scope="col">Stock</th><th scope="col">Price (USD)</th><th scope="col">Change</th><th scope="col">Quote time ({clock?'local':'ET'})</th></tr></thead><tbody>{rows.map(row=><tr key={row.symbol}><th scope="row">{row.symbol}<small>{row.name}</small></th><td>{row.changes.day===null?'—':row.price.toFixed(2)}</td><td>{percent(row.changes.day)}</td><td>{row.changes.day!==null&&(row as any).quoteAsOf?formatTime((row as any).quoteAsOf):'Unavailable'}</td></tr>)}</tbody></table></div></details>
   <div className={styles.sessionPulse}><SessionMarketPulse session={session} kind={kind} formatTime={formatTime} periodControls={pulseControls}/></div>
   <p className={styles.disclosure}>Scheduled snapshots, not a live quote stream. Quotes may be delayed and have different timestamps. Gray tiles mean unavailable session data. Outside collection hours, the last saved session remains visible. Source: Yahoo Finance via our saved market feed. Extended-hours trading can have lower liquidity and wider spreads.</p>
  </>:<p role="status" className={styles.timestamp}>A saved {info.label.toLowerCase()} snapshot is currently unavailable. Please try again later or explore the regular-session heatmap.</p>}
  <aside className={styles.cta}><div><h3>Follow how the session unfolds</h3><p>Explore the snapshot archive and continue your stock research in the app. Some app features require a subscription.</p></div><button type="button" onClick={()=>setDownload(true)}>Explore in the app →</button></aside>
  {download&&<AppDownloadModal placement={kind==='preMarket'?'free_premarket_snapshot':'free_afterhours_snapshot'} onClose={()=>setDownload(false)} title="Continue your market research" description="Explore the snapshot archive, company metrics and research in the app."/>}
 </section>;
}
