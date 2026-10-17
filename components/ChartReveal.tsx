import {CSSProperties,ReactNode,useId} from 'react';
import motion from '../styles/ChartMotion.module.css';

// Reveal only the marks; axes, legends and interactive overlays stay readable.
export default function ChartReveal({width,height,children}:{width:number;height:number;children:ReactNode}){
 const id='chart-reveal-'+useId().replace(/:/g,'');
 return <g><defs><clipPath id={id}><rect className={motion.wipe} x="0" y="0" width={width} height={height} style={{'--chart-width':`${width}px`} as CSSProperties}/></clipPath></defs><g clipPath={`url(#${id})`}>{children}</g></g>;
}
