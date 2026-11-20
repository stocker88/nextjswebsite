import Stock from '../stocks/[ticker]/index';
import {predictionStocks, predictionSlug} from '../../lib/stock-predictions';
import {loadStockResearch,loadStockEarnings} from '../../lib/stock-research-server';
import {recentStockNews} from '../../lib/stock-related-research';
import {fetchResearch} from '../../lib/research-server';
export default Stock;
export function getStaticPaths() {
  return {paths: predictionStocks.map(stock => ({params: {slug: predictionSlug(stock)}})), fallback: false};
}
export async function getStaticProps({params}: {params: {slug: string}}) {
  const stock = predictionStocks.find(stock => predictionSlug(stock) === params.slug);
  if (!stock) return {notFound: true};
  return {props:{stock,predictionPage:true,bundle:loadStockResearch(stock.ticker),calendar:loadStockEarnings(stock.ticker),items:recentStockNews(await fetchResearch(),stock.ticker)},revalidate:60};
}
