/** Match the app: include the strike with a little room for expiry value. */
export function resultStockAxis(before:number, after:number, strike?:number, premium=0) {
 const low=Math.min(before,after), high=Math.max(before,after), falling=after<before;
 const padding=Math.max((strike??0)*.025,premium*1.5);
 const minimum=strike!==undefined&&strike<=low?Math.max(0,strike-padding):low;
 const maximum=strike!==undefined&&strike>=high?strike+padding:high;
 return {minimum, maximum, falling,
  comparisonFraction:(screenFraction:number)=>after===before?0:Math.max(0,Math.min(1,(minimum+screenFraction*(maximum-minimum)-before)/(after-before))),
  fraction:(stock:number)=>(stock-minimum)/(maximum-minimum||1),
 };
}
