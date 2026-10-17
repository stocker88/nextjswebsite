import {RefObject,useEffect} from 'react';

// Only animate new plots/data, never pointer movement or live calculator inputs.
// Server-rendered charts remain visible if JavaScript or observers are unavailable.
export default function useChartEntrance<T extends HTMLElement|SVGElement>(ref:RefObject<T|null>,replayKey='',enabled=true){
 useEffect(()=>{
  const element=ref.current;
  if(!element||!enabled)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let observer:IntersectionObserver|undefined,frame=0,timer=0,finished=false,started=false;
  const complete=()=>{
   finished=true;
   observer?.disconnect();cancelAnimationFrame(frame);window.clearTimeout(timer);
   element.dataset.chartEntrance='complete';
  };
  const play=()=>{
   if(finished||started)return;
   started=true;
   observer?.disconnect();
   // Commit the reset before replaying a changed ticker or period.
   frame=requestAnimationFrame(()=>{frame=requestAnimationFrame(()=>{
    element.dataset.chartEntrance='playing';
    timer=window.setTimeout(complete,1800);
   })});
  };
  if(reduced.matches||!('IntersectionObserver' in window))complete();
  else{
   element.dataset.chartEntrance='waiting';
   observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting))play()},{threshold:.15});
   observer.observe(element);
  }
  const preference=()=>{if(reduced.matches)complete()};
  reduced.addEventListener('change',preference);
  element.addEventListener('pointerdown',complete);
  element.addEventListener('focusin',complete);
  return()=>{
   complete();delete element.dataset.chartEntrance;
   reduced.removeEventListener('change',preference);
   element.removeEventListener('pointerdown',complete);
   element.removeEventListener('focusin',complete);
  };
 },[ref,replayKey,enabled]);
}
