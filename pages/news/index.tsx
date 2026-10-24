import BriefingCards from '../../components/BriefingCards';
import {briefings,isMarketBriefing} from '../../lib/market-briefings';
import ResearchPage from '../../components/ResearchPage';
import MarketFeedTabs from '../../components/MarketFeedTabs';
import MoverNewsCard from '../../components/MoverNewsCard';
import {moverArticles} from '../../lib/mover-research';
export default function MoverNews(){return <ResearchPage title="Stock Movers News and Earnings Results" path="/news/" description="Why stocks are up or down: dated market moves, earnings results, financial infographics and technical research."><h1>Stock movers news and earnings</h1><p>What changed, what companies reported, and the financial and technical context behind the latest stock moves.</p><MarketFeedTabs active="movers"/><BriefingCards items={briefings.filter(a=>isMarketBriefing(a)).slice(0,10)}/>{!moverArticles.length&&<p>New source-checked research will appear here as reports are published.</p>}<div className="articles">{moverArticles.map(a=><MoverNewsCard key={a.id} article={a}/>)}</div><style jsx>{`.articles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}@media(max-width:700px){.articles{grid-template-columns:1fr;gap:18px}}`}</style></ResearchPage>}
