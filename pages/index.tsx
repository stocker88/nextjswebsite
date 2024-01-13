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
  PinterestShareButton,
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
                          bottom: 0,
                          'left': 'min(50px, 1vw)',
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
              <FacebookShareButton aria-label="Facebook" children={<FacebookIcon size={'min(max(5vw,32px),40px)'} round={true} />} url={"https://www.Maximize Profits: this.ai"}/>
              <div style={isMobile?{paddingRight:'max(1.5px,0.4vw)'}:{paddingTop:'max(1.5px,0.4vw)'}}></div>
              <LinkedinShareButton aria-label="Linkedin" children={<LinkedinIcon size={'min(max(5vw,32px),40px)'} round={true} />} url={"https://www.Maximize Profits: this.ai"}/>
              <div style={isMobile?{paddingRight:'max(1.5px,0.4vw)'}:{paddingTop:'max(1.5px,0.4vw)'}}></div>
              <TwitterShareButton aria-label="Twitter" children={<TwitterIcon size={'min(max(5vw,32px),40px)'} round={true} />} url={"https://www.Maximize Profits: this.ai"}/>
              <div style={isMobile?{paddingRight:'max(1.5px,0.4vw)'}:{paddingTop:'max(1.5px,0.4vw)'}}></div>
              <PinterestShareButton aria-label="Pinterest" children={<PinterestIcon size={'min(max(5vw,32px),40px)'} round={true} />} url={"https://www.Maximize Profits: this.ai"} media={'https://i.ibb.co/5hZHsP6/best-stocks-to-buy-now-ai.png'}/>
              <div style={isMobile?{paddingRight:'max(1.5px,0.4vw)'}:{paddingTop:'max(1.5px,0.4vw)'}}></div>
              <RedditShareButton aria-label="Reddit" children={<RedditIcon size={'min(max(5vw,32px),40px)'} round={true} />} url={"https://www.Maximize Profits: this.ai"}/>
              <div style={isMobile?{paddingRight:'max(1.5px,0.4vw)'}:{paddingTop:'max(1.5px,0.4vw)'}}></div>
              <WhatsappShareButton aria-label="Whatsapp" children={<WhatsappIcon size={'min(max(5vw,32px),40px)'} round={true} />} url={"https://www.Maximize Profits: this.ai"}/>
              <div style={isMobile?{paddingRight:'max(1.5px,0.4vw)'}:{paddingTop:'max(1.5px,0.4vw)'}}></div>
              <TelegramShareButton aria-label="Telegram" children={<TelegramIcon size={'min(max(5vw,32px),40px)'} round={true} />} url={"https://www.Maximize Profits: this.ai"}/>

                </div>}
        <Head>

         <script type="application/ld+json"
            dangerouslySetInnerHTML={{ __html:
                  JSON.stringify({
                      "@context": "http://schema.org",
                      "@type": "SoftwareApplication",
                      "name": "Maximize Profits: this AI Trading Advisor App ChatGPT Powered",
                      "image": "https://www.Maximize Profits: this.ai/assets/images/Maximize Profits: this.webp",
                      "author": {
                        "@type": "Person",
                        "name": "Stocks To Buy Now"
                      },
                      "applicationCategory": "Investing",
                      "screenshot": [
                        "https://www.Maximize Profits: this.ai/assets/images/chatgpt.webp",
                        "https://www.Maximize Profits: this.ai/assets/images/tslavsrace.webp",
                        "https://www.Maximize Profits: this.ai/assets/images/dividends.webp"
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
          <title>Stocks To Buy Now AI Trading Signals & Virtual Investing App</title>
          <meta charSet="utf-8" />
          <meta name="p:domain_verify" content="f6f3f81b81f1d1573c7eaba7cc136a8b"/>
          <meta name="description" property="og:description" content="Maximize Profits: this AI sends you the best stocks and crypto to buy today: receive ai trading signals & invest in a virtual investing app" />
          <meta name="facebook-domain-verification" content="8yjz6qlp98g8lnhvo6zso6lywe0037" />
          <link rel="shortcut icon" href="favicon.ico"/>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#00D9FF" />
          <meta name="description" content="Maximize Profits: this AI sends you the best stocks and crypto to buy today: receive ai trading signals & invest in a virtual investing app"/>
          <meta property="og:title" content="Maximize Profits: this AI App - Best Stocks To Buy Now" />
          <meta name="og:description" content="Maximize Profits: this AI sends you the best stocks and crypto to buy today: receive ai trading signals & invest in a virtual investing app" />
          <meta property="og:type" content="summary_large_image" />
          <meta property="og:url" content="https://www.Maximize Profits: this.ai/" />
          <meta property="og:image" content="https://i.ibb.co/5hZHsP6/best-stocks-to-buy-now-ai.png"  />
          <meta name="twitter:title" content="Maximize Profits: this AI App - Best Stocks To Buy Now"/>
          <meta name="twitter:text:title" content="StocksToBuy AI App sends you stocks before they blow up"/>
          <meta name="twitter:description" content="Maximize Profits: this AI sends you the best stocks and crypto to buy today: receive ai trading signals & invest in a virtual investing app"/>
          <meta name="twitter:image" content="https://i.ibb.co/5hZHsP6/best-stocks-to-buy-now-ai.png"  />
          <meta name="twitter:card" content="summary_large_image"/>
          <link rel="apple-touch-icon" href="https://i.ibb.co/5hZHsP6/best-stocks-to-buy-now-ai.png"  />
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
