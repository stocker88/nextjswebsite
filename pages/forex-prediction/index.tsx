import ToolDirectory from '../../components/ToolDirectory';
import {toolAssets} from '../../lib/seo-tools-server';
import {assetPath} from '../../lib/seo-tools';
export default ToolDirectory;
export function getStaticProps(){return {props:{title:'Forex Predictions & Exchange Rate Scenarios',description:'Explore currency-pair history and conditional exchange-rate scenarios. Compare horizons and calculate risk in the quote currency.',path:'/forex-prediction/',items:toolAssets().filter(a=>a.kind==='forex').map(a=>({name:a.name+' ('+a.symbol+')',path:assetPath(a),detail:a.industry||a.currency}))}};}
