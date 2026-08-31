import Image from 'next/image';
import type { MouseEvent } from 'react';
import { trackAppStoreClick } from '../../lib/analytics';

const iosAppStoreUrl =
  'https://apps.apple.com/us/app/stocks-to-buy-now-ai-signals/id1565527320';
const androidPlayStoreUrl =
  'https://play.google.com/store/apps/details?id=com.newcompany.stocker';

export default function ProductProof() {
  const openAppStore = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const isAndroid = /Android/i.test(navigator.userAgent);
    const linkUrl = isAndroid ? androidPlayStoreUrl : iosAppStoreUrl;

    trackAppStoreClick({
      store: isAndroid ? 'google' : 'apple',
      placement: event.currentTarget.dataset.placement || 'daily_routine',
      linkUrl,
    });

    window.open(linkUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="product-proof">
      <section className="proof-section routine-section">
        <div className="proof-copy">
          <span className="proof-eyebrow">A SIMPLE DAILY ROUTINE</span>
          <h2>It takes 5 minutes a day to be a pro</h2>
          <p>
            Review active signals, expert insights, earnings opportunities and
            the market updates that may affect your portfolio.
          </p>
          <a
            href={iosAppStoreUrl}
            className="proof-link"
            target="_blank"
            rel="noopener noreferrer"
            onClick={openAppStore}
          >
            Explore the app →
          </a>
        </div>

        <div className="phone-frame routine-phone">
          <Image
            src="/assets/images/daily-investing-routine.png"
            alt="Five-minute daily Stocks To Buy Now AI workflow"
            width={864}
            height={1821}
            sizes="(max-width: 760px) 88vw, 420px"
          />
        </div>
      </section>

      <section className="proof-section predictions-section">
        <div className="proof-heading">
          <span className="proof-eyebrow">PAST SIGNAL EXAMPLES</span>
          <h2>See how earlier market signals played out</h2>
          <p>
            Explore historical examples alongside the business growth data
            available inside the app.
          </p>
        </div>

        <div className="prediction-grid">
          <figure className="prediction-card">
            <div className="phone-frame prediction-phone">
              <div className="phone-speaker" aria-hidden="true" />
              <div className="prediction-crop prediction-crop--lly">
                <Image
                  src="/assets/images/past-signal-lly.png"
                  alt="Historical LLY AI signal example in the app"
                  width={1290}
                  height={2796}
                  sizes="(max-width: 760px) 86vw, 420px"
                />
              </div>
            </div>
            <figcaption>
              <strong>LLY signal example</strong>
              <span>Signal timing with company revenue growth</span>
            </figcaption>
          </figure>

          <figure className="prediction-card">
            <div className="phone-frame prediction-phone">
              <div className="phone-speaker" aria-hidden="true" />
              <div className="prediction-crop prediction-crop--nvda">
                <Image
                  src="/assets/images/past-signal-nvda.png"
                  alt="Historical NVDA AI signal example in the app"
                  width={1290}
                  height={2796}
                  sizes="(max-width: 760px) 86vw, 420px"
                />
              </div>
            </div>
            <figcaption>
              <strong>NVDA signal example</strong>
              <span>Signal timing with earnings-per-share growth</span>
            </figcaption>
          </figure>
        </div>

        <p className="proof-disclaimer">
          Historical examples are shown for educational purposes only. Past
          performance does not guarantee future results.
        </p>

        <a
          href={iosAppStoreUrl}
          className="proof-link prediction-cta"
          data-placement="past_signals_paper_trading"
          target="_blank"
          rel="noopener noreferrer"
          onClick={openAppStore}
        >
          Try Risk-Free Paper Trading →
        </a>
      </section>

      <section className="proof-section founder-trades-section">
        <div className="proof-heading">
          <span className="proof-eyebrow">FOUNDER’S REAL-LIFE EXAMPLES</span>
          <h2>Built from an investor’s point of view</h2>
          <p>
            Personal trades from the founder, based on past signals, industry growth prospects and business competitive MOAT analysis.
          </p>
        </div>

        <div className="trade-grid">
          <figure className="trade-card trade-card--chart">
            <Image
              src="/assets/images/founder-trade-chart.jpg"
              alt="Founder personal historical trade chart"
              width={1320}
              height={1209}
              sizes="(max-width: 760px) 92vw, 650px"
            />
          </figure>

          <div className="trade-card trade-summary">
            <span>PERSONAL POSITION EXAMPLE</span>
            <h3>NVDA</h3>
            <Image
              src="/assets/images/founder-nvda-gain.jpg"
              alt="Founder personal NVDA position gain screenshot"
              width={651}
              height={276}
              sizes="(max-width: 760px) 82vw, 420px"
            />
            <p>
              A real life trade from the founder executed with Fidelity.
            </p>
          </div>
        </div>

        <p className="proof-disclaimer">
          These are selected personal historical examples, not investment
          advice. Outcomes vary and losses are possible.
        </p>
      </section>

      <style jsx>{`
        .product-proof {
          color: #fff;
          background: #070b18;
        }

        .proof-section {
          width: min(1120px, 100%);
          margin: 0 auto;
          padding: clamp(70px, 9vw, 118px) 20px;
        }

        .routine-section {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(320px, 0.7fr);
          align-items: center;
          gap: clamp(42px, 8vw, 100px);
        }

        .proof-copy {
          max-width: 560px;
        }

        .proof-eyebrow,
        .trade-summary > span {
          color: #59aaff;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        h2 {
          margin: 12px 0 16px;
          font-size: clamp(34px, 5vw, 58px);
          line-height: 1.05;
          letter-spacing: -0.045em;
          text-wrap: balance;
        }

        .proof-copy p,
        .proof-heading p {
          margin: 0;
          color: #aeb8ca;
          font-size: clamp(16px, 2vw, 19px);
          line-height: 1.65;
        }

        .proof-link {
          display: inline-flex;
          margin-top: 26px;
          padding: 13px 19px;
          border-radius: 999px;
          background: #1683ff;
          color: #fff;
          font-weight: 750;
          text-decoration: none;
        }

        .phone-frame {
          position: relative;
          overflow: hidden;
          margin: 0 auto;
          padding: 12px;
          border: 1px solid rgba(132, 155, 198, 0.28);
          border-radius: 42px;
          background: #02040a;
          box-shadow: 0 38px 90px rgba(0, 0, 0, 0.42);
        }

        .phone-frame :global(img) {
          display: block;
          width: 100%;
          height: auto;
          border-radius: 31px;
        }

        .phone-speaker {
          position: absolute;
          z-index: 2;
          top: 18px;
          left: 50%;
          width: 30%;
          height: 22px;
          border-radius: 999px;
          background: #000;
          transform: translateX(-50%);
          box-shadow: 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        .routine-phone {
          width: min(420px, 100%);
        }

        .predictions-section,
        .founder-trades-section {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .proof-heading {
          max-width: 760px;
          margin: 0 auto 44px;
          text-align: center;
        }

        .prediction-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          align-items: start;
          gap: clamp(24px, 5vw, 64px);
          max-width: 900px;
          margin: 0 auto;
        }

        .prediction-card {
          margin: 0;
        }

        .prediction-phone {
          max-width: 390px;
        }

        .prediction-crop {
          overflow: hidden;
          aspect-ratio: 0.54;
          border-radius: 31px;
          background: #10195b;
        }

        .prediction-crop :global(img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .prediction-crop--lly :global(img) {
          object-position: 50% 1%;
        }

        .prediction-crop--nvda :global(img) {
          object-position: 50% 36%;
        }

        figcaption {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 20px 8px 0;
          text-align: center;
        }

        figcaption strong {
          font-size: 18px;
        }

        figcaption span {
          color: #98a5ba;
          font-size: 14px;
        }

        .proof-disclaimer {
          max-width: 760px;
          margin: 38px auto 0;
          color: #778399;
          font-size: 12px;
          line-height: 1.55;
          text-align: center;
        }

        .prediction-cta {
          display: flex;
          width: fit-content;
          min-width: 180px;
          min-height: 50px;
          align-items: center;
          justify-content: center;
          margin: 22px auto 0;
          background: #1683ff;
          box-shadow: none;
        }

        .trade-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(300px, 0.8fr);
          gap: 20px;
          align-items: stretch;
        }

        .trade-card {
          margin: 0;
          padding: 14px;
          border: 1px solid rgba(130, 164, 214, 0.18);
          border-radius: 26px;
          background: linear-gradient(145deg, #121b2e, #090f1c);
          box-shadow: 0 22px 60px rgba(0, 0, 0, 0.25);
        }

        .trade-card--chart :global(img) {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 17px;
        }

        .trade-summary {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(24px, 4vw, 42px);
        }

        .trade-summary h3 {
          margin: 9px 0 24px;
          font-size: clamp(36px, 5vw, 56px);
        }

        .trade-summary :global(img) {
          width: 100%;
          height: auto;
          border-radius: 14px;
        }

        .trade-summary p {
          margin: 22px 0 0;
          color: #98a5ba;
          font-size: 14px;
          line-height: 1.55;
        }

        @media (max-width: 760px) {
          .proof-section {
            padding: 52px 14px;
          }

          .routine-section,
          .trade-grid {
            grid-template-columns: 1fr;
          }

          .routine-section {
            text-align: center;
          }

          .proof-copy {
            margin: 0 auto;
          }

          .routine-phone {
            width: min(290px, 82vw);
          }

          .prediction-grid {
            grid-template-columns: 1fr;
            gap: 34px;
          }

          .prediction-phone {
            width: min(270px, 76vw);
          }

          figcaption {
            padding-top: 13px;
          }

          .trade-summary {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
