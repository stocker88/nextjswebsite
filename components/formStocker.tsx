import { useState, useEffect } from "react";
import { serverTimestamp } from "firebase/firestore";
import ConfettiExplosion from 'react-confetti-explosion';

import InstallButtonsWithQR from './elements/InstallButtonsWithQR';
import { doc, setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import 'firebase/firestore';
import ReactGA from 'react-ga4';
import {getFirestore} from 'firebase/firestore';
import { useSession } from '../stockerSession';
import { emitEvent } from '../contexts/store';
import { useSpring, animated } from 'react-spring';

type Props = {
  from: string
}


const handleMouseOver = () => {
emitEvent('updateVariable', 3);
// Your function for mouse-over
};

const handleMouseLeave = () => {
emitEvent('updateVariable', 1);
// Your function for mouse-leave
};



//export db from other script and import it here

const generateDynamicLink = async () => {
  const apiKey = 'AIzaSyCa9vdoGvXZqMLKg9jZlK0TDsFi23V2qzU';
  const endpoint = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${apiKey}`;

  const link = 'https://stockstobuynow.ai';
  const androidPackageName = 'com.newcompany.stocker';
  const iosBundleId = 'com.newcompany.stocker';

  var storedUtmParams = localStorage.getItem('utmParams');

     var userIdValue = localStorage.getItem('userId')||'defaultUserId';

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

  const utmParamsFinal = {
    campaign: utmCampaignValue,
    medium: utmMediumValue,
    source: utmSourceValue,
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      dynamicLinkInfo: {
        domainUriPrefix: 'https://applink.stockstobuynow.ai',
        link: `${link}/userIdPassed?userId=${encodeURIComponent(userIdValue)}`,
        androidInfo: {
          androidPackageName: androidPackageName,
        },
        navigationInfo: {
          enableForcedRedirect: 1,
        },
        iosInfo: {
          iosBundleId: iosBundleId,
          iosAppStoreId: '1565527320',
        },
        socialMetaTagInfo: {
            socialImageLink: 'https://i.ibb.co/fCGQ4jv/hot-stocks-to-buy-now-hellostocker-ai.jpg',
            socialTitle:'HelloStocker AI',
            socialDescription: "🌟 We are a team of ex Goldman Sachs and Bank of America Investment Managers with over 15 years of trading experience🚀 We combined our efforts with ex Google AI and Open AI Engineers to build an AI model that sends you buy and sell signals based on:  - Social Platform and Sentiment Analysis: Analyzing social platform trends and sentiment analysis to predict which stocks are about to blow up,  - Financial Statement and Wall Street Analysts ratings: Leveraging revenues, profitability and earnings report to predict which companies will outperform / are undervalued,  - Macro Economic and Investment Styles: Studying which stage of the economy we are at to predict which investment style factor will be performing better,  - Company Competitive Advantage: Understanding what makes a company attractive with respect to peers  - Technical Trading: Using technical trading and volume techniques to understand when is the best point to buy or sell a stock  - Artificial Intelligence and Big Data: we use AI models to generate investing decisions driven by the optimization of a utility function that takes all the previous parameters into account"
        },
        analyticsInfo: {
          googlePlayAnalytics: {
            utmCampaign: utmParamsFinal.campaign,
            utmMedium: utmParamsFinal.medium,
            utmSource: utmParamsFinal.source,
          },
           itunesConnectAnalytics: {
              at: utmSourceValue,
              ct: utmCampaignValue,
              mt: utmMediumValue,
              pt: utmSourceValue
            },
        },
        },
    }),
  });

  if (!response.ok) {
     console.log('Response:', await response.text());

    throw new Error(`Failed to generate dynamic link: ${response.status}`);
  }

  const result = await response.json();
  return result.shortLink;
};


function NewsletterSignUp({ from }: Props){
{/*
const Alert = styled.p`
    position: relative;
    padding: 0.4rem;
    margin: 0.5rem;
    color: white;
    text-align: center; font-size: 1.2rem;
    border: 1px solid rgba (255, 255, 255, 0.2); border-radius: 10px;
    background: rgba(0, 255, 0, 0.1); backdrop-filter: blur (10px);
    z- index: 3;
`;

const Button = styled.button`
    position: relative;
    padding: 0.4rem;
    margin: 0.5rem;
    color: white;
    text-align: center; font-size: 1.2rem;
    border: 1px solid rgba (255, 255, 255, 0.2); border-radius: 10px;
    background: rgba(0, 255, 0, 0.1); backdrop-filter: blur (10px);
    z- index: 3;
`;

const Form = styled.form`
    position: relative;
    padding: 3rem; min-width: 500px;
    border-radius: 5px;
    box-shadow: 0 0 30px #333;
    background: rgba (255, 255, 255, 0.1);
    border: solid 1px rgba(255, 255, 255, 0.2);
    backgroud-clip: padding-box;
    backdrop-filter: blur(10px);
    z-index:2;
`;

const Input = styled.input`
    padding:10px;
    border-radius: 10px 0 0 10px;
    border: none;
    with: 80%;
    outline: none;
    color: #cf1d22;
`;


const Container = styled.div`
    position:relative;
`;
const Div = styled.div`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: Linear-gradient(to right, #414345. #232526);
    overflow:hidden;
`;
*/}
    const { sessionData, setSessionData } = useSession();

    const [input,setInput] = useState("");
    const [message,setMessage] = useState("");
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

    let [showDropdown, setShowDropdown] = useState(false);
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


    const inputHandler = (e) => {
        setInput(e.target.value);
    };
    const db = getFirestore();

    const submitHandler = ()=> {

            emitEvent('updateVariable', 3);

            console.log(input);
            //add to firebase
            const dateTime = Date.now();
            const unixTime = Math.floor(dateTime / 1000);
            const unixTimeStr = unixTime.toString();

            const sessionId = sessionData.sessionId || '';

            const randomString = Math.random().toString(20).substring(2, 14) + Math.random().toString(20).substring(2, 14);
            const docId = unixTimeStr + (sessionData.sessionId || deviceInfo.language + deviceInfo.platform + deviceInfo.screenWidth + deviceInfo.screenHeight+randomString);


              var storedUtmParams = localStorage.getItem('utmParams');
             var utmCampaignValue=`defaultWeb_${from}`;
             var utmSourceValue=`defaultWeb`;
             var utmMediumValue=`defaultWeb_${from}`;
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
                emailTime: serverTimestamp(),
                time: serverTimestamp(),
                unixTime: unixTime,
              userAgent: deviceInfo.userAgent,
              platform: deviceInfo.platform,
              language: deviceInfo.language,
              screenWidth: deviceInfo.screenWidth,
              screenHeight: deviceInfo.screenHeight,
              from: from,
                utmCampaignValue:utmCampaignValue,
                utmSourceValue:utmSourceValue,
                utmMediumValue:utmMediumValue,
                }, { merge: true });

            if (sessionId === ''){
                setSessionData({ ...sessionData, sessionId: docId });
            }

            setShowDropdown(true)
            setInput("");
            setIsSubmitted(true)
            setIsExploding(true)


              // Log a custom event to Google Analytics
              ReactGA.initialize('G-JPXMZYD5DY');
              const intervalId = setInterval(() => {
                    if (window.gtag) {
                      clearInterval(intervalId);
                      console.log('gtag');
                      // Replace with your analytics tracking code
                      window.gtag('event', 'getTheAppClicked', {
                        'from': from,
                        'action': 'clicked',
                        'utm_campaign': utmCampaignValue||'notDefined',
                        'utm_source': utmSourceValue||'notDefined',
                        'utm_medium': utmMediumValue||'notDefined',
                        // Add any additional parameters you want to track
                      });
                    } else {
                  console.log('no gtag');}
              }, 100);


            import("react-facebook-pixel")
              .then((x) => x.default)
              .then((ReactPixel) => {
                ReactPixel.init('3644450535825105');
                ReactPixel.trackCustom('getTheAppClicked', {location: 'hero'});
              });
           {/*
           setMessage(<InstallButtonsWithQR/>);
           setTimeout(
                () => {
                    setMessage("");
                },
                3000,
            )*/}

    }

    return (
    <center>

    <>{isExploding && <ConfettiExplosion
                width={1600}
                particleCount={250} // Equivalent to particleCount
                duration={2000} // Equivalent to duration
                 force={0.8} // Equivalent to force
                />}</>


    <div style={{'background': 'Linear-gradient(to right, #414345. #232526)', 'display': 'fixed'}}>

 <animated.div
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
    >
            {isSubmitted===false &&
                <button type="submit"
                onClick={submitHandler}
                style={{
                 'paddingTop': '14px',
              'paddingBottom': '14px',
              'color': 'black',
               'width':'40vw',
              'textAlign': 'center',
              'fontSize': 'min(18px,max(16px,2vw))',
              'borderRadius': '30px 30px 30px 30px',
              'background': 'black',
              'maxWidth':'200px',
              'boxShadow': '0px 0px 30px rgba(250, 250, 250, 0.8)',
               }}>  <b style={{'color':'white', 'textShadow': '0px 0px 4px rgba(0, 0, 0, 0.5)'}}>Get It Now→</b>
                </button>
            }
            </animated.div>
           {showDropdown &&     <center> <h1 className="text-4xl md:text-4xl font-bold tracking-tighter leading-tight" style={{ color: 'white', lineHeight: 1.3,textShadow: '0px 0px 3px rgba(0, 0, 0, 1)',  }} >

                </h1>    </center>}
            {showDropdown && <InstallButtonsWithQR/>}


            {/*
            {message && <alert> {message} </alert>}
            )*/}
    </div>
    </center>
    )

}



export default NewsletterSignUp;