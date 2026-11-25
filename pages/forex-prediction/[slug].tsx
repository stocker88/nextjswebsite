import AssetAnalysisPage from '../../components/AssetAnalysisPage';
import {toolAssets,toolPairs} from '../../lib/seo-tools-server';
import {assetPath} from '../../lib/seo-tools';
export default AssetAnalysisPage;
export function getStaticPaths(){return {paths:toolAssets().filter(a=>a.kind==='forex').map(a=>({params:{slug:a.slug}})),fallback:false};}
export function getStaticProps({params}:any){const all=toolAssets(),asset=all.find(a=>a.kind==='forex'&&a.slug===params.slug);if(!asset)return {notFound:true};const related=all.filter(a=>a.kind===asset.kind&&a.symbol!==asset.symbol&&(asset.kind!=='stock'||a.industry===asset.industry)).slice(0,6).map(a=>({name:a.name+' ('+a.symbol+')',path:assetPath(a)}));const comparisonLinks=asset.kind==='stock'?toolPairs().filter(p=>p.a.symbol===asset.symbol||p.b.symbol===asset.symbol).slice(0,3).map(p=>({name:p.a.symbol+' vs '+p.b.symbol,path:'/stock-comparison/'+p.slug+'/'})):[];return {props:{asset,related,comparisonLinks}};}
