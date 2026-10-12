import HeadlinePreview from '../../components/HeadlinePreview';
import {savedNews,newsSlug,Headline} from '../../lib/market-news';
export default function Story({item}:{item:Headline}){return <HeadlinePreview item={item}/>}
export function getStaticPaths(){return {paths:savedNews.items.map(n=>({params:{slug:newsSlug(n)}})),fallback:false}}
export function getStaticProps({params}:{params:{slug:string}}){const item=savedNews.items.find(n=>newsSlug(n)===params.slug);return item?{props:{item}}:{notFound:true}}
