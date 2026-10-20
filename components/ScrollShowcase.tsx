import {useEffect,useRef} from 'react';
import Image from 'next/image';
import useChartEntrance from './useChartEntrance';
import ChartReveal from './ChartReveal';
import styles from '../styles/ScrollShowcase.module.css';
const chapters=[
  {eyebrow:'01 / THE BIG PICTURE',title:'Less noise.\nMore perspective.',text:'Start with the market. Explore the heatmap, follow the calendar and put the day’s moves in context.',href:'/stock-market-heatmap/',link:'Explore the market'},
  {eyebrow:'02 / LOOK CLOSER',title:'Go deeper\nthan the price.',text:'Bring stock ideas and company fundamentals together. Explore the business behind the ticker.',href:'/stocks-to-buy/',link:'Explore stock research'},
  {eyebrow:'03 / MAKE IT A ROUTINE',title:'Your next move.\nMore considered.',text:'Make room for research, learning and a daily investing routine. All in one place.',href:'/#how-it-works',link:'Discover the app'},
];
export default function ScrollShowcase(){
  const root=useRef<HTMLElement>(null);
  const chartRef=useRef<SVGSVGElement>(null);
  useChartEntrance(chartRef);
  useEffect(()=>{
    const element=root.current;if(!element)return;
    // Use the existing unpinned layout on iOS. A viewport-height sticky stage
    // is sampled as a bottom toolbar background by Safari's chrome renderer.
    if(CSS.supports('-webkit-touch-callout','none'))return;
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');let frame=0;let observer:IntersectionObserver|undefined;
    const draw=()=>{frame=0;const rect=element.getBoundingClientRect();const travel=Math.max(1,rect.height-window.innerHeight+80);const p=Math.max(0,Math.min(1,(80-rect.top)/travel));element.style.setProperty('--journey',String(p));if(!element.contains(document.activeElement))element.dataset.chapter=String(Math.min(2,Math.floor(p*3)));};
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(draw);};
    const setup=()=>{window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);observer?.disconnect();cancelAnimationFrame(frame);frame=0;
      if(reduced.matches){delete element.dataset.enhanced;element.style.removeProperty('--journey');return;}
      element.dataset.enhanced='true';draw();observer=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);schedule();}else{window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);}});observer.observe(element);
    };setup();reduced.addEventListener('change',setup);
    return()=>{observer?.disconnect();cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);reduced.removeEventListener('change',setup);};
  },[]);
  return <section ref={root} className={styles.journey} aria-label="Explore the Stocks To Buy Now AI experience">
    <div className={styles.stage}>
      <div className={styles.orbit} aria-hidden="true"/>
      <div className={styles.copy}>{chapters.map((chapter,index)=><article className={styles.chapter} data-chapter-copy={index} key={chapter.eyebrow}>
        <span>{chapter.eyebrow}</span><h2>{chapter.title.split('\n').map((line,i)=><span key={line}>{line}{i===0&&<br/>}</span>)}</h2><p>{chapter.text}</p><a href={chapter.href}>{chapter.link} <span aria-hidden="true">↗</span></a>
      </article>)}</div>
      <div className={styles.visual} aria-label="Preview of the app’s daily investing routine">
        <div className={styles.backCard}><span>RESEARCH</span><strong>See the bigger picture.</strong><div className={styles.chart} aria-hidden="true"><svg ref={chartRef} viewBox="0 0 240 100"><ChartReveal width={240} height={100}><path d="M0 85 25 70 45 78 65 49 90 60 110 30 135 43 150 20 180 38 200 15 240 5"/></ChartReveal></svg></div><small>Context before decisions.</small></div>
        <div className={styles.phone}><Image src="/assets/images/daily-investing-routine.png" width={864} height={1821} sizes="(max-width: 700px) 190px, 320px" alt="The Stocks To Buy Now AI app: signals, insights, earnings and market updates"/></div>
        <div className={styles.frontCard}><span className={styles.spark} aria-hidden="true">✦</span><div><small>YOUR DAILY ROUTINE</small><strong>Research. Learn. Repeat.</strong></div></div>
        <span className={styles.caption}>APP PREVIEW · ILLUSTRATIVE RESEARCH VISUAL</span>
      </div>
      <div className={styles.progress} aria-hidden="true"><span>SCROLL TO EXPLORE</span><div><i/></div><span>01 — 03</span></div>
    </div>
  </section>;
}
