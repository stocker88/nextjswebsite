import {loadStockResearch,loadStockEarnings} from '../../../lib/stock-research-server';
import {recentStockNews} from '../../../lib/stock-related-research';
import {fetchResearch} from '../../../lib/research-server';
import PredictionPeriodPage, {type PeriodProps} from '../../../components/PredictionPeriodPage';
import {periods,historyForPeriod} from '../../../lib/prediction-periods';
import {predictionSlug} from '../../../lib/stock-predictions';
import {cachedPredictionStocks,cachedPredictionDetail,predictionToday,predictionEvents} from '../../../lib/prediction-cache-server';
export default function PeriodRoute(props:PeriodProps){return <PredictionPeriodPage key={props.stock.ticker+props.period+props.detail?.priceDate} {...props}/>;}
export function getStaticPaths(){return {paths:cachedPredictionStocks().flatMap(stock=>periods.map(period=>({params:{slug:predictionSlug(stock),period:period.id}}))),fallback:false};}
export async function getStaticProps({params}:{params:{slug:string;period:string}}){
 const stock=cachedPredictionStocks().find(s=>predictionSlug(s)===params.slug);
 if(!stock||!periods.some(p=>p.id===params.period))return {notFound:true};
 const today=predictionToday(),cached=cachedPredictionDetail(stock.ticker);
 const detail=cached?{...cached,prices:historyForPeriod(cached,params.period,cached.priceDate||today)}:null;
 const bundle=loadStockResearch(stock.ticker);
 // Price history lives once in detail; peer tables need metrics, not duplicate chart arrays.
 if(bundle.snapshot)bundle.snapshot={...bundle.snapshot,detail:null,peers:bundle.snapshot.peers.map(peer=>({...peer,detail:peer.detail?{...peer.detail,prices:[]}:null}))};
 return {props:{bundle,calendar:loadStockEarnings(stock.ticker),items:recentStockNews(await fetchResearch(),stock.ticker),stock,period:params.period,detail,today,events:predictionEvents(today)},revalidate:60};
}
