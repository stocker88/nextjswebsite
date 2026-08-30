import Head from 'next/head';
import { useEffect, useState } from 'react';
import { trackAppStoreClick } from '../lib/analytics';

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

    setIsSocialBrowser(
      /Instagram|FBAN|FBAV|TikTok|Twitter|X\//i.test(userAgent),
    );

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

    window.location.href = appUrl;

    // A successful app open backgrounds this page. If it remains visible,
    // the app is unavailable (or the in-app browser blocked the request), so
    // continue to the correct store.
    window.setTimeout(() => {
      if (document.visibilityState !== 'visible') return;

      trackAppStoreClick({
        store: storeUrl === PLAY_STORE_URL ? 'google' : 'apple',
        placement: 'shared_insight_fallback',
        linkUrl: storeUrl,
      });

      window.location.href = storeUrl;
    }, 1600);
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

        <meta name="theme-color" content="#080b14" />
      </Head>

      <main className="page">
        <section className="card">
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
            This post is available inside StocksToBuyNow AI.
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
              : 'If you do not have the app, we’ll take you to the App Store.'}
          </p>

          <div className="trust">
            <span>★★★★★</span>
            <small>Join 300,000+ investors</small>
          </div>
        </section>
      </main>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 24px;
          background:
            radial-gradient(
              circle at top,
              #087dd1 0%,
              #102a9d 42%,
              #080b2c 100%
            );
          color: white;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            'SF Pro Display',
            'Segoe UI',
            sans-serif;
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
      `}</style>
    </>
  );
}
