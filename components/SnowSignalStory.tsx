import {useEffect,useRef,useState} from 'react';
import AppDownloadModal from './AppDownloadModal';
import {useSiteAccount} from './SiteAccount';
import {getSiteAuth} from '../lib/site-auth';
import {overnightOptionsResult} from '../lib/featured-research';
import styles from '../styles/SnowSignalStory.module.css';

type GraphPoint={x:number;y1:number};
type SnowSignalData={originalPrice:GraphPoint[];originalFinancials:GraphPoint[];latestPrice:GraphPoint[];latestFinancials:GraphPoint[];signalTime:number;updatedAt:number};
const cacheKey='snowSignalStory:v1';
const entryTime=Date.UTC(2026,4,1);
const previewData:SnowSignalData={
 originalPrice:[[-150,82],[-126,74],[-103,91],[-80,68],[-58,104],[-35,92],[-14,115],[0,141],[28,176],[58,214],[91,251]].map(([days,y1])=>({x:entryTime+days*86400000,y1})),
 originalFinancials:[[-300,870],[-210,920],[-120,1040],[-30,1160],[70,1320],[160,1430]].map(([days,y1])=>({x:entryTime+days*86400000,y1})),
 latestPrice:[[0,141],[31,280.16],[94,307.53],[132,291],[168,326],[179,319]].map(([days,y1])=>({x:entryTime+days*86400000,y1})),
 latestFinancials:[[-300,870],[-210,920],[-120,1040],[-30,1160],[70,1280],[160,1390]].map(([days,y1])=>({x:entryTime+days*86400000,y1})),
 signalTime:entryTime,updatedAt:0,
};

const lesson=[
 {title:'Understand both trailing and forward P/E.',body:<p>Trailing P/E divides the share price by earnings per share over the previous 12 months; forward P/E uses forecast earnings.</p>},
 {title:'Compare P/E across peers.',body:<><p>Start with the earnings calendar. In the screener, select Stocks → Earnings Calendar and display Market Cap. Choose a large company reporting within the next two weeks, then tap Competition and sort by P/E. Focus on competitors with similar business models, growth, profitability and financial strength. Market cap measures company size, while P/E helps assess the price being paid for earnings. Two companies with similar P/E ratios are not necessarily equally attractive.</p><p>Compare valuation with the stock’s own history. Use the two-year view to examine changes in share price alongside changes in P/E, then repeat the comparison with a relevant competitor. A rising price with a falling P/E can indicate that earnings are growing faster than the share price. A falling price with a rising P/E can indicate that earnings are deteriorating even faster. This relative-value analysis helps distinguish a potential opportunity from a stock that merely looks cheaper after a decline.</p></>},
 {title:'Great ideas combine valuation with technical setups.',body:<p>A particularly interesting setup is a growth stock trading below its usual P/E range while approaching an established price-support area, provided its earnings outlook remains healthy.</p>},
 {title:'Historical SNOW example.',body:<p>SNOW’s entry date was May 1, 2026. Using its $141.00 closing price as the reference, the stock reached $280.16 on June 1, a one-month move of approximately +98.7%. By August 3, it closed at $307.53, approximately +118.1% over three months. Around the entry, April’s trading highs suggest a resistance zone near $150–$157.</p>},
 {title:'Turn the research into a measured stock or LEAPS idea.',body:<p>Size the idea for the risk, define the level that would invalidate the setup and revisit the thesis as earnings, valuation and price action change.</p>},
];

function cleanPoints(value:unknown):GraphPoint[]{
 if(!Array.isArray(value))return[];
 return value.map(item=>{const row=item as Record<string,unknown>,x=Number(row.x),y1=Number(row.y1);return{x:x<100000000000?x*1000:x,y1}}).filter(point=>Number.isFinite(point.x)&&Number.isFinite(point.y1)).sort((a,b)=>a.x-b.x).slice(-120);
}
function validCache(value:unknown):value is SnowSignalData{
 const item=value as SnowSignalData;return !!item&&Array.isArray(item.originalPrice)&&Array.isArray(item.originalFinancials)&&Array.isArray(item.latestPrice)&&Array.isArray(item.latestFinancials)&&Number.isFinite(item.signalTime);
}
function linePath(points:GraphPoint[],domain=points,width=360,height=142,padding=13){
 if(!points.length)return'';const xs=domain.map(p=>p.x),ys=domain.map(p=>p.y1),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys),dx=maxX-minX||1,dy=maxY-minY||1;
 return points.map((point,index)=>`${index?'L':'M'} ${(padding+(point.x-minX)/dx*(width-padding*2)).toFixed(1)} ${(height-padding-(point.y1-minY)/dy*(height-padding*2)).toFixed(1)}`).join(' ');
}
function projectedPoints(points:GraphPoint[],signalTime:number){
 const future=points.filter(point=>point.x>signalTime),past=points.filter(point=>point.x<=signalTime),anchor=past[past.length-1]||points[0];
 if(future.length)return{past,projection:anchor?[anchor,...future]:future};
 if(!anchor)return{past:points,projection:[]};
 const trend=past.length>2?anchor.y1-past[Math.max(0,past.length-3)].y1:Math.max(anchor.y1*.08,1);
 return{past,projection:[anchor,1,2,3].map((point,index)=>index===0?anchor:{x:anchor.x+index*35*86400000,y1:anchor.y1+trend*(index*.75)})};
}
function bars(points:GraphPoint[],signalTime?:number){
 if(!points.length)return null;const shown=points.slice(-18),max=Math.max(...shown.map(p=>p.y1),1),min=Math.min(...shown.map(p=>p.y1),0),hasFuture=!!signalTime&&shown.some(point=>point.x>signalTime);
 return <div className={styles.bars} aria-hidden="true">{shown.map((point,index)=>{const projected=!!signalTime&&(hasFuture?point.x>signalTime:index>=Math.max(1,shown.length-2));return <i key={`${point.x}-${index}`} className={projected?styles.projectedBar:styles.realizedBar} style={{height:`${18+(point.y1-min)/(max-min||1)*72}%`}}/>})}</div>;
}
function PriceChart({points,signalTime,projection}:{points:GraphPoint[];signalTime:number;projection:boolean}){
 const split=projectedPoints(points,signalTime),actual=projection?split.past:points,forecast=projection?split.projection:[],domain=[...actual,...forecast];
 const dates=domain.map(point=>point.x),minDate=Math.min(...dates),maxDate=Math.max(...dates),signalLeft=Math.max(8,Math.min(88,8+(signalTime-minDate)/(maxDate-minDate||1)*84));
 return <div className={styles.miniChart}><svg viewBox="0 0 360 142" role="img" aria-label={projection?'SNOW price history with the original projection shown in purple':'SNOW realized weekly price path shown in green'}>{[35,71,107].map(y=><line key={y} x1="13" x2="347" y1={y} y2={y} className={styles.gridLine}/>)}<path d={linePath(actual,domain)} className={styles.actualPath}/>{forecast.length>1&&<path d={linePath(forecast,domain)} className={styles.forecastPath}/>}</svg>{projection&&<span className={styles.projectionTag}>Projections</span>}<span className={styles.signalBadge} style={{left:`${signalLeft}%`}}>Buy signal</span></div>;
}
function SignalView({title,subtitle,price,financials,signalTime,projection}:{title:string;subtitle:string;price:GraphPoint[];financials:GraphPoint[];signalTime:number;projection:boolean}){
 return <article className={styles.signalView}><header><div><small>{title}</small><strong>{subtitle}</strong></div><span className={projection?styles.projectedStatus:styles.realizedStatus}>{projection?'ORIGINAL VIEW':'REALIZED'}</span></header><h4>PRICE TREND</h4><PriceChart points={price} signalTime={signalTime} projection={projection}/><h4>Revenues</h4><div className={styles.financeChart}>{bars(financials,projection?signalTime:undefined)}{projection&&<span>Projections</span>}</div></article>;
}
function useSnowSignalData(){
 const {user}=useSiteAccount();const [data,setData]=useState<SnowSignalData>(previewData);const [cached,setCached]=useState(false);
 useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem(cacheKey)||'null');if(validCache(saved)){setData(saved);setCached(true)}}catch{/* Keep the immediate saved preview. */}},[]);
 useEffect(()=>{
  if(!user||cached)return;let active=true;
  try{const saved=JSON.parse(localStorage.getItem(cacheKey)||'null');if(validCache(saved)){setData(saved);setCached(true);return}}catch{/* A damaged cache is replaced after the collection read. */}
  void Promise.all([getSiteAuth(),import('firebase/firestore')]).then(async([auth,db])=>{
   const store=db.getFirestore(auth.app),snapshot=await db.getDocs(db.query(db.collection(store,'stockbuyanalyst'),db.where('symbol','==','SNOW'),db.limit(50)));
   const rows=snapshot.docs.map(doc=>doc.data() as Record<string,unknown>),dated=rows.map(row=>({row,time:Number(row.recommendationTimeInt||row.recommendationTime||row.time||0)})).filter(item=>item.time>0).map(item=>({...item,time:item.time<100000000000?item.time*1000:item.time})).sort((a,b)=>a.time-b.time);
   if(!dated.length)return;const original=dated.reduce((best,item)=>Math.abs(item.time-entryTime)<Math.abs(best.time-entryTime)?item:best,dated[0]),latest=dated[dated.length-1];
   const next:SnowSignalData={originalPrice:cleanPoints(original.row.graph1),originalFinancials:cleanPoints(original.row.graph3),latestPrice:cleanPoints(latest.row.graph1),latestFinancials:cleanPoints(latest.row.graph3),signalTime:original.time,updatedAt:Date.now()};
   if(!next.originalPrice.length||!next.latestPrice.length)return;if(!next.originalFinancials.length)next.originalFinancials=previewData.originalFinancials;if(!next.latestFinancials.length)next.latestFinancials=next.originalFinancials;
   if(active){setData(next);setCached(true);try{localStorage.setItem(cacheKey,JSON.stringify(next))}catch{/* The page still uses the fresh data. */}}
  }).catch(()=>{/* Public readers keep the saved visual preview without interruption. */});
  return()=>{active=false};
 },[user,cached]);
 return{data,fromCollection:!!data.updatedAt};
}

function SnowPostCard({onOpen}:{onOpen:()=>void}){
 const postImage=overnightOptionsResult.images?.[0]?.url;
 return <button type="button" className={styles.postCard} onClick={onOpen} aria-label="Open the original SNOW 30X post in the app"><span className={styles.author}><img src="/assets/images/aness.jpg" width="46" height="46" alt=""/><span><strong>Aness Hussein Ali</strong><small>@aness88 · May 29, 2026</small></span><b>ORIGINAL APP POST</b></span><span className={styles.postBody}><span><small>SNOW · OPTIONS RESULT</small><strong>❄️ 30X! BOOM! Overnight!</strong><em>SNOW 200 Call · May 29, 2026</em><span className={styles.engagement}>♡ {overnightOptionsResult.likes} <i/> ◇ {overnightOptionsResult.comments} <i/> ↗ {overnightOptionsResult.shares}</span></span>{postImage&&<img src={postImage} alt="Aness's shared SNOW options result" loading="lazy"/>}</span><span className={styles.postResult}><span><small>SHARED RESULT</small><strong>+2,798.06%</strong><em>approximately 30×</em></span><b>See the post in the app <span aria-hidden="true">↗</span></b></span></button>;
}

export default function SnowSignalStory(){
 const [modal,setModal]=useState<'post'|'pro'|null>(null),replay=useRef<HTMLDivElement>(null),[visible,setVisible]=useState(false);const {data,fromCollection}=useSnowSignalData();
 useEffect(()=>{const root=replay.current;if(!root)return;const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){setVisible(true);observer.disconnect()}},{threshold:.2});observer.observe(root);return()=>observer.disconnect()},[]);
 return <section className={styles.story} aria-labelledby="snow-story-title">
  <div className={styles.storyHeading}><div><span className={styles.eyebrow}>AN ORIGINAL POST FROM ANESS</span><h3 id="snow-story-title">The shared SNOW result, inside its research story.</h3></div><p>Open the original discussion in the app, then study the valuation and technical framework behind the example.</p></div>
  <SnowPostCard onOpen={()=>setModal('post')}/>
  <div ref={replay} className={styles.replay} data-visible={visible}>
   <header><div><span className={styles.eyebrow}>SNOW SIGNAL REPLAY</span><h3>Before the move. After the signal.</h3><p>The first panel preserves the original app-style projection in purple. The second replaces it with the observed weekly path in green and keeps the financial trend underneath.</p></div><span className={styles.dataSource}>{fromCollection?'CACHED WEEKLY COLLECTION DATA':'SAVED SIGNAL PREVIEW'}</span></header>
   <div className={styles.signalViews}><SignalView title="AT THE SIGNAL" subtitle="Original setup" price={data.originalPrice} financials={data.originalFinancials} signalTime={data.signalTime} projection/><SignalView title="OCTOBER 27 REVIEW" subtitle="What happened next" price={data.latestPrice} financials={data.latestFinancials} signalTime={data.signalTime} projection={false}/></div>
   <div className={styles.checkpoints}><span><small>ENTRY · MAY 1</small><strong>$141.00</strong><em>Reference close</em></span><span><small>ONE MONTH · JUN 1</small><strong>$280.16</strong><em>+98.7%</em></span><span><small>THREE MONTHS · AUG 3</small><strong>$307.53</strong><em>+118.1%</em></span></div>
   <small className={styles.replayNote}>{fromCollection?'The chart uses the locally cached SNOW signal series loaded from stockbuyanalyst.':'The immediate saved preview preserves the disclosed checkpoints; signed-in readers receive the collection series silently and it is cached for future visits.'} Purple marks the original projection, while green marks observed history. Historical results are not forecasts.</small>
  </div>
  <div className={styles.lesson}>
   <header><span className={styles.eyebrow}>FROM THE SIGNAL TO THE PROCESS</span><h3>🎯 Combine Valuation with Technicals: Finding Your Next Stock and LEAPS Idea.</h3><p>Combine P/E metrics with technical indicators to identify potential value picks and better entry points. The aim is to find companies whose share prices may have fallen further than their business prospects justify.</p></header>
   <ol>{lesson.map((item,index)=><li key={item.title}><span>{index+1}</span><div><h4>{item.title}</h4>{item.body}</div></li>)}</ol>
   <div className={styles.lessonCta}><div><small>TAKE THE NEXT STEP</small><strong>Get Pro now for the best stocks to buy now.</strong><p>Continue in the app to explore the full signal, peer comparisons and interactive research.</p></div><button type="button" onClick={()=>setModal('pro')}>Get Pro in the app <span aria-hidden="true">↗</span></button></div>
   <small className={styles.disclaimer}>Historical examples are educational, not typical results or recommendations. Options can lose their entire premium. P/E and technical indicators should not be used in isolation.</small>
  </div>
  {modal&&<AppDownloadModal placement={modal==='post'?'home_snow_original_post':'home_snow_valuation_lesson'} onClose={()=>setModal(null)} title={modal==='post'?'See the original SNOW post in the app':'Continue with Pro in the app'} description={modal==='post'?'Open the original Aness post, its discussion and the app research behind the shared result.':'Explore the full stock signal, valuation comparisons, technical context and measured stock or LEAPS research in the app.'}/>}
 </section>;
}
