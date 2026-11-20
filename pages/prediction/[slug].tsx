import Stock, {getStaticProps as loadStockPage} from '../stocks/[ticker]/index';
import {stocks} from '../../lib/stocks';
import {predictionSlug} from '../../lib/stock-predictions';
export default Stock;
export function getStaticPaths() {
  return {paths: stocks.map(stock => ({params: {slug: predictionSlug(stock)}})), fallback: false};
}
export async function getStaticProps({params}: {params: {slug: string}}) {
  const stock = stocks.find(stock => predictionSlug(stock) === params.slug);
  if (!stock) return {notFound: true};
  const result = await loadStockPage({params: {ticker: stock.slug}});
  if (!result.props) return {notFound: true};
  return {...result, props: {...result.props, predictionPage: true}};
}
