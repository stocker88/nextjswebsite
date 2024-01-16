import { AppProps } from 'next/app'
import '../styles/index.css'
import { SessionProvider } from '../stockerSession';
import Starfield from 'react-starfield';
import { subscribeToEvent, emitEvent } from '../contexts/store'
import { useState, useEffect } from 'react';

export default function MyApp({ Component, pageProps }: AppProps) {

const [myVariable, setMyVariable] = useState(1);

  const updateVariable = (newValue) => {
    setMyVariable(newValue);
  };

  // Subscribe to the custom event
  subscribeToEvent('updateVariable', updateVariable);

  return <div className="App">
               <Starfield
                 starCount={1000*(myVariable)}
                 starColor={[255, 255, 255]}
                 speedFactor={0.17*(myVariable)}
                 backgroundColor="black"
               />
               <SessionProvider> { <Component {...pageProps} />} </SessionProvider>
             </div>
}
