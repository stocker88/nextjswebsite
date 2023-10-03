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
           <a href="https://apps.apple.com/app/stocker/id1565527320?platform=iphone" target="_blank">
        <Image
         src={require('assets/images/appledownloadlogo.png')}
         alt="stocker app investing for beginners how to invest in stocks how to find the best crypto best stocks to invest cryptocurrency stocker"
        style={{width:130}}
         />
         </a>

        <br></br>

        <a href="https://play.google.com/store/apps/details?id=com.newcompany.stocker" target="_blank">
           <Image
          src={require('assets/images/googledownloadlogo.png')}
          alt="stocker app investing for beginners how to invest in stocks how to find the best crypto best stocks to invest cryptocurrency stocker"
         style={{width:130}}
          />
          </a>
          </section>
          )
}

export default InstallButtons;