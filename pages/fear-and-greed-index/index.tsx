import {useRef,useState} from 'react';
import useChartEntrance from '../../components/useChartEntrance';
import ChartReveal from '../../components/ChartReveal';
import Head from 'next/head';
import FearGreedShare from '../../components/FearGreedShare';
import Header from '../../components/layout/Header';
import saved from '../../data/fear-greed.json';
import {CNN_URL,indicators,rating,color,historyMaximum,FearGreedSnapshot} from '../../lib/fear-greed';
import {SITE,breadcrumbs,jsonLd} from '../../lib/seo';
import styles from '../../styles/FearGreed.module.css';
const date=(s:string)=>new Date(s).toLocaleString('en-US',{timeZone:'America/New_York',month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'})+' ET';
function View(){return <a className={styles.view} href={CNN_URL} target="_blank" rel="noopener noreferrer">View on CNN ↗</a>}
export default function FearGreedPage({snapshot}:{snapshot:FearGreedSnapshot|null}){
 const [range,setRange]=useState(90);
 const value=snapshot?.score??null;
 const history=snapshot?.history??[];
 const end=history.length?Date.parse(history[history.length-1].date):0;
 const points=history.filter(p=>Date.parse(p.date)>=end-range*86400000);
 const start=points.length?Date.parse(points[0].date):end;
 const ceiling=historyMaximum(points);
 const ticks=Array.from({length:5},(_,i)=>ceiling*i/4);
 const path=points.map((p,i)=>`${i?'L':'M'}${30+(Date.parse(p.date)-start)/Math.max(1,end-start)*940},${210-p.value/ceiling*180}`).join(' ');
 const historyRef=useRef<SVGSVGElement>(null),gaugeRef=useRef<SVGSVGElement>(null);
 useChartEntrance(historyRef,JSON.stringify([range,points]));
 useChartEntrance(gaugeRef,String(value));
 const angle=value===null?null:Math.PI*(1-value/100);
 return <><Head><title>CNN Fear &amp; Greed Index | StocksToBuyNow.ai</title><meta name="description" content="Explore CNN’s Fear & Greed Index, its seven market sentiment indicators and available historical readings. See source dates and research the wider market context."/><link rel="canonical" href={SITE+'/fear-and-greed-index/'}/><meta property="og:title" content="Fear & Greed Index | Market sentiment"/><meta property="og:description" content="Put market sentiment in context. Explore the index, its components and available history."/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(breadcrumbs([{name:'Home',path:'/'},{name:'Fear & Greed Index',path:'/fear-and-greed-index/'}]))}}/></Head>
 <Header forceDark navBasePath="/"/><main className={styles.page}><div className={styles.container}>
 <a className={styles.back} href="/">Home / Market sentiment</a>
 <header className={styles.hero}><span className={styles.eyebrow}>THE MOOD OF THE MARKET</span><h1>Fear or greed?<br/><em>See the bigger picture.</em></h1><p>Explore CNN’s Fear &amp; Greed Index alongside the market signals behind it.</p><nav aria-label="Related tools"><a href="/stock-market-heatmap/">Market heatmap →</a><a href="/stock-market-calendar/">Market calendar →</a><a href="/options-activity/">Options activity →</a></nav></header>
 <div className={styles.share}><FearGreedShare/></div>
 <section className={styles.overview} aria-label="Index overview"><article className={styles.card}><div className={styles.cardHeader}><div><span className={styles.eyebrow}>CNN FEAR &amp; GREED INDEX</span><h2>Market sentiment</h2></div><View/></div>
 <div className={styles.gauge}><svg ref={gaugeRef} viewBox="0 0 420 240" role="img" aria-label={value===null?'Index reading unavailable':`Fear and Greed Index ${value.toFixed(1)} out of 100, ${rating(value)}`}>
 <defs><linearGradient id="sentiment" x1="0" x2="1"><stop offset="0%" stopColor="#f17886"/><stop offset="30%" stopColor="#efa46b"/><stop offset="50%" stopColor="#e7cc7b"/><stop offset="75%" stopColor="#8bd8bf"/><stop offset="100%" stopColor="#42c99a"/></linearGradient></defs>
 <ChartReveal width={420} height={240}><path d="M40 200 A170 170 0 0 1 380 200" fill="none" stroke="url(#sentiment)" strokeWidth="23" strokeLinecap="round" opacity={value===null?.35:1}/>
 {angle!==null&&<circle cx={210+170*Math.cos(angle)} cy={200-170*Math.sin(angle)} r="12" fill="#f2f4ff" stroke="#111b2b" strokeWidth="4"/>}</ChartReveal>
 <text x="210" y="150" textAnchor="middle" fill={color(value)} fontSize="64" fontWeight="700">{value===null?'—':Math.round(value)}</text><text x="210" y="184" textAnchor="middle" fill="#b6c4d8" fontSize="16">{rating(value)}</text><text x="38" y="232" fill="#b6c4d8" fontSize="13">0 · Fear</text><text x="380" y="232" textAnchor="end" fill="#b6c4d8" fontSize="13">Greed · 100</text></svg></div>
 <p className={styles.asof}>{snapshot?`Saved reading · ${snapshot.dateOnly?new Date(snapshot.timestamp).toLocaleDateString('en-US',{timeZone:'UTC',month:'short',day:'numeric',year:'numeric'}):date(snapshot.timestamp)}`:'An index reading is not available here yet.'}</p></article>
 <div className={styles.comparisons}>{([['Previous close',snapshot?.previousClose],['One week ago',snapshot?.weekAgo],['One month ago',snapshot?.monthAgo],['One year ago',snapshot?.yearAgo]] as const).map(([label,n])=><article className={styles.card} key={label}><h3>{label}</h3>{n==null?<View/>:<><strong style={{color:color(n)}}>{Math.round(n)}</strong><span>{rating(n)}</span></>}</article>)}</div></section>
 <section className={styles.card}><div className={styles.cardHeader}><div><span className={styles.eyebrow}>SENTIMENT OVER TIME</span><h2>How the mood has changed</h2></div><div className={styles.ranges} aria-label="History period">{[[30,'1M'],[90,'3M'],[365,'1Y']].map(([n,label])=><button key={n} aria-pressed={range===n} onClick={()=>setRange(Number(n))}>{label}</button>)}</div></div>
 {points.length>1?<><svg ref={historyRef} className={styles.chart} viewBox="0 0 1000 240" role="img" aria-label="Historical Fear and Greed scores, colored from red at 0 to green at 100"><defs><linearGradient id="history-sentiment" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="210" y2={210-180*100/ceiling}><stop offset="0%" stopColor="#f17886"/><stop offset="30%" stopColor="#efa46b"/><stop offset="50%" stopColor="#e7cc7b"/><stop offset="75%" stopColor="#8bd8bf"/><stop offset="100%" stopColor="#42c99a"/></linearGradient></defs>{ticks.map(n=><g key={n}><line x1="30" x2="970" y1={210-n/ceiling*180} y2={210-n/ceiling*180} stroke="#29344a"/><text x="4" y={214-n/ceiling*180} fill="#a8b9d0" fontSize="12">{Number(n.toFixed(1))}</text></g>)}<ChartReveal width={1000} height={240}><path d={path} fill="none" stroke="url(#history-sentiment)" strokeWidth="3"/></ChartReveal></svg><p className={styles.asof}>{points[0].date.slice(0,10)} — {points[points.length-1].date.slice(0,10)}</p></>:<div className={styles.empty}><span>Historical readings</span><View/></div>}
 </section>
 <section className={styles.indicators}><div className={styles.sectionHeading}><span className={styles.eyebrow}>SEVEN PIECES OF THE PICTURE</span><h2>What’s driving sentiment?</h2></div><div className={styles.grid}>{indicators.map(([key,title,description],i)=>{const n=snapshot?.indicators.find(v=>v.key===key)?.score??null;return <article className={styles.card} key={key}><div className={styles.cardHeader}><span className={styles.number}>0{i+1}</span>{n===null?<View/>:<span style={{color:color(n)}}>{Math.round(n)} · {rating(n)}</span>}</div><h3>{title}</h3><p>{description}</p>{n!==null&&<div className={styles.meter} role="meter" aria-label={title} aria-valuemin={0} aria-valuemax={100} aria-valuenow={n}><i style={{width:`${n}%`,background:color(n)}}/></div>}</article>})}</div></section>
 <section className={styles.guide}><span className={styles.eyebrow}>TURN SENTIMENT INTO A RESEARCH QUESTION</span><h2>Read the mood. Then look underneath.</h2><p>CNN combines seven indicators into a score from 0 to 100. Lower readings indicate fear; higher readings indicate greed. Compare the score with market breadth, sector performance and upcoming events. Sentiment can remain extreme, so the index alone is not a timing signal.</p><a href="/stock-market-heatmap/">Explore the market heatmap →</a></section>
 <footer className={styles.footer}><p><a href="https://www.stockstobuynow.ai/">www.StocksToBuyNow.ai</a></p></footer>
 </div></main></>;
}
export function getStaticProps(){return {props:{snapshot:saved as FearGreedSnapshot|null}};}
