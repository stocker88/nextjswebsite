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




//export db from other script and import it here

function NewsletterSignUp(){
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
    const submitHandler = (e) => {
        e.preventDefault();
        if (input){
            console.log(input);
            //add to firebase
            const dateTime = Date.now();
            const unixTime = Math.floor(dateTime / 1000);
            const docId = sessionData.sessionId || input;

             setDoc(doc(db, "contactList", docId), {
                email: input,
                time: serverTimestamp(),
                unixTime: unixTime,
              userAgent: deviceInfo.userAgent,
              platform: deviceInfo.platform,
              language: deviceInfo.language,
              screenWidth: deviceInfo.screenWidth,
              screenHeight: deviceInfo.screenHeight,
                }, { merge: true });

            setSessionData({ ...sessionData, email: input });

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
    }

    return (
    <center>
    <>{isExploding && <ConfettiExplosion
                width={1600}
                particleCount={350} // Equivalent to particleCount
                duration={4000} // Equivalent to duration
                 force={0.8} // Equivalent to force
                />}</>
    <div style={{'background': 'Linear-gradient(to right, #414345. #232526)', 'display': 'fixed'}}>

            {isSubmitted===false && <form onSubmit={submitHandler}
style={{'padding': '10px'}}>
            <br></br>
                <input type="email" required placeholder="Enter your email here..."
                onChange={inputHandler}
                value={input}
                style={{
                'padding':'19px',
                'textAlign': 'center',
                'borderRadius': '30px 0 0 30px',
                'width':'47vw',
                'fontSize': 'min(18px,max(14px,2vw))',
                'maxWidth':'315px',
                }}/>
                <button type="submit" style={{
               'paddingTop': '3px',
                'paddingBottom': '3px',
                'paddingRight': '3px',
               'color': 'white',
                'width':'32vw',
               'textAlign': 'right',
               'fontSize': 'min(19px,max(15px,2vw))',
               'borderRadius': '0 30px 30px 0',
               'background': 'white',
               'maxWidth':'225px',
               }}>  <div style={{
                                                   'paddingTop': '16px',
                                                   'paddingBottom': '16px',
                                                   'color': 'black',
                                                    'width':'31vw',
                                                   'textAlign': 'center',
                                                   'fontSize': 'min(18px,max(14px,2vw))',
                                                   'borderRadius': '30px 30px 30px 30px',
                                                   'background': '#00f75f',
                                                   'maxWidth':'220px'
                                                  }}>Show me how→</div> </button>
            </form>}
           {showDropdown &&     <center> <h1 className="text-3xl md:text-4xl font-bold tracking-tighter leading-tight" style={{ color: 'white', fontFamily: 'arial',lineHeight: 1.3,textShadow: '4px 4px 4px rgba(0, 0, 0, 0)', 'padding': '2rem' }} >
                    <br></br>Install now
                    to receive the best stocks & crypto to buy
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