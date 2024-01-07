
import Link from 'next/link';
import { doc, setDoc } from "firebase/firestore";
import 'firebase/firestore';
import {getFirestore} from 'firebase/firestore';
import { serverTimestamp } from "firebase/firestore";
import { useSession } from '../stockerSession';
import { useState, useEffect } from "react";
import { format } from 'date-fns';
import { isMobile} from "react-device-detect";

const TryWebAppLink = () => {
const db = getFirestore();
    const { sessionData, setSessionData } = useSession();
        const [deviceInfo, setDeviceInfo] = useState({
            userAgent: '',
            platform: '',
            language: '',
            screenWidth: '',
            screenHeight: '',
        });

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




  useEffect(() => {
        // Fetch device information when the component mounts
        fetchDeviceInfo();
      }, []); // Empty dependency array ensures the effect runs only once after initial render


  const handleClick = (ticker) => {
    const dateTime = Date.now();
    const unixTime = Math.floor(dateTime / 1000);


    const sessionId = sessionData.sessionId || '';


    const randomString = Math.random().toString(20).substring(2, 14) + Math.random().toString(20).substring(2, 14);
    const docId = deviceInfo.language + deviceInfo.platform + deviceInfo.screenWidth + deviceInfo.screenHeight+randomString;
    if (sessionId === ''){
        setSessionData({ ...sessionData, sessionId: docId });
    }

     setDoc(doc(db, "a_triedwebapp", docId), {
        time_webapptry: serverTimestamp(),
        time: serverTimestamp(),
         time_webapptryunix: unixTime,
          userAgent: deviceInfo.userAgent,
          sessionId:sessionId,
          platform: deviceInfo.platform,
          language: deviceInfo.language,
          screenWidth: deviceInfo.screenWidth,
          screenHeight: deviceInfo.screenHeight,
        }, { merge: true });
  };


const linkStyle = {
    color: 'blue',
    fontSize: 'small',
    textDecoration: 'underline',
    cursor: 'pointer',
  };
   const containerStyle = {
      display: 'flex',
      padding:'20px',
      justifyContent: 'center',
    };
  return (
    <div style={containerStyle}>
    <br></br>
      <div>

        <Link href="/web-app" onClick={handleClick}>
         {!isMobile && (
                <div
                  style={{
                    color: 'blue',
                    fontSize: '16px',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  {'Try the web app (beta for Desktop)'}
                </div>
              )}
                       <br></br>
                       <br></br>
                       <br></br>
                       <br></br>
        </Link>
      </div>
    </div>
  );
};

export default TryWebAppLink;
