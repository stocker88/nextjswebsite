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

            <div className="container">

             <div className="split-item">
<div style={{paddingTop: 10}}></div>
                  <h3 className="text-3xl md:text-6xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'white', fontFamily: 'arial',lineHeight: 1.3}}>
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
                </h3>

        </div>
        </div>
<center>
<div className="container">
     <div className="split-item">
<h3 className="text-3xl md:text-6xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'white', fontFamily: 'arial',lineHeight: 1.3}}>
                   <i>     We Predicted Netflix +40% </i>
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

        </div>
        </div>
        </center>
<br></br>
  <br></br>

        <IntroDataset/>
<div className="container">
     <div className="split-item">
<div style={{paddingTop: 10}}></div>
                <h3 className="text-3xl md:text-6xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'white', fontFamily: 'arial',lineHeight: 1.3}}>
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
                <br></br>
                <br></br>
                <br></br>
</h3>

        </div>
        </div>

<center>
<div className="container">
     <div className="split-item">
<h3 className="text-3xl md:text-6xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'white', fontFamily: 'arial',lineHeight: 1.3}}>

            <i>      Dividend Stocks +20% Yield </i>
                  </h3>



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

        </div>
        </div>
</center>
<br></br>
<br></br>
    <br></br>
    <center>
                  <div className="container">
   <div className="split-item">
                <div className="split-item-content reveal-from-left" data-reveal-container=".split-item">

                  <h3 className="text-3xl md:text-6xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'white', fontFamily: 'arial',lineHeight: 1.3}}>
                <i>    Tesla Competition Analysis </i>
                    </h3>

                </div>

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

              </div>
              </div>
</center>
              <br></br>
<br></br>
 <br></br>
        <AboutUs/>
    <div className="container">
   <div className="split-item">
        <h3 className="text-3xl md:text-6xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'white', fontFamily: 'arial',lineHeight: 1.3}}>
        The Vision: End Social Inequalities
        <br></br>
        <br></br>
        The Mission: Give Everyone Equal Chances To Build Wealth
        <br></br>
        <br></br>
       Our CEO managed billions for Wall Street banks
       <br></br>
       <br></br>
       Our CTO deployed AI technologies for FAANG companies
        <br></br>
        <br></br>
       We predicted Netflix +40% return, Tesla +3,000% and Nvidia +6,000%
        <br></br>
        <br></br>
        </h3>
</div>
</div>

<br></br>
              <br></br>
              <br></br>

<center>

                  <div className="container">
   <div className="split-item">
                <div className="split-item-content reveal-from-left" data-reveal-container=".split-item">
                  <h3 className="text-3xl md:text-6xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'white', fontFamily: 'arial',lineHeight: 1.3}}>
                 <i>     Unlimited Virtual Money </i>
                    </h3>

                </div>

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

              </div>
              </div>
</center>

              <br></br>

              <br></br>

<center>

                  <div className="container">
   <div className="split-item">
                <div className="split-item-content reveal-from-left" data-reveal-container=".split-item">
                  <h3 className="text-3xl md:text-6xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'white', fontFamily: 'arial',lineHeight: 1.3}}>

                        <br></br>
                <i>        Is it a Bubble? Look at Nvidia Earnings </i>
                    </h3>

                </div>

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

              </div>
              </div>
              </center>
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


<br></br>


    </>
  )
}