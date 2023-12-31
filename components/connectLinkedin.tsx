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

function LinkedInButton () {
    const db = getFirestore();
    const { sessionData, setSessionData } = useSession();


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


  useEffect(() => {
        // Fetch device information when the component mounts
        fetchDeviceInfo();
      }, []); // Empty dependency array ensures the effect runs only once after initial render


  const onClickedButton = () => {
    const dateTime = Date.now();
    const unixTime = Math.floor(dateTime / 1000);


    const sessionId = sessionData.sessionId || '';


    const randomString = Math.random().toString(20).substring(2, 14) + Math.random().toString(20).substring(2, 14);
    const docId = sessionId ===''?deviceInfo.language + deviceInfo.platform + deviceInfo.screenWidth + deviceInfo.screenHeight+randomString: sessionId;
    if (sessionId === ''){
        setSessionData({ ...sessionData, sessionId: docId });
    }

     setDoc(doc(db, "contactList", docId), {
        timeViewLinkedIn: serverTimestamp(),
        time: serverTimestamp(),
        unixTimeViewLinkedIn: unixTime,
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
        <button onClick={onClickedButton}>
        <a href='https://www.linkedin.com/company/stockstobuynow-ai' target="_blank" >
         <div style={{
            'paddingTop': '16px',
            'paddingBottom': '16px',
            'color': 'white',
            'width':'31vw',
            'textAlign': 'center',
            'fontSize': 'min(20px,max(15px,2vw))',
            'borderRadius': '30px 30px 30px 30px',
            'background': '#493bc3',
            'maxWidth':'280px',
            'boxShadow': '0px 0px 5px rgba(0, 0, 0, 0.4)',
        }}>Follow on LinkedIn</div></a>
        </button>
      </center>
    </div>
  );
};

export default LinkedInButton;
