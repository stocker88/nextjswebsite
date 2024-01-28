declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

import Container from '../components/container'
import MoreStories from '../components/more-stories'
import HeroPost from '../components/hero-post'
import Intro from '../components/intro'
import Layout from '../components/layout'
import { getAllPosts } from '../lib/api'
import Head from 'next/head'
import { CMS_NAME } from '../lib/constants'
import Post from '../interfaces/post'
import Home from '../views/Home';
//import './App.css';
import ReactGA from 'react-ga4';
import { initializeApp } from "firebase/app";
import { useState, useEffect } from 'react';
import Script from 'next/script'

import {
    FacebookShareButton,
    LinkedinShareButton,

    RedditShareButton,
    TwitterShareButton,
    FacebookIcon,
    InstapaperIcon,
    LinkedinIcon,
    PinterestIcon,
    RedditIcon,
    TwitterIcon,
    WhatsappIcon,
    TelegramIcon,
    WhatsappShareButton,
    TelegramShareButton,
    FacebookShareCount,
    PinterestShareCount,
    RedditShareCount,
} from "react-share";
import { isMobile} from "react-device-detect";

const firebaseConfig = {
  apiKey: "AIzaSyCa9vdoGvXZqMLKg9jZlK0TDsFi23V2qzU",
  authDomain: "stocker-fcda2.firebaseapp.com",
  projectId: "stocker-fcda2",
  storageBucket: "stocker-fcda2.appspot.com",
  messagingSenderId: "269261832880",
  appId: "1:269261832880:web:4b6affd899a01f5f0cf175",
  measurementId: "G-WXHHGB6FSV"
};

// Initialize Firebase
//const firebaseApp = initializeApp(firebaseConfig);

  // Initialize Firebase
const app = initializeApp(firebaseConfig);

// On your website
function getQueryParam(name) {
    // Function to get the value of a URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}


type Props = {
  allPosts: Post[]
}
ReactGA.initialize('G-JPXMZYD5DY');

const trackPage = page => {
  ReactGA.set({ page });
  ReactGA.send("pageview");
};


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

export default function Index({ allPosts }: Props) {

  const [scaleFactor, setScaleFactor] = useState(0);


  useEffect(() => {
          // Get the utm_campaign_value from the URL
          var utmCampaignValue = getQueryParam('utm_campaign');
          var utmSourceValue = getQueryParam('utm_source');
          var utmMediumValue = getQueryParam('utm_medium');

          var utmParams = {
              source: 'notDefined',
              medium: 'notDefined',
              campaign: 'notDefined'
          };

          if (utmCampaignValue !== null) {
              utmParams.campaign = utmCampaignValue;
          }

          if (utmSourceValue !== null) {
              utmParams.source = utmSourceValue;
          }

          if (utmMediumValue !== null) {
              utmParams.medium = utmMediumValue;
          }

          if (Object.keys(utmParams).length > 0) {
              localStorage.setItem('utmParams', JSON.stringify(utmParams));

//               console.log('UTM Value stored:', JSON.stringify(utmParams));
          } else {
              console.log('UTM Campaign Value not found in the URL.');
          }
            import("react-facebook-pixel")
              .then((x) => x.default)
              .then((ReactPixel) => {
                ReactPixel.init('3644450535825105');
                ReactPixel.pageView();
              });
            import("react-facebook-pixel")
              .then((x) => x.default)
              .then((ReactPixel) => {
                ReactPixel.init('569234290211542');
                ReactPixel.pageView();
              });
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const newScaleFactor = Math.min(scrollY / 400, 1); // Adjust the divisor for a faster or slower scaling effect
      setScaleFactor(newScaleFactor);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };




  }, []);





  const heroPost = allPosts[0]
  const morePosts = allPosts.slice(0,-1)
  return (
    <>
       <Layout>
       {morePosts.length > 0 && <Home posts={morePosts} />}
{<div style={{
                          'position': 'fixed',
                          'top':  'min(10px, 0.8vw)',
                          'left': isMobile?'unset':'min(50px, 1vw)',
                          'right': isMobile?'min(50px, 1vw)':'unset',
                          'backgroundColor': 'rgba(18, 18, 18, 0.9)',
                          'padding': 'min(10px, 0.8vw)',
                          'boxShadow': '0px 0px 8px rgba(255, 255, 255, 0.4)',
                          'zIndex': '100',
                          'borderRadius': '30px',
                          'display': 'flex',

                          transform: `scale(${scaleFactor})`,
                          'flexDirection': isMobile ? 'row' : 'column',
                            'whiteSpace': isMobile ? 'nowrap' : 'normal',
                            'overflowX': isMobile ? 'auto' : 'visible',
                            'justifyContent': isMobile ? 'center' : 'flex-start',
                          'transition': 'bottom 0.3s ease-in-out', // Add smooth transition
                        }}>

            <div style={isMobile?{paddingRight:'max(1.5px,0.4vw)'}:{paddingTop:'max(1.5px,0.4vw)'}}></div>
              <WhatsappShareButton aria-label="Whatsapp" children={<WhatsappIcon size={'min(max(5vw,32px),40px)'} round={true} />} url={"https://www.stockstobuynow.ai"}/>
              <div style={isMobile?{paddingRight:'max(1.5px,0.4vw)'}:{paddingTop:'max(1.5px,0.4vw)'}}></div>
              <TelegramShareButton aria-label="Telegram" children={<TelegramIcon size={'min(max(5vw,32px),40px)'} round={true} />} url={"https://www.stockstobuynow.ai"}/>
            <div style={isMobile?{paddingRight:'max(1.5px,0.4vw)'}:{paddingTop:'max(1.5px,0.4vw)'}}></div>
              <FacebookShareButton aria-label="Facebook" children={<FacebookIcon size={'min(max(5vw,32px),40px)'} round={true} />} url={"https://www.stockstobuynow.ai"}/>
              <div style={isMobile?{paddingRight:'max(1.5px,0.4vw)'}:{paddingTop:'max(1.5px,0.4vw)'}}></div>
              <RedditShareButton aria-label="Reddit" children={<RedditIcon size={'min(max(5vw,32px),40px)'} round={true} />} url={"https://www.stockstobuynow.ai"}/>
            <div style={isMobile?{paddingRight:'max(1.5px,0.4vw)'}:{paddingTop:'max(1.5px,0.4vw)'}}></div>
              <LinkedinShareButton aria-label="Linkedin" children={<LinkedinIcon size={'min(max(5vw,32px),40px)'} round={true} />} url={"https://www.stockstobuynow.ai"}/>



                </div>}
        <Head>

         <script type="application/ld+json"
            dangerouslySetInnerHTML={{ __html:
                  JSON.stringify({
                      "@context": "http://schema.org",
                      "@type": "SoftwareApplication",
                      "name": "AI Trading Advisor App ChatGPT Powered",
                      "image": "https://stockstobuynow/assets/images/Maximize Profits: this.webp",
                      "author": {
                        "@type": "Person",
                        "name": "Stocks To Buy Now"
                      },
                      "applicationCategory": "Investing",
                      "screenshot": [
                        "https://stockstobuynow/assets/images/chatgpt.webp",
                        "https://stockstobuynow/assets/images/tslavsrace.webp",
                        "https://stockstobuynow/assets/images/dividends.webp"
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
                        "reviewBody": "Maximize Profits: this is an amazing virtual investing app! Their AI Advisor helps me find the best stocks to invest in. +++ recommend Maximize Profits: this"
                      }
                    })}}
                />
          <title>Stocks To Buy Now : AI Trading Virtual App</title>
          <meta charSet="utf-8" />
          <meta name="p:domain_verify" content="f6f3f81b81f1d1573c7eaba7cc136a8b"/>
          <meta name="description" property="og:description" content="Receive hot ai trading signals & invest in a virtual investing app: trade the best stocks and crypto to buy today - Maximize Profits, Minimize Risks" />
          <meta name="facebook-domain-verification" content="8yjz6qlp98g8lnhvo6zso6lywe0037" />
          <link rel="shortcut icon" href="favicon.ico"/>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="hsl(200, 100%, 48%)" />
          <meta name="description" content="Receive hot ai trading signals & invest in a virtual investing app: trade the best stocks and crypto to buy today - Maximize Profits, Minimize Risks"/>
          <meta property="og:title" content="This AI Sends You Hot Stocks To Buy Before They Blow Up" />
          <meta name="og:description" content="Receive hot ai trading signals & invest in a virtual investing app: trade the best stocks and crypto to buy today - Maximize Profits, Minimize Risks" />
          <meta property="og:type" content="summary_large_image" />
          <meta property="og:url" content="https://www.stockstobuynow.ai/" />
          <meta property="og:image" content="https://i.ibb.co/fCGQ4jv/hot-stocks-to-buy-now-hellostocker-ai.jpg"  />
          <meta name="twitter:title" content="This AI Sends You Hot Stocks To Buy Before They Blow Up"/>
          <meta name="twitter:text:title" content="StocksToBuy AI App sends you stocks before they blow up"/>
          <meta name="twitter:description" content="Receive hot ai trading signals & invest in a virtual investing app: trade the best stocks and crypto to buy today - Maximize Profits, Minimize Risks"/>
          <meta name="twitter:image" content="https://i.ibb.co/fCGQ4jv/hot-stocks-to-buy-now-hellostocker-ai.jpg"  />
          <meta name="twitter:card" content="summary_large_image"/>
          <link rel="apple-touch-icon" href="https://i.ibb.co/fCGQ4jv/hot-stocks-to-buy-now-hellostocker-ai.jpg"  />
          {/*<script type="text/javascript" id="hs-script-loader" async defer src="//js-eu1.hs-scripts.com/143613046.js"></script>*/}

 <Script id="facebook-pixel">
      {`
            !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '3644450535825105');
          fbq('track', 'PageView');
          </script>
          <noscript><img height="1" width="1" style="display:none"
          src="https://www.facebook.com/tr?id=3644450535825105&ev=PageView&noscript=1"
      `}
    </Script>

 <Script  id="facebook-pixel2">
      {`
            !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '569234290211542');
          fbq('track', 'PageView');
          </script>
          <noscript><img height="1" width="1" style="display:none"
          src="https://www.facebook.com/tr?id=569234290211542&ev=PageView&noscript=1"
      `}
    </Script>
    <Script async src="https://www.googletagmanager.com/gtag/js?id=G-JPXMZYD5DY"/>
    <Script>
      {`
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      gtag('js', new Date());
      gtag('config', 'G-JPXMZYD5DY');
      `}
    </Script>


        </Head>

      </Layout>
    </>
  )
}

export const getStaticProps = async () => {
  const allPosts = getAllPosts([
    'title',
    'date',
    'slug',
    'author',
    'coverImage',
    'excerpt',
    'seoExcerpt',
  ])

  return {
    props: { allPosts },
  }
}
