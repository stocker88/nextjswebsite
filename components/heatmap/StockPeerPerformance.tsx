import {useEffect,useId,useState} from 'react';
import Link from 'next/link';
import saved from '../../data/market-heatmap.json';
import {stocks} from '../../lib/stocks';
import {HeatSnapshot,HeatStock,Period,PERIOD_OPTIONS,heatmapEndpoint,validSnapshot,percent,dateLabel,returnColor} from '../../lib/market-heatmap';
import styles from './StockPeerPerformance.module.css';

export default function StockPeerPerformance({symbol,industry}:{symbol:string;industry?:string}){
 const [snapshot,setSnapshot]=useState<HeatSnapshot>(saved as HeatSnapshot);
 const [period,setPeriod]=useState<Period>('day');
 const periodId=useId();
 useEffect(()=>{
  const controller=new AbortController();
  fetch(heatmapEndpoint,{signal:controller.signal}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(data=>{if(!controller.signal.aborted&&validSnapshot(data))setSnapshot(data)}).catch(()=>{/* Keep the dated saved data. */});
  return()=>controller.abort();
 },[]);
 const selected=snapshot.rows.find(row=>row.symbol===symbol);
 const group=selected?.industry||industry;
 const peers=group?snapshot.rows.filter(row=>row.industry===group&&row.symbol!==symbol):[];
 const value=(row:HeatStock)=>row.asOf===snapshot.asOf?row.changes[period]:null;
 const rows=[...(selected?[selected]:[]),...peers].sort((a,b)=>(value(b)??-Infinity)-(value(a)??-Infinity)||a.symbol.localeCompare(b.symbol));
 const href=(ticker:string)=>{const curated=stocks.find(stock=>stock.ticker===ticker);return curated?'/stocks/'+curated.slug+'/':'/instruments/'+encodeURIComponent(ticker)+'/';};
 return <section className={styles.panel} aria-label={symbol+' industry peers'}>
  <header className={styles.header}><div><span className={styles.eyebrow}>INDUSTRY COMPARISON</span><h2>{symbol} industry peers</h2><p>{group||'Industry unavailable'} · {dateLabel(snapshot.asOf)} · Closing-price performance</p></div><label htmlFor={periodId}>Performance period<select id={periodId} value={period} onChange={event=>setPeriod(event.target.value as Period)}>{PERIOD_OPTIONS.map(option=><option key={option.value} value={option.value}>{option.label}</option>)}</select></label></header>
  {peers.length?<><p className={styles.note}>Compare {symbol} with {peers.length} other {peers.length===1?'stock':'stocks'} in the available heatmap coverage.</p><div className={styles.grid}>{rows.map(row=><Link data-depth-card data-stock-link key={row.symbol} href={href(row.symbol)} aria-current={row.symbol===symbol?'page':undefined} className={styles.card}><span><strong><span data-stock-symbol={row.symbol}>{row.symbol}</span>{row.symbol===symbol&&<small>Current stock</small>}</strong><span className={styles.company}>{row.name}</span></span><span className={styles.performance} style={{color:returnColor(value(row),false)}}>{percent(value(row))}</span></Link>)}</div></>:<p className={styles.note}>No industry peers are available in the current heatmap coverage.</p>}
  <footer className={styles.footer}><Link href={'/stock-market-heatmap/?q='+encodeURIComponent(symbol)+'&period='+period}>Compare in heatmap →</Link><span>Source: www.StocksToBuyNow.ai</span></footer>
 </section>;
}
