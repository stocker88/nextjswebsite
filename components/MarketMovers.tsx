import ShareControl from './ShareControl';
import type {ReactNode,CSSProperties} from 'react';
import {stockPageHref} from '../lib/stock-page';
import {HeatStock,Period,biggestMovers,percent} from '../lib/market-heatmap';
import styles from '../styles/ExtendedHours.module.css';
import MoverContext from './MoverContext';
import MoverTrade from './MoverTrade';
export default function MarketMovers({rows,period,label,periodControls,marketSession='intraday'}:{rows:HeatStock[];period:Period;label?:string;periodControls?:ReactNode;marketSession?:string}) {
 const {gainers,losers}=biggestMovers(rows,period);
 return <section className={styles.movers} aria-label={`Top movers · ${label||'snapshot'}`}>
  {periodControls}<h3>Biggest movers{label?` · ${label}`:''}</h3>
  <p>Top <span className={styles.desktopCount}>7</span><span className={styles.mobileCount}>10</span> gainers and decliners across {rows.length} tracked stocks in this snapshot.</p>
  <ShareControl path={`${marketSession==='premarket'?'/premarket-stock-heatmap/':marketSession==='afterhours'?'/after-hours-stock-heatmap/':'/stock-market-heatmap/'}?period=${period}${marketSession==='premarket'?'&session=preMarket':marketSession==='afterhours'?'&session=afterHours':''}`} title="Stock movers" subtitle={`${label||period} · ${marketSession}`} rows={[...gainers,...losers].map(r=>({label:r.symbol,value:percent(r.changes[period]),detail:`${r.name} · ${r.asOf}`}))}/>
  <div className={styles.moverGroups} role="region" aria-label="Gainers and decliners" tabIndex={0}>
  {([['Gainers',gainers],['Decliners',losers]] as const).map(([title,items])=><div key={title} className={styles.moverGroup}>
   <h4>{title}</h4>{items.length?items.map((row,index)=><div key={row.symbol} className={`${styles.moverRow} ${index>=7?styles.extraMover:''}`} data-mover-symbol={row.symbol} style={{'--mover-grid-row':index+2} as CSSProperties}>
    <a href={stockPageHref(row.symbol)}><span className={styles.moverIdentity}><span className={styles.moverSymbol}>{row.symbol}</span><small>{row.name}</small></span><strong className={row.changes[period]!>=0?styles.positive:styles.negative}>{percent(row.changes[period])}</strong></a>
    <div className={styles.moverActions}><MoverContext stock={row} period={period} marketSession={marketSession} compact/><MoverTrade symbol={row.symbol} compact/></div>
   </div>):<p>No {title.toLowerCase()} with an available quote.</p>}
  </div>)}
  </div>
 </section>;
}
