import { AppProps } from 'next/app'
import '../styles/index.css'
import { SessionProvider } from '../stockerSession';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <SessionProvider> { <Component {...pageProps} />} </SessionProvider>
}
