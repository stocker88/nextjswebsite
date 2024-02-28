import React, { useEffect, useState } from 'react';

import classNames from 'classnames';
import { SectionTilesProps } from '../../utils/SectionProps';
import Image from 'next/image'
import { useSpringCarousel } from 'react-spring-carousel'
import { isMobile } from "react-device-detect";

const propTypes = {
  ...SectionTilesProps.types
}


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
            socialTitle:'HelloStocker AI',
            socialDescription: "🌟 We are a team of ex Goldman Sachs and Bank of America Portfolio Managers and Traders with over 15 years of experience in investing.🚀 We combined our efforts with ex Google AI and Open AI Engineers to build an AI model that sends you buy and sell signals based on:  - Social Platform and Sentiment Analysis: Analyzing social platform trends and sentiment analysis to predict which stocks are about to blow up,  - Financial Statement and Wall Street Analysts ratings: Leveraging revenues, profitability and earnings report to predict which companies will outperform / are undervalued,  - Macro Economic and Investment Styles: Studying which stage of the economy we are at to predict which investment style factor will be performing better,  - Company Competitive Advantage: Understanding what makes a company attractive with respect to peers  - Technical Trading: Using technical trading and volume techniques to understand when is the best point to buy or sell a stock  - Artificial Intelligence and Big Data: we use AI models to generate investing decisions driven by the optimization of a utility function that takes all the previous parameters into account"
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

const defaultProps = {
  ...SectionTilesProps.defaults
}

const Ratings = ({
  ...props
}) => {

  const outerClasses = classNames(
    'features-tiles section',
  );

  const innerClasses = classNames(
    'Ratings-inner section-inner',
  );

  const tilesClasses = classNames(
    'tiles-wrap',
  );
  const splitItemImageStyle = {
    borderRadius: '10px',
  };

const [index, setIndex] = useState(0);
    const [dynamicLink, setDynamicLink] = useState(null);


        useEffect(() => {
            if (isMobile) {
               const fetchData = async () => {
                  const link = await generateDynamicLink();
                  setDynamicLink(link);
                  console.log('open1')
                };

                fetchData();
            }
        }, []); // Empty depend


  return (
    <section
      {...props}
      className={outerClasses}
    >


    <center style={{width:'100%'}}>
    <a href={dynamicLink} target="_blank">
        <Image
          width={438*0.8}
          height={875*0.8}
          className="shadow-md"
          src="/assets/images/appstorerating.png"
          style={splitItemImageStyle}

          alt="App Store Ratings Reviews "
        />
</a>
    </center>



    </section>
  );
}

Ratings.propTypes = propTypes;
Ratings.defaultProps = defaultProps;

export default Ratings;
