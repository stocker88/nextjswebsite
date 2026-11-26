import {siteNavigation} from '../lib/site-navigation';
import TradingToolsHub from '../components/TradingToolsHub';
import {workflows} from '../lib/trading-workflows';
import {toolAssets,toolPairs} from '../lib/seo-tools-server';
export default TradingToolsHub;
// Reuse menu labels and destinations so the directory stays consistent.
const featuredPaths = [
 '/stock-market-heatmap/', '/premarket-stock-heatmap/', '/after-hours-stock-heatmap/',
 '/fear-and-greed-index/', '/hormuz-transit-index/', '/pentagon-pizza-index/',
 '/stock-market-news/', '/earnings-calendar/', '/ipo-calendar/', '/stock-market-calendar/',
 '/industries/', '/stocks-to-buy/', '/insider-news/', '/results/',
];
const featuredTools = featuredPaths.map(path => {
 const item = siteNavigation.find(item => item.href === path)!;
 return {name:item.label,path:item.href,detail:item.detail};
});
export function getStaticProps(){const assets=toolAssets();return {props:{title:'Trading Tools',description:'Explore stock heatmaps, market news, earnings and economic calendars, predictions, industry comparisons, insider activity and trading calculators.',path:'/trading-tools/',items:[...featuredTools,{name:'Stock Price Predictions',path:'/prediction/',detail:'Search company outlooks and scenarios'},{name:'Track Record',path:'/methodology/',detail:'Explore historical signal returns and the SPY comparison'},{name:'Stock research & technical analysis',path:'/stocks/',detail:assets.filter(a=>a.kind==='stock').length+' stocks with price history'},{name:'Stock performance comparisons',path:'/stock-comparison/',detail:toolPairs().length+' pairs with matching historical dates'},{name:'Crypto price scenarios',path:'/crypto-prediction/',detail:assets.filter(a=>a.kind==='crypto').length+' assets'},{name:'Forex exchange-rate scenarios',path:'/forex-prediction/',detail:assets.filter(a=>a.kind==='forex').length+' pairs'},{name:'Position size calculator',path:'/tools/position-size-calculator/'},{name:'Forex pip value calculator',path:'/tools/forex-pip-value-calculator/'},{name:'Futures tick value calculator',path:'/tools/futures-tick-value-calculator/'},{name:'Options profit calculator',path:'/options-profit-calculator/'},{name:'Unusual options activity',path:'/options-activity/'},...workflows.map(g=>({name:g.title,path:'/trading-guides/'+g.slug+'/',detail:g.description}))]}};}
