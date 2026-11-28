import saved from '../data/pizza-shop-baselines.json';
import {useSiteLanguage} from '../lib/localization/use-site-language';
import s from '../styles/PentagonPizza.module.css';
export type PizzaBaselines={source:string;retrievedAt:string|null;shops:{name:string;placeId:string;mapsUrl:string;baseline:Record<string,{hour:number;popularity:number}[]>}[]};
export default function PizzaTypicalWeek({baselines}:{baselines?:PizzaBaselines|null}){
 const {t,language}=useSiteLanguage();
 const shops=baselines?.shops.length?baselines.shops:saved.shops;
 const points=Array.from({length:168},(_,i)=>{
  const values=shops.map(shop=>(shop.baseline as PizzaBaselines['shops'][number]['baseline'])[String(Math.floor(i/24))]?.find(p=>p.hour===i%24)?.popularity).filter((v):v is number=>typeof v==='number'&&Number.isFinite(v));
  return values.length>=Math.ceil(shops.length/2)?values.reduce((sum,v)=>sum+v,0)/values.length:null;
 });
 const path=points.map((value,i)=>value===null?'':`${i&&points[i-1]!==null?'L':'M'}${40+i/167*600},${170-value*1.45}`).join(' ');
 return <div><p className={s.meta}>{t('Typical weekly activity · Eastern Time')}</p><svg className={s.chart} viewBox="0 0 680 210" role="img" aria-label={t('Typical weekly pizza-shop activity')}>
 {[0,50,100].map(v=><g key={v}><line x1="40" x2="640" y1={170-v*1.45} y2={170-v*1.45} stroke="#344055"/><text x="4" y={174-v*1.45} fill="#aebdd1" fontSize="11">{v}</text></g>)}
 <path d={path} fill="none" stroke="#779dff" strokeWidth="2.5"/>
 {Array.from({length:7},(_,day)=><text key={day} x={40+(day*24+12)/167*600} y="200" textAnchor="middle" fill="#aebdd1" fontSize="11">{new Intl.DateTimeFormat(language,{weekday:'short',timeZone:'UTC'}).format(new Date(Date.UTC(2026,10,22+day)))}</text>)}
 </svg><p className={s.meta}>{t('Typical popularity on a 0–100 scale, averaged across shops. This is a usual week, not measured activity on past dates.')}</p><p className={s.meta}>{t('Measured history will appear as readings become available.')}</p></div>;
}
