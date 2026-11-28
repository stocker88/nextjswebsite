import {useEffect,useState} from 'react';
import {useSiteLanguage} from '../lib/localization/use-site-language';
import {PizzaBaselines} from './PizzaTypicalWeek';
import baselineData from '../data/pizza-shop-baselines.json';
import s from '../styles/PentagonPizza.module.css';
export type PizzaShopReading={name:string;percentOfUsual:number|null;spike:boolean;timestamp:string|null};
export default function PizzaShopBreakdown({restaurants,loading,baselines}:{restaurants:PizzaShopReading[];loading:boolean;baselines?:PizzaBaselines|null}){
 const profile=baselines?.shops.length?baselines:baselineData;
 const {t,language}=useSiteLanguage();
 const [day,setDay]=useState(0);
 useEffect(()=>{const weekday=new Intl.DateTimeFormat('en-US',{weekday:'short',timeZone:'America/New_York'}).format(new Date());setDay(['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(weekday));},[]);
 const days=Array.from({length:7},(_,i)=>new Intl.DateTimeFormat(language,{weekday:'short',timeZone:'UTC'}).format(new Date(Date.UTC(2026,10,22+i))));
 return <section className={s.shopSection} aria-labelledby="pizza-shops-title">
 <div className={s.top}><div><h3 id="pizza-shops-title">{t('Activity by pizza shop')}</h3><p>{t('Typical hourly activity, separate from live readings. All hours are Eastern Time.')}</p></div>
 <label className={s.dayPicker}>{t('Day of week')}<select value={day} onChange={e=>setDay(Number(e.target.value))}>{days.map((name,i)=><option key={i} value={i}>{name}</option>)}</select></label></div>
 <div className={s.shopGrid}>{profile.shops.map(shop=>{
 const reading=restaurants.find(r=>r.name===shop.name);
 const baseline=(shop.baseline as Record<string,{hour:number;popularity:number}[]>)[String(day)]||[];
 const values=Array.from({length:24},(_,hour)=>({hour,value:baseline.find(p=>p.hour===hour)?.popularity??null}));
 const available=reading?.percentOfUsual!=null;
 const shareText=shop.name+' — '+t('Explore typical pizza-shop activity near the Pentagon.')+' https://www.stockstobuynow.ai/'+(language==='en'?'':language+'/')+'pentagon-pizza-index/';
 return <article className={s.shopCard} key={shop.placeId}>
 <header><span className={s.shopIcon} aria-hidden="true">🍕</span><h4>{shop.name}</h4></header>
 {available&&<div className={s.shopStatus}><span className={s.shopLive}>{Math.round(reading!.percentOfUsual!)}% {t('of usual activity')}</span>{reading?.spike&&<span>{t('Activity spike')}</span>}</div>}
 <nav className={s.shopLinks} aria-label={shop.name}><a href={shop.mapsUrl} target="_blank" rel="noopener noreferrer">Google Maps ↗</a><a href={'https://x.com/intent/post?text='+encodeURIComponent(shareText)} target="_blank" rel="noopener noreferrer">{t('Share on X')} ↗</a></nav>
 <p className={s.chartLabel}>{t('Typical activity')} · {days[day]}</p>
 <svg className={s.shopChart} viewBox="0 0 360 145" role="img" aria-label={shop.name+' — '+t('Typical hourly activity')}>
 <line x1="12" y1="112" x2="348" y2="112" stroke="#344055"/>
 {values.map(({hour,value})=>{const height=value==null?0:Math.max(2,value*.9);return <rect key={hour} x={12+hour*14} y={112-height} width="10" height={height} rx="3" fill={value===0?'#465368':'#779dff'}><title>{String(hour).padStart(2,'0')+':00 ET — '+(value==null?t('No baseline available'):value+' / 100 '+t('Typical activity'))}</title></rect>})}
 {[0,6,12,18,23].map(hour=><text key={hour} x={17+hour*14} y="134" textAnchor="middle" fill="#aebdd1" fontSize="11">{String(hour).padStart(2,'0')}:00</text>)}
 </svg>
 <p className={s.shopFootnote}>{t('Relative popularity: 0–100. These bars are historical patterns, not live orders or opening hours.')}</p>
 </article>})}</div>
 </section>;
}
