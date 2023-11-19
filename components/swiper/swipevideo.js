
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

export default function SwipeVideo() {

  return (
    <>
    <Swiper class="sample-slider" effect={'coverflow'} slidesPerView={isMobile?1.2 : 2} spaceBetween={0}
    centeredSlides={true} loop={true}
     coverflowEffect={{
        "rotate": 0,
        "stretch": 0,
        "depth": 450,
        "scale":0.4,
        "modifier": 0.85,
        "slideShadows": false
        }} pagination={{
  "clickable": true,
}} className="mySwiper">

             <SwiperSlide>
                  <div className="container">
   <center><iframe width="321" height="571" src="https://www.youtube.com/embed/YbEra3h44oo" title="The mathematics of compounding: personal finance can make you a millionnaire" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></center>
              <br></br><br></br>
              </div>
              </SwiperSlide>

             <SwiperSlide>
                  <div className="container">
   <center><iframe width="321" height="571" src="https://www.youtube.com/embed/6aRrWfg7pL4" title="What would $10,000 invested in Elon Musk&#39;s Tesla be worth today?" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></center>
              <br></br><br></br>
              </div>
              </SwiperSlide>


  <SwiperSlide>
                  <div className="container">
  <center><iframe width="321" height="571" src="https://www.youtube.com/embed/GaFa0YPn4fE" title="#Diamond Hands, we&#39;re not afraid" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></center>
              <br></br><br></br>
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
                                  alt='hellostocker app stocks to buy ai stocks to watch market financial advisor economic tools investing virtual trading'
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