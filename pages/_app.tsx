import { AppProps } from 'next/app'
import '../styles/index.css'
import { SessionProvider } from '../stockerSession';
import Starfield from 'react-starfield';
import { subscribeToEvent, emitEvent } from '../contexts/store'
import { useState, useEffect, useRef } from 'react';
export default function MyApp({ Component, pageProps }: AppProps) {
const [myVariable, setMyVariable] = useState(1);
const [myColor, setMyColor] = useState("black");

useEffect(() => {
  const calculateNumPages = () => {
    const contentHeight = document.body.scrollHeight;
    const viewportHeight = window.innerHeight;
    const calculatedPages = Math.ceil(contentHeight / viewportHeight);

  };

  calculateNumPages();

  // Re-calculate numPages when the window is resized
  window.addEventListener('resize', calculateNumPages);

  return () => {
    window.removeEventListener('resize', calculateNumPages);
  };
}, []);

  const updateVariable = (newValue) => {
    setMyVariable(newValue);
  };
  const updateColors = (newValue) => {
    setMyColor(newValue);
  };

  // Subscribe to the custom event
  subscribeToEvent('updateVariable', updateVariable);
  subscribeToEvent('updateColors', updateColors);

  return <div className="App">
  <div style={{ width: '100%', height: '100%'}}>
       <Starfield
         starCount={150*(myVariable)}
         starColor={[255, 255, 255]}
         speedFactor={0.1*(myVariable)}
         backgroundColor={myColor}
       />
       <SessionProvider> { <Component {...pageProps} />} </SessionProvider>
     </div>
     </div>

}
