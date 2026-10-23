import type {ReactNode} from 'react';
import {stockPageHref} from '../lib/stock-page';
import {HeatStock,Period,biggestMovers,percent} from '../lib/market-heatmap';
import styles from '../styles/ExtendedHours.module.css';
import MoverContext from './MoverContext';
export default function MarketMovers({rows,period,label,periodControls,marketSession='intraday'}:{rows:HeatStock[];period:Period;label?:string;periodControls?:ReactNode;marketSession?:string}) {
 const {gainers,losers}=biggestMovers(rows,period);
 return <section className={styles.movers} aria-label={`Top movers · ${label||'snapshot'}`}>
  {periodControls}<h3>Biggest movers{label?` · ${label}`:''}</h3>
  <p>Top <span className={styles.desktopCount}>7</span><span className={styles.mobileCount}>10</span> gainers and decliners across {rows.length} S&amp;P 500 stocks in this snapshot.</p>
  <div className={styles.moverGroups} role="region" aria-label="Gainers and decliners" tabIndex={0}>
  {([['Gainers',gainers],['Decliners',losers]] as const).map(([title,items])=><div key={title} className={styles.moverGroup}>
   <h4>{title}</h4>{items.length?items.map((row,index)=><div key={row.symbol} className={`${styles.moverRow} ${index>=7?styles.extraMover:''}`} data-mover-symbol={row.symbol}>
    <a href={stockPageHref(row.symbol)}><span>{row.symbol}<small>{row.name}</small></span><strong className={row.changes[period]!>=0?styles.positive:styles.negative}>{percent(row.changes[period])}</strong></a>
    <MoverContext stock={row} period={period} marketSession={marketSession} compact/>
   </div>):<p>No {title.toLowerCase()} with an available quote.</p>}
  </div>)}
  </div>
 </section>;
}
