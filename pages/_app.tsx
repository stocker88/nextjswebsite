import { AppProps } from 'next/app'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import '../styles/index.css'
import { SessionProvider } from '../stockerSession';
import { initializeAnalytics, trackPageView } from '../lib/analytics';

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    initializeAnalytics();
    trackPageView(router.asPath);

    const handleRouteChange = (url: string) => trackPageView(url);
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  return (
    <div className="App">
      <SessionProvider>
        <Component {...pageProps} />
      </SessionProvider>
    </div>
  );
}
