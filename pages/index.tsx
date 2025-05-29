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
// import { initializeApp } from "firebase/app";
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
//
// const firebaseConfig = {
//   apiKey: "AIzaSyCa9vdoGvXZqMLKg9jZlK0TDsFi23V2qzU",
//   authDomain: "stocker-fcda2.firebaseapp.com",
//   projectId: "stocker-fcda2",
//   storageBucket: "stocker-fcda2.appspot.com",
//   messagingSenderId: "269261832880",
//   appId: "1:269261832880:web:4b6affd899a01f5f0cf175",
//   measurementId: "G-WXHHGB6FSV"
// };
//
// // Initialize Firebase
// //const firebaseApp = initializeApp(firebaseConfig);
//
//   // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// On your website

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

  const heroPost = allPosts[0]
  const morePosts = allPosts.slice(0,-1)

  useEffect(() => {
    trackPage(window.location.pathname);
  }, []);


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
                      "name": "Stocks to Buy Now AI Trading Signals App",
                      "image": "https://stockstobuynow/assets/images/Maximize Profits: this.webp",
                      "author": {
                        "@type": "Person",
                        "name": "Stocks to Buy Now AI Trading Signals"
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
                        "reviewBody": "Stocks to buy now ai app sends you the best stocks signals and features relevant market information and trading strategies! The best trading app out there."
                      }
                    })}}
                />
          <script type="text/javascript" src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" async></script>
          <title>Stocks to Buy : AI Trading Signals</title>
          <meta charSet="utf-8" />
          <meta name="p:domain_verify" content="f6f3f81b81f1d1573c7eaba7cc136a8b"/>
          <meta name="description" property="og:description" content="Stocks To Buy Now AI sends you the best stocks to buy before they blow up. Maximize profits 30x faster. Invest better using financials, economics, and AI statistical methods. Receive the best trading signals." />
          <link rel="shortcut icon" href="favicon.ico"/>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="hsl(200, 100%, 48%)" />
          <meta name="description" content="Stocks To Buy Now AI sends you the best stocks to buy before they blow up. Maximize profits 30x faster. Invest better using financials, economics, and AI statistical methods. Receive the best trading signals."/>
          <meta property="og:title" content="Stocks To Buy Now AI sends you the best stocks to buy before they blow up. Maximize profits 30x faster. Invest better using financials, economics, and AI statistical methods. Receive the best trading signals." />
          <meta name="og:description" content="Stocks To Buy Now AI sends you the best stocks to buy before they blow up. Maximize profits 30x faster. Invest better using financials, economics, and AI statistical methods. Receive the best trading signals." />
          <meta property="og:type" content="summary_large_image" />
          <meta property="og:url" content="https://www.stockstobuynow.ai/" />
          <meta property="og:image" content="https://i.ibb.co/fCGQ4jv/hot-stocks-to-buy-now-hellostocker-ai.jpg"/>
          <meta name="twitter:title" content="Stocks To Buy Now AI sends you the best stocks to buy before they blow up. Maximize profits 30x faster. Invest better using financials, economics, and AI statistical methods. Receive the best trading signals."/>
          <meta name="twitter:text:title" content="StocksToBuy AI App sends you stocks before they blow up"/>
          <meta name="twitter:description" content="Stocks To Buy Now AI sends you the best stocks to buy before they blow up. Maximize profits 30x faster. Invest better using financials, economics, and AI statistical methods. Receive the best trading signals."/>
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
