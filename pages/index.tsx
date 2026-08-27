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
import { useState, useEffect, useRef } from 'react';
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
  const topWidgetRef = useRef<HTMLDivElement>(null);
  const bodyWidgetRef = useRef<HTMLDivElement>(null);

  const [isMounted, setIsMounted] = useState(false)
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


  // Stage 1: Verify document compilation layer is completely ready
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Stage 2: Programmatically generate the frames using Trustpilot's execution blueprint
  useEffect(() => {
    if (!isMounted) return;

    const renderWidget = (targetRef: React.RefObject<HTMLDivElement>, isTop: boolean) => {
      if (!targetRef.current) return;

      // Clean up previous elements to prevent layout duplicates on mobile switches
      targetRef.current.innerHTML = '';

      const trustbox = document.createElement("div");
      trustbox.className = "trustpilot-widget";
      trustbox.setAttribute("data-locale", "en-US");
      trustbox.setAttribute("data-template-id", "53aa8912dec7e10d38f59f36");
      trustbox.setAttribute("data-businessunit-id", "670a2355c53c6130a02f3e50");
      trustbox.setAttribute("data-style-height", "140px");
      trustbox.setAttribute("data-style-width", "100%");
      trustbox.setAttribute("data-stars", "4,5");
      trustbox.setAttribute("data-theme", isTop ? "dark" : "light");
      trustbox.setAttribute("data-review-languages", "en");
      trustbox.setAttribute("data-schema-type", "Organization");
      trustbox.style.minHeight = "140px";
      trustbox.style.display = "block";

      const fallbackAnchor = document.createElement("a");
      fallbackAnchor.href = "https://trustpilot.com";
      fallbackAnchor.target = "_blank";
      fallbackAnchor.rel = "noopener noreferrer";
      fallbackAnchor.textContent = "Trustpilot";
      trustbox.appendChild(fallbackAnchor);

      targetRef.current.appendChild(trustbox);

      // Force immediate API activation pass
      const trustpilotAPI = (window as any).Trustpilot;
      if (trustpilotAPI && trustpilotAPI.loadFromElement) {
        trustpilotAPI.loadFromElement(trustbox);
      }
    };

    // Trigger explicit render sweeps across both container targets
    const runForcedRender = () => {
      renderWidget(topWidgetRef, true);
      renderWidget(bodyWidgetRef, false);
    };

    // Macro-task queue break to accommodate slow network connectivity frames
    if ((window as any).Trustpilot) {
      runForcedRender();
    } else {
      const checkScriptInterval = setInterval(() => {
        if ((window as any).Trustpilot) {
          runForcedRender();
          clearInterval(checkScriptInterval);
        }
      }, 100);
      setTimeout(() => clearInterval(checkScriptInterval), 4000);
    }
  }, [isMounted]);

  return (
    <>
       {/* Enforce absolute HTTPS protocol mapping routes across all browsers */}
       <Script
         src="https://trustpilot.com"
         strategy="afterInteractive"
         onLoad={() => {
           const tp = (window as any).Trustpilot;
           if (tp && tp.loadFromElement) tp.loadFromElement();
         }}
       />

       <Layout>
         {/* A: THE TOP STRIP COMPONENT TARGET CONTAINER */}
         <div ref={topWidgetRef} className="trustpilot-top-strip is-loaded" style={{ width: '100%' }} />
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
          <script type="text/javascript" src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" async></script>
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
<Script id="trustpilot-observer-fix" strategy="afterInteractive">
  {`
    (function () {
      let observer = null;
      let debounceTimer = null;

      function reloadTrustpilotWidgets() {
        if (typeof Trustpilot !== "undefined" && typeof Trustpilot.loadFromElement === "function") {
          document.querySelectorAll(".trustpilot-widget").forEach((widget) => {
            // Force an immediate layout engine refresh pass
            Trustpilot.loadFromElement(widget);
          });
        }
      }

      function debounceReload() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          reloadTrustpilotWidgets();
        }, 200);
      }

      // Initialize the mutation listener engine once Next.js hydrates
      if (typeof window !== 'undefined') {
        observer = new MutationObserver((mutationsList) => {
          let foundWidgetChange = false;
          for (const mutation of mutationsList) {
            if (mutation.addedNodes && Array.from(mutation.addedNodes).some(node =>
              node.nodeType === 1 && (node.classList.contains("trustpilot-widget") || node.querySelector?.(".trustpilot-widget"))
            )) {
              foundWidgetChange = true;
              break;
            }
          }
          if (foundWidgetChange) debounceReload();
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true
        });

        // Initial fallback execution check
        setTimeout(reloadTrustpilotWidgets, 300);
      }
    })();
  `}
</Script>
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
