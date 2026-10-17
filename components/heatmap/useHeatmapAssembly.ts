import {RefObject,useEffect} from 'react';
import {heatmapAssemblyProgress} from '../../lib/heatmap-motion';

export default function useHeatmapAssembly(ref:RefObject<HTMLDivElement|null>,layoutKey:string,mobile:boolean){
 useEffect(()=>{
  const map=ref.current;if(!map)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const groups=Array.from(map.querySelectorAll<HTMLElement>('[data-assembly-group]'));
  let frame=0,observer:IntersectionObserver|undefined,active=false;
  const draw=()=>{
   frame=0;if(document.hidden)return;
   const top=map.getBoundingClientRect().top;
   // Read geometry first. Mobile groups assemble as each enters the viewport.
   const updates=groups.map(group=>({group,progress:heatmapAssemblyProgress(top+(mobile?group.offsetTop:0),window.innerHeight)}));
   updates.forEach(({group,progress})=>{
    group.style.setProperty('--assembly-progress',String(progress));
    group.dataset.assemblySettled=progress>=.995?'true':'false';
   });
  };
  const schedule=()=>{if(active&&!frame)frame=requestAnimationFrame(draw)};
  const detach=()=>{
   active=false;cancelAnimationFrame(frame);frame=0;
   window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);
   document.removeEventListener('visibilitychange',schedule);
  };
  const setup=()=>{
   detach();observer?.disconnect();
   delete map.dataset.assembly;
   groups.forEach(group=>{group.style.removeProperty('--assembly-progress');delete group.dataset.assemblySettled});
   if(reduced.matches||!('IntersectionObserver' in window))return;
   map.dataset.assembly='enabled';draw();
   observer=new IntersectionObserver(entries=>{
    if(entries.some(entry=>entry.isIntersecting)){
     if(!active){active=true;window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);document.addEventListener('visibilitychange',schedule)}
     schedule();
    }else{draw();detach()}
   },{rootMargin:'160px'});
   observer.observe(map);
  };
  setup();reduced.addEventListener('change',setup);
  return()=>{
   detach();observer?.disconnect();reduced.removeEventListener('change',setup);
   delete map.dataset.assembly;
   groups.forEach(group=>{group.style.removeProperty('--assembly-progress');delete group.dataset.assemblySettled});
  };
 },[ref,layoutKey,mobile]);
}
