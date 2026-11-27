import Head from 'next/head';
import {useSiteLanguage} from '../../lib/localization/use-site-language';
import {message} from '../../lib/localization/translate';
import ResearchPage from '../ResearchPage';
import PredictionPeriodSelector from '../PredictionPeriodSelector';
import PriceChart from '../earnings/PriceChart';
import EarningsStyles from '../earnings/EarningsStyles';
import StockResearchHub from '../StockResearchHub';
import StockEarnings from '../earnings/StockEarnings';
import StockAppCTA from '../StockAppCTA';
import ShareControl from '../ShareControl';
import {predictionPath,predictionName,type predictionStocks} from '../../lib/stock-predictions';
import type {ResearchBundle} from '../../lib/stock-research';
import type {Calendar} from '../../lib/earnings';
import {predictionSeo} from '../../lib/prediction-seo';
import {jsonLd,SITE} from '../../lib/seo';
export default function LocalizedPredictionOverview({stock,bundle,calendar,predictionPeriodsAvailable}:{stock:typeof predictionStocks[number];bundle:ResearchBundle;calendar:Calendar|null;predictionPeriodsAvailable:boolean}){
 const {language,href,t}=useSiteLanguage();const m=(key:string)=>message(key,language,{name:predictionName(stock),symbol:stock.ticker});
 const name=predictionName(stock),path=href(predictionPath(stock)+'/'),detail=bundle.snapshot?.detail;
 const {title,description}=predictionSeo(name,stock.ticker,undefined,language);
 return <ResearchPage title={title} description={description} path={path} predictionLayout>
 <Head><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd({'@context':'https://schema.org','@type':'WebPage',name:title,description,url:SITE+path,inLanguage:language,about:{'@type':'Corporation',name:stock.name,tickerSymbol:stock.ticker}})}}/></Head>
 <header className="public-copy"><h1>{m('Stock price prediction for {name} ({symbol})')}</h1><p>{m('Review price history, earnings and valuation for {name}. Explore different periods and compare growth assumptions with financial data and competitors.')}</p></header>
 {predictionPeriodsAvailable&&<PredictionPeriodSelector stock={stock}/>}
 {detail&&<div className="earnings-page"><PriceChart data={detail}/><ShareControl title={title} path={path}/><EarningsStyles/></div>}
 <section className="public-copy"><h2>{m('How to research the outlook for {name}')}</h2><p>{t('For short horizons, review news, volume, earnings dates and economic events. For the long term, compare per-share earnings growth, margins, debt and valuation. A strong business can deliver weak returns if its price already reflects excessive expectations.')}</p><h2>{t('Scenarios for 2030 and other periods')}</h2><p>{t('Charts show illustrative scenarios adjustable through growth and valuation controls. They are not guaranteed targets or consensus estimates. Check data dates on the chart and revisit assumptions when company results or prospects change.')}</p></section>
 <StockResearchHub symbol={stock.ticker} name={name} bundle={bundle} afterFinancials={<StockEarnings symbol={stock.ticker} initialCalendar={calendar} detail={detail||undefined} hidePriceChart/>}/>
 <StockAppCTA symbol={stock.ticker} pro/>
 </ResearchPage>;
}
