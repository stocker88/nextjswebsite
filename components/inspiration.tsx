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

import {getFirestore} from 'firebase/firestore';
import { useSession } from '../stockerSession';
import { emitEvent } from '../contexts/store';

type Props = {
  from: string
}


//export db from other script and import it here

function QuoteDisplay({ from }: Props){
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
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isExploding, setIsExploding] = useState(false);
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
            const unixTimeStr = Math.floor(dateTime / 1000).toString();
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
{!showDropdown &&<h2 className="text-3xl md:text-5xl font-bold tracking-tighter leading-tight " style={{maxWidth:'900px','color':'white', 'textShadow': '0px 0px 10px rgba(0, 0, 0, 1)' }}>Opportunities in the stock market are like sunrises; if you wait too long, you'll miss them. - Warren Buffett</h2>}
<br></br>
    <div style={{'background': 'Linear-gradient(to right, #414345. #232526)', 'display': 'fixed'}}>

            {isSubmitted===false &&
                <button type="submit"
                onClick={submitHandler}
                style={{
                 'paddingTop': '16px',
              'paddingBottom': '16px',
              'color': 'black',
               'width':'40vw',
              'textAlign': 'center',
              'fontSize': 'min(20px,max(16px,2.3vw))',
              'borderRadius': '30px 30px 30px 30px',
              'background': 'black',
              'maxWidth':'240px',
              'boxShadow': '0px 0px 30px rgba(250, 250, 250, 0.8)',
               }}>  <b style={{'color':'white', 'textShadow': '0px 0px 4px rgba(0, 0, 0, 0.5)'}}>Investment Tips</b>
                </button>

            }
           {showDropdown &&     <center> <h1 className="text-4xl md:text-4xl font-bold tracking-tighter leading-tight" style={{ color: 'white', lineHeight: 1.3,textShadow: '0px 0px 3px rgba(0, 0, 0, 1)',  }} >
                    Access Investment Tips, Predictions, and more
                </h1>    </center>}

            {showDropdown &&<div style={{paddingTop: 20}}></div>}
            {showDropdown &&<InstallButtonsWithQR/>}


            {/*
            {message && <alert> {message} </alert>}
            )*/}
    </div>
    </center>
    )

}



export default QuoteDisplay;
