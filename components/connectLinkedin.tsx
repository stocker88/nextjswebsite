import React, { Component } from 'react';
import Layout from '../components/layout'
import LinkedInIcon from '../components/linkedinicon';

function LinkedInButton () {
 //REMOVED FIREBASE
  return (
    <div>
    <center>
        <button>
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
