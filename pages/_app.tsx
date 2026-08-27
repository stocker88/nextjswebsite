import { AppProps } from 'next/app'
import '../styles/index.css'
import { SessionProvider } from '../stockerSession';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="App">
      <SessionProvider>
        <Component {...pageProps} />
      </SessionProvider>
    </div>
  );
}
