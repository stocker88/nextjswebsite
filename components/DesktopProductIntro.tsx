import {AccountLink} from './SiteAccount';
import {useEffect, useRef, type PointerEvent} from 'react';
import styles from '../styles/DesktopProduct.module.css';
const tools = [
  {label:'Market overview',description:'Heatmaps, movers and the wider market.',href:'#product-reveal',category:'MARKETS',icon:'M3 3h18v18H3z M3 10h18 M10 3v18 M16 10v11'},
  {label:'Company research',description:'Explore the businesses behind the tickers.',href:'/stocks/',category:'RESEARCH',icon:'M10.5 3a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15 M16 16l5 5'},
  {label:'Options workspace',description:'Compare strategies and model your payoff.',href:'/options-strategies/',category:'OPTIONS',icon:'M3 17h6l5-6 7-7 M3 21h18'},
  {label:'Smart Money',description:'Follow disclosed insider and fund activity.',href:'/smart-money/',category:'INSIDERS',icon:'M3 9l9-6 9 6H3z M5 11v8 M12 11v8 M19 11v8 M3 21h18'},
];
function moveCardLight(event: PointerEvent<HTMLAnchorElement>) {
 if (event.pointerType === 'touch') return;
 const card = event.currentTarget;
 const bounds = card.getBoundingClientRect();
 card.style.setProperty('--light-x', `${event.clientX - bounds.left}px`);
 card.style.setProperty('--light-y', `${event.clientY - bounds.top}px`);
 card.dataset.pointerLight = 'true';
}
function clearCardLight(event: PointerEvent<HTMLAnchorElement>) {
 delete event.currentTarget.dataset.pointerLight;
}
export default function DesktopProductIntro(){
 const section = useRef<HTMLElement>(null);
 useEffect(() => {
  const root=section.current;
  if(!root)return;
  let frame=0;
  const update=()=>{frame=0;root.dataset.scrollStarted=String(window.scrollY>8);};
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
  update();window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('pageshow',schedule);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('pageshow',schedule);};
 }, []);

 useEffect(() => {
  const root=section.current;
  if(!root||!('IntersectionObserver' in window))return;
  const mobile=window.matchMedia('(max-width:1023px) and (hover:none), (max-width:1023px) and (pointer:coarse)'),reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const items=Array.from(root.querySelectorAll<HTMLElement>('[data-intro-item]'));
  let observer:IntersectionObserver|undefined;
  const configure=()=>{
   observer?.disconnect();
   if(!mobile.matches||reduced.matches){items.forEach(item=>delete item.dataset.reveal);return;}
   observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{if(entry.isIntersecting){(entry.target as HTMLElement).dataset.reveal='visible';observer?.unobserve(entry.target);}});
   },{threshold:.12,rootMargin:'0px 0px -8% 0px'});
   items.forEach(item=>{
    if(item.dataset.reveal==='visible')return;
    // Restored scroll positions must never hide content already passed.
    if(item.getBoundingClientRect().bottom<=0){item.dataset.reveal='visible';return;}
    item.dataset.reveal='waiting';observer?.observe(item);
   });
  };
  configure();mobile.addEventListener('change',configure);reduced.addEventListener('change',configure);
  return()=>{observer?.disconnect();mobile.removeEventListener('change',configure);reduced.removeEventListener('change',configure);items.forEach(item=>delete item.dataset.reveal);};
 }, []);
 return <section ref={section} id="desktop-product-intro" data-scroll-started="false" className={styles.intro} aria-labelledby="desktop-product-title">
 <div className={styles.introHeading}><div><div data-intro-item className={styles.introBrand}><img src="/assets/images/stockerRobotIcon.png" alt="" width={48} height={48}/><span className={styles.eyebrow}>STOCKS TO BUY NOW AI</span></div><h1 data-intro-item id="desktop-product-title">Your market.<br/><span>A clearer perspective.</span></h1><p data-intro-item>Explore the market, research a company and compare your next idea. Start with the tools below.</p></div><AccountLink data-intro-item className={styles.primary} destination="/stock-market-heatmap/">Explore the market <span aria-hidden="true">↗</span></AccountLink></div>
 <div className={styles.tools}>{tools.map(t=><a data-intro-item href={t.href} key={t.label} onPointerMove={moveCardLight} onPointerLeave={clearCardLight} onPointerCancel={clearCardLight}><span className={styles.toolIcon} aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d={t.icon}/></svg></span><div className={styles.toolCopy}><span className={styles.toolCategory}>{t.category}</span><h2>{t.label}</h2><p>{t.description}</p></div><span className={styles.arrow} aria-hidden="true">↗</span></a>)}</div>
 <div data-intro-item className={styles.introFooter}><span>Research. Compare. Build your perspective.</span><a href="#memberships">Explore membership →</a></div>
 <a className={styles.scrollCue} href="#product-reveal" aria-label="Scroll to the market overview"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></a>
 </section>}
