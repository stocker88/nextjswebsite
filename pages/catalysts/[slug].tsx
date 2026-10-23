import {loadInstrumentResearch} from '../../lib/instrument-research-server';
import MarketBriefingPage from '../../components/MarketBriefingPage';import {briefings} from '../../lib/market-briefings';import {loadStockResearch,loadStockEarnings} from '../../lib/stock-research-server';
export default MarketBriefingPage;
export function getStaticPaths(){return {paths:briefings.filter(a=>a.kind!=='premarket').map(a=>({params:{slug:a.slug}})),fallback:false};}
export async function getStaticProps({params}:any){const article=briefings.find(a=>a.kind!=='premarket'&&a.slug===params.slug);if(!article)return {notFound:true};const symbol=article.kind==='earnings_preview'?article.symbols[0]:null;return {props:{article,research:symbol?await loadInstrumentResearch(symbol):null,bundle:symbol?loadStockResearch(symbol):null,calendar:symbol?loadStockEarnings(symbol):null}};}
