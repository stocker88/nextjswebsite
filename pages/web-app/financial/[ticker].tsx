import Head from 'next/head';
import { useRouter } from 'next/router';
import ErrorPage from 'next/error';

type Props = {
  ticker: string;
};

export default function Ticker({ ticker }) {
  const router = useRouter();

  const logoPath = `/assets/assets/logo/${ticker}.webp`;
  const pageTitle = `${ticker}`;
  const pageDescription = 'Stocks to buy now'; // Update with your description

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

// This method is called at build time
export async function getStaticProps({ params }) {
  const { ticker } = params;
  // Fetch data for the ticker from your API or server
  // Example: const tickerData = await fetchTickerData(ticker);

  // Return the ticker data as props
  return { props: { ticker } };
}
