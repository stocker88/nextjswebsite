import {DesktopActionText} from '../../components/DesktopAppLink';
import ResearchPage from '../../components/ResearchPage';
import MarketFeedTabs from '../../components/MarketFeedTabs';
import MarketNewsFeed from '../../components/MarketNewsFeed';
import NewsMentionsPromo from '../../components/NewsMentionsPromo';
import AppDownloadButton from '../../components/formStocker';

export default function MarketNews(){return <ResearchPage title="Latest Stock Market News Headlines" path="/market-news/" description="Browse the latest stock market headlines by company, ticker and publisher. Updated every 30 minutes.">
  <div className="hero"><span className="eyebrow">MARKET HEADLINES</span><h1>Stock market news</h1><p>The latest headlines, alongside our original research.</p></div>
  <MarketFeedTabs active="news"/>
  <MarketNewsFeed/>
  <NewsMentionsPromo/>
  <div className="hottest-stocks-action">
    <AppDownloadButton popup from="market_news_hottest_stocks" label="Hottest stock now →"/>
    <p><DesktopActionText desktopLabel="Explore the full research">{'Explore in the app · iOS & Android'}</DesktopActionText></p>
  </div>
  <style jsx>{`
    .hottest-stocks-action{text-align:center;margin:30px 0 12px}
    .hottest-stocks-action :global(a.app-download-cta){display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:15px 28px;border:1px solid #c5a5ff;border-radius:999px;background:#c5a5ff;color:#171024!important;font-size:17px;font-weight:750;text-decoration:none}
    .hottest-stocks-action :global(a.app-download-cta:hover){background:#d4bdff}
    .hottest-stocks-action :global(a:focus-visible){outline:2px solid #dfcbff;outline-offset:4px}
    .hottest-stocks-action p{margin:10px 0 0;color:#9eafc9;font-size:12px}
  `}</style>
</ResearchPage>}
