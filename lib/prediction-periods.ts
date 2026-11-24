import type {Detail} from './earnings';
import {predictionPath,predictionStocks} from './stock-predictions';
export const scenarioSymbols=['NVDA','MU','SNDK','TSLA'];
export const periods=[{id:'today',label:'Today'},{id:'tomorrow',label:'Next session'},{id:'next-week',label:'Next week'},{id:'next-month',label:'Next month'},...['2026','2027','2028','2029','2030'].map(id=>({id,label:id==='2026'?'End of 2026':id}))];
export const scenarioStocks=predictionStocks.filter(s=>scenarioSymbols.includes(s.ticker));
export const periodPath=(stock:typeof predictionStocks[number],period:string)=>predictionPath(stock)+'/'+period+'/';
export const readableDate=(s:string)=>new Date(s.slice(0,10)+'T12:00:00Z').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'});
export const roundedPrice=(n:number)=>'$'+(Math.round(n/(n>=100?5:n>=10?1:0.01))*(n>=100?5:n>=10?1:0.01)).toLocaleString('en-US',{maximumFractionDigits:n<10?2:0});
function marketHoliday(day:string){
 const y=Number(day.slice(0,4)),iso=(d:Date)=>d.toISOString().slice(0,10);
 const observed=(year:number,month:number,date:number)=>{const d=new Date(Date.UTC(year,month,date));if(d.getUTCDay()===6)d.setUTCDate(d.getUTCDate()-1);if(d.getUTCDay()===0)d.setUTCDate(d.getUTCDate()+1);return iso(d);};
 const nth=(month:number,weekday:number,n:number)=>{const d=new Date(Date.UTC(y,month,1));d.setUTCDate(1+(weekday-d.getUTCDay()+7)%7+7*(n-1));return iso(d);};
 const memorial=new Date(Date.UTC(y,4,31));while(memorial.getUTCDay()!==1)memorial.setUTCDate(memorial.getUTCDate()-1);
 const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),month=Math.floor((h+l-7*m+114)/31),date=(h+l-7*m+114)%31+1;
 const friday=new Date(Date.UTC(y,month-1,date-2));
 const newYear=(year:number)=>{const d=new Date(Date.UTC(year,0,1));return d.getUTCDay()===6?iso(d):observed(year,0,1);};
 return [newYear(y),newYear(y+1),nth(0,1,3),nth(1,1,3),iso(friday),iso(memorial),observed(y,5,19),observed(y,6,4),nth(8,1,1),nth(10,4,4),observed(y,11,25)].includes(day);
}
export function horizonEnd(period:string,today:string){
 if(/^20\d\d$/.test(period))return period+'-12-31';
 const date=new Date(today+'T12:00:00Z');
 if(period==='next-month')date.setUTCMonth(date.getUTCMonth()+1);
 else date.setUTCDate(date.getUTCDate()+(period==='next-week'?7:period==='tomorrow'?1:0));
 // Scheduled U.S. exchange closures; unscheduled closures cannot be predicted.
 if(period==='tomorrow')while([0,6].includes(date.getUTCDay())||marketHoliday(date.toISOString().slice(0,10)))date.setUTCDate(date.getUTCDate()+1);
 return date.toISOString().slice(0,10);
}
export const scenarios=[{name:'Lower illustration',growth:-5,valuation:-5,color:'#fb7185'},{name:'Central illustration',growth:10,valuation:-3,color:'#c4a7ff'},{name:'Higher illustration',growth:20,valuation:0,color:'#56d9bc'}];
export function growthPrice(price:number,years:number,growth:number,valuation:number){return price*Math.pow(1+growth/100,years)*Math.pow(1+valuation/100,years);}
export function volatility(detail:Detail|null,asOf:string):number|null{
 const points=(detail?.prices||[]).filter(p=>p.date<=asOf&&p.close>0).sort((a,b)=>a.date.localeCompare(b.date)).slice(-61);
 if(points.length<31)return null;
 const returns=points.slice(1).map((p,i)=>Math.log(p.close/points[i].close));
 // Do not build a range across a possible unadjusted split or bad quote.
 if(returns.some(r=>Math.abs(r)>Math.log(1.5)))return null;
 const mean=returns.reduce((a,b)=>a+b,0)/returns.length;
 return Math.sqrt(returns.reduce((a,b)=>a+(b-mean)**2,0)/(returns.length-1));
}
export const upside2030:Record<string,number>={NVDA:400,MU:2000,SNDK:250,TSLA:1000};
export function requiredGrowth(price:number,target:number,years:number,valuation=-3){return (Math.pow(target/price,1/years)/(1+valuation/100)-1)*100;}
export function projection(detail:Detail|null,period:string,today:string,growth?:number,valuation=-3){
 const price=detail?.price,date=detail?.priceDate;
 if(!price||!Number.isFinite(price)||price<=0||!date||!Number.isFinite(Date.parse(date))||date>today||Date.parse(today)-Date.parse(date)>7*86400000)return null;
 const end=horizonEnd(period,today),days=(Date.parse(end)-Date.parse(date))/86400000;
 if(days<=0||period==='today')return null;
 const long=days>180,sigma=volatility(detail,date),years=days/365.25;
 if(!long&&sigma===null)return null;
 const target=period==='2030'?upside2030[detail!.symbol]||null:null;
 const stretch=target?Math.ceil(target*1.25/50)*50:null;
 const defaultGrowth=target?requiredGrowth(price,target,years,-3):10;
 const growthRates=[-5,growth??defaultGrowth,stretch?requiredGrowth(price,stretch,years,0):20];
 const valuationRates=[-5,valuation,0];
 const labels=target?['Downside illustration','Upside scenario','Stretch scenario']:scenarios.map(s=>s.name);
 const value=(fraction:number,index:number)=>long?growthPrice(price,years*fraction,growthRates[index],valuationRates[index]):price*Math.exp((index-1)*sigma!*Math.sqrt(days*5/7*fraction));
 return {end,long,years,price,date,sigma,target,stretch,defaultGrowth,growthRates,valuationRates,labels,values:[0,1,2].map(i=>value(1,i)),points:Array.from({length:25},(_,i)=>({date:new Date(Date.parse(date)+days*86400000*i/24).toISOString().slice(0,10),low:value(i/24,0),central:value(i/24,1),high:value(i/24,2)}))};
}
export function historyForPeriod(detail:Detail|null,period:string,asOf:string){
 const cutoff=new Date(asOf+'T12:00:00Z');
 if(/^20\d\d$/.test(period))cutoff.setUTCFullYear(cutoff.getUTCFullYear()-3);
 else if(period==='next-month')cutoff.setUTCFullYear(cutoff.getUTCFullYear()-1);
 else cutoff.setUTCMonth(cutoff.getUTCMonth()-(period==='next-week'?6:3));
 const start=cutoff.toISOString().slice(0,10);
 return (detail?.prices||[]).filter(p=>p.date>=start&&p.date<=asOf&&Number.isFinite(p.close)&&p.close>0).sort((a,b)=>a.date.localeCompare(b.date));
}
export function predictionContext(stock:typeof predictionStocks[number],detail:Detail|null){
 return companyContext[stock.ticker]||{focus:`${detail?.industry||detail?.sector||stock.name} fundamentals and the expectations reflected in the stock price`,up:'Sustained revenue growth, stronger margins and cash generation can support higher earnings per share.',down:'Weaker demand, margin pressure, dilution or a lower valuation multiple can offset growth.',check:`For ${stock.ticker}, review ${stock.drivers.slice(0,3).join(', ').toLowerCase()}. Compare recent earnings with expectations and test the effect of valuation changes.`,source:stock.investorUrl||`https://www.nasdaq.com/market-activity/stocks/${stock.ticker.toLowerCase()}/earnings`};
}
export const companyContext:Record<string,{focus:string;up:string;down:string;check:string;source:string}>={
 NVDA:{focus:'AI infrastructure demand and the price investors pay for future earnings',up:'Stronger accelerator demand, software adoption and sustained margins can support earnings per share.',down:'Customer capital-spending cuts, competing chips, export restrictions or a lower earnings multiple can offset growth.',check:'Compare data-center revenue, gross margins, customer concentration and cash flow with the assumptions below.',source:'https://investor.nvidia.com/'},
 MU:{focus:'Memory pricing, high-bandwidth memory and the semiconductor cycle',up:'Higher memory selling prices and a richer product mix can raise margins and earnings.',down:'A supply-driven downturn or heavy investment can compress cash flow even while shipment volumes grow.',check:'Compare DRAM and NAND pricing, high-bandwidth memory demand, margins and capital expenditure. Do not extend peak-cycle earnings indefinitely.',source:'https://investors.micron.com/'},
 SNDK:{focus:'NAND prices, storage demand and sustainable margins',up:'Improving NAND prices, enterprise storage demand and manufacturing efficiency can support profitability.',down:'Excess supply, weaker pricing and investment needs can reverse margin gains.',check:'Separate higher unit shipments from price increases. Check corporate actions and earnings definitions before comparing valuation ratios.',source:'https://investor.sandisk.com/'},
 TSLA:{focus:'Automotive cash flow and the expectations embedded in new businesses',up:'Improved vehicle economics and profitable expansion of energy and other businesses can support earnings growth.',down:'Price competition, investment spending and delayed commercialization can disappoint expectations already reflected in the stock.',check:'Compare automotive margins, deliveries, energy cash flow, dilution and investment spending; distinguish operating results from optional future businesses.',source:'https://ir.tesla.com/'},
};
