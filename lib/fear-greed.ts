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
export type FearGreedSnapshot=NonNullable<ReturnType<typeof normalizeFearGreed>>;
