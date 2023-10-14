import React from 'react';
import classNames from 'classnames';
import Image from '../elements/Image';
import { useState } from 'react';


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
                <a href="https://apps.apple.com/app/stocker/id1565527320?platform=iphone" target="_blank" onClick={sendOutboundApple}>
                 <Image
                  src='/assets/images/appledownloadlogo.png'
                  alt="hellostocker app stocks to buy ai stock to watch market financial advisor economic tools investing virtual trading"
                 style={{width:150}}
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

          </section>
          )
}

export default InstallButtons;