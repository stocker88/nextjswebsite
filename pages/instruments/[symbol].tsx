import StockPeerPerformance from '../../components/heatmap/StockPeerPerformance';
import StockEarnings from '../../components/earnings/StockEarnings';
import Link from 'next/link';
import ResearchPage from '../../components/ResearchPage';
import StockResearchHub from '../../components/StockResearchHub';
import StockAppCTA from '../../components/StockAppCTA';
import {loadStockResearch,loadStockEarnings} from '../../lib/stock-research-server';
import type {ResearchBundle} from '../../lib/stock-research';
import type {Calendar} from '../../lib/earnings';
import {catalog} from '../../lib/catalog';
import {recentStockNews} from '../../lib/stocks';
import {fetchResearch} from '../../lib/research-server';
import {ResearchPreview,researchUrl} from '../../lib/research';
import {displayDate} from '../../lib/seo';
export default function Instrument({item,news,bundle,calendar}:{item:typeof catalog[number];news:ResearchPreview[];bundle:ResearchBundle|null;calendar:Calendar|null}){
return <ResearchPage title={`${item.name} (${item.symbol}): profile and research`} path={`/instruments/${encodeURIComponent(item.symbol)}`} noindex hideAppDownload><div className="public-copy"><Link href="/stocks">← Search stocks</Link><h1>{item.name} (<span data-stock-symbol={item.symbol}>{item.symbol}</span>)</h1><dl><dt>Symbol</dt><dd>{item.symbol}</dd>{item.sector&&<><dt>Sector</dt><dd>{item.sector}</dd></>}{item.industry&&<><dt>Industry</dt><dd>{item.industry}</dd></>}{item.type&&<><dt>Instrument type</dt><dd>{item.type}</dd></>}</dl><p>Profile information from the app’s catalog. This is not a live quote or confirmation of current listing status.</p></div>{bundle&&<><div id="earnings" style={{scrollMarginTop:120}}><StockEarnings symbol={item.symbol} initialCalendar={calendar} detail={bundle.snapshot?.detail}/></div><StockResearchHub symbol={item.symbol} name={item.name} bundle={bundle} earningsDate={calendar?.items.filter(e=>e.date>=bundle.today).sort((a,b)=>a.date.localeCompare(b.date))[0]?.date}/></>}<div className="public-copy">{news.length >= 5 && <><h2>Related research</h2>{news.map(n=><p key={n.id}><Link href={researchUrl(n.id, n.title)}>{n.title}</Link><br/><small>{displayDate(n.time)}</small></p>)} </>}</div>{item.type==='EQUITY'&&<StockPeerPerformance symbol={item.symbol} industry={item.industry}/>}<StockAppCTA symbol={item.symbol}/></ResearchPage>;
}
export function getStaticPaths(){return {paths:[],fallback:'blocking'};}
export async function getStaticProps({params}:any){const item=catalog.find(i=>i.symbol===params.symbol);if(!item)return {notFound:true};return {props:{item,news:recentStockNews(await fetchResearch(),item.symbol),bundle:item.type==='EQUITY'?loadStockResearch(item.symbol):null,calendar:item.type==='EQUITY'?loadStockEarnings(item.symbol):null},revalidate:60};}
