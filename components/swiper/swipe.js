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
import IntroDownload from '../../components/introDownload';
import InstallButtonsWithQRAndLogo from '../elements/InstallButtonsWithQRAndLogo';
// install Swiper modules
SwiperCore.use([EffectCoverflow,Pagination,Autoplay]);

export default function Swipe() {

  return (
    <>

            <div className="container">

             <div className="split-item">
<div style={{paddingTop: 10}}></div>
                  <h3 className="text-3xl md:text-6xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'white', textShadow: '2px 2px 2px rgba(0, 0, 0, 0)', fontFamily: 'arial',lineHeight: 1.3}}>
                                - What the Company Business does
                                <br></br>
                                <br></br>
                                - Why the Stock is Growing in Interest
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


                  <div className={
                    classNames(
                      'split-item-image center-content-mobile reveal-from-bottom',
                       'split-item-image-fill'
                    )}
                    data-reveal-container=".split-item">
                 <Zoom>
                 <Image
                    width={450}
                     height={973.91}
                      src='/assets/images/chatgpt.webp'
                      sizes="(max-width: 50%) 33vw, (max-width: 50%) 50vw, 33vw"
                      alt='We Predicted Netflix +40% HelloStocker AI Screenshot'
                      />
                  </Zoom>
                  </div>

        </div>
        </div>
        </center>
<br></br>
  <br></br>
      <h2 className="text-4xl md:text-7xl font-bold tracking-tighter leading-tight md:pr-8" style={{'color':'white', 'textShadow': '2px 2px 2px rgba(0, 0, 0, 0)' }} >
        You Can Practice Trading Ideas
      </h2>
<br></br>
  <div className="split-item">
<div style={{paddingTop: 10}}></div>
                  <h3 className="text-3xl md:text-6xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'white', textShadow: '2px 2px 2px rgba(0, 0, 0, 0)', fontFamily: 'arial',lineHeight: 1.3}}>
                                - We Give You All The Money You Need
                                <br></br>
                                <br></br>
                                - 95% Of Hedge Funds Test Strategies Virtually
                                <br></br>
                                <br></br>
                                - We Don't Want You To Take Risks
                </h3>
        </div>
<center>
<div className="container">
     <div className="split-item">
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
                    height={973.91}
                    sizes="(max-width: 50%) 33vw, (max-width: 50%) 50vw, 33vw"
                    alt='Unlimited Virtual Money HelloStocker Screenshot'
                    />
                    </Zoom>
                </div>

              </div>
              </div>
</center>

<br></br>
              <br></br>
              <br></br>

        <IntroDataset/>
<div className="container">
     <div className="split-item">
<div style={{paddingTop: 10}}></div>
                <h3 className="text-3xl md:text-6xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'white', textShadow: '2px 2px 2px rgba(0, 0, 0, 0)', fontFamily: 'arial',lineHeight: 1.3}}>
                - Wall St Analyst Ratings & Financials
                <br></br>
                <br></br>
                - Social Sentiment & News
                <br></br>
                <br></br>
                - Technical Market Signals AI Screening
                <br></br>
                <br></br>
                - Hedge funds & Famous Figures Trading Activity
                <br></br>
                <br></br>
                <br></br>
</h3>

        </div>
        </div>

<center>
<div className="container">
     <div className="split-item">

              <div className={
                classNames(
                  'split-item-image center-content-mobile reveal-from-bottom',
                   'split-item-image-fill'
                )}
                data-reveal-container=".split-item">
                <Zoom>
                <Image
                  src='/assets/images/dividends.webp'
                    width={600}
                    height={800.4}
                  sizes="(max-width: 50%) 33vw, (max-width: 50%) 50vw, 33vw"
                  alt='Dividend Stocks +20% Yield HelloStocker ipad screenshot'
                  />
                  </Zoom>
              </div>

        </div>
        </div>
</center>

 <br></br> <br></br> <br></br>

        <IntroDownload/>
        <center><InstallButtonsWithQRAndLogo style={{ background: "linear-gradient(#4B6DFD, #617EF6, #FF79FA)"}}/></center>

        <br></br>
        <br></br>
                <br></br>
        <br></br>
        <br></br>



 <br></br>
        <AboutUs/>
    <div className="container">
   <div className="split-item">
        <h3 className="text-3xl md:text-6xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'white', textShadow: '2px 2px 2px rgba(0, 0, 0, 0)', fontFamily: 'arial',lineHeight: 1.3}}>
        Our Mission: Empower Everyone With Financial Growth
         <br></br>
                <br></br>
               We predicted Netflix +40% return, Tesla +3,000% and Nvidia +6,000%
        <br></br>
        <br></br>
       Our CEO managed billions for Wall Street banks
       <br></br>
       <br></br>
       Our CTO deployed AI technologies for FAANG companies
        </h3>
    <center>
                  <div className="container">
   <div className="split-item">


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
                    height={973.91}
                    sizes="(max-width: 50%) 33vw, (max-width: 50%) 50vw, 33vw"
                    alt='Pair Trading TSLA TESLA competition analysis HelloStocker Screenshot'
                    />
                    </Zoom>
                </div>

              </div>
              </div>
</center>
<br></br>
<br></br>
              <br></br>

</div>
</div>

{/*
                  <div className="container">
   <div className="split-item">
                <div className="split-item-content reveal-from-left" data-reveal-container=".split-item">
                    <div className="text-xxs text-color-cyan fw-450 mb-8 center-content-mobile" style={{color:'lightgrey',fontSize:"min(20px,max(15px,1.6vw))", fontFamily: 'arial', fontWeight: 'bold'}}>
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
                  <div className="text-xxs text-color-cyan fw-450 tt-u mb-8 center-content-mobile" style={{color:'blue', fontFamily: 'arial', fontWeight: 'bold'}}>
                    Discuss new with the Stocker community
                    </div>
                  <h3 className="mt-0 mb-12 center-content-mobile" style={{color:'black', fontWeight: 450, fontSize:"min(15px,max(12px,1.3vw))", fontFamily: 'arial'}}>
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
                    alt='stockerapp stocker app crypto news tracker  financial news today  Stocks going viral Crypto going viral find the next big cryptocurrency  financial analysis course  select the best stocks and crypto.   financial literacy course   Make Money how to invest in cryptocurrency   practice investing for beginners   Should I save or invest?  practice investing   free trading simulator Investing for beginners Asset'
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
                                <div className="text-xxs text-color-cyan fw-450 tt-u mb-8 center-content-mobile" style={{color:'blue', fontFamily: 'arial', fontWeight: 'bold'}}>
                                  Competition Analysis
                                  </div>
                                <h3 className="mt-0 mb-12 center-content-mobile" style={{color:'black', fontWeight: 450, fontSize:"min(15px,max(12px,1.3vw))", fontFamily: 'arial'}}>
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