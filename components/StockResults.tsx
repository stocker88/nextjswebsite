import {latestOptionResult} from '../lib/option-results';
import OptionResultPreview from './OptionResultPreview';
export default function StockResults({symbol}:{symbol:string}){
 const result=latestOptionResult(symbol);
 return result?<section aria-label={result.symbol+' option results'} style={{marginTop:36}}><OptionResultPreview result={result}/></section>:null;
}
