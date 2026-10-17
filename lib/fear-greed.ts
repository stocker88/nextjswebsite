export const CNN_URL = 'https://www.cnn.com/markets/fear-and-greed';
export const indicators = [
 ['market_momentum_sp500','Market momentum','How the S&P 500 compares with its recent trend.'],
 ['stock_price_strength','Stock price strength','The balance between stocks reaching new highs and new lows.'],
 ['stock_price_breadth','Market breadth','Trading activity in advancing versus declining stocks.'],
 ['put_call_options','Put and call options','The balance of put and call option activity.'],
 ['market_volatility_vix','Market volatility','Expected market volatility, measured with the VIX.'],
 ['safe_haven_demand','Safe-haven demand','Stock performance compared with Treasury bonds.'],
 ['junk_bond_demand','Junk-bond demand','Demand for riskier debt relative to safer bonds.'],
] as const;
export function score(value:unknown):number|null{return typeof value==='number'&&Number.isFinite(value)&&value>=0&&value<=100?value:null;}
export function rating(value:number|null){return value===null?'Reading unavailable':value<25?'Extreme fear':value<45?'Fear':value<=55?'Neutral':value<=75?'Greed':'Extreme greed';}
export function color(value:number|null){return value===null?'#899bb4':value<25?'#f17886':value<45?'#efa46b':value<=55?'#e7cc7b':value<=75?'#8bd8bf':'#42c99a';}
export function normalizeFearGreed(raw:any){
 const f=raw?.fear_and_greed;
 if(score(f?.score)===null||typeof f?.timestamp!=='string'||!Number.isFinite(Date.parse(f.timestamp)))return null;
 const timestamp=new Date(f.timestamp).toISOString();
 return {score:score(f.score)!,timestamp,previousClose:score(f.previous_close),weekAgo:score(f.previous_1_week),monthAgo:score(f.previous_1_month),yearAgo:score(f.previous_1_year),
 indicators:indicators.map(([key])=>({key,score:score(raw[key]?.score)})),
 history:(Array.isArray(raw?.fear_and_greed_historical?.data)?raw.fear_and_greed_historical.data:[])
  .filter((p:any)=>typeof p?.x==='number'&&Number.isFinite(p.x)&&p.x>0&&p.x<=Date.parse(timestamp)&&score(p.y)!==null)
  .map((p:any)=>({date:new Date(p.x).toISOString(),value:p.y as number}))
  .sort((a:any,b:any)=>a.date.localeCompare(b.date))};
}
export const FINICA_URL = 'https://finica.io/api/fear-greed';
export type FearGreedSnapshot=NonNullable<ReturnType<typeof normalizeFearGreed>> & {
 source?: 'finica'; fetchedAt?: string; dateOnly?: boolean;
};
/** Finica supplies daily dates, not a precise CNN publication timestamp. */
export function normalizeFinicaFearGreed(raw:any, now = new Date()):FearGreedSnapshot|null {
 if(score(raw?.score)===null || !Array.isArray(raw?.historical))return null;
 const historyByDate=new Map<string,number>();
 for(const p of raw.historical){
  if(typeof p?.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(p.date)||score(p.value)===null)continue;
  const ms=Date.parse(p.date+'T00:00:00Z');
  if(!Number.isFinite(ms)||new Date(ms).toISOString().slice(0,10)!==p.date||ms>now.getTime())continue;
  historyByDate.set(p.date,p.value);
 }
 const history=Array.from(historyByDate,([date,value])=>({date:date+'T00:00:00.000Z',value})).sort((a,b)=>a.date.localeCompare(b.date));
 const latest=history[history.length-1];
 if(!latest||latest.value!==raw.score)return null;
 const names=['Market Momentum','Stock Price Strength','Stock Price Breadth','Put/Call Ratio','Market Volatility','Safe Haven Demand','Junk Bond Demand'];
 const components=Array.isArray(raw.components)?raw.components:[];
 const previous=(days:number)=>{
  const target=Date.parse(latest.date)-days*86400000;
  const point=[...history].reverse().find(p=>Date.parse(p.date)<=target);
  return point&&target-Date.parse(point.date)<=4*86400000?point.value:null;
 };
 return {score:raw.score,timestamp:latest.date,dateOnly:true,source:'finica',fetchedAt:now.toISOString(),
  previousClose:score(raw.previousClose),weekAgo:previous(7),monthAgo:previous(30),yearAgo:previous(365),history,
  indicators:indicators.map(([key],i)=>({key,score:score(components.find((c:any)=>c?.name===names[i])?.value)}))};
}
