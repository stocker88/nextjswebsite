import { useEffect, useState } from 'react';

function detectSocialBrowser(userAgent: string) {
  if (/Instagram/i.test(userAgent)) return 'Instagram';
  if (/FBAN|FBAV/i.test(userAgent)) return 'Facebook';
  if (/TikTok/i.test(userAgent)) return 'TikTok';
  if (/Twitter|X\//i.test(userAgent)) return 'X';
  return '';
}

export default function SocialBrowserNotice() {
  const [browserName, setBrowserName] = useState('');

  useEffect(() => {
    setBrowserName(detectSocialBrowser(navigator.userAgent));
  }, []);

  if (!browserName) return null;

  return (
    <aside className="browserNotice" role="status">
      <div>
        <strong>You’re inside {browserName}</strong>
        <span>Tap ••• above, then choose Open in browser</span>
      </div>
      <span className="browserNoticeArrow" aria-hidden="true">↗</span>

      <style jsx>{`
        .browserNotice {
          position: fixed;
          z-index: 10000;
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
      `}</style>
    </aside>
  );
}
