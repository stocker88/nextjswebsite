import useChartEntrance from '../useChartEntrance';
import ChartReveal from '../ChartReveal';
import {useEffect,useId,useRef,useState} from 'react';
import {Leg,expirationPnl,usd} from '../../lib/options-strategies';
import styles from './OptionsTools.module.css';
const axisMoney=(v:number)=>{const n=Math.abs(v),scale=n>=1e6?1e6:n>=1000?1000:1,suffix=scale===1e6?'M':scale===1000?'K':'';return (v<0?'-':'')+'$'+(n/scale).toFixed(scale===1?0:1).replace(/\.0$/,'')+suffix};
export default function ExpirationChart({legs,fee=0,low=60,high=140,price,onPriceChange,mini=false}:{legs:Leg[];fee?:number;low?:number;high?:number;price?:number;onPriceChange?:(price:number)=>void;mini?:boolean}){
 const id=useId().replace(/:/g,'');const ref=useRef<SVGSVGElement>(null),[w,setWidth]=useState(700);
 useChartEntrance(ref);
 useEffect(()=>{const el=ref.current;if(!el)return;const observer=new ResizeObserver(([entry])=>setWidth(Math.max(260,entry.contentRect.width)));observer.observe(el);return()=>observer.disconnect()},[]);
 const h=mini?150:330,left=mini?4:w<450?58:78,right=mini?4:26,top=20,bottom=mini?6:48;
 const xs=Array.from(new Set([...Array.from({length:101},(_,i)=>low+(high-low)*i/100),...legs.filter(l=>l.type!=='stock'&&l.strike>low&&l.strike<high).map(l=>l.strike)])).sort((a,b)=>a-b);
 const ys=xs.map(p=>expirationPnl(legs,p,fee));const min=Math.min(0,...ys),max=Math.max(0,...ys),pad=Math.max((max-min)*.12,1),ymin=min-pad,ymax=max+pad;
 const x=(p:number)=>left+(p-low)/(high-low)*(w-left-right),y=(v:number)=>top+(ymax-v)/(ymax-ymin)*(h-top-bottom);
 const line=xs.map((p,i)=>`${i?'L':'M'}${x(p)},${y(ys[i])}`).join(' '),area=`${line} L${x(high)},${y(0)} L${x(low)},${y(0)} Z`;
 const interactive=!mini&&!!onPriceChange;
 const pickPrice=(el:SVGSVGElement,clientX:number,clientY:number)=>{
  const matrix=el.getScreenCTM();if(!matrix)return;
  const point=new DOMPoint(clientX,clientY).matrixTransform(matrix.inverse());
  const fraction=Math.max(0,Math.min(1,(point.x-left)/(w-left-right)));
  onPriceChange?.(Math.round((low+fraction*(high-low))*100)/100);
 };
 return <svg ref={ref} tabIndex={interactive?0:undefined}
 onPointerDown={interactive?e=>{if(e.button!==0)return;e.preventDefault();e.currentTarget.dataset.pointerFocus="true";e.currentTarget.focus();e.currentTarget.setPointerCapture(e.pointerId);pickPrice(e.currentTarget,e.clientX,e.clientY)}:undefined}
 onPointerMove={interactive?e=>{if(e.currentTarget.hasPointerCapture(e.pointerId))pickPrice(e.currentTarget,e.clientX,e.clientY)}:undefined}
 onPointerUp={interactive?e=>{if(e.currentTarget.hasPointerCapture(e.pointerId)){pickPrice(e.currentTarget,e.clientX,e.clientY);e.currentTarget.releasePointerCapture(e.pointerId)}}:undefined}
 onPointerCancel={interactive?e=>{if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId)}:undefined}
 onKeyDown={interactive?e=>{delete e.currentTarget.dataset.pointerFocus;const step=(high-low)/100;let next=price??low;if(e.key==='ArrowRight'||e.key==='ArrowUp')next+=step;else if(e.key==='ArrowLeft'||e.key==='ArrowDown')next-=step;else if(e.key==='Home')next=low;else if(e.key==='End')next=high;else return;e.preventDefault();onPriceChange?.(Math.round(Math.max(low,Math.min(high,next))*100)/100)}:undefined}
 onBlur={e=>{delete e.currentTarget.dataset.pointerFocus}} aria-valuemin={interactive?low:undefined} aria-valuemax={interactive?high:undefined} aria-valuenow={interactive?price:undefined}
 className={mini?styles.miniChart:styles.chart} viewBox={`0 0 ${w} ${h}`} role={interactive?"slider":"img"} aria-label={mini?'Illustrative expiration payoff shape':'Profit and loss at expiration across underlying prices'} preserveAspectRatio={mini?'none':'xMidYMid meet'}><defs><clipPath id={id+'pos'}><rect x="0" y="0" width={w} height={y(0)}/></clipPath><clipPath id={id+'neg'}><rect x="0" y={y(0)} width={w} height={h-y(0)}/></clipPath></defs>
 {!mini&&[0,.5,1].map(t=>{const v=min+(max-min)*t;return <g key={t}><line x1={left} x2={w-right} y1={y(v)} y2={y(v)} stroke="#29364d"/><text x={left-10} y={y(v)+4} textAnchor="end" fill="#9cacc2" fontSize="12">{axisMoney(v)}</text></g>})}
 <line x1={left} x2={w-right} y1={y(0)} y2={y(0)} stroke="#637187" strokeDasharray="4 5"/>
 <ChartReveal width={w} height={h}><path d={area} fill="#68d9b7" opacity=".13" clipPath={`url(#${id}pos)`}/><path d={area} fill="#fb7898" opacity=".12" clipPath={`url(#${id}neg)`}/><path d={line} fill="none" stroke="#86dec4" strokeWidth={mini?3:3.5} clipPath={`url(#${id}pos)`}/><path d={line} fill="none" stroke="#fb8fa8" strokeWidth={mini?3:3.5} clipPath={`url(#${id}neg)`}/></ChartReveal>
 {!mini&&(w<450?[0,.5,1]:[0,.25,.5,.75,1]).map(t=>{const p=low+(high-low)*t;return <text key={t} x={x(p)} y={h-22} textAnchor="middle" fontSize="12" fill="#9cacc2">{usd(p)}</text>})}
 {!mini&&price!==undefined&&<g><line x1={x(price)} x2={x(price)} y1={top} y2={h-bottom} stroke="#bea8ff" strokeDasharray="4 4"/><circle cx={x(price)} cy={y(expirationPnl(legs,price,fee))} r="5" fill="#bea8ff" stroke="#080e1c" strokeWidth="2"/></g>}
 </svg>
}
