import React from 'react';
import classNames from 'classnames';
import Image from '../elements/Image';
import { useState } from 'react';

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import ReactGA from 'react-ga4';

const innerClasses = classNames(
'hero-inner section-inner',
);

const sendOutboundApple = (event) => {

  ReactGA.event({
   category: 'StoreRedirect',
   action: 'storeClick',
   label: 'AAPL'
 });
}

const sendOutboundAndroid = (event) => {
ReactGA.event({
category: 'StoreRedirect',
action: 'storeClick',
label: 'Android'
});
}

const InstallButtons = ({...props}) => {

       return(
       <section
             {...props}
           >
           <Zoom><Image
                           src={'/assets/images/qrcode.png'}
                          style={{width:120}}
                          alt='stockerapp ai stocker app investing trading'
                           /></Zoom>
                          <br></br>
                          <br></br>
           <a href="https://apps.apple.com/app/stocker/id1565527320" target="_blank" onClick={sendOutboundApple}>
        <Image
         src='/assets/images/appledownloadlogo.png'
         alt="stocker investing for beginners how to invest how to find the best crypto best stocks to invest cryptocurrency stocker crypto monnaie"
        style={{width:150}}
         />
         </a>

<div style={{paddingTop: 10}}></div>
        <a href="https://play.google.com/store/apps/details?id=com.newcompany.stocker" target="_blank" onClick={sendOutboundAndroid}>
           <Image
          src='/assets/images/googledownloadlogo.png'
          alt="stocker how to invest how to find the best crypto best stocks to invest crypto monnaie "
         style={{width:150}}
          />
          </a>
          </section>
          )
}

export default InstallButtons;