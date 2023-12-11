import cn from 'classnames'
import Link from 'next/link'
import Image from 'next/image'
import { doc, setDoc } from "firebase/firestore";
import 'firebase/firestore';
import {getFirestore} from 'firebase/firestore';
import { serverTimestamp } from "firebase/firestore";
import { useSession } from '../stockerSession';
import { useState, useEffect } from "react";
import { format } from 'date-fns';



type Props = {
  title: string
  src: string
  slug?: string
}

const CoverImage = ({ title, src, slug }: Props) => {

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

    const email = sessionData.email || '';
    const sessionId = sessionData.sessionId || '';
const today = new Date();

  const formattedDate = format(today, 'MMMM d, yyyy');
    const docId = email === ''
      ?  sessionId ===''?
        deviceInfo.language + deviceInfo.platform + deviceInfo.screenWidth + deviceInfo.screenHeight+formattedDate
        : sessionId
      : email;
    if (email === ''){
        setSessionData({ ...sessionData, sessionId: docId });
    }

     setDoc(doc(db, "contactList", docId), {
        [ `timeViewClickedPost${slug}` ]: serverTimestamp(),
         [ `unixTimeViewClickedPost${slug}` ]: unixTime,
          userAgent: deviceInfo.userAgent,
          platform: deviceInfo.platform,
          language: deviceInfo.language,
          screenWidth: deviceInfo.screenWidth,
          screenHeight: deviceInfo.screenHeight,
        }, { merge: true });
  };


  const image = (
  <center>
    <Image
      src={src}
      alt={`Cover Image for ${title}`}
      className={cn('shadow-sm w-full', {
        'hover:shadow-lg transition-shadow duration-200': slug,
      })}
      width={1300}
      height={630}
      style={{'maxWidth':'1000px','borderRadius': '10px 10px 10px 10px'}}
      unoptimized={true}
    />
    </center>
  )
  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link as={`/posts/${slug}`} href="/posts/[slug]" aria-label={title} onClick={handleClick}>
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  )
}

export default CoverImage
