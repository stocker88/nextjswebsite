import MarketInsightCard from './MarketInsightCard';
import CatalystNewsCard from './CatalystNewsCard';
import {isMarketBriefing,type Briefing} from '../lib/market-briefings';
export default function BriefingCards({items}:{items:Briefing[]}){
 return <><div className="briefing-cards">{items.map(a=>isMarketBriefing(a)?<MarketInsightCard key={a.id} article={a}/>:<CatalystNewsCard key={a.id} article={a}/>)}</div>
 <style jsx>{`.briefing-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px;margin:24px 0}@media(max-width:700px){.briefing-cards{grid-template-columns:1fr;gap:18px}}`}</style></>;
}
