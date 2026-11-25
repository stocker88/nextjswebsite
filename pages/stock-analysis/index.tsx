import ToolDirectory from '../../components/ToolDirectory';
import {toolAssets} from '../../lib/seo-tools-server';
import {assetPath} from '../../lib/seo-tools';
export default ToolDirectory;
export function getStaticProps(){return {props:{title:'Stock Technical Analysis & Position Size Calculators',description:'Explore closing-price charts, moving averages, drawdowns and position sizing for stocks with available price history.',path:'/stock-analysis/',items:toolAssets().filter(a=>a.kind==='stock').map(a=>({name:a.name+' ('+a.symbol+')',path:assetPath(a),detail:a.industry||a.currency}))}};}
