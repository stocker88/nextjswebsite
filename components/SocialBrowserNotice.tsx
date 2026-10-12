import { useEffect, useState } from 'react';

export function detectSocialBrowser(
  userAgent = '',
  referrer = '',
  currentUrl = '',
  attribution = '',
) {
  // TikTok can use different webviews for bio and Story links. Some Story
  // webviews look like Safari, so also inspect the referrer and campaign URL.
  const linkContext = `${referrer} ${currentUrl} ${attribution}`;

  if (/Instagram/i.test(userAgent)) return 'Instagram';
  if (/FBAN|FBAV|FB_IAB|Facebook/i.test(userAgent)) {
    return 'Facebook';
  }
  const hasTikTokUserAgent =
    /TikTok|BytedanceWebview|ByteDance|musical[_\s.-]?ly|musically|Aweme|ttwebview|TikTokWebView|zhiliaoapp/i.test(
      userAgent,
    );
  if (hasTikTokUserAgent) return 'TikTok';
  if (/Twitter|(?:^|\s)X\//i.test(userAgent)) {
    return 'X';
  }

  const isIOSWebView =
    /iPhone|iPad|iPod/i.test(userAgent) &&
    /AppleWebKit/i.test(userAgent) &&
    /Mobile\//i.test(userAgent) &&
    !/Version\/[^\s]+.*Safari/i.test(userAgent) &&
    !/CriOS|FxiOS|EdgiOS|OPiOS/i.test(userAgent);
  const isAndroidWebView =
    /Android/i.test(userAgent) &&
    /(?:;\s*wv\)|\bwv\b|Version\/4\.0.*Chrome)/i.test(userAgent);
  const isEmbeddedWebView = isIOSWebView || isAndroidWebView;
  const hasTikTokAttribution =
    /TikTok|tiktok\.com|tiktokstory|storytiktok|tiktoklink/i.test(linkContext);

  // Campaign data identifies TikTok only while the page is embedded. A real
  // Safari/Chrome window must not keep showing the in-app-browser notice.
  if (isEmbeddedWebView && /Instagram|instagram\.com/i.test(linkContext)) return 'Instagram';
  if (isEmbeddedWebView && /Facebook|facebook\.com/i.test(linkContext)) return 'Facebook';
  if (isEmbeddedWebView && /Twitter|twitter\.com|https?:\/\/(?:www\.)?x\.com(?:[/?#]|$)/i.test(linkContext)) return 'X';
  if (isEmbeddedWebView && hasTikTokAttribution) return 'TikTok';
  if (isEmbeddedWebView) return 'an in-app browser';

  return '';
}

type Props = {
  browserName?: string;
  variant?: 'standard' | 'insight';
};

export default function SocialBrowserNotice({
  browserName: suppliedBrowserName = '',
  variant = 'standard',
}: Props) {
  const [detectedBrowserName, setDetectedBrowserName] = useState('');

  useEffect(() => {
    if (!suppliedBrowserName) {
      setDetectedBrowserName(
        detectSocialBrowser(
          navigator.userAgent,
          document.referrer,
          window.location.href,
        ),
      );
    }
  }, [suppliedBrowserName]);

  const browserName = suppliedBrowserName || detectedBrowserName;

  if (!browserName) return null;

  return (
    <aside className="browserNotice" role="status">
      <div>
        <strong>Open in your phone’s browser</strong>
        <span className="browserNoticeAction">
          <small>{variant === 'insight' ? 'VIEW THE SHARED INSIGHT' : 'FOR FASTER LOADING'}</small>
          <span>
            Tap the menu in the top-right corner, then select <b>“Open in browser”</b>.
          </span>
        </span>
      </div>
      <span className="browserNoticeArrow" aria-hidden="true">↑</span>

      <style jsx>{`
        .browserNotice {
          position: fixed;
          z-index: 10000;
          top: max(10px, env(safe-area-inset-top));
          right: 12px;
          width: min(360px, calc(100vw - 24px));
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 15px 16px;
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
          gap: 7px;
          padding-right: 30px;
        }

        .browserNotice strong {
          font-size: 15px;
          line-height: 1.25;
        }

        .browserNotice span {
          color: rgba(255, 255, 255, 0.78);
          font-size: 12px;
          line-height: 1.35;
        }

        .browserNotice .browserNoticeAction {
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding: 9px 11px;
          border: 1px solid rgba(104, 216, 255, 0.25);
          border-radius: 10px;
          background: rgba(104, 216, 255, 0.08);
          color: rgba(255, 255, 255, 0.88);
          font-size: 15px;
          font-weight: 500;
          line-height: 1.35;
        }

        .browserNoticeAction small {
          color: #68d8ff;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
        }

        .browserNotice .browserNoticeAction > span {
          color: rgba(255, 255, 255, 0.88);
          font-size: 15px;
          line-height: 1.35;
        }

        .browserNoticeAction b {
          color: #fff;
          font-weight: 800;
        }

        .browserNotice .browserNoticeArrow {
          position: absolute;
          top: 14px;
          right: 16px;
          color: #68d8ff;
          font-size: 32px;
          font-weight: 800;
          line-height: 1;
          transform: rotate(8deg) translateY(-2px);
          animation: pointToMenu 1.4s ease-in-out infinite;
        }

        @keyframes pointToMenu {
          0%, 100% {
            transform: rotate(8deg) translateY(1px);
          }
          50% {
            transform: rotate(8deg) translateY(-5px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .browserNotice .browserNoticeArrow {
            animation: none;
          }
        }
      `}</style>
    </aside>
  );
}
