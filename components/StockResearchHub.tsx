import StockSearchMetadata from './StockSearchMetadata';
import StockCatalystLinks from './StockCatalystLinks';
import MoverNewsList from './MoverNewsList';
import StockPeerAnalysis from './StockPeerAnalysis';
import {useState} from 'react';
import Link from 'next/link';
import {stocks} from '../lib/stocks';
import type {ResearchBundle,Financial} from '../lib/stock-research';
import {decimal,multiple,money,percent} from '../lib/earnings';
import AppDownloadModal from './AppDownloadModal';
import styles from '../styles/StockResearch.module.css';
const pct=(v:number|null|undefined)=>v==null?'N/A':percent(v*100);
function GetApp(){
 const [open,setOpen]=useState(false);
 return <><button type="button" className={styles.getApp} aria-haspopup="dialog" onClick={()=>setOpen(true)}>Get App</button>{open&&<AppDownloadModal placement="stock_research_metric" title="Explore more in the app" onClose={()=>setOpen(false)}/>}</>;
}
const val=(value:string)=>value==='N/A'?<GetApp/>:value;
function Metric({label,value,hint}:{label:string;value:string;hint?:string}){return <div className={styles.metric}><span>{label}</span><strong>{val(value)}</strong>{hint&&<small>{hint}</small>}</div>}
function Chart({points,label,format=money,bars=false}:{points:[string,number][];label:string;format?:(v:number)=>string;bars?:boolean}){
 if(points.length<(bars?1:2))return <div className={styles.chart}><GetApp/></div>;
 const values=points.map(p=>p[1]),minimum=Math.min(...values),maximum=Math.max(...values);
 // A flat series still needs a finite domain; otherwise use the exact observed range.
 const padding=minimum===maximum?Math.max(Math.abs(minimum)*.01,.01):0;
 const min=minimum-padding,max=maximum+padding,range=max-min;
 const y=(value:number)=>180-(value-min)/range*140;
 const coords=points.map((p,i)=>`${35+i/Math.max(1,points.length-1)*730},${y(p[1])}`).join(' ');
 const step=730/points.length,barWidth=Math.min(52,step*.7),baseline=y(Math.max(min,Math.min(max,0)));
 return <figure className={styles.chart}><svg viewBox="0 0 800 220" role="img" aria-label={label+(bars?' bar chart':'')}><path d="M35 40H765M35 110H765M35 180H765" stroke="#24334b"/>
 {bars?<><line x1="35" x2="765" y1={baseline} y2={baseline} stroke="#7f93ad"/>{points.map(([date,value],i)=><rect key={date} x={35+i*step+(step-barWidth)/2} y={Math.min(179,Math.min(y(value),baseline))} width={barWidth} height={Math.max(1,Math.abs(y(value)-baseline))} rx="2" fill={value<0?'#ed8497':'#8cddd0'}><title>{`${date}: ${format(value)}`}</title></rect>)}</>:<polyline points={coords} fill="none" stroke="#8cddd0" strokeWidth="3" vectorEffect="non-scaling-stroke"/>}
 <text x="35" y="25" fill="#a7bed8" fontSize="12">{format(max)}</text>{bars&&<text x="35" y="196" fill="#a7bed8" fontSize="11">{format(min)}</text>}<text x="35" y="210" fill="#a7bed8" fontSize="12">{points[0][0]}</text><text x="765" y="210" textAnchor="end" fill="#a7bed8" fontSize="12">{points.at(-1)![0]}</text></svg><figcaption>{label} · Latest: {format(points.at(-1)![1])}{bars&&<> · Scale: {format(minimum)} to {format(maximum)}{minimum===maximum?" (constant value)":min>0||max<0?" (zoomed)":""}</>}</figcaption></figure>;
}
const fields:[keyof Financial,string][]=[['revenue','Revenue'],['netIncome','Net income'],['grossProfit','Gross profit'],['operatingIncome','Operating income'],['ebitda','EBITDA'],['operatingCashFlow','Operating cash flow'],['capitalExpenditure','Capital expenditure'],['cash','Cash'],['assets','Total assets'],['liabilities','Total liabilities'],['equity','Shareholder equity'],['debt','Total debt']];
export default function StockResearchHub({symbol,name,bundle,earningsDate}:{symbol:string;name:string;bundle:ResearchBundle;earningsDate?:string}){
 const s=bundle.snapshot,d=s?.detail,f=s?.financials.at(-1);const [metric,setMetric]=useState<keyof Financial>('revenue');const [peerMetric,setPeerMetric]=useState('valuation');
 const peers=[{symbol,name,detail:d||null,financials:s?.financials||[]},...(s?.peers||[])];
 const positivePE=(s?.peers||[]).map(p=>p.detail?.pe).filter((v):v is number=>typeof v==='number'&&v>0).sort((a,b)=>a-b);const middle=positivePE.length?positivePE.length%2?positivePE[Math.floor(positivePE.length/2)]:(positivePE[positivePE.length/2-1]+positivePE[positivePE.length/2])/2:null;
 return <div className={styles.research}><StockSearchMetadata symbol={symbol} name={name} bundle={bundle} earningsDate={earningsDate}/><StockCatalystLinks symbol={symbol}/>
 <section id="financials" className={styles.panel}><header><span className={styles.eyebrow}>02 / FINANCIALS</span><h2>{name} financials</h2><p>Revenue, earnings, cash flow and financial strength in one view.</p></header>
 <p className={styles.note}>{f?.date&&<>Financial statements: {f.date} · </>}{f?.currency||'Reporting currency unconfirmed'}.</p>
 <div className={styles.toolbar}><label htmlFor="financial-metric">Financial history</label><select id="financial-metric" value={metric} onChange={e=>setMetric(e.target.value as keyof Financial)}>{fields.map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></div>
 <Chart bars label={`${symbol} ${fields.find(([k])=>k===metric)?.[1]} · reported periods${f?.currency?' ('+f.currency+')':' (currency unconfirmed)'}`} points={(s?.financials||[]).filter(r=>typeof r[metric]==='number'&&Number.isFinite(r[metric])).map(r=>[r.date,r[metric] as number])}/>
 <div className={styles.metrics}>{fields.map(([key,label])=><Metric key={key} label={label} value={money(f?.[key] as number|null)}/>)}<Metric label="Net profit margin" value={pct(f?.netMargin)}/><Metric label="Gross margin" value={pct(f?.grossMargin)}/>{f?.debtToEquity!=null&&<Metric label="Debt / equity" value={multiple(f.debtToEquity)}/>}{f?.currentRatio!=null&&<Metric label="Current ratio" value={multiple(f.currentRatio)}/>}{f?.quickRatio!=null&&<Metric label="Quick ratio" value={multiple(f.quickRatio)}/>}<Metric label="Short interest: days to cover" value={decimal(s?.shortInterest?.daysToCover)} hint={s?.shortInterest?.date}/></div>
<details className={styles.method}><summary>How to read these financial metrics</summary><p>Figures use the app’s saved statements for the displayed period, not a trailing-year total. Margins divide profit by revenue; quick ratio uses current assets less inventory divided by current liabilities. Compare dates and currencies before comparing companies.</p></details></section>
 <section id="catalysts" className={styles.panel}><header><span className={styles.eyebrow}>03 / WHAT COMES NEXT</span><h2>{name} event catalysts</h2><p>Company earnings and scheduled market events that may change expectations.</p></header>
 {earningsDate&&<div className={styles.catalyst}><span className={styles.date}>{earningsDate}</span><div><h3>{symbol} earnings</h3><p>Watch reported results, management’s outlook and the share-price reaction.</p><a href="#earnings">See earnings expectations ↑</a></div></div>}
 {bundle.events.map(e=><article key={e.id} className={styles.catalyst}><span className={styles.date}>{e.date}<small>{e.timeLabel}</small></span><div><h3>{e.title}</h3><p>{e.watch}</p><a href={e.sourceUrl} rel="noopener noreferrer" target="_blank">Release schedule ↗</a><small className={styles.note}>{e.status}</small></div></article>)}
 {!bundle.events.length&&<p className={styles.note}>No upcoming events are listed in the saved calendar window.</p>}<p className={styles.note}>Dates use U.S. Eastern time and can change. Calendar events provide context; they do not determine the direction of a stock move.</p></section>
 <section id="peers" className={styles.panel}><header><span className={styles.eyebrow}>04 / SIDE BY SIDE</span><h2>Compare {symbol} with its peers</h2><p>{d?.industry||'Industry'} · Compare valuation, financial strength and price performance.</p></header>
 <div className={styles.metrics}><Metric label="Companies with valuation data" value={String(peers.filter(p=>p.detail).length)}/><Metric label="Peer median positive P/E" value={multiple(middle)}/><Metric label={`${symbol} P/E`} value={multiple(d?.pe)}/></div>
 <div className={styles.toolbar} role="group" aria-label="Peer metric group">{[['valuation','Valuation'],['financials','Financials'],['technicals','Technicals']].map(([key,label])=><button key={key} aria-pressed={peerMetric===key} onClick={()=>setPeerMetric(key)}>{label}</button>)}</div>
 <div className={styles.tableScroll} tabIndex={0} aria-label={`${symbol} peer comparison table`}><table><caption>{symbol} peer comparison: {peerMetric}</caption><thead><tr><th>Company</th>{(peerMetric==='valuation'?['Price','Market cap','P/E','Forward P/E','P/S','Forward P/S']:peerMetric==='financials'?['Revenue','Net income','Net margin','Debt / equity','Quick ratio','Cash']:['1-year change','RSI (14)','50-day average','200-day average','Relative volume']).map(label=><th key={label}>{label}</th>)}</tr></thead><tbody>{peers.map(p=>{const q=p.detail,f=p.financials.at(-1);const cells=peerMetric==='valuation'?[decimal(q?.price),money(q?.marketCap),multiple(q?.pe),multiple(q?.forwardPe),multiple(q?.ps),multiple(q?.forwardPs)]:peerMetric==='financials'?[money(f?.revenue),money(f?.netIncome),pct(f?.netMargin),multiple(f?.debtToEquity),multiple(f?.quickRatio),money(f?.cash)]:[percent(q?.technical?.oneYear),decimal(q?.technical?.rsi14),decimal(q?.technical?.sma50),decimal(q?.technical?.sma200),multiple(q?.technical?.relativeVolume)];return <tr key={p.symbol} data-current={p.symbol===symbol}><th><Link href={stocks.some(s=>s.ticker===p.symbol)?'/stocks/'+stocks.find(s=>s.ticker===p.symbol)!.slug:'/instruments/'+encodeURIComponent(p.symbol)+'/'}>{p.symbol}</Link><small>{p.name}</small><small>{peerMetric==='financials'?[f?.date,f?.currency].filter(Boolean).join(' · '):[q?.priceDate,q?.currency].filter(Boolean).join(' · ')}</small></th>{cells.map((c,i)=><td key={i}>{val(c)}</td>)}</tr>})}</tbody></table></div>
 <div className={styles.distribution} aria-label="Positive P/E comparison">{peers.filter(p=>(p.detail?.pe??0)>0).map(p=><div key={p.symbol} data-current={p.symbol===symbol}><span>{p.symbol}</span><i style={{width:((p.detail!.pe!/Math.max(...peers.map(q=>q.detail?.pe??0),1))*100)+'%'}}/><span>{multiple(p.detail?.pe)}</span></div>)}</div><p className={styles.note}>The peer median excludes the selected stock and is based on {positivePE.length} available positive multiples. P/E median excludes negative or missing earnings multiples. Peer reports can have different fiscal periods and currencies; values are not currency-converted.</p></section>
 <MoverNewsList symbol={symbol}/>
 <StockPeerAnalysis symbol={symbol} companies={bundle.peerAnalysis} industries={bundle.industries}/>
 </div>;
}
