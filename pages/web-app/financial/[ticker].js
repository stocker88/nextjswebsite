// pages/web-app/financial/[ticker].js
import Head from 'next/head';


const TickerPage = ({ ticker }) => {

// Assuming the logo path follows a specific structure: /assets/logo/ticker.webp
  const logoPath = `/assets/logo/${ticker}.webp`;

  const pageTitle = `${ticker}`;
  const pageDescription = 'Stocks to buy now'; // Update with your description

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

      <iframe
        src={`http://localhost:3000/web-app#/financial/${ticker}`}

      ></iframe>

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
};

// Fetch data for the ticker
TickerPage.getInitialProps = async ({ query }) => {
  const { ticker } = query;
  // Fetch additional data for the ticker from your API or server
  // Example: const tickerData = await fetchTickerData(ticker);

  // Return the ticker data as props
  return { ticker };
};

export default TickerPage;
