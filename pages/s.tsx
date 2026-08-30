import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SocialBrowserNotice from '../components/SocialBrowserNotice';

const RESOLVE_SHORT_LINK_URL =
  'https://us-central1-stocker-fcda2.cloudfunctions.net/resolveShortLink';

type ResolvedLink = {
  type?: string;
  destinationPath?: string;
  postId?: string;
  referrerUid?: string;
  goal?: string;
  symbol?: string;
  source?: string;
  medium?: string;
  campaign?: string;
};

function destinationFor(link: ResolvedLink) {
  const params = new URLSearchParams();

  if (link.postId) params.set('postId', link.postId);
  if (link.referrerUid) params.set('referrerUid', link.referrerUid);
  if (link.goal) params.set('goal', link.goal);
  if (link.symbol) params.set('symbol', link.symbol);
  if (link.source) params.set('utm_source', link.source);
  if (link.medium) params.set('utm_medium', link.medium);
  if (link.campaign) params.set('utm_campaign', link.campaign);

  const path = link.destinationPath
    ? `/${link.destinationPath.replace(/^\/+|\/+$/g, '')}`
    : '/';
  const query = params.toString();

  return query ? `${path}?${query}` : path;
}

export default function ShortLinkPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    if (!router.isReady) return;

    const code = typeof router.query.c === 'string'
      ? router.query.c.trim()
      : '';

    if (!code) {
      setError('This link is incomplete.');
      return;
    }

    fetch(RESOLVE_SHORT_LINK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { code } }),
    })
      .then(async (response) => {
        const body = await response.json();

        if (!response.ok || !body.result) {
          throw new Error('Short link could not be resolved');
        }

        return router.replace(destinationFor(body.result));
      })
      .catch(() => {
        setError('This link is unavailable or has expired.');
      });
  }, [router]);

  return (
    <>
      <Head>
        <title>Opening shared link | StocksToBuyNow AI</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#080b14" />
      </Head>

      <SocialBrowserNotice />

      <main className="page">
        <img
          src="/assets/images/stockerRobotIcon.png"
          alt="StocksToBuyNow AI"
        />

        {error ? (
          <>
            <h1>We couldn’t open this link</h1>
            <p>{error}</p>
            <a href="/">Go to StocksToBuyNow AI</a>
          </>
        ) : (
          <>
            <h1>Opening your shared link…</h1>
            <span className="spinner" aria-label="Loading" />
          </>
        )}
      </main>

      <style jsx>{`
        .page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 18px;
          padding: 24px;
          text-align: center;
          color: white;
          background: radial-gradient(circle at top, #087dd1, #102a9d 42%, #080b2c);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        img {
          width: 84px;
          height: 84px;
          border-radius: 20px;
        }

        h1 {
          margin: 0;
          font-size: 27px;
        }

        p {
          margin: 0;
          color: rgba(255, 255, 255, 0.78);
        }

        a {
          padding: 13px 20px;
          border-radius: 999px;
          color: #07133e;
          background: white;
          font-weight: 700;
          text-decoration: none;
        }

        .spinner {
          width: 26px;
          height: 26px;
          border: 3px solid rgba(255, 255, 255, 0.28);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
