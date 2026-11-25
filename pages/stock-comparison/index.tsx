import ToolDirectory from '../../components/ToolDirectory';
import {toolPairs} from '../../lib/seo-tools-server';
export default ToolDirectory;
export function getStaticProps(){return {props:{title:'Stock Comparison: Performance, Drawdown & Correlation',description:'Compare stocks over matching dates with rebased price charts, historical returns, drawdowns and return correlation.',path:'/stock-comparison/',items:toolPairs().map(p=>({name:p.a.symbol+' vs '+p.b.symbol,path:'/stock-comparison/'+p.slug+'/',detail:p.a.name+' / '+p.b.name}))}};}
