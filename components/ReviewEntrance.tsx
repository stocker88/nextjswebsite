import {ReactNode,useEffect,useRef} from 'react';
import styles from '../styles/ReviewEntrance.module.css';
/** A scroll-driven blue-to-navy scene. Reviews remain ordinary links and content. */
export default function ReviewEntrance({children}:{children:ReactNode}){
 const root=useRef<HTMLElement>(null);
 useEffect(()=>{
  const element=root.current;if(!element)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const short=window.matchMedia('(max-height: 650px)');
  let frame=0;let observer:IntersectionObserver|undefined;
  const clamp=(value:number)=>Math.max(0,Math.min(1,value));
  const draw=()=>{frame=0;const rect=element.getBoundingClientRect();const header=window.innerWidth<1000?68:80;const p=clamp((header-rect.top)/Math.max(1,rect.height-window.innerHeight+header));
   // Continue the hero’s actual decorative gradient across the section boundary.
   const halo=document.querySelector('.hero-atmosphere i:last-child')?.getBoundingClientRect();
   if(halo){element.style.setProperty('--halo-x',`${halo.left-rect.left}px`);element.style.setProperty('--halo-y',`${halo.top-rect.top}px`);element.style.setProperty('--halo-w',`${halo.width}px`);element.style.setProperty('--halo-h',`${halo.height}px`);}
   element.style.setProperty('--reviews-progress',String(p));
   element.style.setProperty('--review-panel',String(clamp(.12+p/0.75)));
   element.style.setProperty('--review-top',String(clamp(.12+p/.35)));
   element.style.setProperty('--review-cards',String(clamp((p-.25)/.4)));
   element.style.setProperty('--review-bottom',String(clamp((p-.55)/.3)));
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(draw);};
  const setup=()=>{observer?.disconnect();window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);cancelAnimationFrame(frame);frame=0;
   if(reduced.matches||short.matches){delete element.dataset.enhanced;element.removeAttribute('style');return;}
   element.dataset.enhanced='true';draw();observer=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);schedule();}else{window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);}});observer.observe(element);
  };
  setup();reduced.addEventListener('change',setup);short.addEventListener('change',setup);
  return()=>{observer?.disconnect();cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);reduced.removeEventListener('change',setup);short.removeEventListener('change',setup);};
 },[]);
 return <section ref={root} className={styles.entrance} aria-label="Investor reviews"><div className={styles.gradientTail} aria-hidden="true"><i/></div><div className={styles.stage}><div className={styles.darkPanel} aria-hidden="true"/><div className={styles.reviews}>{children}</div></div></section>;
}
