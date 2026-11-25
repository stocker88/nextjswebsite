import StockComparisonPage from '../../components/StockComparisonPage';
import {comparisonChoices,comparisonData} from '../../lib/comparison-data-server';
export default StockComparisonPage;
export function getStaticProps(){const left=comparisonData('NVDA')!,right=comparisonData('AMD')!;return {props:{a:left.asset,b:right.asset,slug:'',left,right,choices:comparisonChoices()}};}
