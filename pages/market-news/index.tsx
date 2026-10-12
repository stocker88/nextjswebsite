import ResearchPage from '../../components/ResearchPage';
import MarketFeedTabs from '../../components/MarketFeedTabs';
import MarketNewsFeed from '../../components/MarketNewsFeed';
export default function MarketNews(){return <ResearchPage title="Latest Stock Market News Headlines" path="/market-news/" description="Browse the latest stock market headlines by company, ticker and publisher. Updated every 30 minutes."><div className="hero"><span className="eyebrow">MARKET HEADLINES</span><h1>Stock market news</h1><p>The latest headlines, alongside our original research.</p></div><MarketFeedTabs active="news"/><MarketNewsFeed/></ResearchPage>}
