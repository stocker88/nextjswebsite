import type {CSSProperties} from 'react';

/** Reversible viewport progress: assemble before the plot reaches the reading area. */
export function heatmapAssemblyProgress(top:number,viewportHeight:number){
 const height=Math.max(1,viewportHeight);
 const progress=Math.max(0,Math.min(1,(height*.96-top)/(height*.66)));
 return progress*progress*(3-2*progress);
}

/** Stable per-symbol scatter, so resizing or changing periods never randomizes tiles. */
export function heatmapPieceMotion(symbol:string,x:number,y:number,width:number,height:number,mobile:boolean):CSSProperties{
 let hash=0;for(const char of symbol)hash=(hash*31+char.charCodeAt(0))>>>0;
 const dx=(x/Math.max(1,width)-.5)*2,dy=(y/Math.max(1,height)-.5)*2;
 const distance=mobile?32:100;
 const delay=(hash%5)*.035;
 return {
  '--piece-x':`${(dx*distance+((hash%19)-9)*(mobile?1:2)).toFixed(2)}px`,
  '--piece-y':`${(dy*distance*.7+((hash%13)-6)*(mobile?1.5:3)).toFixed(2)}px`,
  '--piece-turn':`${((hash%17)-8)*(mobile?.35:1)}deg`,
  '--piece-delay':delay,
  '--piece-rate':1/(1-delay),
 } as CSSProperties;
}
