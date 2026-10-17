import {ReactNode,useEffect,useRef,useState} from 'react';
import styles from './Heatmap.module.css';
type Transform={scale:number;x:number;y:number};
const initial:Transform={scale:1,x:0,y:0};
export default function HeatmapZoom({children,width,height,enabled,resetKey,onGesture}:{children:ReactNode;width:number;height:number;enabled:boolean;resetKey:string;onGesture:()=>void}){
 const [transform,setTransform]=useState(initial),[dragging,setDragging]=useState(false);
 const current=useRef(initial),viewport=useRef<HTMLDivElement>(null),pointers=useRef(new Map<number,{x:number;y:number}>()),start=useRef<{distance:number;scale:number;worldX:number;worldY:number}|null>(null),moved=useRef(false),down=useRef<{x:number;y:number}|null>(null),suppressUntil=useRef(0);
 const commit=(next:Transform)=>{const scale=Math.max(1,Math.min(5,next.scale));const result={scale,x:Math.min(0,Math.max(-width*(scale-1),next.x)),y:Math.min(0,Math.max(-height*(scale-1),next.y))};current.current=result;setTransform(result)};
 const reset=()=>{commit(initial);pointers.current.clear();start.current=null;setDragging(false)};
 useEffect(()=>{reset()},[width,height,enabled,resetKey]);
 function zoom(scale:number,x=width/2,y=height/2){const old=current.current,next=Math.max(1,Math.min(5,scale));commit({scale:next,x:x-(x-old.x)*next/old.scale,y:y-(y-old.y)*next/old.scale});onGesture()}
 useEffect(()=>{
  const el=viewport.current;if(!el||!enabled)return;
  const wheel=(e:WheelEvent)=>{if(!e.ctrlKey&&!e.metaKey)return;e.preventDefault();const r=el.getBoundingClientRect();zoom(current.current.scale*Math.exp(-e.deltaY*.01),e.clientX-r.left,e.clientY-r.top)};
  el.addEventListener('wheel',wheel,{passive:false});return()=>el.removeEventListener('wheel',wheel);
 },[width,height,enabled]);
 function pointerDown(e:React.PointerEvent<HTMLDivElement>){
  if(!enabled||e.button!==0)return;
  pointers.current.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pointers.current.size===1){moved.current=false;down.current={x:e.clientX,y:e.clientY}}
  if(pointers.current.size===2){
   const [a,b]=Array.from(pointers.current.values()),r=e.currentTarget.getBoundingClientRect(),mx=(a.x+b.x)/2-r.left,my=(a.y+b.y)/2-r.top,t=current.current;
   start.current={distance:Math.max(1,Math.hypot(a.x-b.x,a.y-b.y)),scale:t.scale,worldX:(mx-t.x)/t.scale,worldY:(my-t.y)/t.scale};
   moved.current=true;setDragging(true);onGesture();
  }
 }
 function pointerMove(e:React.PointerEvent<HTMLDivElement>){
  const old=pointers.current.get(e.pointerId);if(!old)return;
  pointers.current.set(e.pointerId,{x:e.clientX,y:e.clientY});
  const points=Array.from(pointers.current.values());
  if(points.length===2&&start.current){
   e.currentTarget.setPointerCapture(e.pointerId);
   const [a,b]=points,r=e.currentTarget.getBoundingClientRect(),s=start.current,scale=Math.max(1,Math.min(5,s.scale*Math.hypot(a.x-b.x,a.y-b.y)/s.distance));
   commit({scale,x:(a.x+b.x)/2-r.left-s.worldX*scale,y:(a.y+b.y)/2-r.top-s.worldY*scale});
  }else if(points.length===1&&current.current.scale===1){
   if(down.current&&Math.hypot(e.clientX-down.current.x,e.clientY-down.current.y)>8){
    moved.current=true;onGesture();
    if(e.pointerType==='touch'){
     const panel=e.currentTarget.closest<HTMLElement>('[aria-label="Expanded stock market heatmap"]');
     if(panel)panel.scrollTop+=old.y-e.clientY;else window.scrollBy({top:old.y-e.clientY,behavior:'instant' as ScrollBehavior});
    }
   }
  }else if(points.length===1&&current.current.scale>1){
   if(!moved.current&&down.current&&Math.hypot(e.clientX-down.current.x,e.clientY-down.current.y)<5)return;
   moved.current=true;setDragging(true);onGesture();e.currentTarget.setPointerCapture(e.pointerId);
   commit({...current.current,x:current.current.x+e.clientX-old.x,y:current.current.y+e.clientY-old.y});
  }
 }
 function pointerUp(e:React.PointerEvent<HTMLDivElement>){
  if(moved.current)suppressUntil.current=Date.now()+400;
  pointers.current.delete(e.pointerId);start.current=null;
  if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);
  if(!pointers.current.size){setDragging(false);down.current=null}
 }
 return <>
 {enabled&&<div className={styles.zoomTools} aria-label="Map zoom controls"><button aria-label="Zoom out" disabled={transform.scale<=1} onClick={()=>zoom(transform.scale/1.4)}>−</button><span>{Math.round(transform.scale*100)}%</span><button aria-label="Zoom in" disabled={transform.scale>=5} onClick={()=>zoom(transform.scale*1.4)}>+</button><button onClick={reset} disabled={transform.scale===1}>Reset zoom</button><small>Pinch to zoom · drag to pan · Ctrl/⌘ + scroll</small></div>}
 <div ref={viewport} className={styles.zoomViewport} style={enabled?{height,touchAction:'none',cursor:dragging?'grabbing':transform.scale>1?'grab':undefined}:undefined} tabIndex={enabled?0:undefined} role="group" aria-label="Zoomable heatmap" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp} onClickCapture={e=>{if(Date.now()<suppressUntil.current){e.preventDefault();e.stopPropagation()}}} onKeyDown={e=>{
  if(!enabled||e.target!==e.currentTarget)return;
  if(['+','=','-','0','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){
   e.preventDefault();if(e.key==='0')reset();else if(e.key==='+'||e.key==='=')zoom(current.current.scale*1.4);else if(e.key==='-')zoom(current.current.scale/1.4);else {const delta=50;commit({...current.current,x:current.current.x+(e.key==='ArrowLeft'?delta:e.key==='ArrowRight'?-delta:0),y:current.current.y+(e.key==='ArrowUp'?delta:e.key==='ArrowDown'?-delta:0)});onGesture()}
  }
 }}><div className={styles.zoomCanvas} style={enabled?{width,height,transform:`translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,transformOrigin:'0 0',pointerEvents:dragging?'none':undefined}:undefined}>{children}</div></div>
 </>;
}
