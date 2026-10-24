import {HeatStock,Period,biggestMovers,sectorRankings,percent,periodLabel,returnColor} from '../../lib/market-heatmap';
import styles from './Heatmap.module.css';
import MoverContext from '../MoverContext';
import MoverTrade from '../MoverTrade';
export function Movers({rows,period,colorblind,onPick,label,marketSession='intraday'}:{rows:HeatStock[];period:Period;colorblind:boolean;onPick:(r:HeatStock)=>void;label?:string;marketSession?:string}){
 const {gainers,losers}=biggestMovers(rows,period);
 return <section className={styles.verticalMovers} aria-label="Stock movers"><h3>Stock movers <small>{label||periodLabel(period)}</small></h3><div className={styles.moverColumns}>{([['Gainers',gainers],['Decliners',losers]] as const).map(([title,items])=><div key={title}><h4 style={{color:title==='Gainers'?'#79dfb8':'#ff8d9c'}}>{title}</h4>{items.length?items.map(r=><div className={styles.verticalMover} key={r.symbol}><button onClick={()=>onPick(r)}><span><strong>{r.symbol}</strong><small>{r.name}</small></span><b style={{color:returnColor(r.changes[period],colorblind)}}>{percent(r.changes[period])}</b></button><div className={styles.verticalActions}><MoverContext stock={r} period={period} marketSession={marketSession} compact/><MoverTrade symbol={r.symbol} compact/></div></div>):<p>No available quotes.</p>}</div>)}</div></section>;
}
export function SectorLeaderboard({rows,period,colorblind,onSector}:{rows:HeatStock[];period:Period;colorblind:boolean;onSector:(s:string)=>void}){
 const rankings=sectorRankings(rows.map(r=>({...r,sector:r.industry||r.sector})),period);
 return <details className={styles.rankings} open><summary>Industry movers <span>{periodLabel(period)}</span></summary><p>Average return of covered stocks in each industry.</p><div className={styles.rankingGrid}>{rankings.map((r,i)=><button key={r.name} onClick={()=>onSector(r.name)}><span>{i+1}. {r.name}<small>{r.available}/{r.total} stocks with data</small></span><strong style={{color:returnColor(r.average,colorblind)}}>{percent(r.average)}</strong></button>)}</div>{!rankings.length&&<p>No stocks in this view.</p>}</details>;
}
export function IndustryPeers({stock,rows,period,colorblind,onPick}:{stock:HeatStock;rows:HeatStock[];period:Period;colorblind:boolean;onPick:(r:HeatStock)=>void}){
 const peers=stock.industry?rows.filter(r=>r.industry===stock.industry&&r.symbol!==stock.symbol):[];
 const values=peers.map(r=>r.changes[period]).filter((v):v is number=>v!==null);
 const average=values.length?values.reduce((s,v)=>s+v,0)/values.length:null;
 const sorted=[stock,...peers].sort((a,b)=>(b.changes[period]??-Infinity)-(a.changes[period]??-Infinity)||a.symbol.localeCompare(b.symbol));
 return <section className={styles.peers} aria-label="Industry peer comparison"><h4>Compare industry peers · {periodLabel(period)}</h4><p>{stock.industry||'No saved industry'} · {peers.length} other stocks in loaded coverage. {average!==null?`Peer average: ${percent(average)} (${values.length} with data; excludes ${stock.symbol}).`:'No peer returns available for this period.'}</p><div className={styles.peerList}>{sorted.map(r=><button key={r.symbol} aria-current={r.symbol===stock.symbol?'true':undefined} onClick={()=>onPick(r)}><span><strong>{r.symbol}</strong><small>{r.name}</small></span><span style={{color:returnColor(r.changes[period],colorblind)}}>{percent(r.changes[period])}</span></button>)}</div></section>;
}
