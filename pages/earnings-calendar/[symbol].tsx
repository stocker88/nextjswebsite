import EarningsCalendar from '../../components/earnings/EarningsCalendar';
import snapshot from '../../data/earnings-calendar.json';
import {Detail} from '../../lib/earnings';
export default function Page({company}:{company:Detail}){return <EarningsCalendar snapshot={snapshot} company={company}/>;}
export function getStaticPaths(){return {paths:snapshot.detailSymbols.map(symbol=>({params:{symbol:symbol.toLowerCase()}})),fallback:false};}
export async function getStaticProps({params}:{params:{symbol:string}}){
 const fs=await import('fs');const path=await import('path');
 const symbol=snapshot.detailSymbols.find(s=>s.toLowerCase()===params.symbol);
 if(!symbol)return {notFound:true};
 const company=JSON.parse(fs.readFileSync(path.join(process.cwd(),'public/earnings-data',symbol+'.json'),'utf8'));
 return {props:{company}};
}
