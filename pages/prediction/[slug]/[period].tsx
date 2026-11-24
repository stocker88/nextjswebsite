import fs from 'fs';
import path from 'path';
import PredictionPeriodPage, {type PeriodProps} from '../../../components/PredictionPeriodPage';
import {scenarioStocks,periods} from '../../../lib/prediction-periods';
import {predictionSlug} from '../../../lib/stock-predictions';
import {loadStockResearch} from '../../../lib/stock-research-server';
export default function PeriodRoute(props:PeriodProps){return <PredictionPeriodPage key={props.stock.ticker+props.period+props.detail?.priceDate} {...props}/>;}
export function getStaticPaths(){return {paths:scenarioStocks.flatMap(stock=>periods.map(period=>({params:{slug:predictionSlug(stock),period:period.id}}))),fallback:false};}
export function getStaticProps({params}:{params:{slug:string;period:string}}){
 const stock=scenarioStocks.find(s=>predictionSlug(s)===params.slug);
 if(!stock||!periods.some(p=>p.id===params.period))return {notFound:true};
 const bundle=loadStockResearch(stock.ticker);
 let detail=bundle.snapshot?.detail||null;
 try{const current=JSON.parse(fs.readFileSync(path.join(process.cwd(),'public/earnings-data',stock.ticker+'.json'),'utf8'));if(!detail||current.updatedAt>detail.updatedAt)detail=current;}catch{}
 return {props:{stock,period:params.period,detail,today:bundle.today,events:bundle.events},revalidate:60};
}
