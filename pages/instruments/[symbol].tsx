import Link from 'next/link';
import ResearchPage from '../../components/ResearchPage';
import StockEarnings from '../../components/earnings/StockEarnings';
import StockResearchHub from '../../components/StockResearchHub';
import StockAppCTA from '../../components/StockAppCTA';
import {catalog} from '../../lib/catalog';
import {recentStockNews,stocks} from '../../lib/stocks';
import {fetchResearch} from '../../lib/research-server';
import {ResearchPreview,researchUrl} from '../../lib/research';
import {displayDate} from '../../lib/seo';
import type {ResearchBundle} from '../../lib/stock-research';
import type {Calendar} from '../../lib/earnings';
import {loadStockResearch,loadStockEarnings} from '../../lib/stock-research-server';
import styles from '../../styles/StockResearch.module.css';
export default function Instrument({item,news,bundle,calendar}:{item:typeof catalog[number];news:ResearchPreview[];bundle:ResearchBundle|null;calendar:Calendar|null}){
 const d=bundle?.snapshot?.detail,curated=stocks.find(s=>s.ticker===item.symbol);
 const next=calendar?.items.filter(e=>e.date>=calendar.today).sort((a,b)=>a.date.localeCompare(b.date))[0];
 return <ResearchPage title={`${item.name} (${item.symbol}): financials, technicals & earnings`} description={`Research ${item.name} (${item.symbol}): earnings, saved financials, price trends, event catalysts, macro context and peer comparisons.`} path={curated?'/stocks/'+curated.slug:`/instruments/${encodeURIComponent(item.symbol)}`} noindex stockPage>
 <header className={styles.hero}><span className={styles.eyebrow}>{item.sector||item.type}{item.industry?' / '+item.industry:''}</span><Link href="/stocks">← Browse stocks</Link><h1>{item.name} (<span data-stock-symbol={item.symbol}>{item.symbol}</span>)</h1><p>Explore company metrics, earnings and the market factors that can affect {item.symbol}. Figures use dated research snapshots.</p>{bundle&&<nav className={styles.nav} aria-label="Research sections">{[['earnings','Earnings'],['financials','Financials'],['technicals','Technicals'],['catalysts','Event catalysts'],['macro','Macro'],['peers','Compare peers']].map(([id,label])=><a key={id} href={'#'+id}>{label}</a>)}</nav>}</header>
 {bundle&&<><div id="earnings" style={{scrollMarginTop:120}}><StockEarnings symbol={item.symbol} initialCalendar={calendar} detail={d} compact/></div><StockResearchHub symbol={item.symbol} name={item.name} bundle={bundle} earningsDate={next?.date}/></>}
 <div className="public-copy">{news.length>=5&&<><h2>Related research</h2>{news.map(n=><p key={n.id}><Link href={researchUrl(n.id,n.title)}>{n.title}</Link><br/><small>{displayDate(n.time)}</small></p>)}</>}</div><StockAppCTA symbol={item.symbol}/></ResearchPage>;
}
export function getStaticPaths(){return {paths:[],fallback:'blocking'};}
export async function getStaticProps({params}:any){const item=catalog.find(i=>i.symbol===params.symbol);if(!item)return {notFound:true};return {props:{item,news:recentStockNews(await fetchResearch(),item.symbol),bundle:item.type==='EQUITY'?loadStockResearch(item.symbol):null,calendar:item.type==='EQUITY'?loadStockEarnings(item.symbol):null},revalidate:3600};}
