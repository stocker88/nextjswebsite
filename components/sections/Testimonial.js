import React, { useEffect, useState } from 'react';

import LinkedInIcon from '../../components/linkedinicon';
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
        id: 'item-1',
        renderItem: (
             <center style={{width:'100%'}}>

            <a href='https://www.linkedin.com/in/dorianbilinski/' target="_blank" >
              <Image
                 src='/assets/images/testimonies/dorian.webp'
                 alt="Features tile icon 06"
                 width={130}
                 height={130}
                 style={{
                 'borderRadius': '45px 45px 45px 45px',
                 'border': '2px solid rgba(255, 255, 255, 1)'
                 }}
                />

                 <p className="text-1xl leading-relaxed mb-4" style={{'color':'lightgrey', padding:'1.5rem','textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' , 'maxWidth':'650px', 'textAlign': 'left',}}>

                    <b className="text-lg md:text-3xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'#493bc3'}}> Social Hype, Momentum, Option Trading and Earnings Forecast: AI trading signals that work </b>
                    <br></br>
                   <br></br>

                    "You'll receive clear AI Trade Signals: what to buy, when to sell, what signal drives AI, explanations and target sell price...
                    What I love most are the 3 hot stocks to buy every week before they blow up. I get notified live and track AI recommendations performance. Customer support is great too, always available even on weekends."
                    <br></br>
                    <br></br>
                    <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px', // Adjust the gap between the icon and the text as needed
                                  }}>
                    <LinkedInIcon/>

                          <div style={{
                                          marginLeft: '10px', // Adjust this if needed to space out the text from the icon
                                        }}>
               <b>  Dorian Bilinski
                 <br></br>
                 Data Science Manager - NLP Research   </b>

                </div></div>
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
                   <p className="text-1xl leading-relaxed mb-4" style={{'color':'lightgrey', padding:'1.5rem','textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' , 'maxWidth':'650px', 'textAlign': 'left',}}>

                      <b className="text-lg md:text-3xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'#493bc3'}}> Stock Recommendations that Drive Performance </b>
                      <br></br>
                      <br></br>
                      "The AI tailors recommendations to match my preferences. You can access Long Term and Short Term strategies and pick what works best for you.
                       It's like a personnal coach who listens to you, available 24/7.
                       It's not just about stocks; it's about market views and profits."

                      <br></br>
                      <br></br>
                      <div style={{
                                                          display: 'flex',
                                                          alignItems: 'center',
                                                          gap: '10px', // Adjust the gap between the icon and the text as needed
                                                        }}>
                                          <LinkedInIcon/>

                                                <div style={{
                                                                marginLeft: '10px', // Adjust this if needed to space out the text from the icon
                                                              }}>
                 <b>  Adrien Chenin
                   <br></br>
                   Quantitative Researcher @ Millenium Hedge Fund   </b>
</div></div>

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

              <p className="text-1xl leading-relaxed mb-4" style={{'color':'lightgrey', padding:'1.5rem','textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' , 'maxWidth':'650px', 'textAlign': 'left',}}>
                  <b className="text-lg md:text-3xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'#493bc3'}}> Simple and Easy to Understand </b>
                  <br></br>
                 <br></br>
                 "I asked for dividend stocks for passive income. Ideally a low risk company with stable yield.
                  I received suggestions straight to the point.
                 Everything is backed up by data, it is easy to review. The UX is friendly and easy to use. Great app and great customer support, I recommend."
                  <br></br>
                  <br></br>
                  <div style={{
                                                      display: 'flex',
                                                      alignItems: 'center',
                                                      gap: '10px', // Adjust the gap between the icon and the text as needed
                                                    }}>
                                      <LinkedInIcon/>

                                            <div style={{
                                                            marginLeft: '10px', // Adjust this if needed to space out the text from the icon
                                                          }}>
             <b>  Fabien Nieto
                                       <br></br>
                                       CEO & Founder @ SEO Marketing Agency   </b>
</div></div>

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
             <p className="text-1xl leading-relaxed mb-4" style={{'color':'lightgrey', padding:'1.5rem','textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' , 'maxWidth':'650px', 'textAlign': 'left',}}>

                <b className="text-lg md:text-3xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'#493bc3'}}> A Safe Playground for Learning </b>
                <br></br>
               <br></br>
               "Practise trading ideas without the risk!
                I used the virtual reality trading platform to make sure it's working well.
                It's a safe playground for learning and gaining confidence in their AI technology."
                <br></br>
                <br></br>
                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px', // Adjust the gap between the icon and the text as needed
                                                  }}>
                                    <LinkedInIcon/>

                                          <div style={{
                                                          marginLeft: '10px', // Adjust this if needed to space out the text from the icon
                                                        }}>
           <b>  Maxime Lonné
             <br></br>
             Paid Media Director @ Eskimoz   </b>
</div></div>

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
<br></br> <br></br>

</center>

    </section>
  );
}

Testimonial.propTypes = propTypes;
Testimonial.defaultProps = defaultProps;

export default Testimonial;
