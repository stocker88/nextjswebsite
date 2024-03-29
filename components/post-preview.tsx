import Avatar from './avatar'
import DateFormatter from './date-formatter'
import CoverImage from './cover-image'
import Link from 'next/link'
import type Author from '../interfaces/author'
import { doc, setDoc } from "firebase/firestore";
import 'firebase/firestore';
import {getFirestore} from 'firebase/firestore';
import { serverTimestamp } from "firebase/firestore";
import { useSession } from '../stockerSession';
import { useState, useEffect } from "react";
import { format } from 'date-fns';



type Props = {
  title: string
  coverImage: string
  date: string
  excerpt: string
  author: Author
  slug: string
}

const PostPreview = ({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: Props) => {

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
     var utmCampaignValue='defaultWeb';
     var utmSourceValue='defaultWeb';
     var utmMediumValue='defaultWeb';
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
        [ `timeViewClickedPost${slug}` ]: serverTimestamp(),
        time: serverTimestamp(),
         [ `unixTimeViewClickedPost${slug}` ]: unixTime,
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
    <div>
         <div className="mb-5">
           <CoverImage slug={slug} title={title} src={coverImage} />
         </div>
         <h3 className="text-2xl mb-3 leading-snug excerpt_snug" style={{'color':'white', 'textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' }}>
           <Link
             as={`/posts/${slug}`}
             href="/posts/[slug]"
             className="hover:underline"
             onClick={handleClick}
           >
             {title}
           </Link>
         </h3>
         <div className="text-lg mb-4" style={{'color':'grey'}}>
           {/*<DateFormatter dateString={date} />*/}
         </div>
         <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey'}}>{excerpt}</p>
        {/* <Avatar name={author.name} picture={author.picture} />*/}
       </div>
  )
}


export default PostPreview
