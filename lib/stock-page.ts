import stocks from '../data/stocks.json';
const curated=new Map(stocks.map(stock=>[stock.ticker,stock.slug]));
export function stockPageHref(symbol:string){
 const slug=curated.get(symbol);
 return slug?`/stocks/${slug}/`:`/instruments/${encodeURIComponent(symbol)}/`;
}
