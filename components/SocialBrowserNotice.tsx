import { useEffect, useState } from 'react';

export function detectSocialBrowser(userAgent: string) {
  if (/TikTok|BytedanceWebview|ByteDance|musical[_\s.-]?ly|musically|Aweme|ttwebview/i.test(userAgent)) {
    return 'TikTok';
  }

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
        <span className="browserNoticeAction">
          <small>TO CONTINUE</small>
          <span>Tap the browser menu above, then select <b>Open in Browser</b></span>
        </span>
      </div>
      <span className="browserNoticeArrow" aria-hidden="true">↑</span>

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
          padding-right: 52px;
        }

        .browserNotice strong {
          font-size: 19px;
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
          font-size: 17px;
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
          font-size: 17px;
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
          font-size: 48px;
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
