import { useEffect, useState } from 'react';

type Props = {
  from: string;
};

const iosAppStoreUrl =
  'https://apps.apple.com/us/app/stocks-to-buy-now-ai-signals/id1565527320';

const androidPlayStoreUrl =
  'https://play.google.com/store/apps/details?id=com.newcompany.stocker';

function NewsletterSignUp({ from }: Props) {
  const [storeUrl, setStoreUrl] = useState(iosAppStoreUrl);

  useEffect(() => {
    if (/Android/i.test(navigator.userAgent)) {
      setStoreUrl(androidPlayStoreUrl);
    }
  }, []);

  const trackDownload = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'getTheAppClicked', {
        from,
        action: 'clicked',
      });
    }
  };

  return (
    <a
      className="nav-cta app-download-cta"
      href={storeUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={trackDownload}
    >
      Get the App
    </a>
  );
}

export default NewsletterSignUp;
