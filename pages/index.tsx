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

          if (Object.keys(utmParams).length > 0 && (utmParams.source!='notDefined' || utmParams.medium!='notDefined' || utmParams.campaign!='notDefined') ) {
              localStorage.setItem('utmParams', JSON.stringify(utmParams));

//               console.log('UTM Value stored:', JSON.stringify(utmParams));
          } else {
              console.log('UTM Campaign Value not found in the URL.');
          }

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
                          "name": "Jerome"
                        },
                        "reviewRating": {
                          "@type": "Rating",
                          "ratingValue": "5/5"
                        },
                        "reviewBody": "Maximize Profits: this is an amazing virtual investing app! Their AI Advisor helps me find the best stocks to invest in. +++ recommend Maximize Profits: this"
                      }
                    })}}
                />
          <title>Stocks to Buy Now: AI Trading Signals</title>
          <meta charSet="utf-8" />
          <meta name="p:domain_verify" content="f6f3f81b81f1d1573c7eaba7cc136a8b"/>
          <meta name="description" property="og:description" content="⭐⭐️⭐️⭐️⭐️️️️️ over 26,300 active investors | About us: 15 years in investing, Math PhDs & Goldman Sachs Directors | You receive Politician Trades (Nancy Pelosi), AI Earnings Prediction, Momentum Signals, Hedge Funds & Stock Options traders activity - Apple AAPL Nvidia NVDA Meta Netflix NFLX Google GOOG Amazon AMZN Microsoft MSFT Price Prediction | learn make money and get rich 30x faster" />
//           <meta name="facebook-domain-verification" content="8yjz6qlp98g8lnhvo6zso6lywe0037" />
          <link rel="shortcut icon" href="favicon.ico"/>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="hsl(200, 100%, 48%)" />
          <meta name="description" content="⭐⭐️⭐️⭐️⭐️️️️️ over 26,300 active investors | About us: 15 years in investing, Math PhDs & Goldman Sachs Directors | You receive Politician Trades (Nancy Pelosi), AI Earnings Prediction, Momentum Signals, Hedge Funds & Stock Options traders activity - Apple AAPL Nvidia NVDA Meta Netflix NFLX Google GOOG Amazon AMZN Microsoft MSFT Price Prediction | learn make money and get rich 30x faster"/>
          <meta property="og:title" content="Profit 30x Faster with AI Stock Trading Signals: Stocks To Buy Now AI Sends You Hot Stocks Before They Blow Up" />
          <meta name="og:description" content="⭐⭐️⭐️⭐️⭐️️️️️ over 26,300 active investors | About us: 15 years in investing, Math PhDs & Goldman Sachs Directors | You receive Politician Trades (Nancy Pelosi), AI Earnings Prediction, Momentum Signals, Hedge Funds & Stock Options traders activity - Apple AAPL Nvidia NVDA Meta Netflix NFLX Google GOOG Amazon AMZN Microsoft MSFT Price Prediction | learn make money and get rich 30x faster" />
          <meta property="og:type" content="summary_large_image" />
          <meta property="og:url" content="https://www.stockstobuynow.ai/" />
          <meta property="og:image" content="https://i.ibb.co/fCGQ4jv/hot-stocks-to-buy-now-hellostocker-ai.jpg"/>
          <meta name="twitter:title" content="Profit 30x Faster with AI Stock Trading Signals : Stocks To Buy Now AI Sends You Hot Stocks Before They Blow Up"/>
          <meta name="twitter:text:title" content="StocksToBuy AI App sends you stocks before they blow up"/>
          <meta name="twitter:description" content="⭐⭐️⭐️⭐️⭐️️️️️ over 26,300 active investors | About us: 15 years in investing, Math PhDs & Goldman Sachs Directors | You receive Politician Trades (Nancy Pelosi), AI Earnings Prediction, Momentum Signals, Hedge Funds & Stock Options traders activity - Apple AAPL Nvidia NVDA Meta Netflix NFLX Google GOOG Amazon AMZN Microsoft MSFT Price Prediction | learn make money and get rich 30x faster"/>
          <meta name="twitter:image" content="https://i.ibb.co/fCGQ4jv/hot-stocks-to-buy-now-hellostocker-ai.jpg"  />
          <meta name="twitter:card" content="summary_large_image"/>
          <link rel="apple-touch-icon" href="https://i.ibb.co/fCGQ4jv/hot-stocks-to-buy-now-hellostocker-ai.jpg"  />
          {/*<script type="text/javascript" id="hs-script-loader" async defer src="//js-eu1.hs-scripts.com/143613046.js"></script>*/}


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
