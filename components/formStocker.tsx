import { useState } from "react";

import 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore';
import { doc, setDoc } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";

import InstallButtonsWithQR from './elements/InstallButtonsWithQR';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCa9vdoGvXZqMLKg9jZlK0TDsFi23V2qzU",
  authDomain: "stocker-fcda2.firebaseapp.com",
  projectId: "stocker-fcda2",
  storageBucket: "stocker-fcda2.appspot.com",
  messagingSenderId: "269261832880",
  appId: "1:269261832880:web:4b6affd899a01f5f0cf175",
  measurementId: "G-WXHHGB6FSV"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
if (firebaseConfig?.projectId) {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  if (app.name && typeof window !== 'undefined') {
    const analytics = getAnalytics(app);
  }

  // Access Firebase services using shorthand notation
  const db = getFirestore();
}



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
    const [input,setInput] = useState("");
    const [message,setMessage] = useState("");
    let [showDropdown, setShowDropdown] = useState(false);

    const inputHandler = (e) => {
        setInput(e.target.value);
    };
const db = getFirestore();
    const submitHandler = (e) => {
        e.preventDefault();
        if (input){
            console.log(input);
            //add to firebase
             setDoc(doc(db, "contactList", input), {
                email: input,
                time: serverTimestamp(),
                });
            setShowDropdown(true)
            setInput("");

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
    <div style={{'background': 'Linear-gradient(to right, #414345. #232526)', 'display': 'fixed'}}>

            <form onSubmit={submitHandler}
style={{'padding': '10px'}}>

            <br></br>
                <input type="email" placeholder="Enter your email here..."
                onChange={inputHandler}
                value={input}
                style={{
                'padding':'19px',
                'textAlign': 'center',
                'borderRadius': '30px 0 0 30px',
                'width':'45vw',
                'fontSize': 'min(19px,max(15px,2vw))',
                'maxWidth':'315px',
                }}/>
                <button type="submit" style={{
               'padding': '3px',
               'color': 'white',
                'width':'36vw',
               'textAlign': 'right',
               'fontSize': 'min(19px,max(15px,2vw))',
               'borderRadius': '0 30px 30px 0',
               'background': 'white',
               'maxWidth':'225px'
               }}>  <div style={{
                                                   'paddingTop': '16px',
                                                   'paddingBottom': '16px',
                                                   'color': 'white',
                                                    'width':'30vw',
                                                   'textAlign': 'center',
                                                   'display': 'flex', 'justifyContent':'flex-end',
                                                   'fontSize': 'min(19px,max(15px,2vw))',
                                                   'borderRadius': '30px 30px 30px 30px',
                                                   'background': '#3700B3',
                                                   'maxWidth':'220px'
                                                  }}>Show me how</div> </button>
            </form>
           {showDropdown &&     <center> <h1 className="text-3xl md:text-4xl font-bold tracking-tighter leading-tight" style={{ color: 'white', fontFamily: 'arial',lineHeight: 1.3,textShadow: '4px 4px 4px rgba(0, 0, 0, 0)', 'padding': '2rem' }} >
                    Thank you! <br></br>Test it Now We Give You Virtual Money
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