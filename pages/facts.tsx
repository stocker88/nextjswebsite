import Head from 'next/head';
import Header from '../components/layout/Header';

const APP_STORE_URL = 'https://apps.apple.com/app/id1565527320';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.newcompany.stocker';
const TRUSTPILOT_URL = 'https://www.trustpilot.com/review/stockstobuynow.ai';

const factsSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  '@id': 'https://www.stockstobuynow.ai/facts#page',
  url: 'https://www.stockstobuynow.ai/facts',
  name: 'Stocks To Buy Now AI: Product Facts',
  description: 'Official product facts, features, platforms and disclosures for Stocks To Buy Now AI.',
  isPartOf: { '@id': 'https://www.stockstobuynow.ai/#website' },
  about: { '@id': 'https://www.stockstobuynow.ai/#app' },
};

export default function FactsPage() {
  return (
    <>
      <Head>
        <title>Product Facts | Stocks To Buy Now AI</title>
        <meta
          name="description"
          content="Official facts about Stocks To Buy Now AI, including features, supported platforms, ratings, paper trading and important risk disclosures."
        />
        <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1" />
        <link rel="canonical" href="https://www.stockstobuynow.ai/facts" />
        <meta property="og:title" content="Stocks To Buy Now AI: Product Facts" />
        <meta property="og:description" content="Official product features, platforms, ratings and disclosures." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.stockstobuynow.ai/facts" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(factsSchema) }}
        />
      </Head>

      <Header homeHref="/" navBasePath="/" socialNoticeMode="tiktok" />

      <main className="factsPage">
        <section className="hero">
          <span className="eyebrow">OFFICIAL PRODUCT INFORMATION</span>
          <h1>Stocks To Buy Now AI product facts</h1>
          <p className="lead">
            A clear, regularly maintained overview of what the app does, where it is available and how to evaluate it responsibly.
          </p>
          <div className="rating" aria-label="Five stars based on more than twenty thousand reviews">
            <span className="stars">★★★★★</span>
            <strong>5 stars based on 20,000+ reviews</strong>
            <small>Combined across the Apple App Store, Google Play and Trustpilot</small>
          </div>
        </section>

        <section className="factsGrid" aria-label="Product facts">
          <article>
            <span>PRODUCT</span>
            <h2>AI-assisted market research</h2>
            <p>Stock and options signals, market analysis, educational insights and tools designed to help investors research opportunities and understand risk.</p>
          </article>
          <article>
            <span>PLATFORMS</span>
            <h2>iPhone, iPad and Android</h2>
            <p>The app is available through the official Apple App Store and Google Play listings linked below.</p>
          </article>
          <article>
            <span>PRACTICE</span>
            <h2>Risk-free paper trading</h2>
            <p>Users can test strategies and follow signals using virtual capital before deciding whether to trade with real money.</p>
          </article>
          <article>
            <span>FOUNDER</span>
            <h2>Aness Hussein Ali</h2>
            <p>Statistician, economist, trader, data scientist and software engineer. Founder information and professional profiles are publicly available.</p>
          </article>
        </section>

        <section className="detailSection">
          <div>
            <span className="eyebrow">CORE CAPABILITIES</span>
            <h2>What users receive</h2>
          </div>
          <ul>
            <li>Stock and options signals with supporting market context</li>
            <li>Technical, fundamental, macroeconomic and catalyst-driven analysis</li>
            <li>Market updates, earnings signals and educational content</li>
            <li>Paper-trading tools for testing ideas with virtual capital</li>
            <li>Portfolio-oriented research and risk-management guidance</li>
          </ul>
        </section>

        <section className="storeSection">
          <span className="eyebrow">OFFICIAL DESTINATIONS</span>
          <h2>Verify the app and independent reviews</h2>
          <div className="links">
            <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">Apple App Store ↗</a>
            <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer">Google Play ↗</a>
            <a href={TRUSTPILOT_URL} target="_blank" rel="noopener noreferrer">Trustpilot ↗</a>
          </div>
        </section>

        <section className="disclosure">
          <span className="eyebrow">IMPORTANT DISCLOSURE</span>
          <h2>Research and education—not personalized financial advice</h2>
          <p>
            Investing involves risk, including possible loss of principal. Signals, examples and historical results do not guarantee future performance. Users should independently evaluate each idea and consider their objectives, experience and risk tolerance.
          </p>
          <small>Last updated: August 31, 2026</small>
        </section>
      </main>

      <style jsx>{`
        .factsPage {
          min-height: 100vh;
          padding: 92px 24px 80px;
          background:
            radial-gradient(circle at 50% -10%, rgba(0, 173, 255, 0.2), transparent 34%),
            #050b1b;
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
        }
        .hero, .factsGrid, .detailSection, .storeSection, .disclosure {
          width: 100%;
          max-width: 1080px;
          margin-right: auto;
          margin-left: auto;
        }
        .hero { max-width: 850px; text-align: center; }
        .eyebrow { color: #59cfff; font-size: 13px; font-weight: 800; letter-spacing: .16em; }
        h1 { margin: 18px 0; font-size: clamp(42px, 6vw, 72px); line-height: 1.02; letter-spacing: -.045em; }
        .lead { margin: 0 auto; max-width: 720px; color: #b7c2d8; font-size: 21px; line-height: 1.55; }
        .rating { display: flex; margin: 34px auto 0; flex-direction: column; align-items: center; gap: 5px; }
        .stars { color: #ffd000; font-size: 27px; letter-spacing: .08em; }
        .rating strong { font-size: 18px; }
        .rating small { color: #93a0ba; font-size: 14px; }
        .factsGrid { display: grid; margin-top: 64px; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
        article, .detailSection, .storeSection, .disclosure {
          border: 1px solid rgba(130, 165, 220, .18);
          border-radius: 24px;
          background: rgba(16, 27, 51, .82);
        }
        article { padding: 30px; }
        article > span { color: #59cfff; font-size: 11px; font-weight: 800; letter-spacing: .13em; }
        h2 { margin: 10px 0 12px; font-size: 28px; line-height: 1.2; letter-spacing: -.025em; }
        article p, .disclosure p { margin: 0; color: #abb7cc; font-size: 16px; line-height: 1.65; }
        .detailSection { display: grid; margin-top: 18px; padding: 36px; grid-template-columns: .8fr 1.2fr; gap: 42px; }
        .detailSection h2, .storeSection h2, .disclosure h2 { margin-top: 12px; }
        ul { margin: 0; padding-left: 22px; color: #c7d0e0; }
        li { margin: 0 0 13px; padding-left: 5px; line-height: 1.5; }
        .storeSection, .disclosure { margin-top: 18px; padding: 36px; }
        .links { display: flex; flex-wrap: wrap; gap: 12px; }
        .links a { padding: 14px 18px; border-radius: 999px; background: #2389ff; color: #fff; font-weight: 750; text-decoration: none; }
        .links a:hover { background: #4ba0ff; }
        .disclosure small { display: block; margin-top: 18px; color: #76849e; }
        @media (max-width: 700px) {
          .factsPage { padding: 54px 16px 56px; }
          h1 { font-size: 42px; }
          .lead { font-size: 18px; }
          .factsGrid { margin-top: 42px; grid-template-columns: 1fr; }
          article, .detailSection, .storeSection, .disclosure { padding: 24px; border-radius: 20px; }
          .detailSection { grid-template-columns: 1fr; gap: 14px; }
          h2 { font-size: 24px; }
          .links { flex-direction: column; }
          .links a { text-align: center; }
        }
      `}</style>
    </>
  );
}
