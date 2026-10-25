import { captureAcquisition, installAcquisitionCapture } from '../lib/acquisition';
import { AppProps } from 'next/app'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import '../styles/index.css'
import '../styles/motion.css'
import '../styles/interaction.css'
import InteractionPolish from '../components/InteractionPolish';
import { SessionProvider } from '../stockerSession';
import {SiteAccountProvider} from '../components/SiteAccount';
import { initializeAnalytics, trackPageView } from '../lib/analytics';

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => installAcquisitionCapture(), []);

  useEffect(() => {
    initializeAnalytics();
    trackPageView(router.asPath);

    const handleRouteChange = (url: string) => { trackPageView(url); captureAcquisition(); };
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  return (
    <div className="App">
      <SessionProvider>
        <InteractionPolish />
        <SiteAccountProvider><Component {...pageProps} /></SiteAccountProvider>
      </SessionProvider>
    </div>
  );
}
