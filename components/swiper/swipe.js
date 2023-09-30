
import React, { useRef, useState, useEffect } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import classNames from 'classnames';
import Image from '../elements/Image';
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination"
import { isMobile, browserName } from "react-device-detect";


// import Swiper core and required modules
import SwiperCore, {
  EffectCoverflow,Pagination,Autoplay
} from 'swiper';

// install Swiper modules
SwiperCore.use([EffectCoverflow,Pagination,Autoplay]);

export default function Swipe() {

  return (
    <>
    <Swiper effect={'coverflow'} slidesPerView={isMobile?1.2 : 2} spaceBetween={0}
    centeredSlides={true} loop={true}
    autoplay={{
              delay: 2200,
              disableOnInteraction: false,
            }}
     coverflowEffect={{
        "rotate": 0,
        "stretch": 0,
        "depth": 450,
        "scale":0.4,
        "modifier": 0.85,
        "slideShadows": false
        }} pagination={{
  "clickable": true
}} className="mySwiper">


             <SwiperSlide>
                  <div className="container">
   <div className="split-item">
                <div className="split-item-content reveal-from-left" data-reveal-container=".split-item">
                  <div className="text-xxs text-color-cyan fw-600 tt-u mb-8 center-content-mobile" style={{color:'blue', fontFamily: 'arial', fontWeight: 'bold'}}>
                    Test your strategies
                    </div>
                  <h3 className="mt-0 mb-12 center-content-mobile" style={{color:'black', fontWeight: 600, fontSize:"min(25px,max(17px,2.3vw))", fontFamily: 'arial'}}>
                    Practise with Virtual money
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
                    src='/assets/images/portfolio.png'
                    width={500}
                    height={500}
                    alt='stockerapp stocker app social trading investment screener free no risk Stocker Stocks etfs fx and crypto bitcoin next'
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
                    Your AI financial advisor available 24/7
                    </div>
                  <h3 className="mt-0 mb-12 center-content-mobile" style={{color:'black', fontWeight: 600, fontSize:"min(25px,max(17px,2.3vw))", fontFamily: 'arial'}}>

                    Find your Best Investing and Budgeting Strategies
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
                    src='/assets/images/chatgpt.png'
                    width={500}
                    height={500}
                    alt='stockerapp stocker app stockerapp stocker app social trading investment screener free no risk Stocker Stocks etfs fx and crypto bitcoin next'
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
                      Tesla vs Ferrari: Profitability Analysis
                    </div>
                  <h3 className="mt-0 mb-12 center-content-mobile" style={{color:'black', fontWeight: 600, fontSize:"min(25px,max(17px,2.3vw))", fontFamily: 'arial'}}>
                    Compare your trade ideas with their Competition
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
                    src='/assets/images/tslavsrace.png'
                    width={500}
                    height={500}
                    alt='stocker ai app money income investing financial invest budgeting trading stocks crypto personalfinance learn'
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
                     Market News & Educational Content
                    </div>
                  <h3 className="mt-0 mb-12 center-content-mobile" style={{color:'black', fontWeight: 600, fontSize:"min(25px,max(17px,2.3vw))", fontFamily: 'arial'}}>
                    Save Time and Build Knowledge
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
                    width={500}
                    height={500}
                    alt='stocker ai app money income investing financial invest budgeting trading stocks crypto personalfinance learn'
                    />
                </div>
                </center>
              </div>
              </div>
              </SwiperSlide>

{/*
                <SwiperSlide>
                  <div className="container">
   <div className="split-item">
                <div className="split-item-content reveal-from-left" data-reveal-container=".split-item">
                  <div className="text-xxs text-color-cyan fw-600 tt-u mb-8 center-content-mobile" style={{color:'blue', fontFamily: 'arial', fontWeight: 'bold'}}>
                    Discuss new with the Stocker community
                    </div>
                  <h3 className="mt-0 mb-12 center-content-mobile" style={{color:'black', fontWeight: 600, fontSize:"min(25px,max(17px,2.3vw))", fontFamily: 'arial'}}>
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
                    width={500}
                    height={500}
                    alt='stockerapp stocker app crypto news tracker  financial news today  Stocks going viral Crypto going viral find the next big cryptocurrency  financial analysis course  select the best stocks and crypto.   financial literacy course   learn how to invest in stocks how to invest in cryptocurrency   practise investing for beginners   Should I save or invest?  practise investing   free trading simulator Investing for beginners Asset'
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
                                <h3 className="mt-0 mb-12 center-content-mobile" style={{color:'black', fontWeight: 600, fontSize:"min(25px,max(17px,2.3vw))", fontFamily: 'arial'}}>
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
                                  width={500}
                                  height={500}
                                  alt='stocker ai app money income investing financial invest budgeting trading stocks crypto personalfinance learn'
                                  />
                              </div>
                              </center>
                            </div>
                            </div>
                            </SwiperSlide>

*/}




<br></br>

  </Swiper>
    </>
  )
}