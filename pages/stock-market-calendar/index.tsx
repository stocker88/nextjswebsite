import Head from 'next/head';
import Header from '../../components/layout/Header';
import MarketCalendar from '../../components/market/MarketCalendar';
import CalendarPredictionPromo from '../../components/CalendarPredictionPromo';
export default function StockMarketCalendarPage(){return <>
 <Head><title>Stock Market Calendar | Economic Events, 13F & Index Announcements</title><meta name="description" content="Plan your week or month with economic releases, Federal Reserve events, 13F filings, index announcements and trading dates."/><link rel="canonical" href="https://www.stockstobuynow.ai/stock-market-calendar/"/></Head>
 <Header forceDark navBasePath="/"/>
 <main><div className="intro"><a href="/">Home</a><span> / Stock market calendar</span><h1>Stock market calendar</h1><p>Keep important market dates in view. Explore the week ahead or switch to a monthly overview.</p></div>
 <MarketCalendar fullPage/>
 <CalendarPredictionPromo kind="market"/>
 <footer><a href="/">StocksToBuyNow.ai</a><p>Selected events. Dates may change. Check the official sources linked to each event.</p></footer></main>
 <style jsx>{`main{min-height:100vh;background:#06051a;color:#ecf1ff;padding:120px 20px 36px}.intro,.app,footer{max-width:1120px;margin:0 auto}.intro h1{font-size:clamp(30px,5vw,48px);margin:22px 0 12px}.intro p,.app>p,footer p{color:#acbcd0;line-height:1.7}.intro span{color:#95a8c7;font-size:13px}.app{padding:28px;border:1px solid #403458;border-radius:20px;background:#11192a}.app a,footer a,.intro a{color:#bda5f3}footer{padding:36px 0;font-size:13px}@media(max-width:650px){main{padding:105px 10px 24px}.app{padding:18px}}`}</style>
 </>;}
