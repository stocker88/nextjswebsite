import { AppProps } from 'next/app'
import '../styles/index.css'
import { SessionProvider } from '../stockerSession';
import Starfield from 'react-starfield';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <div className="App">
               <Starfield
                 starCount={1000}
                 starColor={[255, 255, 255]}
                 speedFactor={0.17}
                 backgroundColor="black"
               />
               <SessionProvider> { <Component {...pageProps} />} </SessionProvider>
             </div>
}
