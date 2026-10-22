import {useEffect,useId,useState} from 'react';
import Link from 'next/link';
import IndustryExplorer from './IndustryExplorer';
import StockLogo from './StockLogo';
import AppDownloadModal from './AppDownloadModal';
import {money,decimal,percent,multiple} from '../lib/earnings';
import {finite,peHistogram,periods} from '../lib/peer-analysis';
import type {PeerCompany,Period,Metric,ChangeMetric,IndustrySummary} from '../lib/peer-analysis';
import {stocks} from '../lib/stocks';
import styles from '../styles/PeerAnalysis.module.css';

const metrics:[Metric,string][]=[['marketCap','Market cap'],['pe','Trailing P/E'],['forwardPe','Forward P/E'],['ps','Price / sales'],['oneYear','1-year price change'],['rsi','RSI (14)'],['netMargin','Net profit margin'],['debtToEquity','Debt / equity']];
const changeMetrics:[ChangeMetric,string][]=[['eps','Earnings per share'],['revenue','Revenue'],['netIncome','Net income']];
const metricLabel=(key:Metric)=>metrics.find(([k])=>k===key)![1];
const metricFormat=(key:Metric,value:number|null)=>key==='marketCap'?money(value):['pe','forwardPe','ps','debtToEquity'].includes(key)?multiple(value):['oneYear','netMargin'].includes(key)?percent(value):decimal(value);
const href=(symbol:string)=>{const stock=stocks.find(s=>s.ticker===symbol);return stock?`/stocks/${stock.slug}/`:`/instruments/${encodeURIComponent(symbol)}/`};
const domain=(values:number[],nonnegative=false)=>{const low=Math.min(...values),high=Math.max(...values),pad=Math.max((high-low)*.12,Math.abs(low)*.02,.5);return [nonnegative?Math.max(0,low-pad):low-pad,high+pad]};
export default function StockPeerAnalysis({symbol='',companies=[],industries=[],industry}:{symbol?:string;companies?:PeerCompany[];industries?:IndustrySummary[];industry?:string}){
 const id=useId();
 const [companyLimit,setCompanyLimit]=useState(8);
 const [mode,setMode]=useState<'change'|'metrics'>('change'),[period,setPeriod]=useState<Period>('1Y'),[changeMetric,setChangeMetric]=useState<ChangeMetric>('eps');
 const [xMetric,setXMetric]=useState<Metric>('marketCap'),[yMetric,setYMetric]=useState<Metric>('pe');
 const [selected,setSelected]=useState(symbol||companies[0]?.symbol||''),[hidden,setHidden]=useState<string[]>([]),[query,setQuery]=useState(''),[sort,setSort]=useState<'cap'|'pe'|'name'>('cap');
 const [allPE,setAllPE]=useState(false),[bin,setBin]=useState<number|null>(null),[app,setApp]=useState(false);
 useEffect(()=>setCompanyLimit(8),[query,sort,bin,symbol]);
 const current=companies.find(c=>c.symbol===symbol),chosen=companies.find(c=>c.symbol===selected);
 const label=changeMetrics.find(([k])=>k===changeMetric)![1];
 const xLabel=mode==='change'?`${period} price change`:metricLabel(xMetric),yLabel=mode==='change'?`${period} ${label.toLowerCase()} change`:metricLabel(yMetric);
 const xValue=(c:PeerCompany)=>mode==='change'?c.changes[period].price.value:c[xMetric];
 const yValue=(c:PeerCompany)=>mode==='change'?c.changes[period][changeMetric].value:c[yMetric];
 const formatX=(v:number|null)=>mode==='change'?percent(v):metricFormat(xMetric,v),formatY=(v:number|null)=>mode==='change'?percent(v):metricFormat(yMetric,v);
 const valid=companies.filter(c=>finite(xValue(c))&&finite(yValue(c)));
 const points=valid.filter(c=>!hidden.includes(c.symbol)).sort((a,b)=>(b.marketCap||0)-(a.marketCap||0));
 const [xmin,xmax]=domain(points.length?points.map(c=>xValue(c)!):[0,1],mode==='metrics'&&['marketCap','pe','forwardPe','ps'].includes(xMetric)),[ymin,ymax]=domain(points.length?points.map(c=>yValue(c)!):[0,1],mode==='metrics'&&['marketCap','pe','forwardPe','ps'].includes(yMetric));
 const px=(v:number)=>88+(v-xmin)/(xmax-xmin)*570,py=(v:number)=>300-(v-ymin)/(ymax-ymin)*248;
 const maxCap=Math.max(1,...points.map(c=>c.marketCap||0));
 const hist=peHistogram(companies,allPE),focused=peHistogram(companies),matching=bin==null?null:hist.bins[bin].companies;
 const search=query.trim().replace(/^\$/,'').toLowerCase();
 const list=companies.filter(c=>(!matching||matching.some(p=>p.symbol===c.symbol))&&(!search||`${c.symbol} ${c.name}`.toLowerCase().includes(search))).sort((a,b)=>sort==='name'?a.name.localeCompare(b.name):sort==='pe'?(a.pe??Infinity)-(b.pe??Infinity):(b.marketCap??-1)-(a.marketCap??-1));
 const openApp=<button type="button" className={styles.getApp} aria-haspopup="dialog" onClick={()=>setApp(true)}>Get App</button>;
 const display=(value:number|null,text:string)=>finite(value)?text:openApp;
 const choose=(s:string)=>setSelected(s);
 function resetComparison(){setHidden([]);setSelected(symbol||companies[0]?.symbol||'');}
 return <section id="peer-analysis" className={styles.section}>
  <header><span className={styles.eyebrow}>{industry?'INDUSTRY ANALYSIS':'05 / PEER ANALYSIS'}</span><h2>{industry?`${industry} comparison & valuation`:`Explore ${symbol} alongside its peers`}</h2><p>{industry||current?.industry||'Related companies'} · {companies.length} companies · Cached market data</p></header>
  <div className={styles.card}>
   <h3>Comparison</h3>
   <div className={styles.tabs} role="group" aria-label="Peer analysis mode">{(['change','metrics'] as const).map(m=><button key={m} type="button" aria-pressed={mode===m} onClick={()=>{setMode(m);resetComparison()}}>{m==='change'?'Change':'Metrics'}</button>)}</div>
   {mode==='change'?<><div className={styles.periods} role="group" aria-label="Peer analysis period">{periods.map(p=><button key={p} type="button" aria-pressed={p===period} onClick={()=>{setPeriod(p);resetComparison()}}>{p}</button>)}</div><label className={styles.selector} htmlFor={id+'-change'}>Compare price change with<select id={id+'-change'} value={changeMetric} onChange={e=>{setChangeMetric(e.target.value as ChangeMetric);resetComparison()}}>{changeMetrics.map(([key,name])=><option key={key} value={key}>{name}</option>)}</select></label></>:<div className={styles.axes}>{[['Horizontal axis',xMetric,setXMetric],['Vertical axis',yMetric,setYMetric]].map(([title,value,set],i)=><label className={styles.selector} key={i} htmlFor={id+'-axis'+i}>{title as string}<select id={id+'-axis'+i} value={value as string} onChange={e=>{(set as (v:Metric)=>void)(e.target.value as Metric);resetComparison()}}>{metrics.map(([key,name])=><option key={key} value={key}>{name}</option>)}</select></label>)}</div>}
  </div>
  <div className={styles.card}>
   <h3>Compare companies</h3><p>Tap a bubble to inspect a company. Bubble area reflects market cap, with a minimum size for visibility.</p>
   <div className={styles.chartLabel}>{yLabel}</div>
   {points.length?<div className={styles.scatter}><svg viewBox="0 0 700 365" aria-label={`${xLabel} versus ${yLabel}`} role="group">
    {[0,1,2,3].map(i=>{const y=ymin+(ymax-ymin)*i/3,x=xmin+(xmax-xmin)*i/3;return <g key={i}><line x1="88" x2="658" y1={py(y)} y2={py(y)} stroke="#273649"/><text x="79" y={py(y)+5} textAnchor="end">{formatY(y)}</text><text x={px(x)} y="326" textAnchor="middle">{formatX(x)}</text></g>})}
    {xmin<0&&xmax>0&&<line x1={px(0)} x2={px(0)} y1="52" y2="300" stroke="#52647a" strokeDasharray="4 4"/>}
    {ymin<0&&ymax>0&&<line x1="88" x2="658" y1={py(0)} y2={py(0)} stroke="#52647a" strokeDasharray="4 4"/>}
    {[...points.filter(c=>c.symbol!==selected),...points.filter(c=>c.symbol===selected)].map(c=><circle key={c.symbol} role="button" tabIndex={0} aria-pressed={selected===c.symbol} aria-label={`${c.symbol}: ${xLabel} ${formatX(xValue(c))}; ${yLabel} ${formatY(yValue(c))}`} cx={px(xValue(c)!)} cy={py(yValue(c)!)} r={finite(c.marketCap)&&c.marketCap>0?Math.max(7,29*Math.sqrt(c.marketCap/maxCap)):7} fill={selected===c.symbol?'#8ad8bf':'#9fbced55'} stroke={selected===c.symbol?'#c2f9e9':'#9fbced'} strokeWidth={selected===c.symbol?3:1.5} strokeDasharray={c.marketCap==null?'3 2':undefined} onClick={()=>choose(c.symbol)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(c.symbol)}}}><title>{`${c.symbol} · ${c.name}\n${xLabel}: ${formatX(xValue(c))}\n${yLabel}: ${formatY(yValue(c))}`}</title></circle>)}
    <text x="373" y="355" textAnchor="middle" className={styles.axisTitle}>{xLabel}</text>
   </svg></div>:<div className={styles.empty}><p>{hidden.length===valid.length&&valid.length?'All plotted companies are hidden.':'Explore this comparison with the full research in the app.'}</p>{valid.length===0?openApp:<button type="button" onClick={()=>setHidden([])}>Restore companies</button>}</div>}
   {chosen&&<div className={styles.selection} aria-live="polite"><div><span className={styles.ticker}>{chosen.symbol}</span><span>{chosen.name}</span><p>{xLabel}: {display(xValue(chosen),formatX(xValue(chosen)))}<br/>{yLabel}: {display(yValue(chosen),formatY(yValue(chosen)))}</p><small>{mode==='change'?<>Price observations: {chosen.changes[period].price.from||'—'} to {chosen.changes[period].price.to||'—'}<br/>Financial observations: {chosen.changes[period][changeMetric].from||'—'} to {chosen.changes[period][changeMetric].to||'—'}</>:<>Price snapshot: {chosen.priceDate||'See app'}{chosen.financialDate&&<> · Financial period: {chosen.financialDate}</>}</>}</small></div><div className={styles.selectionActions}><Link href={href(chosen.symbol)}>View research ↗</Link>{points.some(c=>c.symbol===chosen.symbol)&&<button type="button" aria-label={`Hide ${chosen.symbol} from chart`} onClick={()=>setHidden(h=>[...h,chosen.symbol])}>Hide ×</button>}</div></div>}
   <div className={styles.foot}><span>{valid.length} of {companies.length} companies have both plotted values.{hidden.length>0&&` ${hidden.length} hidden.`}</span>{hidden.length>0&&<button type="button" onClick={()=>setHidden([])}>Restore hidden companies</button>}{valid.length<companies.length&&openApp}</div>
  </div>
  <div className={styles.card}>
   <h3>P/E distribution</h3><p>Trailing price-to-earnings multiples · {hist.values.length} companies</p>
   <div className={styles.stats}><div><span>Median P/E</span><strong>{display(hist.median,multiple(hist.median))}</strong></div><div><span>Middle 50%</span><strong>{hist.q1==null?openApp:`${multiple(hist.q1)} to ${multiple(hist.q3)}`}</strong></div><div><span>{symbol?`${symbol} P/E`:'Positive P/E coverage'}</span><strong>{symbol?display(current?.pe??null,multiple(current?.pe)):`${hist.values.length} / ${companies.length}`}</strong></div></div>
   {hist.values.length>0?<><div className={styles.histWrap}><div className={styles.histogram} role="group" aria-label="P/E distribution ranges">{hist.bins.map((b,i)=><button key={i} type="button" disabled={!b.companies.length} aria-pressed={bin===i} aria-label={`P/E ${decimal(b.low)} to ${decimal(b.high)}: ${b.companies.length} companies`} aria-controls={id+'-pe-matches'} onClick={()=>{setBin(bin===i?null:i);setQuery('')}}><span className={styles.histCount}>{b.companies.length||''}</span><i style={{height:Math.max(2,b.companies.length/Math.max(...hist.bins.map(b=>b.companies.length),1)*110)}}/></button>)}</div>{finite(current?.pe)&&current!.pe!>=hist.low&&current!.pe!<=hist.high&&<span className={styles.peMarker} style={{left:((current!.pe!-hist.low)/(hist.high-hist.low)*100)+'%'}} aria-label={`${symbol} P/E marker`}><span>{symbol}</span></span>}<div className={styles.histEnds}><span>{multiple(hist.low)}</span><span>{multiple(hist.high)}</span></div></div><p className={styles.hint}>Tap a bar to see the companies in that P/E range.{finite(current?.pe)&&<> {symbol} has a higher P/E than {Math.round(hist.values.filter(p=>p<current!.pe!).length/hist.values.length*100)}% of this group.</>}</p></>:<div className={styles.empty}>{openApp}</div>}
   <div id={id+'-pe-matches'} aria-live="polite">{matching&&<div className={styles.rangeResults}><div className={styles.foot}><h4>P/E {multiple(hist.bins[bin!].low)} to {multiple(hist.bins[bin!].high)} · {matching.length} {matching.length===1?'company':'companies'}</h4><button type="button" onClick={()=>setBin(null)}>Clear P/E filter ×</button></div><ul>{[...matching].sort((a,b)=>(a.pe||0)-(b.pe||0)).map(c=><li key={c.symbol}><Link href={href(c.symbol)}><StockLogo symbol={c.symbol} src={c.logo||null}/><span><strong>{c.symbol}</strong><small>{c.name}</small></span><span>{multiple(c.pe)} ↗</span></Link></li>)}</ul></div>}</div>
   {(focused.hidden>0||allPE)&&<button type="button" className={styles.textButton} onClick={()=>{setAllPE(!allPE);setBin(null)}}>{allPE?'Focus P/E range':`Show all P/E values (${focused.hidden} outside focused range)`}</button>}
   <p className={styles.note}>{companies.length-hist.values.length} companies excluded from P/E statistics because earnings are non-positive or the saved multiple is missing. Statistics include all valid positive values, including those outside the focused chart range.</p>
  </div>
  <div className={styles.card}>
   <h3>Companies</h3><p aria-live="polite">Showing {Math.min(companyLimit,list.length)} of {list.length} matching companies · {sort==='cap'?'Largest market cap first':sort==='pe'?'Lowest positive P/E first':'Company name'}</p>
   <div className={styles.search}><label htmlFor={id+'-search'} className={styles.srOnly}>Search peer companies</label><input id={id+'-search'} type="search" placeholder="Search company or ticker" value={query} onChange={e=>setQuery(e.target.value)}/><label htmlFor={id+'-sort'} className={styles.srOnly}>Sort peer companies</label><select id={id+'-sort'} value={sort} onChange={e=>setSort(e.target.value as typeof sort)}><option value="cap">Sort by market cap</option><option value="pe">Sort by P/E</option><option value="name">Sort by name</option></select></div>
   {bin!=null&&<div className={styles.foot}>P/E range: {multiple(hist.bins[bin].low)} to {multiple(hist.bins[bin].high)}<button type="button" onClick={()=>setBin(null)}>Clear P/E filter ×</button></div>}
   <ul id={id+'-companies'} className={styles.companies+(companies.length>8?' '+styles.compactCompanies:'')}>{list.slice(0,companyLimit).map(c=><li key={c.symbol} data-selected={c.symbol===selected}><button type="button" className={styles.companyName} onClick={()=>choose(c.symbol)} aria-label={`Inspect ${c.symbol}`}><StockLogo symbol={c.symbol} src={c.logo||null}/><span><strong>{c.symbol}</strong><span>{c.name}</span></span></button><div className={styles.companyFacts+' '+styles.valuationFacts}><span>Market cap {display(c.marketCap,money(c.marketCap))}</span><span>P/E {display(c.pe,multiple(c.pe))}</span><span>P/S {display(c.ps,multiple(c.ps))}</span><span>Forward P/E {openApp}</span><span>Forward P/S {openApp}</span><small>{c.priceDate?`Price snapshot: ${c.priceDate}`:'Catalog snapshot'}{c.financialDate?` · Financials: ${c.financialDate}`:''}</small></div><Link className={styles.companyLink} href={href(c.symbol)} aria-label={`Open ${c.symbol} research`}>↗</Link></li>)}</ul>
   {list.length>8&&<div className={styles.companyPaging}>{companyLimit<list.length&&<button type="button" aria-controls={id+'-companies'} onClick={()=>setCompanyLimit(n=>n+8)}>Show {Math.min(8,list.length-companyLimit)} more <span>({list.length-companyLimit} remaining)</span></button>}{companyLimit>8&&<button type="button" aria-controls={id+'-companies'} onClick={()=>setCompanyLimit(8)}>Show fewer</button>}</div>}
   {!list.length&&<p>No companies match these filters.</p>}
  </div>
  {industries.length>0&&<IndustryExplorer industries={industries} current={industry||current?.industry}/>}
  <details className={styles.method}><summary>How this comparison works</summary><p>Uses the saved companies from the same industry and listing market{symbol?`, including ${symbol}`:''}, ordered by cached market cap. Company snapshots can have different dates; the web cache may cover fewer metrics and periods than the app.</p><p>Periods end at each company’s dated price snapshot. Change compares the latest saved observation with one at or before the selected period’s start. A daily price change uses consecutive saved sessions. Financial data updates quarterly, so short periods may show no change. Missing history and zero starting values are excluded; a negative starting value uses its absolute value as the denominator.</p><p>Metrics use saved ratios and percentages. Market caps use the listing market’s reporting currency; underlying financial statements may use different currencies. Circle sizes have a minimum for touch visibility, and an outlined circle indicates a missing market cap. These comparisons describe data, not recommendations or price predictions.</p></details>
  {app&&<AppDownloadModal placement="stock_peer_analysis" title="Explore the full peer analysis in the app" onClose={()=>setApp(false)}/>}
 </section>;
}
