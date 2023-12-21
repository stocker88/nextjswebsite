import React, { Component } from 'react';
import { useState, useEffect } from "react";
import ConfettiExplosion from 'react-confetti-explosion';
import Layout from '../components/layout'
import { format } from 'date-fns';


import { doc, setDoc } from "firebase/firestore";
import 'firebase/firestore';
import {getFirestore} from 'firebase/firestore';
import { serverTimestamp } from "firebase/firestore";
import { useSession } from '../stockerSession';

function QuoteDisplay () {
const db = getFirestore();
    const { sessionData, setSessionData } = useSession();


  const [quotes, setQuotes] = useState([
    "Opportunities in the stock market are like sunrises; if you wait too long, you'll miss them. - Warren Buffett",
    "If you don't find a way to make money while you sleep, you will work until you die. - Warren Buffett",
    "Use your money to make more money. - Robert Kiyosaki",
    "Risk comes from not knowing what you're doing, always double check with an advisor. - Warren Buffett",
    "The stock market is a device for making the money work. - Warren Buffett",
    "Price is what you pay. Value is what you get. - Warren Buffett",
    "Your net worth is determined by your network – the people you learn from and grow with. - Warren Buffett",
    "A well-diversified portfolio is the shield that guards your financial future. - Benjamin Graham",
    "The stock market doesn't discriminate; it's open to anyone willing to learn and take action. - Warren Buffett",
    "Success in investing is built on a foundation of sound research and thoughtful decisions. - Warren Buffett",
    "The market is a giant discount machine. When everything goes on sale, people run out of the store. – Mark Cuban",
    // Add more quotes here as needed
  ]);

 const fetchDeviceInfo = () => {
        try {
          // Get basic device information
          setDeviceInfo({
            ...deviceInfo,
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenWidth: String(window.screen.width),
            screenHeight: String(window.screen.height),
            // Add or update other properties as needed
          });
        } catch (error) {
          console.error('Error fetching device information:', error);

          // Set empty string ('') as default values if fetching device information fails
          setDeviceInfo({
            ...deviceInfo,
            userAgent: '',
            platform: '',
            language: '',
            screenWidth: '',
            screenHeight: '',
            // Set other properties to empty strings as needed
          });
        }
      };
const [deviceInfo, setDeviceInfo] = useState({
        userAgent: '',
        platform: '',
        language: '',
        screenWidth: '',
        screenHeight: '',
        // Add more properties based on available browser APIs
//         latitude: null,
//         longitude: null,
      });

    const [isExploding, setIsExploding] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [numberClicks, setNumberClicks] = useState(0);

  useEffect(() => {
        // Fetch device information when the component mounts
        fetchDeviceInfo();
      }, []); // Empty dependency array ensures the effect runs only once after initial render


  const generateRandomQuote = () => {
    const newIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuoteIndex((newIndex)%quotes.length);
    setNumberClicks(numberClicks+1)
    setIsSubmitted(true)
    setIsExploding(true)
    setTimeout(() => {
      setIsExploding(false);
    }, 1000);

    const dateTime = Date.now();
    const unixTime = Math.floor(dateTime / 1000);



    const sessionId = sessionData.sessionId || '';


  const randomString = Math.random().toString(20).substring(2, 14) + Math.random().toString(20).substring(2, 14);
    const docId = sessionId ===''?deviceInfo.language + deviceInfo.platform + deviceInfo.screenWidth + deviceInfo.screenHeight+randomString: sessionId;
    if (sessionId === ''){
        setSessionData({ ...sessionData, sessionId: docId });
    }

     setDoc(doc(db, "contactList", docId), {
        timeLastClickQuoteInspiration: serverTimestamp(),
        time: serverTimestamp(),
        unixTimeLastClickQuoteInspiration: unixTime,
      numberClicksQuoteInspiration:numberClicks,
        userAgent: deviceInfo.userAgent,
        platform: deviceInfo.platform,
        language: deviceInfo.language,
        screenWidth: deviceInfo.screenWidth,
        screenHeight: deviceInfo.screenHeight,
        }, { merge: true });
  };


  return (
    <div>

    <center>
    <>{isExploding && <ConfettiExplosion
                    width={1600}
                    particleCount={250} // Equivalent to particleCount
                    duration={2000} // Equivalent to duration
                     force={0.8} // Equivalent to force
                    />}</>
      <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight " style={{maxWidth:'900px','color':'white', 'textShadow': '0px 0px 10px rgba(0, 0, 0, 1)' }}>
      {quotes[currentQuoteIndex]}</h2>
           <br></br>


        <button onClick={generateRandomQuote}
            style={{

                 }}>  <div style={{
                 'padding': '0.8rem',
                 'color': 'white',
                  'width':'31vw',
                 'textAlign': 'center',
                 'fontSize': 'min(19px,max(15px,2vw))',
                 'borderRadius': '30px 30px 30px 30px',
                 'background': '#493bc3',
                 'maxWidth':'280px'
                }}><b style={{'color':'white', 'textShadow': '0px 0px 4px rgba(0, 0, 0, 0.5)'}}>Show me another quote</b></div></button>
      </center>
    </div>
  );
};

export default QuoteDisplay;
