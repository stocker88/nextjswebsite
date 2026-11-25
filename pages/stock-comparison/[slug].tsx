import StockComparisonPage from '../../components/StockComparisonPage';
import {toolPairs} from '../../lib/seo-tools-server';
export default StockComparisonPage;
export function getStaticPaths(){return {paths:toolPairs().map(p=>({params:{slug:p.slug}})),fallback:false};}
export function getStaticProps({params}:any){const pair=toolPairs().find(p=>p.slug===params.slug);return pair?{props:pair}:{notFound:true};}
