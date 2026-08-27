declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    Trustpilot?: {
      loadFromElement: (element: Element | HTMLElement | null) => void;
    };
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

  const params = new URLSearchParams(window.location.search);
  const referralCode = params.get('goal') || params.get('referrerUid') || '';
  const campaign = params.get("campaign") || params.get("utm_campaign") || "";
  const source = params.get("source") || params.get("utm_source") || "";
  const medium = params.get("medium") || params.get("utm_medium") || "";

  if (!referralCode) return;

  const userAgent = navigator.userAgent;
  const countryCode = (navigator.language.split("-")[1] || "").toUpperCase();

  const platform =
    /Android/i.test(userAgent)
      ? "android"
      : /iPhone|iPad|iPod/i.test(userAgent)
      ? "ios"
      : "web";

  localStorage.setItem("referralCode", referralCode);

  fetch("https://us-central1-stocker-fcda2.cloudfunctions.net/storeReferralClick", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      referralCode,
      campaign,
      source,
      medium,
      userAgent,
      countryCode,
      platform,
    }),
  }).catch(console.error);

}, []);


  return (
    <>
       <Layout>
       {morePosts.length > 0 && <Home posts={morePosts} />}

        <Head>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Stocks To Buy Now AI",
            "url": "https://www.stockstobuynow.ai/",
            "image": "https://www.stockstobuynow.ai/assets/images/stockerRobotIcon.png",
            "operatingSystem": "iOS, Android",
            "applicationCategory": "FinanceApplication",
            "description": "AI-powered stock signals, market analysis and practical investing tools.",
            "author": {
              "@type": "Person",
              "name": "Aness Hussein Ali",
              "url": "https://anesshusseinali.com/",
              "sameAs": "https://www.linkedin.com/in/anesshusseinali/"
            },
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "screenshot": [
              "https://www.stockstobuynow.ai/assets/images/1.webp",
              "https://www.stockstobuynow.ai/assets/images/2.webp",
              "https://www.stockstobuynow.ai/assets/images/3.webp"
            ]
          }) }} />
          <script type="text/javascript" src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" async></script>
          <title>Stocks to Buy Now AI | Stock Signals &amp; Market Insights</title>
          <meta name="apple-itunes-app" content="app-id=1565527320"/>
          <meta name="p:domain_verify" content="f6f3f81b81f1d1573c7eaba7cc136a8b"/>
          <meta name="description" content="Discover AI-powered stock signals, market analysis and practical investing tools designed to help investors identify opportunities and understand risk."/>
          <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
          <link rel="canonical" href="https://www.stockstobuynow.ai/" />
          <meta property="og:title" content="Stocks to Buy Now AI | Stock Signals &amp; Market Insights" />
          <meta property="og:description" content="Discover AI-powered stock signals, market analysis and practical investing tools designed to help investors identify opportunities and understand risk." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://www.stockstobuynow.ai/" />
          <meta property="og:site_name" content="Stocks To Buy Now AI" />
          <meta property="og:image" content="https://www.stockstobuynow.ai/assets/images/1.webp"/>
          <meta property="og:image:width" content="1680" />
          <meta property="og:image:height" content="992" />
          <meta property="og:image:alt" content="Stocks To Buy Now AI market signal example" />
          <meta name="twitter:card" content="summary_large_image"/>
          <meta name="twitter:title" content="Stocks to Buy Now AI | Stock Signals &amp; Market Insights"/>
          <meta name="twitter:description" content="Discover AI-powered stock signals, market analysis and practical investing tools."/>
          <meta name="twitter:image" content="https://www.stockstobuynow.ai/assets/images/1.webp" />


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
