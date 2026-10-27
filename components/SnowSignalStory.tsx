import {useEffect,useRef,useState,useId,type CSSProperties} from 'react';
import AppDownloadModal from './AppDownloadModal';
import {snowSignalReplay,replayDate,replayMoney,replayRevenue,replayGeometry,nearestReplayPoint,type ReplayPoint} from '../lib/snow-signal-replay';
import {overnightOptionsResult} from '../lib/featured-research';
import styles from '../styles/SnowSignalStory.module.css';

const lesson=[
 {title:'Understand both trailing and forward P/E.',body:<p>Trailing P/E divides the share price by earnings per share over the previous 12 months; forward P/E uses forecast earnings.</p>},
 {title:'Compare P/E across peers.',body:<><p>Start with the earnings calendar. In the screener, select Stocks → Earnings Calendar and display Market Cap. Choose a large company reporting within the next two weeks, then tap Competition and sort by P/E. Focus on competitors with similar business models, growth, profitability and financial strength. Market cap measures company size, while P/E helps assess the price being paid for earnings. Two companies with similar P/E ratios are not necessarily equally attractive.</p><p>Compare valuation with the stock’s own history. Use the two-year view to examine changes in share price alongside changes in P/E, then repeat the comparison with a relevant competitor. A rising price with a falling P/E can indicate that earnings are growing faster than the share price. A falling price with a rising P/E can indicate that earnings are deteriorating even faster. This relative-value analysis helps distinguish a potential opportunity from a stock that merely looks cheaper after a decline.</p></>},
 {title:'Great ideas combine valuation with technical setups.',body:<p>A particularly interesting setup is a growth stock trading below its usual P/E range while approaching an established price-support area, provided its earnings outlook remains healthy.</p>},
 {title:'Historical SNOW example.',body:<p>The SNOW signal was shared on May 13, 2026. Its saved price chart ended at $151.52. By October 26, the follow-up price was $334.95, approximately +121.1% from that reference. Compare the original setup with the path that followed, including the pullbacks along the way.</p>},
 {title:'Turn the research into a measured stock or LEAPS idea.',body:<p>Size the idea for the risk, define the level that would invalidate the setup and revisit the thesis as earnings, valuation and price action change.</p>},
];

function ReplayPlot({points,projection=[],financial=false,signalPoint}:{points:readonly ReplayPoint[];projection?:readonly ReplayPoint[];financial?:boolean;signalPoint?:ReplayPoint}) {
 const [active,setActive]=useState<number|null>(null);
 const id=useId().replace(/:/g,'');
 const chart=replayGeometry(points,projection,financial);
 const plotted=[...points,...(financial?chart.projectedBars:projection.slice(1))];
 const selected=active===null?null:plotted[active];
 const illustrative=active!==null&&active>=points.length;
 const boundary=chart.x(points.at(-1)!);
 const marker=signalPoint&&points.find(p=>p.x===signalPoint.x);
 const xFirst=replayDate(points[0].x,true),xLast=replayDate((projection.at(-1)||points.at(-1)!).x,true);
 const pricePath=chart.path(points);
 const area=pricePath+` L ${(chart.x(points.at(-1)!)*7.2).toFixed(3)} 243.6 L ${(chart.x(points[0])*7.2).toFixed(3)} 243.6 Z`;
 return <div className={styles.replayPlot}>
  {financial&&<span className={styles.chartScale}>Scale: {replayRevenue(chart.min)} to {replayRevenue(chart.max)}</span>}
  <svg viewBox="0 0 720 280" preserveAspectRatio="none" role="img" tabIndex={0}
   aria-label={`SNOW ${financial?'revenues':'price history'}, ${points.length} saved observations${projection.length?', with the original illustrative projection':''}. Use arrow keys to inspect values.`}
   onPointerMove={event=>{const bounds=event.currentTarget.getBoundingClientRect();setActive(nearestReplayPoint(plotted,(event.clientX-bounds.left)/bounds.width*100,chart.x))}}
   onPointerLeave={()=>setActive(null)} onBlur={()=>setActive(null)}
   onKeyDown={event=>{if(['ArrowLeft','ArrowRight','Home','End','Escape'].includes(event.key)){event.preventDefault();setActive(event.key==='Escape'?null:event.key==='Home'?0:event.key==='End'?plotted.length-1:Math.max(0,Math.min(plotted.length-1,(active??0)+(event.key==='ArrowRight'?1:-1))))}}}>
   <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#20d49a" stopOpacity=".16"/><stop offset="1" stopColor="#20d49a" stopOpacity="0"/></linearGradient></defs>
   {projection.length>0&&<g className={styles.savedProjectionZone}><rect x={boundary*7.2} y="0" width={(100-boundary)*7.2} height="280" fill="#c9a4ff" fillOpacity=".13"/><line x1={boundary*7.2} x2={boundary*7.2} y1="0" y2="252" stroke="#c9a4ff" strokeOpacity=".65" strokeDasharray="4 5" vectorEffect="non-scaling-stroke"/></g>}
   {[14,32.25,50.5,68.75,87].map(y=><line key={y} x1="28.8" x2="691.2" y1={y*2.8} y2={y*2.8} stroke="#ffffff" strokeOpacity=".1" vectorEffect="non-scaling-stroke"/>)}
   {financial ? points.map((p,i)=><line key={p.x} className={styles.cachedBar} x1={chart.x(p)*7.2} x2={chart.x(p)*7.2} y1={chart.y(chart.baseline)*2.8} y2={chart.y(p.y1)*2.8} stroke="#20d49a" strokeWidth="6" strokeLinecap="round" vectorEffect="non-scaling-stroke" style={{'--bar-delay':`${i/(points.length-1)*800}ms`,transformOrigin:`${chart.x(p)*7.2}px ${chart.y(chart.baseline)*2.8}px`} as CSSProperties}/>) : <g className={styles.historyReveal}><path d={area} fill={`url(#${id})`}/><path d={pricePath} fill="none" stroke="#20d49a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"/></g>}
   {projection.length>0&&<g className={styles.projectionReveal}>{financial ? chart.projectedBars.map(p=><line key={p.x} x1={chart.x(p)*7.2} x2={chart.x(p)*7.2} y1={chart.y(chart.baseline)*2.8} y2={chart.y(p.y1)*2.8} stroke="#c9a4ff" strokeWidth="6" strokeLinecap="round" vectorEffect="non-scaling-stroke"/>) : <path d={chart.path(projection)} fill="none" stroke="#c9a4ff" strokeWidth="2" strokeDasharray="4 5" strokeLinecap="round" vectorEffect="non-scaling-stroke"/>}</g>}
   {marker&&<circle className={styles.savedSignalDot} cx={chart.x(marker)*7.2} cy={chart.y(marker.y1)*2.8} r="7" stroke="#d6ffec" strokeWidth="2" fill="#20d49a" vectorEffect="non-scaling-stroke"/>}
   {selected&&<g><line x1={chart.x(selected)*7.2} x2={chart.x(selected)*7.2} y1="24" y2="250" stroke="#c9d4e9" strokeOpacity=".5" strokeDasharray="3 4" vectorEffect="non-scaling-stroke"/><circle cx={chart.x(selected)*7.2} cy={chart.y(selected.y1)*2.8} r="6" fill={illustrative?'#c9a4ff':'#20d49a'}/></g>}
  </svg>
  <span className={styles.replayAxisStart}>{xFirst}</span>
  <span className={styles.replayAxisEnd}>{projection.length?'Projections':xLast}</span>
  {marker&&<span className={styles.savedSignalBadge} style={{left:`${chart.x(marker)}%`,top:`${chart.y(marker.y1)}%`}}>Buy signal</span>}
  {selected&&<span role="status" className={styles.replayTooltip} style={{left:`${Math.max(24,Math.min(76,chart.x(selected)))}%`}}>{illustrative?'Illustrative projection · ':''}{replayDate(selected.x)}<strong>{financial?replayRevenue(selected.y1):replayMoney(selected.y1)}</strong></span>}
 </div>;
}
function SignalView({original=false}:{original?:boolean}) {
 const data=snowSignalReplay,series=original?data.original:data.review;
 return <article className={styles.signalView}>
  <header><div><small>{original?'AS SHARED · '+replayDate(data.signalTime):'THROUGH '+replayDate(series.price.at(-1)!.x)}</small><strong>{original?'Original signal':'What happened next'}</strong></div><span className={original?styles.projectedStatus:styles.realizedStatus}>{original?'ORIGINAL VIEW':'ACTUAL HISTORY'}</span></header>
  <div className={styles.savedSignalHeading}><img src="/assets/logo/SNOW.webp" alt="" width="36" height="36" onError={event=>{event.currentTarget.style.display='none'}}/><div><strong>SNOW</strong><span>Snowflake</span></div><b>{original?'BUY':'FOLLOW-UP'}</b></div>
  <h4>Price</h4><ReplayPlot points={series.price} projection={original?data.original.priceProjection:[]} signalPoint={data.original.price.at(-1)}/>
  <h4>Revenues</h4><ReplayPlot points={series.financials} projection={original?data.original.financialProjection:[]} financial/>
 </article>;
}

function SnowPostCard({onOpen}:{onOpen:()=>void}){
 const postImage=overnightOptionsResult.images?.[0]?.url;
 return <button type="button" className={styles.postCard} onClick={onOpen} aria-label="Open the original SNOW 30X post in the app"><span className={styles.author}><img src="/assets/images/aness.jpg" width="46" height="46" alt=""/><span><strong>Aness Hussein Ali</strong><small>@aness88 · May 29, 2026</small></span><b>ORIGINAL APP POST</b></span><span className={styles.postBody}><span><small>SNOW · OPTIONS RESULT</small><strong>❄️ 30X! BOOM! Overnight!</strong><em>SNOW 200 Call · May 29, 2026</em><span className={styles.engagement}>♡ {overnightOptionsResult.likes} <i/> ◇ {overnightOptionsResult.comments} <i/> ↗ {overnightOptionsResult.shares}</span></span>{postImage&&<img src={postImage} alt="Aness's shared SNOW options result" loading="lazy"/>}</span><span className={styles.postResult}><span><small>SHARED RESULT</small><strong>+2,798.06%</strong><em>approximately 30×</em></span><b>See the post in the app <span aria-hidden="true">↗</span></b></span></button>;
}

export default function SnowSignalStory(){
 const [modal,setModal]=useState<'post'|'pro'|null>(null),replay=useRef<HTMLDivElement>(null),[visible,setVisible]=useState(false);const data=snowSignalReplay;
 useEffect(()=>{const root=replay.current;if(!root)return;if(!('IntersectionObserver' in window)){setVisible(true);return}const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){setVisible(true);observer.disconnect()}},{threshold:.2});observer.observe(root);return()=>observer.disconnect()},[]);
 return <section className={styles.story} aria-labelledby="snow-story-title">
  <div className={styles.storyHeading}><div><span className={styles.eyebrow}>AN ORIGINAL POST FROM ANESS</span><h3 id="snow-story-title">The shared SNOW result, inside its research story.</h3></div><p>Open the original discussion in the app, then study the valuation and technical framework behind the example.</p></div>
  <SnowPostCard onOpen={()=>setModal('post')}/>
  <div ref={replay} className={styles.replay} data-visible={visible}>
   <header><div><span className={styles.eyebrow}>SNOW SIGNAL REPLAY</span><h3>Before the move. After the signal.</h3><p>The original signal is on the left. Compare its price and revenue trends with what followed on the right. Move over a chart to explore the values.</p></div><span className={styles.dataSource}>SNOW · SIGNAL &amp; FOLLOW-UP</span></header>
   <div className={styles.signalViews}><SignalView original/><SignalView/></div>
   <div className={styles.checkpoints}><span><small>SIGNAL CHART REFERENCE</small><strong>{replayMoney(data.original.price.at(-1)!.y1)}</strong><em>{replayDate(data.original.price.at(-1)!.x)}</em></span><span><small>FOLLOW-UP PRICE</small><strong>{replayMoney(data.review.price.at(-1)!.y1)}</strong><em>{replayDate(data.review.price.at(-1)!.x)}</em></span><span><small>CHANGE FROM REFERENCE</small><strong>+{(100*(data.review.price.at(-1)!.y1/data.original.price.at(-1)!.y1-1)).toFixed(1)}%</strong><em>Stock price change</em></span></div>
   <small className={styles.replayNote}>Purple shows the original illustrative projection. Green shows the recorded history. Historical results are not forecasts.</small>
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
