import {latestOptionResult} from '../lib/option-results';
import OptionResultCard from './OptionResultCard';
export default function StockResults({symbol}:{symbol:string}){
 const result=latestOptionResult(symbol);
 return result?<section aria-label={result.symbol+' option results'} style={{marginTop:36}}><OptionResultCard result={result} compact/></section>:null;
}
