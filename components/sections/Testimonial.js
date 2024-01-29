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

const Testimonial = ({
  ...props
}) => {

  const outerClasses = classNames(
    'features-tiles section',
  );

  const innerClasses = classNames(
    'testimonial-inner section-inner',
  );

  const tilesClasses = classNames(
    'tiles-wrap',
  );
  const splitItemImageStyle = {
    borderRadius: '10px',
  };

const [index, setIndex] = useState(0);
    const [dynamicLink, setDynamicLink] = useState(null);

const slides =    [
      {
        id: 'item-0',
        renderItem: (



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


        )
      },{
        id: 'item-1',
        renderItem: (
             <center style={{width:'100%'}}>

            <a href='https://www.linkedin.com/in/hagege/' target="_blank" >
              <Image
                 src='/assets/images/testimonies/jerome.webp'
                 alt="Features tile icon 06"
                 width={130}
                 height={130}
                 style={{
                 'borderRadius': '45px 45px 45px 45px',
                 'border': '2px solid rgba(255, 255, 255, 1)'
                 }}
                />
                 <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey', padding:'2rem','textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' , 'maxWidth':'650px', 'textAlign': 'left',}}>

                    <b className="text-2xl md:text-5xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'#493bc3'}}> Saves 130+ Hours of Investing Research per Month </b>
                    <br></br>
                   <br></br>



                    <i>"HelloStocker AI tells me what to buy and sends data and explanations.
                    Once I understand why and agree I can pass my trades with eToro or Robinhood. What I love the most is when the AI sends me notifications when it's time to sell and take profits. They advise me and have my final interests in mind: big gains."</i>
                    <br></br>
                    <br></br>
               <b>  Jerome Hagege
                 <br></br>
                 Data Science Manager - NLP Research   </b>


                  </p>

                 </a>
                 </center>
        )
      },
      {
        id: 'item-2',
        renderItem: (
            <center style={{width:'100%'}}>
             <br></br>
          <a href='https://www.linkedin.com/in/adrien-chenin-306b6131/' target="_blank" >

                 <Image
                   src='/assets/images/testimonies/adrien.webp'
                   alt="Features tile icon 06"
                   width={130}
                   height={130}
                   style={{
                   'borderRadius': '45px 45px 45px 45px',
                   'border': '2px solid rgba(255, 255, 255, 1)'
                   }}
                  />
                   <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey', padding:'2rem','textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' , 'maxWidth':'650px', 'textAlign': 'left',}}>

                      <b className="text-2xl md:text-5xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'#493bc3'}}> Stock Recommendations that Drive Performance </b>
                      <br></br>
                      <br></br>
                      <i>"The AI tailors recommendations to match my preferences.
                       I ask the AI what he thinks before making any trade, it's like a personnal coach.

                       Your personal genie available 24/7! It's not just about stocks; it's about the right stocks that deliver profits."</i>

                      <br></br>
                      <br></br>
                 <b>  Adrien Chenin
                   <br></br>
                   Quantitative Researcher @ Millenium Hedge Fund   </b>


                    </p>

                   </a>
               </center>
        )
      },
      {
        id: 'item-2',
        renderItem: (

        <center style={{width:'100%'}}>
         <br></br>
          <a href='https://www.linkedin.com/in/fabienns/' target="_blank" >
             <Image
               src='/assets/images/testimonies/fabien.webp'
               alt="Features tile icon 06"
               width={130}
               height={130}
               style={{
               'borderRadius': '45px 45px 45px 45px',
               'border': '2px solid rgba(255, 255, 255, 1)'
               }}
              />

              <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey', padding:'2rem','textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' , 'maxWidth':'650px', 'textAlign': 'left',}}>
                  <b className="text-2xl md:text-5xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'#493bc3'}}> Simple and Easy to Understand </b>
                  <br></br>
                 <br></br>
                 <i>"I wanted dividend stocks for passive income.
                  StocksToBuyNow AI trading advisor sent me stock recommendations well explained and straight to the point.
                 Finally financial advises that don't require a finance degree💪
                 I receive concise messages with easy-to-read graphs.
                 They have a user friendly ChatGPT like interface.
                 No more financial jargon Harvard show off."</i>
                  <br></br>
                  <br></br>
             <b>  Fabien Nieto
                                       <br></br>
                                       CEO & Founder @ SEO Marketing Agency   </b>


                </p>

               </a></center>


        )
      },
      {
        id: 'item-2',
        renderItem: (
           <center style={{width:'100%'}}>
            <br></br>
            <a href='https://www.linkedin.com/in/maxime-lonn%C3%A9-b38a6829/' target="_blank" >
           <Image
             src='/assets/images/testimonies/maxime.webp'
             alt="Features tile icon 06"
             width={130}
             height={130}
             style={{
             'borderRadius': '45px 45px 45px 45px',
             'border': '2px solid rgba(255, 255, 255, 1)'
             }}
            />
             <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey', padding:'2rem','textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' , 'maxWidth':'650px', 'textAlign': 'left',}}>

                <b className="text-2xl md:text-5xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'#493bc3'}}> A Safe Playground for Learning </b>
                <br></br>
               <br></br>
               <i>"Practise trading ideas without the risk! StocksToBuyNow App nails it!
                It's about making sure you acquire the skillset and profit from it.
                I use the virtual reality trading platform to practice investing ideas in all safety!
                It's a safe playground for learning and gaining confidence in their AI technology."</i>
                <br></br>
                <br></br>
           <b>  Maxime Lonné
             <br></br>
             Paid Media Director @ Eskimoz   </b>


              </p>

             </a>
             </center>
        )
      }
    ];


        const {
          carouselFragment,
         slideToPrevItem,
         slideToNextItem
        } = useSpringCarousel({
          withLoop: true, // -> make me loop!
        items: slides,
        });

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
<center>
      <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                  width: '100%',
                   }}>
        {carouselFragment}


      </div>
</center>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0px' }}>
          {slides.map((_, i) => (
            <div
              key={i}
              className={`dot ${index === i ? 'active' : ''}`}
              style={{
                backgroundColor: index === i ? 'white' : 'grey',
                boxShadow: index === i ? '0 0 5px rgba(255, 255, 255, 1)' : 'none',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                margin: '0 5px', // Adjust as needed
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '10px' }}>
                {/* Previous Button */}
                <button
                  style={{ color: 'white' }}
                  onClick={() => {
                    console.log('Previous button clicked');
                    slideToPrevItem();
                    setIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
                  }}
                >Previous</button>

                {/* Next Button */}
                <button style={{ padding: '10px 20px', color: 'white',}}
                   onClick={() => {
                                    console.log('Previous button clicked');
                                    slideToNextItem();
                                    setIndex((prevIndex) => (prevIndex + 1 + slides.length) % slides.length);
                                  }}>Next</button>
              </div>
<br></br> <br></br>



    </section>
  );
}

Testimonial.propTypes = propTypes;
Testimonial.defaultProps = defaultProps;

export default Testimonial;
