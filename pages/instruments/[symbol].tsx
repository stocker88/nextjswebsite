import ResearchPage from '../../components/ResearchPage';
import InstrumentResearch, {type InstrumentResearchProps} from '../../components/InstrumentResearch';
import {loadStockResearch,loadStockEarnings} from '../../lib/stock-research-server';
import {catalog} from '../../lib/catalog';
import {recentStockNews} from '../../lib/stock-related-research';
import {fetchResearch} from '../../lib/research-server';
export default function Instrument(props:InstrumentResearchProps){const {item}=props;return <ResearchPage title={`${item.name} (${item.symbol}): profile and research`} path={`/instruments/${encodeURIComponent(item.symbol)}`} noindex hideAppDownload><InstrumentResearch {...props}/></ResearchPage>;}
export function getStaticPaths(){return {paths:[],fallback:'blocking'};}
export async function getStaticProps({params}:any){const item=catalog.find(i=>i.symbol===params.symbol);if(!item)return {notFound:true};return {props:{item,news:recentStockNews(await fetchResearch(),item.symbol),bundle:item.type==='EQUITY'?loadStockResearch(item.symbol):null,calendar:item.type==='EQUITY'?loadStockEarnings(item.symbol):null},revalidate:60};}
