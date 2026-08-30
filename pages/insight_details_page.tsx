import Head from 'next/head';
import { useEffect, useState } from 'react';
import { trackAppStoreClick } from '../lib/analytics';
import TrustpilotWidget from '../components/TrustpilotWidget';
import Header from '../components/layout/Header';

const APP_STORE_URL =
  'https://apps.apple.com/app/id1565527320';

const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.newcompany.stocker';

export default function InsightDetailsPage() {
  const [storeUrl, setStoreUrl] = useState(APP_STORE_URL);
  const [appUrl, setAppUrl] = useState('');
  const [isSocialBrowser, setIsSocialBrowser] = useState(false);
  const [smartBannerContent, setSmartBannerContent] = useState(
    'app-id=1565527320, app-argument=https://www.stockstobuynow.ai/insight_details_page',
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const postId = params.get('postId') || '';

    // A normal referral uses "goal".
    // A shared post uses "referrerUid".
    const referralCode =
      params.get('goal') ||
      params.get('referrerUid') ||
      '';

    const campaign =
      params.get('campaign') ||
      params.get('utm_campaign') ||
      'postShares';

    const source =
      params.get('source') ||
      params.get('utm_source') ||
      'sharedFromAppUser';

    const medium =
      params.get('medium') ||
      params.get('utm_medium') ||
      postId;

    const userAgent = navigator.userAgent;

    const isAndroid = /Android/i.test(userAgent);

    const detectedSocialBrowser = /Instagram/i.test(userAgent)
      ? 'Instagram'
      : /FBAN|FBAV/i.test(userAgent)
      ? 'Facebook'
      : /TikTok|BytedanceWebview|ByteDance|musical[_\s.-]?ly|musically|Aweme|ttwebview/i.test(userAgent)
      ? 'TikTok'
      : /Twitter|X\//i.test(userAgent)
      ? 'X'
      : '';

    setIsSocialBrowser(Boolean(detectedSocialBrowser));

    // Keep the route in Uri.path so it matches the existing Flutter handler.
    // The query string preserves the post and campaign attribution fields.
    setAppUrl(
      `${
        isAndroid
          ? 'ai.stockstobuynow'
          : 'com.newcompany.stocker'
      }:///insight_details_page?${params.toString()}`,
    );

    setSmartBannerContent(
      `app-id=1565527320, app-argument=${window.location.href}`,
    );

    const platform = /Android/i.test(userAgent)
      ? 'android'
      : /iPhone|iPad|iPod/i.test(userAgent)
      ? 'ios'
      : 'web';

    const countryCode =
      (navigator.language.split('-')[1] || '').toUpperCase();

    setStoreUrl(
      platform === 'android'
        ? PLAY_STORE_URL
        : APP_STORE_URL,
    );

    if (!referralCode) return;

    localStorage.setItem('referralCode', referralCode);

    // Prevent a page refresh from tracking the same click repeatedly.
    const trackingKey =
      `sharedPostTracked:${referralCode}:${postId}`;

    if (sessionStorage.getItem(trackingKey)) return;

    sessionStorage.setItem(trackingKey, 'true');

    fetch(
      'https://us-central1-stocker-fcda2.cloudfunctions.net/storeReferralClick',
      {
        method: 'POST',
        keepalive: true,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          referralCode,
          campaign,
          source,
          medium,
          postId,
          userAgent,
          countryCode,
          platform,
        }),
      },
    ).catch(console.error);
  }, []);

  const openApp = () => {
    if (!appUrl) return;

    // Attempt the custom scheme in a hidden frame. Navigating the top-level
    // Instagram/TikTok webview to an unavailable scheme makes it replace our
    // page with its own "problem loading" screen before the store fallback.
    const appFrame = document.createElement('iframe');
    appFrame.setAttribute('aria-hidden', 'true');
    appFrame.style.display = 'none';
    appFrame.src = appUrl;

    let appOpened = false;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        appOpened = true;
      }
    };

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange,
    );

    document.body.appendChild(appFrame);

    // A successful app open backgrounds this page. If it remains visible,
    // the app is unavailable (or the in-app browser blocked the request), so
    // continue to the correct store.
    window.setTimeout(() => {
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange,
      );
      appFrame.remove();

      if (appOpened || document.visibilityState !== 'visible') return;

      trackAppStoreClick({
        store: storeUrl === PLAY_STORE_URL ? 'google' : 'apple',
        placement: 'shared_insight_fallback',
        linkUrl: storeUrl,
      });

      window.location.href = storeUrl;
    }, 1600);
  };

  const isGooglePlay = storeUrl === PLAY_STORE_URL;

  const trackDirectStoreClick = (
    store: 'apple' | 'google',
    linkUrl: string,
  ) => {
    trackAppStoreClick({
      store,
      placement: 'shared_insight_store_card',
      linkUrl,
    });
  };

  return (
    <>
      <Head>
        <title>Shared insight | StocksToBuyNow AI</title>

        <meta
          name="description"
          content="An investor shared a StocksToBuyNow AI insight with you."
        />

        <meta
          name="apple-itunes-app"
          content={smartBannerContent}
        />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />

        <meta name="theme-color" content="#00a3f5" />
      </Head>

      <Header homeHref="/" navBasePath="/" />

      <main className="page">
        <div className="content">
        <div className="topArea">
        <section className="card heroCard">
          <img
            src="/assets/images/stockerRobotIcon.png"
            alt="StocksToBuyNow AI"
            className="appIcon"
          />

          <span className="label">
            SHARED APP INSIGHT
          </span>

          <h1>
            Someone shared an investment insight with you
          </h1>

          <p>
            Continue in the app to view the complete insight,
            signals and analysis.
          </p>

          <button
            className="primaryButton"
            type="button"
            onClick={openApp}
          >
            Open this insight in the app →
          </button>

          <p className="installed">
            {isSocialBrowser
              ? 'If the app does not open, tap ••• and choose Open in browser.'
              : `If you do not have the app, we’ll take you to ${isGooglePlay ? 'Google Play' : 'the App Store'}.`}
          </p>

          <div className="trust">
            <span>★★★★★</span>
            <small>Join 300,000+ investors</small>
          </div>
        </section>
        </div>

        <div className="bottomArea">
        <section className="storeSection" aria-labelledby="store-heading">
          <span className="label">CONTINUE WITH STOCKSTOBUYNOW AI</span>
          <h2 id="store-heading">See the complete insight in the app</h2>
          <p>View signals, analysis and the latest investing insights in one place.</p>

          <div className="storeCards">
            <a
              className="storeCard"
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackDirectStoreClick('google', PLAY_STORE_URL)}
            >
              <span className="storeIcon googleIcon" aria-hidden="true">
                <svg viewBox="0 0 64 64">
                  <path fill="#00D7FE" d="M13 9.7v44.6L36.8 32 13 9.7Z" />
                  <path fill="#00F076" d="m13 9.7 29.1 16.8-5.3 5.5L13 9.7Z" />
                  <path fill="#FFCC00" d="m36.8 32 5.3 5.5L13 54.3 36.8 32Z" />
                  <path fill="#FF3A44" d="m42.1 26.5 7.4 4.3c1 .6 1 1.8 0 2.4l-7.4 4.3-5.3-5.5 5.3-5.5Z" />
                </svg>
              </span>
              <span className="storeCardContent">
                <small>GOOGLE PLAY</small>
                <strong>Android</strong>
                <span className="storeStars" aria-label="Five stars">★★★★★</span>
                <span className="storeLink">View app on Google Play ↗</span>
              </span>
            </a>

            <a
              className="storeCard"
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackDirectStoreClick('apple', APP_STORE_URL)}
            >
              <span className="storeIcon appleIcon" aria-hidden="true">
                <svg viewBox="0 0 64 64">
                  <defs>
                    <linearGradient id="insight-app-store-gradient" x1="8" y1="4" x2="56" y2="60">
                      <stop stopColor="#39C8FF" />
                      <stop offset="1" stopColor="#2867E8" />
                    </linearGradient>
                  </defs>
                  <rect width="64" height="64" rx="15" fill="url(#insight-app-store-gradient)" />
                  <path d="M23.2 43.8h24.2M18.1 43.8h1.8M25.1 36.8 35.3 19M31 19l15.2 26.3M21.2 45.3l-3 5.2M39.5 36.8l4.2 7.2" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="storeCardContent">
                <small>APPLE APP STORE</small>
                <strong>iPhone &amp; iPad</strong>
                <span className="storeStars" aria-label="Five stars">★★★★★</span>
                <span className="storeLink">View app on the App Store ↗</span>
              </span>
            </a>
          </div>
        </section>

        <section className="trustpilotSection" aria-label="Independent Trustpilot rating">
          <TrustpilotWidget
            templateId="53aa8912dec7e10d38f59f36"
            businessUnitId="670a2355c53c6130a02f3e50"
            height="160px"
            isTopStrip={false}
          />
        </section>
        </div>
        </div>
      </main>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          padding: 0;
          background: hsl(250, 100%, 5%);
          color: white;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            'SF Pro Display',
            'Segoe UI',
            sans-serif;
        }

        .content {
          display: flex;
          width: 100%;
          margin: 0 auto;
          flex-direction: column;
          align-items: stretch;
        }

        .topArea {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 26px 24px 30px;
          background: linear-gradient(
            hsl(200, 100%, 48%),
            hsl(250, 100%, 25%)
          );
        }

        .bottomArea {
          display: flex;
          width: 100%;
          flex-direction: column;
          align-items: center;
          padding: 34px 24px 56px;
          background: linear-gradient(
            hsl(250, 100%, 5%),
            hsl(250, 100%, 5%),
            hsl(250, 100%, 5%)
          );
        }

        .heroCard {
          margin: 0;
        }

        .browserNotice {
          position: fixed;
          z-index: 1000;
          top: max(10px, env(safe-area-inset-top));
          left: 12px;
          right: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 13px 14px 13px 16px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 16px;
          background: rgba(5, 13, 42, 0.96);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.32);
          color: white;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            'SF Pro Display',
            'Segoe UI',
            sans-serif;
          backdrop-filter: blur(16px);
        }

        .browserNotice div {
          display: flex;
          min-width: 0;
          flex-direction: column;
          gap: 2px;
        }

        .browserNotice strong {
          font-size: 14px;
          line-height: 1.25;
        }

        .browserNotice span {
          color: rgba(255, 255, 255, 0.78);
          font-size: 12px;
          line-height: 1.35;
        }

        .browserNotice .browserNoticeArrow {
          flex: 0 0 auto;
          color: #68d8ff;
          font-size: 30px;
          font-weight: 800;
          line-height: 1;
          transform: translateY(-2px);
        }

        .card {
          width: 100%;
          max-width: 440px;
          text-align: center;
          padding: 40px 26px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 28px;
          background: rgba(8, 11, 30, 0.38);
          backdrop-filter: blur(18px);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.3);
        }

        .appIcon {
          width: 92px;
          height: 92px;
          border-radius: 22px;
          margin-bottom: 22px;
          box-shadow: 0 14px 35px rgba(0, 0, 0, 0.28);
        }

        .label {
          display: block;
          margin-bottom: 12px;
          color: #68d8ff;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.4px;
        }

        h1 {
          margin: 0;
          font-size: clamp(29px, 7vw, 40px);
          line-height: 1.08;
          letter-spacing: -1.2px;
        }

        p {
          margin: 20px auto;
          color: rgba(255, 255, 255, 0.78);
          font-size: 17px;
          line-height: 1.5;
        }

        .primaryButton {
          display: block;
          width: 100%;
          margin-top: 28px;
          padding: 17px 22px;
          border: 0;
          border-radius: 999px;
          background: white;
          color: #07133e;
          cursor: pointer;
          font-family: inherit;
          text-decoration: none;
          font-size: 17px;
          font-weight: 800;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.28);
        }

        .installed {
          margin-top: 16px;
          font-size: 13px;
        }

        .trust {
          display: flex;
          flex-direction: column;
          gap: 7px;
          margin-top: 28px;
        }

        .trust span {
          color: #ffd400;
          letter-spacing: 2px;
        }

        .trust small {
          color: rgba(255, 255, 255, 0.68);
        }

        .storeSection {
          width: 100%;
          max-width: 560px;
          padding: 34px 0 4px;
          text-align: center;
        }

        .storeSection h2 {
          margin: 0;
          font-size: clamp(25px, 6vw, 34px);
          line-height: 1.12;
          letter-spacing: -0.8px;
        }

        .storeSection > p {
          max-width: 440px;
          margin: 13px auto 22px;
          font-size: 15px;
        }

        .storeCard {
          display: flex;
          gap: 18px;
          width: 100%;
          padding: 22px;
          border: 1px solid rgba(130, 164, 214, 0.25);
          border-radius: 24px;
          background: linear-gradient(145deg, rgba(19, 27, 46, 0.97), rgba(10, 16, 30, 0.97));
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.24);
          color: white;
          text-align: left;
          text-decoration: none;
          transition: transform 180ms ease, border-color 180ms ease;
        }

        .storeCards {
          display: grid;
          gap: 16px;
        }

        .storeCard:hover {
          border-color: rgba(104, 216, 255, 0.55);
          transform: translateY(-3px);
        }

        .storeIcon {
          display: grid;
          flex: 0 0 64px;
          width: 64px;
          height: 64px;
          place-items: center;
          overflow: hidden;
          border-radius: 16px;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.28);
        }

        .storeIcon svg {
          display: block;
          width: 100%;
          height: 100%;
        }

        .googleIcon {
          padding: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: linear-gradient(145deg, #172239, #0c1427);
        }

        .storeCardContent {
          display: flex;
          min-width: 0;
          flex: 1;
          flex-direction: column;
          align-items: flex-start;
        }

        .storeCardContent small {
          color: #8fa0ba;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
        }

        .storeCardContent strong {
          margin-top: 5px;
          font-size: 18px;
          line-height: 1.3;
        }

        .storeStars {
          margin-top: 5px;
          color: #ffbf3f;
          letter-spacing: 0.08em;
        }

        .storeLink {
          margin-top: 17px;
          color: #59aaff;
          font-size: 14px;
          font-weight: 750;
        }

        .trustpilotSection {
          width: 100%;
          max-width: 560px;
          min-height: 160px;
          padding-top: 40px;
        }

        @media (max-width: 520px) {
          .topArea {
            padding: 20px 14px 26px;
          }

          .bottomArea {
            padding: 26px 14px 42px;
          }

          .storeCard {
            padding: 19px;
          }

          .storeIcon {
            flex-basis: 56px;
            width: 56px;
            height: 56px;
          }
        }
      `}</style>
    </>
  );
}
