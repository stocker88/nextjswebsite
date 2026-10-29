// A gentle back-and-forth pan keeps each headline reachable without cloned links.
export function startResearchBandScroll(rail:HTMLElement, region:HTMLElement, paused=false) {
 const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
 let frame=0,last=0,direction=1,position=rail.scrollLeft,hover=false,focus=region.contains(document.activeElement),touch=false;
 let resumeAt=performance.now()+1800;
 const rest=()=>{last=0;position=rail.scrollLeft;resumeAt=performance.now()+1800;};
 const enter=(event:PointerEvent)=>{if(event.pointerType!=='touch')hover=true;rest();};
 const leave=()=>{hover=false;rest();};
 const focusIn=()=>{focus=true;rest();};
 const focusOut=(event:FocusEvent)=>{focus=region.contains(event.relatedTarget as Node|null);rest();};
 const down=()=>{touch=true;rest();};
 const up=()=>{touch=false;rest();};
 const wheel=()=>{rest();};
 const visible=()=>rest();
 const tick=(time:number)=>{
  if(paused||motion.matches||document.hidden||hover||focus||touch||time<resumeAt){last=0;position=rail.scrollLeft;}
  else {
   const max=rail.scrollWidth-rail.clientWidth;
   if(max>1){
    const elapsed=last?Math.min(time-last,64):0;
    position=Math.min(max,Math.max(0,position+direction*18*elapsed/1000));
    rail.scrollLeft=position;
    if((direction>0&&position>=max)||(direction<0&&position<=0)){direction*=-1;resumeAt=time+2200;last=0;}
    else last=time;
   }else{last=0;position=rail.scrollLeft;}
  }
  frame=window.requestAnimationFrame(tick);
 };
 region.addEventListener('pointerenter',enter);region.addEventListener('pointerleave',leave);
 region.addEventListener('focusin',focusIn);region.addEventListener('focusout',focusOut);
 rail.addEventListener('pointerdown',down);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);
 region.addEventListener('wheel',wheel,{passive:true});document.addEventListener('visibilitychange',visible);
 motion.addEventListener?.('change',rest);
 frame=window.requestAnimationFrame(tick);
 return ()=>{
  window.cancelAnimationFrame(frame);
  region.removeEventListener('pointerenter',enter);region.removeEventListener('pointerleave',leave);
  region.removeEventListener('focusin',focusIn);region.removeEventListener('focusout',focusOut);
  rail.removeEventListener('pointerdown',down);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);
  region.removeEventListener('wheel',wheel);document.removeEventListener('visibilitychange',visible);motion.removeEventListener?.('change',rest);
 };
}
