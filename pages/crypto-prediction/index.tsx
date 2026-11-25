import ToolDirectory from '../../components/ToolDirectory';
import {toolAssets} from '../../lib/seo-tools-server';
import {assetPath} from '../../lib/seo-tools';
export default ToolDirectory;
export function getStaticProps(){return {props:{title:'Crypto Price Predictions & Scenario Calculators',description:'Explore cryptocurrency price history, test growth and volatility scenarios, and calculate position sizes. Dated data and transparent assumptions.',path:'/crypto-prediction/',items:toolAssets().filter(a=>a.kind==='crypto').map(a=>({name:a.name+' ('+a.symbol+')',path:assetPath(a),detail:a.industry||a.currency}))}};}
