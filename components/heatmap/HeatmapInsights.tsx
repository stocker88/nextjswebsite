import {HeatStock,Period,biggestMovers,sectorRankings,percent,periodLabel,returnColor} from '../../lib/market-heatmap';
import styles from './Heatmap.module.css';
export function Movers({rows,period,colorblind,onPick}:{rows:HeatStock[];period:Period;colorblind:boolean;onPick:(r:HeatStock)=>void}){
 const {gainers,losers}=biggestMovers(rows,period);
 return <section className={styles.movers} aria-label="Biggest movers"><span className={styles.moversTitle}>Biggest movers · {periodLabel(period)}</span>{[['Gainers',gainers],['Losers',losers]].map(([label,items])=><div className={styles.moverLine} key={label as string}><span>{label as string}</span><div>{(items as HeatStock[]).length?(items as HeatStock[]).map(r=><button key={r.symbol} onClick={()=>onPick(r)} aria-label={`Highlight ${r.symbol}`}><strong>{r.symbol}</strong> <span style={{color:returnColor(r.changes[period],colorblind)}}>{percent(r.changes[period])}</span></button>):<small>None in this view</small>}</div></div>)}</section>;
}
export function SectorLeaderboard({rows,period,colorblind,onSector}:{rows:HeatStock[];period:Period;colorblind:boolean;onSector:(s:string)=>void}){
 const rankings=sectorRankings(rows,period);
 return <details className={styles.rankings} open><summary>Sector leaderboard <span>{periodLabel(period)}</span></summary><p>Equal-weight average of displayed stocks with available returns. Coverage is shown for each sector; this is not the full sector index.</p><div className={styles.rankingGrid}>{rankings.map((r,i)=><button key={r.name} onClick={()=>onSector(r.name)}><span>{i+1}. {r.name}<small>{r.available}/{r.total} stocks with data</small></span><strong style={{color:returnColor(r.average,colorblind)}}>{percent(r.average)}</strong></button>)}</div>{!rankings.length&&<p>No stocks in this view.</p>}</details>;
}
export function IndustryPeers({stock,rows,period,colorblind,onPick}:{stock:HeatStock;rows:HeatStock[];period:Period;colorblind:boolean;onPick:(r:HeatStock)=>void}){
 const peers=stock.industry?rows.filter(r=>r.industry===stock.industry&&r.symbol!==stock.symbol):[];
 const values=peers.map(r=>r.changes[period]).filter((v):v is number=>v!==null);
 const average=values.length?values.reduce((s,v)=>s+v,0)/values.length:null;
 const sorted=[stock,...peers].sort((a,b)=>(b.changes[period]??-Infinity)-(a.changes[period]??-Infinity)||a.symbol.localeCompare(b.symbol));
 return <section className={styles.peers} aria-label="Industry peer comparison"><h4>Compare industry peers · {periodLabel(period)}</h4><p>{stock.industry||'No saved industry'} · {peers.length} other stocks in loaded coverage. {average!==null?`Peer average: ${percent(average)} (${values.length} with data; excludes ${stock.symbol}).`:'No peer returns available for this period.'}</p><div className={styles.peerList}>{sorted.map(r=><button key={r.symbol} aria-current={r.symbol===stock.symbol?'true':undefined} onClick={()=>onPick(r)}><span><strong>{r.symbol}</strong><small>{r.name}</small></span><span style={{color:returnColor(r.changes[period],colorblind)}}>{percent(r.changes[period])}</span></button>)}</div></section>;
}
