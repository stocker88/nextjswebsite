import {stocks} from './stocks';
import {catalog} from './catalog';
type Stock = (typeof stocks)[number];
const curated = new Map(stocks.map(stock => [stock.ticker, stock]));
const sectorDrivers:Record<string,string[]> = {
 Technology:['Revenue growth and customer demand','Operating margins and research spending','Capital expenditure and free cash flow','Competition and product cycles','Valuation and share dilution'],
 Healthcare:['Product demand and revenue growth','Research costs and operating margins','Regulatory decisions and clinical milestones','Competition and patent exposure','Cash generation and financing needs'],
 'Financial Services':['Revenue mix and customer activity','Credit quality and loss provisions','Interest rates and funding costs','Capital adequacy and regulation','Valuation and shareholder distributions'],
 Energy:['Commodity prices and demand','Production volumes and operating costs','Capital spending and cash generation','Hedging and operational risks','Debt and shareholder distributions'],
 Utilities:['Customer demand and regulated revenues','Operating costs and allowed returns','Capital investment and financing costs','Regulatory decisions and reliability','Debt and dividend coverage'],
 'Real Estate':['Occupancy and rental income','Property expenses and operating cash flow','Interest rates and refinancing needs','Property demand and asset valuations','Debt and distribution coverage'],
};
const defaultDrivers=['Revenue growth and demand','Operating margins and cost pressures','Cash flow and capital investment','Competition and industry conditions','Debt, valuation and share dilution'];
export const predictionStocks:Stock[] = [
 ...stocks,
 ...catalog.filter(item=>item.type==='EQUITY'&&!curated.has(item.symbol)).map(item=>({
  slug:item.symbol.toLowerCase(),ticker:item.symbol,name:item.name,
  investorUrl:'',earningsUrl:'',
  overview:`${item.name} (${item.symbol}) is listed in our stock directory${item.industry ? ` under ${item.industry}` : ''}${item.sector ? ` in the ${item.sector} sector` : ''}. Review the available dated company research, financial history and market context below to assess a price outlook.`,
  drivers:sectorDrivers[item.sector]||defaultDrivers,
 }))
];
type PredictionIdentity=Pick<Stock,'ticker'|'slug'|'name'>;
export const predictionName = (stock: PredictionIdentity) => stock.ticker === 'GOOGL' ? 'Google (Alphabet)' : stock.name;
const clean=(value:string)=>value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export const predictionSlug = (stock: PredictionIdentity) => {
 // Keep the original twelve published URLs stable; other listings include the exact ticker.
 if(curated.has(stock.ticker))return (stock.ticker==='GOOGL'?'google':clean(stock.name))+'-stock-price-prediction';
 const symbol=stock.ticker.toLowerCase().replace(/[^a-z0-9-]/g,c=>'-'+c.charCodeAt(0).toString(16)+'-');
 // Cache-only companies use a permanent ticker URL even if provider display names change.
 if(stock.slug==='cached-'+stock.ticker.toLowerCase())return symbol+'-stock-price-prediction';
 return clean(stock.name)+'-'+symbol+'-stock-price-prediction';
};
export const predictionPath = (stock: PredictionIdentity) => '/prediction/' + predictionSlug(stock);
const bySymbol=new Map(predictionStocks.map(stock=>[stock.ticker,stock]));
export function stockPredictionHref(symbol:string){const stock=bySymbol.get(symbol);return stock?predictionPath(stock):null;}
