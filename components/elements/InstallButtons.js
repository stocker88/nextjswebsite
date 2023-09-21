import React from 'react';
import classNames from 'classnames';
import Image from '../elements/Image';
import { useState } from 'react';


const innerClasses = classNames(
'hero-inner section-inner',
);

const InstallButtons = ({...props}) => {

       return(
       <section
             {...props}
           >
           <a href="https://apps.apple.com/us/app/stocker/id1565527320" target="_blank">
        <Image
         src={require('assets/images/appledownloadlogo.png')}
         alt="stocker how to invest how to find the best crypto best stocks to invest Ebitda Financial risk  Fundamental analysis  Hedge fund  Economics Price to book Price to earnings Debt to equity  Short interest ratio Mutual fund"
        style={{width:130}}
         />
         </a>

        <br></br>

        <a href="https://play.google.com/store/apps/details?id=com.newcompany.stocker" target="_blank">
           <Image
          src={require('assets/images/googledownloadlogo.png')}
          alt="stocker how to invest how to find the best Balance sheet Earning per share Momentum  Technical analysis  Fundamental analysis Factor model Capital accumulation Capital gains tax Diversification finance "
         style={{width:130}}
          />
          </a>
          </section>
          )
}

export default InstallButtons;