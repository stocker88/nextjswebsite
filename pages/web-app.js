// flutter-app.js
import Head from 'next/head';
import FlutterAppContainer from '../components/sections/FlutterAppContainer'; // Update the path

const FlutterAppPage = () => {
    console.log('Loading Flutter script...');

  return (
    <>
     <Head>

             <script type="application/ld+json"
                dangerouslySetInnerHTML={{ __html:
                      JSON.stringify({
                          "@context": "http://schema.org",
                          "@type": "SoftwareApplication",
                          "name": "Stocks To Buy Now AI Trading Signals App",
                          "image": "https://www.stockstobuynow.ai/assets/images/stockstobuynow.webp",
                          "author": {
                            "@type": "Person",
                            "name": "Stocks To Buy Now"
                          },
                          "applicationCategory": "Investing",
                          "screenshot": [
                            "https://www.stockstobuynow.ai/assets/images/chatgpt.webp",
                            "https://www.stockstobuynow.ai/assets/images/tslavsrace.webp",
                            "https://www.stockstobuynow.ai/assets/images/dividends.webp"
                          ],
                          "review": {
                            "@type": "Review",
                            "author": {
                              "@type": "Person",
                              "name": "itsjayhi"
                            },
                            "reviewRating": {
                              "@type": "Rating",
                              "ratingValue": "5/5"
                            },
                            "reviewBody": "StocksToBuyNow is an amazing virtual investing app! Their AI Advisor helps me find the best stocks to invest in. +++ recommend StocksToBuyNow"
                          }
                        })}}
                    />
              <title>Ask AI for Hot Stocks To Buy Now</title>
              <meta charSet="utf-8" />
              <meta name="p:domain_verify" content="f6f3f81b81f1d1573c7eaba7cc136a8b"/>
              <meta name="description" property="og:description" content="🟢Just 1 year ago Sandisk was $39 now it's $1,570 🎯 we said buy, but you didn't know us. Join 300k+ investors who receive free trading signals, ai stocks to buy today, biotech stocks to buy before earnings, the next Nvidia, the best stocks to buy now" />
//              <meta name="facebook-domain-verification" content="8yjz6qlp98g8lnhvo6zso6lywe0037" />
              <link rel="shortcut icon" href="favicon.ico"/>
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <meta name="theme-color" content="hsl(200, 100%, 48%)" />
              <meta name="description" content="🟢Just 1 year ago Sandisk was $39 now it's $1,570 🎯 we said buy, but you didn't know us. Join 300k+ investors who receive free trading signals, ai stocks to buy today, biotech stocks to buy before earnings, the next Nvidia, the best stocks to buy now"/>
              <meta property="og:title" content="Stocks to Buy Now | Trading Signals | Stock Market News Today | Free Trading Course" />
              <meta name="og:description" content="🟢Just 1 year ago Sandisk was $39 now it's $1,570 🎯 we said buy, but you didn't know us. Join 300k+ investors who receive free trading signals, ai stocks to buy today, biotech stocks to buy before earnings, the next Nvidia, the best stocks to buy now" />
              <meta property="og:type" content="summary_large_image" />
              <meta property="og:url" content="https://www.stockstobuynow.ai/" />
              <meta property="og:image" content="https://i.ibb.co/fCGQ4jv/hot-stocks-to-buy-now-hellostocker-ai.jpg"  />
              <meta name="twitter:title" content="StocksToBuyNow ai App - Best Stocks To Buy Now"/>
              <meta name="twitter:text:title" content="StocksToBuyNow ai App sends you stocks before they blow up"/>
              <meta name="twitter:description" content="🟢Just 1 year ago Sandisk was $39 now it's $1,570 🎯 we said buy, but you didn't know us. Join 300k+ investors who receive free trading signals, ai stocks to buy today, biotech stocks to buy before earnings, the next Nvidia, the best stocks to buy now"/>
              <meta name="twitter:image" content="https://i.ibb.co/fCGQ4jv/hot-stocks-to-buy-now-hellostocker-ai.jpg"  />
              <meta name="twitter:card" content="summary_large_image"/>
              <link rel="apple-touch-icon" href="https://i.ibb.co/fCGQ4jv/hot-stocks-to-buy-now-hellostocker-ai.jpg"  />
              {/*<script type="text/javascript" id="hs-script-loader" async defer src="//js-eu1.hs-scripts.com/143613046.js"></script>*/}
            </Head>

      {/* Other content */}
      <FlutterAppContainer />
    </>
  );
};

export default FlutterAppPage;