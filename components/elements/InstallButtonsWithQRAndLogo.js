import React from 'react';
import classNames from 'classnames';
import Image from 'next/image';
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
                                           src='/assets/images/hellostocker.webp'
                                           alt="AI powered Virtual Investing Advisor App analysing hedge fund trading economic and financial data to find the next Nvidia, Tesla, Roblox, the Next Apple"
                                          width={151}  height={151}

                                           />
                 <br></br>
                       <a href="https://apps.apple.com/app/stocker/id1565527320?platform=iphone" target="_blank" onClick={sendOutboundApple}>
                    <Image
                     src='/assets/images/appledownloadlogo.webp'
                     alt="hellostocker app stocks to buy ai stocks to watch market financial advisor economic tools investing virtual trading"
                    width={151}  height={44.7966}
                     />
                     </a>

            <div style={{paddingTop: 10}}></div>
                    <a href="https://play.google.com/store/apps/details?id=com.newcompany.stocker" target="_blank" onClick={sendOutboundAndroid}>
                       <Image
                      src='/assets/images/googledownloadlogo.webp'
                      alt="hellostocker app stocks to buy ai stocks to watch market financial advisor economic tools investing virtual trading"
                     width={151 }
                    height={44.7966}
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
                        src='/assets/images/hellostocker.webp'
                        alt="AI powered Virtual Investing Advisor App analysing hedge fund trading economic and financial data to find the next Nvidia, Tesla, Roblox, the Next Apple"
                       width={160}

                        />
         <br></br>
           <Zoom><Image
                           src={'/assets/images/qrcode.webp'}
                          width={160}
                          alt='hellostocker ai app'
                           /></Zoom>

                                 <div style={{paddingTop: 10}}></div>
                                                                         <Image
                                                                          src='/assets/images/appledownloadlogo.webp'
                                                                          alt="hellostocker ai financial advisor virtual trading app hot stocks to buy now apple store logo"
                                                                         width={131}
                                                                          />


                                                                 <div style={{paddingTop: 10}}></div>

                                                                            <Image
                                                                           src='/assets/images/googledownloadlogo.webp'
                                                                           alt="hellostocker ai financial advisor virtual trading app hot stocks to buy now play store logo"
                                                                          width={130}
                                                                          height={38.566}
                                                                           />

                          <br></br>
<br></br><br></br>
          </section>
          )
}

export default InstallButtonsWithQRAndLogo;