import Link from 'next/link'

import { doc, setDoc } from "firebase/firestore";
import 'firebase/firestore';
import {getFirestore} from 'firebase/firestore';
import { serverTimestamp } from "firebase/firestore";
import { useSession } from '../stockerSession';
import { useState, useEffect } from "react";
import { format } from 'date-fns';

type Props = {
  slug: string
}

const Header = ({ slug }: Props) => {



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


  const handleClick = () => {
    const dateTime = Date.now();
    const unixTime = Math.floor(dateTime / 1000);


    const sessionId = sessionData.sessionId || '';


    const randomString = Math.random().toString(20).substring(2, 14) + Math.random().toString(20).substring(2, 14);
    const docId = sessionId ===''?deviceInfo.language + deviceInfo.platform + deviceInfo.screenWidth + deviceInfo.screenHeight+randomString: sessionId;
    if (sessionId === ''){
        setSessionData({ ...sessionData, sessionId: docId });
    }

      var storedUtmParams = localStorage.getItem('utmParams');
     var utmCampaignValue=`defaultWeb_${slug}`;
     var utmSourceValue=`defaultWeb`;
     var utmMediumValue=`defaultWeb_${slug}`;
     // Check if UTM parameters are stored
     if (storedUtmParams) {
         // Parse the stored JSON string
         var utmParams = JSON.parse(storedUtmParams);

         // Retrieve the specific UTM parameter
         utmCampaignValue = utmParams.campaign;
         utmSourceValue = utmParams.source;
         utmMediumValue = utmParams.medium;
    }
    localStorage.setItem('userId', encodeURIComponent(docId));
     setDoc(doc(db, "contactList", docId), {
        id: encodeURIComponent(docId),
        [ `time_clickedBackToHome_${slug}` ]: serverTimestamp(),
        time: serverTimestamp(),
         [ `unixTime_clickedBackToHome_${slug}` ]: unixTime,
          userAgent: deviceInfo.userAgent,
          platform: deviceInfo.platform,
          language: deviceInfo.language,
          screenWidth: deviceInfo.screenWidth,
          screenHeight: deviceInfo.screenHeight,
        utmCampaignValue:utmCampaignValue,
        utmSourceValue:utmSourceValue,
        utmMediumValue:utmMediumValue,
        }, { merge: true });
  };



  return (
    <h2 className="text-xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight mb-10 mt-8">
      <br></br>
        <center>
      <Link
      href="/"
      className="hover:underline"
      style={{'color':'white', 'textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' }}
      onClick={handleClick}
      >
        StocksToBuyNow.AI
      </Link>
        </center>

    </h2>
  )
}

export default Header
