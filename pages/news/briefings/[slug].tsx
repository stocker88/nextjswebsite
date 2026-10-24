import MarketBriefingPage from '../../../components/MarketBriefingPage';import {briefings,isMarketBriefing} from '../../../lib/market-briefings';export default MarketBriefingPage;
export function getStaticPaths(){return {paths:briefings.filter(a=>isMarketBriefing(a)).map(a=>({params:{slug:a.slug}})),fallback:false};}
export function getStaticProps({params}:any){const article=briefings.find(a=>isMarketBriefing(a)&&a.slug===params.slug);return article?{props:{article,bundle:null,calendar:null}}:{notFound:true};}
