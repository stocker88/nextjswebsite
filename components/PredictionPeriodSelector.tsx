import Link from 'next/link';
import {periods,periodPath} from '../lib/prediction-periods';
import {predictionPath,predictionStocks} from '../lib/stock-predictions';
import styles from '../styles/PredictionPeriods.module.css';
export default function PredictionPeriodSelector({stock,selected='overview'}:{stock:typeof predictionStocks[number];selected?:string}){
 return <nav className={styles.selector} aria-label={`${stock.ticker} prediction period`}><Link href={predictionPath(stock)+'/'} aria-current={selected==='overview'?'page':undefined}>Overview</Link>{periods.map(p=><Link key={p.id} href={periodPath(stock,p.id)} aria-current={selected===p.id?'page':undefined}>{p.label}</Link>)}</nav>;
}
