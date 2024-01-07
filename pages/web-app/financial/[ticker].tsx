import Head from 'next/head';
import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import { stockDataSearch } from '../../../components/constants';
type Props = {
  ticker: string;
};

export default function Ticker({ ticker }) {
  const router = useRouter();

  const logoPath = `https://www.stockstobuynow.ai/assets/assets/logo/${ticker}.webp`;
  const pageTitle = `${ticker} AI Analysis: Financial Forecast, Economics, Social Hype, and Technical Trading in Stocks To Buy Now`;
  const pageDescription = `${ticker} Financial Forecast and Price Prediction on Stocks To Buy Now AI`; // Update with your description

  if (router.isFallback || !ticker) {
    return <b>Loading…</b>;
  }

  // Check for an invalid ticker value or handle other error scenarios
  if (ticker === '') {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={logoPath} />
      </Head>

      <div className="iframe-container">
        <iframe src={`https://www.stockstobuynow.ai/web-app#/financial/${ticker}`} />
        <style jsx>{`
          .iframe-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            margin: 0;
            padding: 0;
            overflow: hidden;
          }
          iframe {
            border: none;
            width: 100%;
            height: 100%;
            display: block;
          }
        `}</style>
      </div>
    </>
  );
}
export async function fetchAvailableTickers() {
  const availableTickers = stockDataSearch.map((stock) => stock.ticker);
  return availableTickers;
}

// This method tells Next.js which dynamic routes to pre-render
export async function getStaticPaths() {
  // Fetch available tickers from your API or source
  const availableTickers = await fetchAvailableTickers(); // Implement your fetching logic

  // Map available tickers to the paths Next.js should pre-render
  const paths = availableTickers.map((ticker) => ({
    params: { ticker },
  }));

  return {
    paths,
    fallback: true, // or 'blocking' for incremental static regeneration
  };
}

// This method is called at build time to fetch data for a specific ticker
export async function getStaticProps({ params }) {
  const { ticker } = params;
  // Fetch data for the ticker from your API or server
  // Example: const tickerData = await fetchTickerData(ticker);

  // Return the ticker data as props
  return { props: { ticker } };
}