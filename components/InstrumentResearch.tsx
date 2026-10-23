import Link from 'next/link';
import StockPeerPerformance from './heatmap/StockPeerPerformance';
import StockEarnings from './earnings/StockEarnings';
import StockResearchHub from './StockResearchHub';
import StockAppCTA from './StockAppCTA';
import type {ResearchBundle} from '../lib/stock-research';
import type {Calendar} from '../lib/earnings';
import type {catalog} from '../lib/catalog';
import {ResearchPreview,researchUrl} from '../lib/research';
import {displayDate} from '../lib/seo';

export type InstrumentResearchProps={item:typeof catalog[number];news:ResearchPreview[];bundle:ResearchBundle|null;calendar:Calendar|null;embedded?:boolean};
export default function InstrumentResearch({item,news,bundle,calendar,embedded=false}:InstrumentResearchProps){
 const heading=<>{item.name} (<span data-stock-symbol={item.symbol}>{item.symbol}</span>)</>;
 return <>
 <div className="public-copy profile">
 {!embedded&&<Link href="/stocks">← Search stocks</Link>}
 {embedded?<><p className="research-kicker">EXPLORE THE COMPANY</p><h2>{heading}</h2><p>Explore earnings, price action, financials and industry comparisons.</p></>:<h1>{heading}</h1>}
 <dl>{[["Symbol",item.symbol],["Sector",item.sector],["Industry",item.industry],["Instrument type",item.type]].filter(([,value])=>value).map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
 <p>Profile information from our saved company catalog. This is not a live quote or confirmation of current listing status.</p></div>
 {bundle&&<><div id="earnings" style={{scrollMarginTop:120}}><StockEarnings symbol={item.symbol} initialCalendar={calendar} detail={bundle.snapshot?.detail}/></div><StockResearchHub symbol={item.symbol} name={item.name} bundle={bundle} showMoverNews={!embedded} earningsDate={calendar?.items.filter(e=>e.date>=bundle.today).sort((a,b)=>a.date.localeCompare(b.date))[0]?.date}/></>}
 <div className="public-copy">{news.length>=5&&<><h2>Related research</h2>{news.map(n=><p key={n.id}><Link href={researchUrl(n.id,n.title)}>{n.title}</Link><br/><small>{displayDate(n.time)}</small></p>)}</>}</div>
 {item.type==='EQUITY'&&<StockPeerPerformance symbol={item.symbol} industry={item.industry}/>}
 <StockAppCTA symbol={item.symbol}/>
 <style jsx>{`.research-kicker{font-size:12px;letter-spacing:.12em;color:#bda4f3;margin-top:36px}.profile{margin:24px 0 32px;padding:26px;border:1px solid #2e3e55;border-radius:22px;background:#101a2a}.profile p{font-size:14px;line-height:1.7;color:#a8bad0}.profile dl{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;margin:24px 0}.profile dt{font-size:11px;color:#8fa4c0;margin-bottom:7px}.profile dd{margin:0;font-size:14px;color:#e3eaf7;overflow-wrap:anywhere}.profile .research-kicker{margin-top:0;color:#bda4f3;font-size:11px}@media(max-width:700px){.profile{padding:20px}.profile dl{grid-template-columns:repeat(2,minmax(0,1fr))}}.public-copy h2{font-size:clamp(26px,3vw,36px);line-height:1.2}`}</style>
 </>;
}
