import React, { useEffect, useRef, useState } from 'react';
// import sections
import Hero from '../components/sections/Hero';
import FeaturesSplit from '../components/sections/FeaturesSplit';
import Blog from '../components/sections/Blog';
import Swipe from '../components/swiper/swipe';
import IntroVideo from '../components/introVideo';
import IntroApp from '../components/introApp';
import YoutubeSection from '../components/sections/YoutubeSection';
import FAQ from '../components/sections/FAQ';
import TitleSplit from '../components/sections/TitleSplit';
import TitleSplit2 from '../components/sections/Title2Split';
import TitleSplit3 from '../components/sections/Title3Split';
import TitleSplit4 from '../components/sections/Title4Split';
import Testimonial from '../components/sections/Testimonial';
import NewsletterSignUp from '../components/formStocker'
import Header from '../components/layout/Header';
import type Post from '../interfaces/post';
import Container from '../components/container'
import Intro from '../components/intro'
import MoreStories from '../components/more-stories'
import Link from 'next/link';
import QuoteDisplay from '../components/inspiration';
import CompoundInterestCalculator from '../components/compoundInterestCalculator';

type Props = {
  posts: Post[]
}

const PlatformIcon = ({ platform }: { platform: 'google' | 'apple' | 'linkedin' }) => {
  if (platform === 'google') {
    return (
      <span className="platform-icon platform-icon--google" aria-hidden="true">
        <svg viewBox="0 0 64 64" role="img">
          <path fill="#00D7FE" d="M13 9.7v44.6L36.8 32 13 9.7Z" />
          <path fill="#00F076" d="m13 9.7 29.1 16.8-5.3 5.5L13 9.7Z" />
          <path fill="#FFCC00" d="m36.8 32 5.3 5.5L13 54.3 36.8 32Z" />
          <path fill="#FF3A44" d="m42.1 26.5 7.4 4.3c1 .6 1 1.8 0 2.4l-7.4 4.3-5.3-5.5 5.3-5.5Z" />
        </svg>
      </span>
    );
  }

  if (platform === 'apple') {
    return (
      <span className="platform-icon platform-icon--apple" aria-hidden="true">
        <svg viewBox="0 0 64 64" role="img">
          <defs>
            <linearGradient id="app-store-gradient" x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
              <stop stopColor="#39C8FF" />
              <stop offset="1" stopColor="#2867E8" />
            </linearGradient>
          </defs>
          <rect width="64" height="64" rx="15" fill="url(#app-store-gradient)" />
          <path d="M23.2 43.8h24.2M18.1 43.8h1.8M25.1 36.8 35.3 19M31 19l15.2 26.3M21.2 45.3l-3 5.2M39.5 36.8l4.2 7.2" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }

  return (
    <span className="platform-icon platform-icon--linkedin" aria-hidden="true">
      <svg viewBox="0 0 64 64" role="img">
        <rect width="64" height="64" rx="15" fill="#0A66C2" />
        <circle cx="20" cy="21" r="4.2" fill="#fff" />
        <path fill="#fff" d="M16.4 28.1h7.2V50h-7.2V28.1Zm11.6 0h6.9v3c1.7-2.3 4.3-3.8 7.7-3.8 7.5 0 8.9 4.9 8.9 11.4V50h-7.2V39.9c0-2.4 0-5.6-3.4-5.6s-4 2.7-4 5.4V50H28V28.1Z" />
      </svg>
    </span>
  );
};

const Home =  ({ posts }: Props) =>  {
{/*
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };
*/}
    useEffect(() => {
      if (window.Trustpilot) {
        window.Trustpilot.loadFromElement(document.getElementsByClassName('trustpilot-widget')[0]);
        window.Trustpilot.loadFromElement(document.getElementsByClassName('trustpilot-widget')[1]);
      }
    }, []);

  return (
    <>

    <Header />
{/*    import { useState } from 'react';
import SignUpModal from '../SignUpModal';
 <div>
      <header>
        <button
         onClick={toggleModal}
            style={{
              'position': 'fixed',
              'top': '20px',
              'right': '20px',
              'padding': '8px 30px',
              'background-color': '#3498db',
              'border-radius': '5px',
              'cursor': 'pointer',
              'z-index': '999',
              }}>Login</button>
      </header>
      {showModal && <SignUpModal onClose={toggleModal} />}
    </div>
*/}


      <Hero className="illustration-section-01" style={{ background: "linear-gradient(hsl(200, 100%, 48%), hsl(250, 100%, 25%))" }}/>

        <div style={{ background: "linear-gradient(hsl(250, 100%, 5%), hsl(250, 100%, 5%), hsl(250, 100%, 5%))" }}>

      <div className="trustpilot-top-strip is-loaded">
        <div
          className="trustpilot-widget"
          data-locale="en-US"
          data-template-id="53aa8912dec7e10d38f59f36"
          data-businessunit-id="670a2355c53c6130a02f3e50"
          data-style-height="140px"
          data-style-width="100%"
          data-stars="4,5"
          data-theme="dark"
          data-review-languages="en"
          data-schema-type="Organization"
        >
          <a href="https://www.trustpilot.com/review/stockstobuynow.ai" target="_blank" rel="noopener">Trustpilot</a>
        </div>
      </div>

      <div id="about-aness" style={{ scrollMarginTop: '90px' }}>
        <Testimonial/>
      </div>

      <div style={{ height: 'clamp(36px, 6vw, 72px)' }} />
      <Container>
        <center style={{
          borderBottom: '0.3px solid #333',
          width: '100%',
          maxWidth: '1000px',
          margin: '0 auto',
        }}>
          <div id="reviews" className="review-sources" style={{ scrollMarginTop: '90px' }}>
            <div className="review-sources__heading">
              <span>Trusted across platforms</span>
              <h2>See what investors are saying</h2>
              <p>Explore independent reviews and learn more about the people behind Stocks To Buy Now AI.</p>
            </div>

            <div className="review-sources__grid">
              <a className="review-source-card" href="https://play.google.com/store/apps/details?id=com.newcompany.stocker" target="_blank" rel="noopener noreferrer">
                <PlatformIcon platform="google" />
                <div className="review-source-card__content">
                  <span className="review-source-card__eyebrow">Google Play</span>
                  <h3>Android reviews</h3>
                  <div className="review-source-card__stars" aria-label="Five stars">★★★★★</div>
                  <span className="review-source-card__link">Read app reviews <span aria-hidden="true">↗</span></span>
                </div>
              </a>

              <a className="review-source-card" href="https://apps.apple.com/us/app/stocks-to-buy-now-ai-signals/id1565527320" target="_blank" rel="noopener noreferrer">
                <PlatformIcon platform="apple" />
                <div className="review-source-card__content">
                  <span className="review-source-card__eyebrow">Apple App Store</span>
                  <h3>iPhone &amp; iPad reviews</h3>
                  <div className="review-source-card__stars" aria-label="Five stars">★★★★★</div>
                  <span className="review-source-card__link">Read app reviews <span aria-hidden="true">↗</span></span>
                </div>
              </a>

              <a className="review-source-card" href="https://www.linkedin.com/in/anesshusseinali/" target="_blank" rel="noopener noreferrer">
                <PlatformIcon platform="linkedin" />
                <div className="review-source-card__content">
                  <span className="review-source-card__eyebrow">LinkedIn</span>
                  <h3>Founder profile</h3>
                  <p>Experience, background and professional updates.</p>
                  <span className="review-source-card__link">View profile <span aria-hidden="true">↗</span></span>
                </div>
              </a>
            </div>
          </div>

          <div className="review-trustpilot is-loaded">
            <div
              className="trustpilot-widget"
              data-locale="en-US"
              data-template-id="53aa8912dec7e10d38f59f36"
              data-businessunit-id="670a2355c53c6130a02f3e50"
              data-style-height="140px"
              data-style-width="100%"
              data-stars="4,5"
              data-theme="dark"
              data-review-languages="en"
              data-schema-type="Organization"
            >
              <a href="https://www.trustpilot.com/review/stockstobuynow.ai" target="_blank" rel="noopener">Trustpilot</a>
            </div>
          </div>
          <div style={{ height: 'clamp(32px, 5vw, 64px)' }} />
        </center>
      </Container>
        <section id="how-it-works" className="signals-section" style={{ scrollMarginTop: '90px' }}>
          <div className="signals-shell">
            <IntroApp/>
            <Swipe/>
          </div>
        </section>
        <YoutubeSection/>
        <section className="editorial-section">
          <div className="editorial-shell">
            <Intro />
            {posts.length > 0 && <MoreStories posts={posts} />}
          </div>
        </section>
        <CompoundInterestCalculator/>
{/*         <center>
<FAQ/>
</center>*/}

{/*
<h3
  className="text2xl md:text-3xl tracking-tighter leading-tight"
  style={{
    color: 'lightGrey',
    textShadow: '0px 0px 3px rgba(0, 0, 0, 1)',
    letterSpacing: '0.05em',
    textAlign: 'left',
    marginBottom: '60px',
    fontSize: '1.4rem'
  }}
>
  If you say <strong> YES </strong> to any of the below,
  <strong> StocksToBuyNow AI </strong> is for you:
</h3>
<br/>
<div style={{ color: 'lightGrey', fontSize: '1.3rem', lineHeight: '1.8', letterSpacing: '0.05em', textAlign: 'left' }}>
  <p style={{ display: 'flex', alignItems: 'center', marginBottom: '60px' }}>
    <span
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '48px',
        height: '48px',
        backgroundColor: 'green',
        borderRadius: '8px',
        marginRight: '20px',
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="32" height="32">
        <path d="M10 15.172l8.292-8.292 1.415 1.415-9.707 9.707-5.707-5.707 1.415-1.415z"/>
      </svg>
    </span>
    Want to learn more about financial markets and pro trading strategies?
  </p>
  <p style={{ display: 'flex', alignItems: 'center', marginBottom: '60px' }}>
    <span
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '48px',
        height: '48px',
        backgroundColor: 'green',
        borderRadius: '8px',
        marginRight: '20px',
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="32" height="32">
        <path d="M10 15.172l8.292-8.292 1.415 1.415-9.707 9.707-5.707-5.707 1.415-1.415z"/>
      </svg>
    </span>
    Want to access stock price predictions driven by ai, statistical and financial analysis?
  </p>

  <p style={{ display: 'flex', alignItems: 'center', marginBottom: '60px' }}>
    <span
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '48px',
        height: '48px',
        backgroundColor: 'green',
        borderRadius: '8px',
        marginRight: '20px',
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="32" height="32">
        <path d="M10 15.172l8.292-8.292 1.415 1.415-9.707 9.707-5.707-5.707 1.415-1.415z"/>
      </svg>
    </span>
    Want to find the best alternative to any stocks your friends already bought?
  </p>


  <p style={{ display: 'flex', alignItems: 'center', marginBottom: '60px' }}>
    <span
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '48px',
        height: '48px',
        backgroundColor: 'green',
        borderRadius: '8px',
        marginRight: '20px',
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="32" height="32">
        <path d="M10 15.172l8.292-8.292 1.415 1.415-9.707 9.707-5.707-5.707 1.415-1.415z"/>
      </svg>
    </span>
    Want to find the next Nvidia?
  </p>

  <p style={{ display: 'flex', alignItems: 'center', marginBottom: '60px' }}>
    <span
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '48px',
        height: '48px',
        backgroundColor: 'green',
        borderRadius: '8px',
        marginRight: '20px',
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="32" height="32">
        <path d="M10 15.172l8.292-8.292 1.415 1.415-9.707 9.707-5.707-5.707 1.415-1.415z"/>
      </svg>
    </span>
    Want to create a side income alongside your job?
  </p>
  <p style={{ display: 'flex', alignItems: 'center', marginBottom: '60px' }}>
    <span
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '48px',
        height: '48px',
        backgroundColor: 'green',
        borderRadius: '8px',
        marginRight: '20px',
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="32" height="32">
        <path d="M10 15.172l8.292-8.292 1.415 1.415-9.707 9.707-5.707-5.707 1.415-1.415z"/>
      </svg>
    </span>
    Looking to take control of your financial future?
  </p>
  <p style={{ display: 'flex', alignItems: 'center', marginBottom: '60px' }}>
    <span
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '48px',
        height: '48px',
        backgroundColor: 'green',
        borderRadius: '8px',
        marginRight: '20px',
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="32" height="32">
        <path d="M10 15.172l8.292-8.292 1.415 1.415-9.707 9.707-5.707-5.707 1.415-1.415z"/>
      </svg>
    </span>
    Interested in reliable strategies for steady financial growth?
  </p>
</div>



<br></br><br></br><br></br><br></br><br></br><br></br>*/}

      </div>
      <style jsx global>{`
        .review-sources {
          width: 100%;
          max-width: 1120px;
          margin: 0 auto;
          padding: 56px 20px 24px;
          text-align: left;
        }

        .review-sources__heading {
          max-width: 680px;
          margin: 0 auto 30px;
          text-align: center;
        }

        .review-sources__heading > span {
          color: #47a3ff;
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .review-sources__heading h2 {
          margin: 10px 0 8px;
          color: #fff;
          font-size: clamp(1.75rem, 3vw, 2.45rem);
          letter-spacing: -0.035em;
        }

        .review-sources__heading p {
          margin: 0;
          color: #aab3c5;
          font-size: 1rem;
          line-height: 1.6;
        }

        .review-sources__grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .review-trustpilot {
          width: 100%;
          max-width: 1120px;
          max-height: 0;
          margin: 0 auto;
          padding: 0 20px;
          overflow: hidden;
          opacity: 0;
          pointer-events: none;
        }

        .review-trustpilot.is-loaded {
          max-height: 190px;
          margin-top: 36px;
          padding-top: 12px;
          opacity: 1;
          pointer-events: auto;
        }

        .trustpilot-widget > a {
          display: none;
        }

        .review-source-card {
          display: flex;
          min-height: 190px;
          gap: 18px;
          padding: 24px;
          color: inherit;
          text-decoration: none;
          background: linear-gradient(145deg, rgba(19, 27, 46, 0.96), rgba(10, 16, 30, 0.96));
          border: 1px solid rgba(130, 164, 214, 0.16);
          border-radius: 22px;
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.2);
          transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
        }

        .review-source-card:hover {
          transform: translateY(-4px);
          border-color: rgba(71, 163, 255, 0.52);
          box-shadow: 0 22px 55px rgba(16, 88, 180, 0.18);
        }

        .platform-icon {
          flex: 0 0 auto;
          width: 64px;
          height: 64px;
          border-radius: 16px;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.28);
        }

        .platform-icon svg {
          display: block;
          width: 100%;
          height: 100%;
        }

        .platform-icon--google {
          display: grid;
          place-items: center;
          overflow: hidden;
          padding: 10px;
          background: linear-gradient(145deg, #172239, #0c1427);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .platform-icon--google svg {
          filter: drop-shadow(0 5px 8px rgba(0, 0, 0, 0.28));
        }

        .platform-icon--apple,
        .platform-icon--linkedin {
          overflow: hidden;
        }

        .review-source-card__content {
          display: flex;
          min-width: 0;
          flex: 1;
          flex-direction: column;
          align-items: flex-start;
        }

        .review-source-card__eyebrow {
          color: #8fa0ba;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .review-source-card h3 {
          margin: 5px 0 5px;
          color: #fff;
          font-size: 1.12rem;
          line-height: 1.3;
        }

        .review-source-card p {
          margin: 3px 0 0;
          color: #aab3c5;
          font-size: 0.88rem;
          line-height: 1.45;
        }

        .review-source-card__stars {
          color: #ffbf3f;
          font-size: 1rem;
          letter-spacing: 0.08em;
        }

        .review-source-card__link {
          margin-top: auto;
          padding-top: 17px;
          color: #59aaff;
          font-size: 0.88rem;
          font-weight: 750;
        }

        @media (max-width: 900px) {
          .review-sources__grid {
            grid-template-columns: 1fr;
          }

          .review-source-card {
            min-height: 160px;
          }
        }

        @media (max-width: 520px) {
          .review-sources {
            padding: 42px 6px 12px;
          }

          .review-source-card {
            min-height: 0;
            padding: 20px;
          }

          .platform-icon {
            width: 54px;
            height: 54px;
            border-radius: 14px;
          }
        }
      `}</style>

    </>
  );
}

export default Home;
