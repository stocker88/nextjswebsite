import React from 'react';
import classNames from 'classnames';
import Image from '../elements/Image';
import { useState } from 'react';
import { isMobile } from "react-device-detect";
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

const InstallButtonsWithQRAndLogo = ({...props}) => {
if(isMobile) {
        return (
        <section
                     {...props}
                   >
                   <br></br>
                           <Image
                                           src='/assets/images/hellostocker.png'
                                           alt="We analyze hedge fund trading economic and financial data to find the best stocks and crypto to invest in and deliver an AI powered trading tool on a unified investment social platform driven by ChatGPT 4"
                                          style={{width:151}}

                                           />
                 <br></br>
                       <a href="https://apps.apple.com/app/stocker/id1565527320?platform=iphone" target="_blank" onClick={sendOutboundApple}>
                    <Image
                     src='/assets/images/appledownloadlogo.png'
                     alt="hellostocker app stocks to buy ai stock to watch market financial advisor economic tools investing virtual trading"
                    style={{width:151}}
                     />
                     </a>

            <div style={{paddingTop: 10}}></div>
                    <a href="https://play.google.com/store/apps/details?id=com.newcompany.stocker" target="_blank" onClick={sendOutboundAndroid}>
                       <Image
                      src='/assets/images/googledownloadlogo.png'
                      alt="hellostocker app stocks to buy ai stock to watch market financial advisor economic tools investing virtual trading"
                     style={{width:150}}
                      />
                      </a>
                      <br></br>
                    <br></br>
                     </section>

        )
    }
       return(
       <section
             {...props}
           >
           <br></br>
         <br></br>
        <Image
                        src='/assets/images/hellostocker.png'
                        alt="We analyze hedge fund trading economic and financial data to find the best stocks and crypto to invest in and deliver an AI powered trading tool on a unified investment social platform driven by ChatGPT 4"
                       style={{width:160}}

                        />
         <br></br>
           <Zoom><Image
                           src={'/assets/images/qrcode.png'}
                          style={{width:160}}
                          alt='hellostocker ai app'
                           /></Zoom>
                          <br></br>
<br></br><br></br>
          </section>
          )
}

export default InstallButtonsWithQRAndLogo;