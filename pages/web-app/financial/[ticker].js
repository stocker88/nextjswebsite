import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const TickerPage = () => {
  const router = useRouter();
  const { ticker } = router.query;

  const [iframeSrc, setIframeSrc] = useState('');

  useEffect(() => {
    if (ticker) {
      const origin = process.browser ? window.location.origin : ''; // Check if in the browser
      const newIframeSrc = `${origin}/web-app#/financial/${ticker}`;
      setIframeSrc(newIframeSrc);
    }
  }, [ticker]);

  const logoPath = `/assets/logo/${ticker}.webp`;

  const pageTitle = `${ticker}`;
  const pageDescription = 'Stocks to buy now';

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
        {iframeSrc && <iframe src={iframeSrc}></iframe>}
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

export default TickerPage;
