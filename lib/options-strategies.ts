export type Leg = {type:'call'|'put'|'stock'; side:'buy'|'sell'; strike:number; premium:number; quantity:number};
export type Strategy = {id:string; name:string; outlook:'Bullish'|'Bearish'|'Neutral'|'Big move'; description:string; risk:string; legs:Leg[]};
const option=(type:'call'|'put',side:'buy'|'sell',strike:number,premium:number,quantity=1):Leg=>({type,side,strike,premium,quantity});
const shares:Leg={type:'stock',side:'buy',strike:0,premium:100,quantity:100};
// Illustrative premiums for a $100 underlying, never market quotes.
export const strategies:Strategy[]=[
 {id:'long-call',name:'Long call',outlook:'Bullish',description:'Pay a premium for upside exposure. At expiration, the stock must rise past the strike plus the premium to break even.',risk:'The entire premium can be lost.',legs:[option('call','buy',100,5)]},
 {id:'long-put',name:'Long put',outlook:'Bearish',description:'Pay a premium for downside exposure. A larger fall increases the payoff, with gains capped if the stock reaches zero.',risk:'The entire premium can be lost.',legs:[option('put','buy',100,5)]},
 {id:'bull-call-spread',name:'Call debit spread',outlook:'Bullish',description:'Buy a call and sell a higher-strike call with the same expiry. The short call reduces the cost and caps the upside.',risk:'Both the potential gain and loss are capped at expiration.',legs:[option('call','buy',95,8),option('call','sell',105,3)]},
 {id:'bear-put-spread',name:'Put debit spread',outlook:'Bearish',description:'Buy a put and sell a lower-strike put with the same expiry. Express a bearish view with a defined expiration payoff.',risk:'Both the potential gain and loss are capped at expiration.',legs:[option('put','buy',105,8),option('put','sell',95,3)]},
 {id:'bull-put-spread',name:'Put credit spread',outlook:'Bullish',description:'Sell a put and buy a lower-strike put. Keep the net credit if both options expire out of the money.',risk:'Loss can exceed the credit received, but is capped at expiration.',legs:[option('put','sell',95,3),option('put','buy',90,1)]},
 {id:'bear-call-spread',name:'Call credit spread',outlook:'Bearish',description:'Sell a call and buy a higher-strike call. Keep the net credit if the stock finishes below the short strike.',risk:'Loss can exceed the credit received, but is capped at expiration.',legs:[option('call','sell',105,3),option('call','buy',110,1)]},
 {id:'covered-call',name:'Covered call',outlook:'Neutral',description:'Hold 100 shares and sell one call. The premium cushions a small decline in exchange for capping the stock’s upside.',risk:'The shares retain substantial downside risk.',legs:[shares,option('call','sell',105,3)]},
 {id:'protective-put',name:'Protective put',outlook:'Bullish',description:'Hold shares and buy a put to establish an expiration loss floor. The insurance premium reduces the net return.',risk:'Protection expires with the put.',legs:[shares,option('put','buy',95,3)]},
 {id:'long-straddle',name:'Long straddle',outlook:'Big move',description:'Buy a call and put at the same strike and expiry. The stock must move far enough in either direction to cover both premiums.',risk:'A small move can leave both premiums at risk.',legs:[option('call','buy',100,5),option('put','buy',100,5)]},
 {id:'long-strangle',name:'Long strangle',outlook:'Big move',description:'Buy a lower-strike put and higher-strike call. The wider strikes usually require a bigger move to reach breakeven.',risk:'Both premiums can be lost if the stock stays between the strikes.',legs:[option('put','buy',95,3),option('call','buy',105,3)]},
 {id:'iron-condor',name:'Iron condor',outlook:'Neutral',description:'Combine a put credit spread and call credit spread. The maximum expiration profit occurs between the two short strikes.',risk:'Either wing can lose money; the expiration loss is capped.',legs:[option('put','buy',90,1),option('put','sell',95,3),option('call','sell',105,3),option('call','buy',110,1)]},
 {id:'call-butterfly',name:'Call butterfly',outlook:'Neutral',description:'Buy one lower call, sell two middle calls and buy one higher call. The peak expiration payoff is at the middle strike.',risk:'Moving too far from the middle strike can lose the debit.',legs:[option('call','buy',90,12),option('call','sell',100,5,2),option('call','buy',110,1)]},
 {id:'short-put',name:'Short put',outlook:'Bullish',description:'Receive a premium in return for the obligation to buy shares at the strike if assigned. Model the cash needed separately.',risk:'Substantial loss if the stock falls; assignment requires buying shares.',legs:[option('put','sell',95,3)]},
 {id:'short-call',name:'Short call',outlook:'Bearish',description:'Sell a call without shares to cover it. The premium is the maximum gain while upside moves increase the loss.',risk:'Unlimited potential loss. Assignment can create a short stock position.',legs:[option('call','sell',105,3)]},
];
export const copyLegs=(strategy:Strategy)=>strategy.legs.map(l=>({...l}));
export function validateLegs(legs:Leg[],fee=0):string|null {
 if(!legs.length||legs.length>8)return 'Add between 1 and 8 legs.';
 if(!Number.isFinite(fee)||fee<0||fee>1000000)return 'Enter a fee between $0 and $1,000,000.';
 for(const l of legs){
 if(!['call','put','stock'].includes(l.type)||!['buy','sell'].includes(l.side))return 'Choose a valid leg type and side.';
 if(!Number.isInteger(l.quantity)||l.quantity<1||l.quantity>100000)return 'Quantities must be whole numbers between 1 and 100,000.';
 if(!Number.isFinite(l.premium)||l.premium<0||l.premium>1000000)return 'Enter a price between $0 and $1,000,000 for each leg.';
 if(l.type!=='stock'&&(!Number.isFinite(l.strike)||l.strike<=0||l.strike>1000000))return 'Enter a strike above $0 and up to $1,000,000.';
 }return null;
}
export function entryCost(legs:Leg[],fee=0){return legs.reduce((v,l)=>v+(l.side==='buy'?1:-1)*l.premium*l.quantity*(l.type==='stock'?1:100)+(l.type==='stock'?0:fee*l.quantity),0)}
export function expirationPnl(legs:Leg[],price:number,fee=0){return -entryCost(legs,fee)+legs.reduce((v,l)=>v+(l.side==='buy'?1:-1)*l.quantity*(l.type==='stock'?price:100*Math.max(0,l.type==='call'?price-l.strike:l.strike-price)),0)}
export type ZeroRange={from:number;to:number};
export function expirationMetrics(legs:Leg[],fee=0){
 const points=Array.from(new Set([0,...legs.filter(l=>l.type!=='stock').map(l=>l.strike)])).sort((a,b)=>a-b);
 const values=points.map(p=>expirationPnl(legs,p,fee));
 const slope=legs.reduce((v,l)=>v+(l.side==='buy'?1:-1)*l.quantity*(l.type==='stock'?1:l.type==='call'?100:0),0);
 const eps=1e-7,roots:number[]=[],ranges:ZeroRange[]=[];
 points.forEach((p,i)=>{
 const a=values[i];if(Math.abs(a)<eps)roots.push(p);
 if(i<points.length-1){const b=values[i+1],q=points[i+1];if(Math.abs(a)<eps&&Math.abs(b)<eps)ranges.push({from:p,to:q});else if(a*b<0)roots.push(p-a*(q-p)/(b-a));}
 });
 const last=points[points.length-1],value=values[values.length-1];
 if(slope!==0){const root=last-value/slope;if(root>last+eps)roots.push(root)}else if(Math.abs(value)<eps)ranges.push({from:last,to:Infinity});
 const merged:ZeroRange[]=[];for(const r of ranges){const prev=merged[merged.length-1];if(prev&&Math.abs(prev.to-r.from)<eps)prev.to=r.to;else merged.push({...r})}
 return {cost:entryCost(legs,fee),maxProfit:slope>0?Infinity:Math.max(0,...values),maxLoss:slope<0?Infinity:Math.max(0,-Math.min(...values)),breakevens:Array.from(new Set(roots)).filter(p=>!merged.some(r=>p>=r.from-eps&&p<=r.to+eps)).sort((a,b)=>a-b),zeroRanges:merged};
}
export const usd=(v:number)=>Number.isFinite(v)?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(Math.abs(v)<1e-8?0:v):'Unlimited';
export function breakevenText(m:ReturnType<typeof expirationMetrics>){return [...m.breakevens.map(usd),...m.zeroRanges.map(r=>r.to===Infinity?`${usd(r.from)} and above`:`${usd(r.from)}–${usd(r.to)}`)].join(' / ')||'None'}
