import {Contract} from '../../lib/options';
import {expirationRows} from '../../lib/options-workspace';
import styles from './OptionsExplorer.module.css';
const n=(v:number|null)=>v===null?'—':v.toLocaleString('en-US');
export default function ExpirationComparison({contracts,onSelect}:{contracts:Contract[];onSelect:(date:string)=>void}){
 const rows=expirationRows(contracts);
 return <section className={styles.panel}><h3>Compare expirations</h3><p className={styles.note}>Currently loaded contracts for this ticker. Select “All expirations” to compare the available dates. IV is the median of reported values, not a forecast.</p>{rows.length?<div className={styles.tableWrap}><table><thead><tr><th>Expiration</th><th>Contracts shown</th><th>Call volume</th><th>Put volume</th><th>Call OI</th><th>Put OI</th><th>Put / call OI</th><th>Median IV</th></tr></thead><tbody>{rows.map(r=><tr key={r.expiry}><td><button onClick={()=>onSelect(r.expiry)}>{r.expiry} →</button></td><td>{r.count}</td><td>{n(r.callVolume)}</td><td>{n(r.putVolume)}</td><td>{n(r.callOi)}</td><td>{n(r.putOi)}</td><td>{r.putCallOi===null?'—':r.putCallOi.toFixed(2)+'×'}</td><td>{r.medianIv===null?'—':(r.medianIv*100).toFixed(1)+'%'}<small> {r.ivCount}/{r.count} with IV</small></td></tr>)}</tbody></table></div>:<p className={styles.note}>No expiration data for this selection.</p>}</section>
}
