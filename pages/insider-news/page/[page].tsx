export {default} from '../../../components/InsiderNewsArchive';
import {insiderArchiveProps,insiderArticles} from '../../../lib/insider-news-server';
import {insiderPageSize} from '../../../lib/insider-news';
export function getStaticPaths(){return {paths:Array.from({length:Math.max(0,Math.ceil(insiderArticles.length/insiderPageSize)-1)},(_,i)=>({params:{page:String(i+2)}})),fallback:false};}
export function getStaticProps({params}:any){return insiderArchiveProps(Number(params.page));}
