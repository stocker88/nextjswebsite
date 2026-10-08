import Link from 'next/link';
import ResearchPage from '../../components/ResearchPage';
import ResearchCTA from '../../components/ResearchCTA';
import {catalog} from '../../lib/catalog';
import {recentStockNews} from '../../lib/stocks';
import {fetchResearch} from '../../lib/research-server';
import {ResearchPreview,researchUrl} from '../../lib/research';
import {displayDate} from '../../lib/seo';
export default function Instrument({item,news}:{item:typeof catalog[number];news:ResearchPreview[]}){
return <ResearchPage title={`${item.name} (${item.symbol}): profile and research`} path={`/instruments/${encodeURIComponent(item.symbol)}`} noindex><div className="public-copy"><Link href="/stocks">← Search stocks</Link><h1>{item.name} ({item.symbol})</h1><dl><dt>Symbol</dt><dd>{item.symbol}</dd>{item.sector&&<><dt>Sector</dt><dd>{item.sector}</dd></>}{item.industry&&<><dt>Industry</dt><dd>{item.industry}</dd></>}{item.type&&<><dt>Instrument type</dt><dd>{item.type}</dd></>}</dl><p>Profile information from the app’s catalog. This is not a live quote or confirmation of current listing status.</p>{news.length >= 5 && <><h2>Related research</h2>{news.map(n=><p key={n.id}><Link href={researchUrl(n.id, n.title)}>{n.title}</Link><br/><small>{displayDate(n.time)}</small></p>)} </>}<ResearchCTA placement="catalog_profile"/></div></ResearchPage>;
}
export function getStaticPaths(){return {paths:[],fallback:'blocking'};}
export async function getStaticProps({params}:any){const item=catalog.find(i=>i.symbol===params.symbol);if(!item)return {notFound:true};return {props:{item,news:recentStockNews(await fetchResearch(),item.symbol)},revalidate:60};}
