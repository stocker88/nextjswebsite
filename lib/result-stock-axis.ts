/** Keep stock prices increasing left-to-right, including falling-stock puts. */
export function resultStockAxis(before:number, after:number) {
 const minimum=Math.min(before,after), maximum=Math.max(before,after), falling=after<before;
 return {minimum, maximum, falling,
  comparisonFraction:(screenFraction:number)=>falling?1-screenFraction:screenFraction,
  fraction:(stock:number)=>(stock-minimum)/(maximum-minimum||1),
 };
}
