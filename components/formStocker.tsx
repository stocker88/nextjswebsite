import { useState, useEffect } from "react";
import ConfettiExplosion from 'react-confetti-explosion';
import InstallButtonsWithQR from './elements/InstallButtonsWithQR';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import ReactGA from 'react-ga4';
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

//REMOVED FIREBASE

    const [isExploding, setIsExploding] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    let [showDropdown, setShowDropdown] = useState(false);


    const submitHandler = ()=> {

            emitEvent('updateVariable', 3);

            setShowDropdown(true)

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
                    // Add any additional parameters you want to track
                  });
                } else {
              console.log('no gtag');}
          }, 100);

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