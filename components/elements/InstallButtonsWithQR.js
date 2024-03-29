import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import Image from 'next/image';
import { isMobile } from "react-device-detect";

import 'react-medium-image-zoom/dist/styles.css'
import ReactGA from 'react-ga4';
import QRCode from 'qrcode.react';
import { useSpring, animated } from 'react-spring';


const generateDynamicLink = async () => {
  const apiKey = 'AIzaSyCa9vdoGvXZqMLKg9jZlK0TDsFi23V2qzU';
  const endpoint = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${apiKey}`;

  const link = 'https://stockstobuynow.ai';
  const androidPackageName = 'com.newcompany.stocker';
  const iosBundleId = 'com.newcompany.stocker';

  var storedUtmParams = localStorage.getItem('utmParams');

     var userIdValue = localStorage.getItem('userId')||'defaultUserId';

     var utmCampaignValue='defaultWeb';
     var utmSourceValue='defaultWeb';
     var utmMediumValue='defaultWeb';

     // Check if UTM parameters are stored
     if (storedUtmParams) {
         // Parse the stored JSON string
         var utmParams = JSON.parse(storedUtmParams);

         // Retrieve the specific UTM parameter
         utmCampaignValue = utmParams.campaign;
         utmSourceValue = utmParams.source;
         utmMediumValue = utmParams.medium;
    }

  const utmParamsFinal = {
    campaign: utmCampaignValue,
    medium: utmMediumValue,
    source: utmSourceValue,
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      dynamicLinkInfo: {
        domainUriPrefix: 'https://applink.stockstobuynow.ai',
        link: `${link}/userIdPassed?userId=${encodeURIComponent(userIdValue)}`,
        androidInfo: {
          androidPackageName: androidPackageName,
        },
        navigationInfo: {
          enableForcedRedirect: 1,
        },
        iosInfo: {
          iosBundleId: iosBundleId,
          iosAppStoreId: '1565527320',
        },
        socialMetaTagInfo: {
            socialImageLink: 'https://i.ibb.co/fCGQ4jv/hot-stocks-to-buy-now-hellostocker-ai.jpg',
            socialTitle:'This AI sends you hot stocks to buy before they blow up',
            socialDescription: "Join a community of +6,300 investors"
        },
        analyticsInfo: {
          googlePlayAnalytics: {
            utmCampaign: utmParamsFinal.campaign,
            utmMedium: utmParamsFinal.medium,
            utmSource: utmParamsFinal.source,
          },
           itunesConnectAnalytics: {
              at: utmSourceValue,
              ct: utmCampaignValue,
              mt: utmMediumValue,
              pt: utmSourceValue
            },
        },
        },
    }),
  });

  if (!response.ok) {
     console.log('Response:', await response.text());

    throw new Error(`Failed to generate dynamic link: ${response.status}`);
  }

  const result = await response.json();
  return result.shortLink;
};


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

        const [dynamicLink, setDynamicLink] = useState(null);
        const [isVisible, setIsVisible] = useState(false);
        useEffect(() => {
           const fetchData = async () => {
              const link = await generateDynamicLink();
              setDynamicLink(link);
              console.log('open1')

              if (link && isMobile) {
                console.log('open2')
                window.open(link, '_blank');
              }
            };

            fetchData();
            setIsVisible(true);
        }, []); // Empty depend

          const springProps = useSpring({
            transform: isVisible ? 'scale(1)' : 'scale(0)',
            config: { duration: 1000 }, // Adjust the duration as needed
          });

        if (isMobile){
        return (isVisible && (<section
                     {...props}
                   >
                   <animated.section style={springProps} {...props}>
                <div>
                 <br></br>
                       <a href={dynamicLink} onClick={sendOutboundApple}>
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
                    <a href={dynamicLink} onClick={sendOutboundAndroid}>
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
                     </section>)

        )
        }

              return (
               isVisible && ( <section
                           {...props}
                         >
             <animated.section style={springProps} {...props}>
               <div>

                <div style={containerStyle}>
                  {dynamicLink && <QRCode value={dynamicLink} style={imageStyle} />}
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
          </section>)
              );

}

export default InstallButtons;