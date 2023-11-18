import Image from 'next/image'
import React, { useRef, useState, useEffect } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import classNames from 'classnames';
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination"
import { isMobile, browserName } from "react-device-detect";
import Zoom from 'react-medium-image-zoom'
import IntroDataset from '../../components/introDataset';
// import Swiper core and required modules
import SwiperCore, {
  EffectCoverflow,Pagination,Autoplay
} from 'swiper';
import AboutUs from '../../components/aboutUs';

// install Swiper modules
SwiperCore.use([EffectCoverflow,Pagination,Autoplay]);

export default function Swipe() {

  return (
    <>

<center>

        <br></br>
            <div className="container">

             <div className="split-item">
                <center>
                  <h3 className="text-3xl md:text-6xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'lightgrey', fontFamily: 'arial',lineHeight: 1.3}}>
                                <br></br>
                                <br></br>
                                - What the Company Business does
                                <br></br>
                                <br></br>
                                - Why it's Growing in Interest
                                <br></br>
                                <br></br>
                                - How the Stock could be more Valuable
                                <br></br>
                                <br></br>
                                - Market Risks & Competitors to watch for
                        <br></br>
                        <br></br>
                        <br></br>

                        We Predicted Netflix +40%
                  </h3>


                  <div className={
                    classNames(
                      'split-item-image center-content-mobile reveal-from-bottom',
                       'split-item-image-fill'
                    )}
                    data-reveal-container=".split-item">
                 <Zoom>
                 <Image
                    width={450}
                     height={450}
                      src='/assets/images/chatgpt.webp'
                      sizes="(max-width: 50%) 33vw, (max-width: 50%) 50vw, 33vw"
                      alt='hellostocker app stocks to buy ai stocks to watch market financial advisor economic tools investing virtual trading'
                      />
                  </Zoom>
                  </div>
            </center>
        </div>
        </div>
<br></br>
  <br></br>
        <IntroDataset/>
        <br></br>
        <div style={{ color: 'white', fontSize: "min(25px,max(19px,2vw))", fontFamily: 'arial', fontWeight: 500,lineHeight: 1,textShadow: '2px 2px 2px rgba(1, 74, 173, 0.6)'}} >
        <br></br>
        <br></br>
        - Wall St Analyst Ratings & Financials
        <br></br>
        <br></br>
        - Social Sentiment & News
        <br></br>
        <br></br>
        - Technical Market Signals
        <br></br>
        <br></br>
        - Hedge fund Trading Activity
        </div>
<br></br>
   <br></br>
                            <br></br>


                  <div className="container">
                 <div className="split-item">
                              <div className="split-item-content reveal-from-left" data-reveal-container=".split-item">
                                <h3 className="text-3xl md:text-6xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'lightgrey', fontFamily: 'arial',lineHeight: 1.3}}>
                                  Dividend Stocks +20% Yield
                                  </h3>

                              </div>
               <center>
                              <div className={
                                classNames(
                                  'split-item-image center-content-mobile reveal-from-bottom',
                                   'split-item-image-fill'
                                )}
                                data-reveal-container=".split-item">
                                <Zoom>
                                <Image
                                  src='/assets/images/dividends.webp'
                                    width={450}
                                    height={450}
                                  sizes="(max-width: 50%) 33vw, (max-width: 50%) 50vw, 33vw"
                                  alt='hellostocker app stocks to buy ai stocks to watch market financial advisor economic tools investing virtual trading'
                                  />
                                  </Zoom>
                              </div>
                              </center>
                            </div>
                            </div>

<br></br>
<br></br>
    <br></br>
                  <div className="container">
   <div className="split-item">
                <div className="split-item-content reveal-from-left" data-reveal-container=".split-item">

                  <h3 className="text-3xl md:text-6xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'lightgrey', fontFamily: 'arial',lineHeight: 1.3}}>
                    Tesla Competition Analysis
                    </h3>

                </div>
                <center>
                <div className={
                  classNames(
                    'split-item-image center-content-mobile reveal-from-bottom',
                     'split-item-image-fill'
                  )}
                  data-reveal-container=".split-item">
                  <Zoom>
                  <Image
                  src='/assets/images/tslavsrace.webp'
                        width={450}
                    height={450}
                    sizes="(max-width: 50%) 33vw, (max-width: 50%) 50vw, 33vw"
                    alt='TSLA TESLA competition analysis best stock to invest in now tesla stocks'
                    />
                    </Zoom>
                </div>
                </center>
              </div>
              </div>

              <br></br>
              <br></br>

<br></br>
 <br></br>
        <br></br>
        <br></br>
        <AboutUs/>

        <div style={{ color: 'white', fontSize: "min(22px,max(18px,1.7vw))", fontFamily: 'arial', fontWeight: 500,lineHeight: 1,textShadow: '2px 2px 2px rgba(1, 74, 173, 0.6)'}} >
        - Our Vision: Put an end to social inequalities by giving everyone equal chances to build wealth.
        <br></br>
        <br></br>
        - Our Mission: Empower the People with clear and transparent insights.
        <br></br>
        <br></br>
       - Our Founders managed billions for Wall Street banks and deployed AI technology for FAANG companies.
        <br></br>
        <br></br>
        - Our AI predicted Netflix +40% return, Tesla +3,000% and Nvidia +6,000%.
        </div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>


<br></br>
              <br></br>
              <br></br>


                  <div className="container">
   <div className="split-item">
                <div className="split-item-content reveal-from-left" data-reveal-container=".split-item">
                  <h3 className="text-3xl md:text-6xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'lightgrey', fontFamily: 'arial',lineHeight: 1.3}}>
                      Unlimited Virtual Money
                    </h3>

                </div>
                <center>
                <div className={
                  classNames(
                    'split-item-image center-content-mobile reveal-from-bottom',
                     'split-item-image-fill'
                  )}
                  data-reveal-container=".split-item">
                  <Zoom>
                  <Image
                    src='/assets/images/portfolio.webp'
                    width={450}
                    height={450}
                    sizes="(max-width: 50%) 33vw, (max-width: 50%) 50vw, 33vw"
                    alt='hellostocker app stocks to buy ai stocks to watch market financial advisor economic tools investing virtual trading'
                    />
                    </Zoom>
                </div>
                </center>
              </div>
              </div>


              <br></br>

              <br></br>




                  <div className="container">
   <div className="split-item">
                <div className="split-item-content reveal-from-left" data-reveal-container=".split-item">
                  <h3 className="text-3xl md:text-6xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'lightgrey', fontFamily: 'arial',lineHeight: 1.3}}>

                        <br></br>
                        Is it a Bubble? Look at Nvidia Earnings
                    </h3>

                </div>
                <center>
                <div className={
                  classNames(
                    'split-item-image center-content-mobile reveal-from-bottom',
                     'split-item-image-fill'
                  )}
                  data-reveal-container=".split-item">
                  <Zoom>
                  <Image
                    src='/assets/images/portfolioVirtual.webp'
                        width={450}
                    height={450}
                    sizes="(max-width: 50%) 33vw, (max-width: 50%) 50vw, 33vw"
                    alt='NVIDIA price graph ticker NVDA find hot stocks to watch today with hellostocker market analytics and ai financial advisor practise with virtual trading'
                    />
                    </Zoom>
                </div>
                </center>
              </div>
              </div>
              <br></br>

{/*
                  <div className="container">
   <div className="split-item">
                <div className="split-item-content reveal-from-left" data-reveal-container=".split-item">
                    <div className="text-xxs text-color-cyan fw-600 mb-8 center-content-mobile" style={{color:'lightgrey',fontSize:"min(20px,max(15px,1.6vw))", fontFamily: 'arial', fontWeight: 'bold'}}>
                     Launch your financial success
                    </div>
                  <h3 className="text-3xl md:text-6xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'lightgrey', fontFamily: 'arial'}}>
                    All the data you need
                    </h3>

                </div>
                <center>
                <div className={
                  classNames(
                    'split-item-image center-content-mobile reveal-from-bottom',
                     'split-item-image-fill'
                  )}
                  data-reveal-container=".split-item">
                  <Image
                    src='/assets/images/educational.png'

                    sizes="(max-width: 50%) 33vw, (max-width: 50%) 50vw, 33vw"
                    alt='hellostocker app stocks to buy ai stocks to watch market financial advisor economic tools investing virtual trading'
                    />
                </div>
                </center>
              </div>
              </div>



                <SwiperSlide>
                  <div className="container">
   <div className="split-item">
                <div className="split-item-content reveal-from-left" data-reveal-container=".split-item">
                  <div className="text-xxs text-color-cyan fw-600 tt-u mb-8 center-content-mobile" style={{color:'blue', fontFamily: 'arial', fontWeight: 'bold'}}>
                    Discuss new with the Stocker community
                    </div>
                  <h3 className="mt-0 mb-12 center-content-mobile" style={{color:'black', fontWeight: 600, fontSize:"min(15px,max(12px,1.3vw))", fontFamily: 'arial'}}>
                     Share insights in Investing channels
                    </h3>

                </div>
                <center>
                <div className={
                  classNames(
                    'split-item-image center-content-mobile reveal-from-bottom',
                     'split-item-image-fill'
                  )}
                  data-reveal-container=".split-item">
                  <Image
                    src='/assets/images/nvdia.png'
                    alt="Features split 02"

                    sizes="(max-width: 50%) 33vw, (max-width: 50%) 50vw, 33vw"
                    alt='stockerapp stocker app crypto news tracker  financial news today  Stocks going viral Crypto going viral find the next big cryptocurrency  financial analysis course  select the best stocks and crypto.   financial literacy course   Make Money how to invest in cryptocurrency   practise investing for beginners   Should I save or invest?  practise investing   free trading simulator Investing for beginners Asset'
                    />
                </div>
                </center>
              </div>
              </div>
              </SwiperSlide>

                <SwiperSlide>
                                <div className="container">
                 <div className="split-item">
                              <div className="split-item-content reveal-from-left" data-reveal-container=".split-item">
                                <div className="text-xxs text-color-cyan fw-600 tt-u mb-8 center-content-mobile" style={{color:'blue', fontFamily: 'arial', fontWeight: 'bold'}}>
                                  Competition Analysis
                                  </div>
                                <h3 className="mt-0 mb-12 center-content-mobile" style={{color:'black', fontWeight: 600, fontSize:"min(15px,max(12px,1.3vw))", fontFamily: 'arial'}}>
                                   Got a trade idea? Compare it with its competitors!
                                  </h3>

                              </div>
                              <center>
                              <div className={
                                classNames(
                                  'split-item-image center-content-mobile reveal-from-bottom',
                                   'split-item-image-fill'
                                )}
                                data-reveal-container=".split-item">
                                <Image
                                  src='/assets/images/twtrvsmeta.png'
                                  alt="Features split 02"

                                  sizes="(max-width: 50%) 33vw, (max-width: 50%) 50vw, 33vw"
                                  alt='hellostocker app stocks to buy ai stocks to watch market financial advisor economic tools investing virtual trading'
                                  />
                              </div>
                              </center>
                            </div>
                            </div>
                            </SwiperSlide>

*/}


</center>

<br></br>


    </>
  )
}