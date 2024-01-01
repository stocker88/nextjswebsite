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
import LinkedInButton from '../../components/connectLinkedin';
import BookingMeetingButton from '../../components/bookingMeetingButton';
// install Swiper modules
SwiperCore.use([EffectCoverflow,Pagination,Autoplay]);

export default function Swipe() {

  return (
    <>

            <div className="container">

             <div className="split-item">
<div style={{paddingTop: 10}}></div>


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
                    width={320}
                     height={693}
                     className="shadow-md"
                      src='/assets/images/chatgpt2.webp'
                      style={{'borderRadius': '30px 30px 30px 30px'}}
                      sizes="(max-width: 50%) 33vw, (max-width: 50%) 50vw, 33vw"
                      alt='We Predicted Netflix +40% StocksToBuyNow AI Screenshot'
                      />
                  </Zoom>
                  </div>

        </div>
        </div>
        </center>



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
                    src='/assets/images/portfolio2.webp'
                    width={320}
                    height={693}
                    className="shadow-md"
                    style={{'borderRadius': '30px 30px 30px 30px'}}
                    sizes="(max-width: 50%) 33vw, (max-width: 50%) 50vw, 33vw"
                    alt='Unlimited Virtual Money StocksToBuyNow Screenshot'
                    />
                    </Zoom>
                </div>

              </div>
              </div>
</center>
<center>
<br></br>
              <br></br>
              <br></br>

<br></br>
</center>
<br></br><br></br>


        <br></br>
        <br></br>


 <br></br>

 <br></br>
 <br></br>
 <center>
       <AboutUs/>
</center>


         <center>

         <h2 className="text-3xl md:text-5xl font-bold tracking-tighter leading-tight " style={{'color':'lightGrey', 'textShadow': '0px 0px 3px rgba(0, 0, 0, 1)'}} >
                 Ex Goldman Sachs, Bank of America and OpenAI Directors

                 </h2>


                  <h3 className="text-3xl md:text-5xl font-bold tracking-tighter leading-tight " style={{'color':'lightGrey', 'textShadow': '0px 0px 3px rgba(0, 0, 0, 1)'}} >
                 <br></br> Over 15 Years in Investing and AI
                 <br></br>

                 <br></br>

                    <LinkedInButton/>

               </h3>


                 <br></br>

                     </center>
         {/*

             <iframe title='' style={{width: '100%',height: '700px', 'borderRadius': '10px 10px 10px 10px'}} src={'https://meetings-eu1.hubspot.com/meetings/alex-StocksToBuyNow-ai/15-and-30min-meeting?embed=true'}/>
             <script type="text/javascript" src="https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js"></script>

         <center><InstallButtonsWithQRAndLogo style={{ background: "linear-gradient(#4B6DFD, #617EF6, #493bc3)"}}/></center>
         */}

         <br></br>

        <br></br>
        <br></br>



 <br></br>


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
                    alt='StocksToBuyNow app stocks to buy ai stocks to watch market financial advisor economic tools investing virtual trading'
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
                                  alt='StocksToBuyNow app stocks to buy ai stocks to watch market financial advisor economic tools investing virtual trading'
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