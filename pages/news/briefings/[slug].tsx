import MarketBriefingPage from '../../../components/MarketBriefingPage';import {briefings} from '../../../lib/market-briefings';export default MarketBriefingPage;
export function getStaticPaths(){return {paths:briefings.filter(a=>a.kind==='premarket').map(a=>({params:{slug:a.slug}})),fallback:false};}
export function getStaticProps({params}:any){const article=briefings.find(a=>a.kind==='premarket'&&a.slug===params.slug);return article?{props:{article,bundle:null,calendar:null}}:{notFound:true};}
