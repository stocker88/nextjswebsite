import Link from 'next/link';
import {useRouter} from 'next/router';
import {periods,periodPath} from '../lib/prediction-periods';
import {predictionPath,predictionStocks} from '../lib/stock-predictions';
import styles from '../styles/PredictionPeriods.module.css';
export default function PredictionPeriodSelector({stock,selected='overview',compact=false}:{stock:typeof predictionStocks[number];selected?:string;compact?:boolean}){
 const router=useRouter();
 if(compact)return <label className={styles.pageSelector}><strong>Prediction period / page</strong><select aria-label="Prediction period / page" value={selected} onChange={e=>router.push(e.target.value==='overview'?predictionPath(stock)+'/':periodPath(stock,e.target.value))}><option value="overview">Overview</option>{periods.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}</select><small>Changes the forecast horizon and opens that prediction page.</small></label>;
 return <nav className={styles.selector} aria-label={`${stock.ticker} prediction period`}><Link prefetch={false} href={predictionPath(stock)+'/'} aria-current={selected==='overview'?'page':undefined}>Overview</Link>{periods.map(p=><Link prefetch={false} key={p.id} href={periodPath(stock,p.id)} aria-current={selected===p.id?'page':undefined}>{p.label}</Link>)}</nav>;
}
