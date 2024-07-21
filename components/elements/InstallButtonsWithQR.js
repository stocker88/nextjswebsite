import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import Image from 'next/image';
import { isMobile } from "react-device-detect";

import 'react-medium-image-zoom/dist/styles.css'
import ReactGA from 'react-ga4';
import QRCode from 'qrcode.react';
import { useSpring, animated } from 'react-spring';


  const containerStyle = {
    width: 'calc(150px + 20px)', // 200px for the content + 10px padding
    height: 'calc(150px + 20px)', // 200px for the content + 10px padding
    backgroundColor: 'white',
    padding: '20px', // 5px of padding
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxSizing: 'border-box', // Include padding in the total width and height
    'borderRadius': '10px',
    border: '2px solid black',
    boxShadow: '0px 0px 25px 0px rgba(255, 255, 255, 0.5)' // Adjust values as needed
  };
  const imageStyle = {
    width: '150px',
    height: '150px',
  };

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

      const springProps = useSpring({
        transform: 'scale(1)',
        config: { duration: 1000 }, // Adjust the duration as needed
      });

        if (isMobile){
        return (<section
                     {...props}
                   >
                   <animated.section style={springProps} {...props}>
                <div>
                 <br></br>
                       <a href='https://apps.apple.com/app/stocker/id1565527320?platform=iphone' onClick={sendOutboundApple}>
                       <div style={{ width: '151px'}}>
                    <Image
                     src='/assets/images/appledownloadlogo.webp'
                     alt="StocksToBuyNow ai financial advisor virtual trading app hot stocks to buy now apple store logo"
                    width={151 }
                    height={45}
                    layout="responsive"
                    priority={true}
                     />
                     </div>
                     </a>

            <div style={{paddingTop: 10}}></div>
                    <a href='https://play.google.com/store/apps/details?id=com.newcompany.stocker' onClick={sendOutboundAndroid}>
                    <div style={{ width: '151px'}}>
                       <Image
                      src='/assets/images/googledownloadlogo.webp'
                      alt="StocksToBuyNow ai financial advisor virtual trading app hot stocks to buy now play store logo"
                     width={151 }
                    height={45}
                    layout="responsive"
                    priority={true}
                      />
                      </div>
                      </a>
                      <br></br>
                    <br></br>
                    </div>
                    </animated.section>
                     </section>

        )
        }

              return (
                 <section
                           {...props}
                         >
             <animated.section style={springProps} {...props}>
               <div>

                <div style={containerStyle}>
                  {<QRCode value='https://applink.stockstobuynow.ai/invite' style={imageStyle} />}
                </div>

             <div style={{paddingTop: 10}}></div>
                      <div style={{paddingTop: 10}}></div>
                      <div style={{ width: '140px'}}>
                              <Image
                               src='/assets/images/appledownloadlogo.webp'
                               alt="StocksToBuyNow ai financial advisor virtual trading app hot stocks to buy now apple store logo"
                              width={131}
                              height={38.863}
                              layout="responsive"
                               />
                        </div>

                      <div style={{paddingTop: 10}}></div>
                            <div style={{ width: '140px'}}>
                                 <Image
                                src='/assets/images/googledownloadlogo.webp'
                                alt="StocksToBuyNow ai financial advisor virtual trading app hot stocks to buy now play store logo"
                               width={130}
                               height={38.566}
                               layout="responsive"

                                />
                                </div>

          <br></br>
          </div>
           </animated.section>
          </section>
              );

}

export default InstallButtons;