import type {OptionResultPreviewData} from '../lib/option-results';
import OptionResultPreview from './OptionResultPreview';
export default function StockResults({result}:{result:OptionResultPreviewData|null}){
 return result?<section aria-label={result.symbol+' option results'} style={{marginTop:36}}><OptionResultPreview result={result}/></section>:null;
}
