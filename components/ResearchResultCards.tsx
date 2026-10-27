import type {MoverArticle} from '../lib/mover-research';
import {earningsRows,sessionPerformance} from '../lib/research-presentation';
export function SessionPerformanceCard({article}:{article:MoverArticle}){
 const perf=sessionPerformance(article);if(!perf)return null;
 return <section className={'session-performance '+perf.tone} aria-label="Session snapshot"><div><strong>{article.symbol} · {perf.date}</strong><span>{perf.session} · {perf.basis}</span></div><div className="return"><b>{perf.move>0?'+':''}{perf.move.toFixed(2)}%</b><span>Session snapshot</span></div><style jsx>{`
 .session-performance{display:flex;align-items:center;justify-content:space-between;gap:16px;border:1px solid #63817b66;background:#36d8a312;border-radius:18px;padding:18px;margin:0 0 22px;color:#7ce2bd}.negative{color:#ff8d9c;background:#fb617612;border-color:#ff8d9c44}.neutral{color:#d4bdff;background:#a78bfa12}.session-performance strong{display:block;font-size:13px;color:#d0dbea;line-height:1.5}.session-performance span{display:block;font-size:11px;line-height:1.5;margin-top:4px;color:#9fadc4}.return{text-align:right;flex-shrink:0}.return b{font-size:30px;line-height:1.2;font-variant-numeric:tabular-nums}.return span{color:inherit}@media(max-width:420px){.session-performance{padding:14px;gap:10px}.return b{font-size:25px}.session-performance strong{font-size:12px}}
 `}</style></section>;
}
export function EarningsResultsCard({article}:{article:MoverArticle}){
 const rows=earningsRows(article);if(!rows.length)return null;
 return <section className="earnings-results" data-research-content-kind="earnings_results" aria-label="Earnings results"><h3>Earnings results</h3><ul>{rows.map(row=><li key={row.headline} className={row.tone}><span className="circle" aria-hidden="true"/><div><strong>{row.headline}</strong><p>{row.detail}</p></div></li>)}</ul><style jsx>{`
 .earnings-results{border:1px solid #8b5cf655;background:linear-gradient(135deg,#8b5cf60e,#111d2e);border-radius:18px;padding:20px;margin:0 0 22px;color:#c8d3e5}.earnings-results h3{color:#c9b1ff;text-transform:uppercase;letter-spacing:.08em;font-size:12px;margin:0 0 18px}.earnings-results ul{list-style:none;padding:0;margin:0;display:grid;gap:18px}.earnings-results li{display:flex;align-items:flex-start;gap:12px;min-width:0}.circle{width:13px;height:13px;border-radius:50%;flex-shrink:0;background:currentColor;margin-top:5px}.positive{color:#55deb0}.negative{color:#ff8d9c}.neutral{color:#e4c975}.earnings-results strong{font-size:16px;line-height:1.5}.earnings-results p{font-size:14px;line-height:1.6;margin:4px 0 0;color:#b7c6db;overflow-wrap:anywhere}@media(max-width:420px){.earnings-results{padding:16px}.earnings-results strong{font-size:15px}.earnings-results p{font-size:13px}}
 `}</style></section>;
}
