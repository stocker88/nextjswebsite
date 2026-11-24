import {predictionCatalog,cachedPredictionDetail} from '../../lib/prediction-cache-server';
import Stock from '../stocks/[ticker]/index';
import {predictionSlug} from '../../lib/stock-predictions';
import {loadStockResearch,loadStockEarnings} from '../../lib/stock-research-server';
import {recentStockNews} from '../../lib/stock-related-research';
import {fetchResearch} from '../../lib/research-server';
export default Stock;
export function getStaticPaths() {
  return {paths: predictionCatalog().map(stock => ({params: {slug: predictionSlug(stock)}})), fallback: false};
}
export async function getStaticProps({params}: {params: {slug: string}}) {
  const stock = predictionCatalog().find(stock => predictionSlug(stock) === params.slug);
  if (!stock) return {notFound: true};
  const bundle=loadStockResearch(stock.ticker),detail=cachedPredictionDetail(stock.ticker);
  if(bundle.snapshot&&detail)bundle.snapshot={...bundle.snapshot,detail};
  return {props:{stock,predictionPage:true,predictionPeriodsAvailable:!!detail,bundle,calendar:loadStockEarnings(stock.ticker),items:recentStockNews(await fetchResearch(),stock.ticker)},revalidate:60};
}
