import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Index from './index';
import { getAllPosts } from '../lib/api';
import type Post from '../interfaces/post';

const RESOLVE_SHORT_LINK_URL =
  'https://us-central1-stocker-fcda2.cloudfunctions.net/resolveShortLink';
const STORE_REFERRAL_URL =
  'https://us-central1-stocker-fcda2.cloudfunctions.net/storeReferralClick';

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

type Props = {
  allPosts: Post[];
};

function queryFor(link: ResolvedLink) {
  const params = new URLSearchParams();

  if (link.postId) params.set('postId', link.postId);
  if (link.referrerUid) params.set('referrerUid', link.referrerUid);
  if (link.goal) params.set('goal', link.goal);
  if (link.symbol) params.set('symbol', link.symbol);
  if (link.source) params.set('utm_source', link.source);
  if (link.medium) params.set('utm_medium', link.medium);
  if (link.campaign) params.set('utm_campaign', link.campaign);

  return params.toString();
}

function storeAttribution(code: string, link: ResolvedLink) {
  const referralCode = link.goal || link.referrerUid || '';
  if (!referralCode) return;

  const trackingKey = `shortLinkTracked:${code}`;
  if (sessionStorage.getItem(trackingKey)) return;

  sessionStorage.setItem(trackingKey, 'true');
  localStorage.setItem('referralCode', referralCode);

  if (link.postId) {
    sessionStorage.setItem(
      `sharedPostTracked:${referralCode}:${link.postId}`,
      'true',
    );
  }

  const userAgent = navigator.userAgent;
  const platform = /Android/i.test(userAgent)
    ? 'android'
    : /iPhone|iPad|iPod/i.test(userAgent)
    ? 'ios'
    : 'web';

  fetch(STORE_REFERRAL_URL, {
    method: 'POST',
    keepalive: true,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      referralCode,
      campaign: link.campaign || '',
      source: link.source || '',
      medium: link.medium || '',
      postId: link.postId || '',
      userAgent,
      countryCode: (navigator.language.split('-')[1] || '').toUpperCase(),
      platform,
    }),
  }).catch(console.error);
}

export default function ShortLinkPage({ allPosts }: Props) {
  const router = useRouter();
  const [showInsightPrompt, setShowInsightPrompt] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;

    const code = typeof router.query.c === 'string'
      ? router.query.c.trim()
      : '';

    if (!code) return;

    fetch(RESOLVE_SHORT_LINK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { code } }),
    })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok || !body.result) throw new Error('Unable to resolve link');
        return body.result as ResolvedLink;
      })
      .then((link) => {
        storeAttribution(code, link);

        if (link.type === 'insight' || link.postId) {
          sessionStorage.setItem('pendingSharedInsight', queryFor(link));
          setShowInsightPrompt(true);
        }
      })
      .catch(console.error);
  }, [router.isReady, router.query.c]);

  const openInsight = () => {
    const query = sessionStorage.getItem('pendingSharedInsight') || '';
    if (!query) return;

    window.location.assign(`/insight_details_page?${query}`);
  };

  return (
    <>
      <Index allPosts={allPosts} />

      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      {showInsightPrompt && (
        <div className="share-prompt-backdrop" role="presentation">
          <section
            className="share-prompt"
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-prompt-title"
          >
            <button
              className="share-prompt-close"
              type="button"
              aria-label="Close shared insight"
              onClick={() => setShowInsightPrompt(false)}
            >
              ×
            </button>

            <Image
              src="/assets/images/stockerRobotIcon.png"
              alt="Stocks To Buy Now AI"
              width={76}
              height={76}
            />

            <span>SHARED APP INSIGHT</span>
            <h1 id="share-prompt-title">Someone shared an investment insight with you</h1>
            <p>Open the shared insight to view its signals and analysis.</p>
            <button className="share-prompt-action" type="button" onClick={openInsight}>
              View the shared insight →
            </button>
          </section>
        </div>
      )}

      <style jsx>{`
        .share-prompt-backdrop {
          position: fixed;
          z-index: 1200;
          inset: 0;
          display: grid;
          place-items: center;
          padding: 18px;
          background: rgba(2, 7, 20, 0.68);
          backdrop-filter: blur(10px);
        }

        .share-prompt {
          position: relative;
          width: min(480px, 100%);
          padding: 34px;
          border: 1px solid rgba(116, 168, 255, 0.3);
          border-radius: 28px;
          background: linear-gradient(155deg, #0d5795, #0d2474 60%, #130a62);
          box-shadow: 0 28px 90px rgba(0, 0, 0, 0.48);
          color: #fff;
          text-align: center;
        }

        .share-prompt img {
          border-radius: 18px;
        }

        .share-prompt > span {
          display: block;
          margin-top: 18px;
          color: #62d6ff;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.15em;
        }

        .share-prompt h1 {
          margin: 12px 0;
          font-size: clamp(25px, 6vw, 38px);
          line-height: 1.08;
          letter-spacing: -0.04em;
        }

        .share-prompt p {
          margin: 0;
          color: rgba(255, 255, 255, 0.76);
          line-height: 1.5;
        }

        .share-prompt-action {
          width: 100%;
          margin-top: 24px;
          padding: 14px 18px;
          border: 0;
          border-radius: 999px;
          background: #fff;
          color: #07143e;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
        }

        .share-prompt-close {
          position: absolute;
          top: 12px;
          right: 14px;
          width: 34px;
          height: 34px;
          padding: 0;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.16);
          color: #fff;
          font-size: 24px;
          line-height: 30px;
          cursor: pointer;
        }

        @media (max-width: 520px) {
          .share-prompt {
            padding: 28px 22px 22px;
            border-radius: 24px;
          }
        }
      `}</style>
    </>
  );
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
  ]);

  return { props: { allPosts } };
};
