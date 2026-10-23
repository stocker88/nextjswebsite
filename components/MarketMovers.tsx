import type {ReactNode} from 'react';
import {stockPageHref} from '../lib/stock-page';
import {HeatStock,Period,biggestMovers,percent} from '../lib/market-heatmap';
import styles from '../styles/ExtendedHours.module.css';
export default function MarketMovers({rows,period,label,periodControls}:{rows:HeatStock[];period:Period;label?:string;periodControls?:ReactNode}) {
 const {gainers,losers}=biggestMovers(rows,period);
 return <section className={styles.movers} aria-label={`Top movers · ${label||'snapshot'}`}>{periodControls}<h3>Biggest movers{label?` · ${label}`:''}</h3><p>Top 10 gainers and decliners across {rows.length} S&amp;P 500 stocks in this snapshot.</p>{[['Gainers',gainers],['Decliners',losers]].map(([title,items])=><div key={title as string}><h4>{title as string}</h4>{(items as HeatStock[]).length?(items as HeatStock[]).map(row=><a key={row.symbol} href={stockPageHref(row.symbol)}><span>{row.symbol}<small>{row.name}</small></span><strong className={row.changes[period]!>=0?styles.positive:styles.negative}>{percent(row.changes[period])}</strong></a>):<p>No {String(title).toLowerCase()} with an available quote.</p>}</div>)}</section>;
}
