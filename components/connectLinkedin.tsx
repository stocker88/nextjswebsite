import React, { Component } from 'react';
import { useState, useEffect } from "react";
import ConfettiExplosion from 'react-confetti-explosion';
import Layout from '../components/layout'
import { format } from 'date-fns';

import LinkedInIcon from '../components/linkedinicon';
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
    localStorage.setItem('userId', encodeURIComponent(docId));
     setDoc(doc(db, "contactList", docId), {
        timeViewLinkedIn: serverTimestamp(),
        time: serverTimestamp(),
        unixTimeViewLinkedIn: unixTime,
      userAgent: deviceInfo.userAgent,
      platform: deviceInfo.platform,
      language: deviceInfo.language,
      screenWidth: deviceInfo.screenWidth,
      screenHeight: deviceInfo.screenHeight,
      type: 'LINKEDIN',
        }, { merge: true });
  };


  return (
    <div>

    <center>
        <button onClick={onClickedButton}>
        <a href='https://www.linkedin.com/in/anesshusseinali/' target="_blank" >
        <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px', // Adjust the gap between the icon and the text as needed
                  padding:'10px'
                }}>
              <LinkedInIcon/><div style={{'color':'white', 'textShadow': '0px 0px 4px rgba(0, 0, 0, 0.5)'}}> Connect on LinkedIn </div></div> </a>
        </button>
      </center>
    </div>
  );
};

export default LinkedInButton;
