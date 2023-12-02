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
import QuoteDisplay from '../../components/inspiration';
// install Swiper modules
SwiperCore.use([EffectCoverflow,Pagination,Autoplay]);

export default function Swipe() {

  return (
    <>

            <div className="container">

             <div className="split-item">
<div style={{paddingTop: 10}}></div>
                  <p className="text-2xl md:text-5xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'white', textShadow: '2px 2px 2px rgba(0, 0, 0, 0)', fontFamily: 'arial',lineHeight: 1.3}}>
                        <br></br>
                        - What the business does and why it has growing interest
                        <br></br>
                        - You receive AI recommendations adapted to your own tastes
                        <br></br>
                        - Interactive analysis with live chat - no boring emails
                        <br></br>
                        - We tell you when to realize your gains
                        <br></br>
                </p>

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
                    width={340}
                     height={735.85}
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
        You Receive Unlimited Money in Virtual Trading
      </h2>
<br></br>
  <div className="split-item">
<div style={{paddingTop: 10}}></div>
                  <p className="text-2xl md:text-5xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'white', textShadow: '2px 2px 2px rgba(0, 0, 0, 0)', fontFamily: 'arial',lineHeight: 1.3}}>
                  <br></br>
                    - You can test trading ideas in a safe virtual reality simulator
                    <br></br>
                    - 99% of Hedge Funds test strategies virtually first
                    <br></br>
                    - It is a safe playground for testing and growing
                    <br></br>
                </p>
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
                    width={340}
                    height={735.85}
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
                  <p className="text-2xl md:text-5xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'white', textShadow: '2px 2px 2px rgba(0, 0, 0, 0)', fontFamily: 'arial',lineHeight: 1.3}}>
                - Market trading signals & AI screening
                <br></br>
                - Wall St analyst ratings & financial data
                <br></br>
                - Social sentiment & News
                <br></br>
                - Hedge Funds & investors trading activity
                <br></br>
                <br></br>
</p>

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

<br></br><br></br>


        <br></br>
        <br></br>
 <br></br> <br></br>
      <br></br><br></br>

     <QuoteDisplay/>
     <br></br> <br></br>
     <br></br> <br></br>
 <br></br><br></br> <br></br>

  <br></br><br></br>
         <IntroDownload/>
         <br></br>
         <center><InstallButtonsWithQRAndLogo style={{ background: "linear-gradient(#4B6DFD, #617EF6, #00f75f)", 'borderRadius': '10px 10px 10px 10px'}}/></center>


         <br></br>
         <br></br>
         <br></br><br></br>

 <br></br>
 <br></br><br></br><br></br>

 <br></br>
 <br></br>
 <center>
       <AboutUs/>
</center>
    <div className="container">
   <div className="split-item">
        <div style={{paddingTop: 10}}></div>
                          <p className="text-2xl md:text-5xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'white', textShadow: '2px 2px 2px rgba(0, 0, 0, 0)', fontFamily: 'arial',lineHeight: 1.3}}>
       <br></br>

       - We traded Billions for Wall Street Hedge Funds
        <br></br>
      <br></br>
       - We build AI technologies for Big Tech companies
       <br></br>
       <br></br>
      - HelloStocker AI predicted Netflix +40%, Nvidia +1,200% and Tesla +3,600%
       <br></br>
       <br></br>
       - Our Mission: Empower You With Financial Growth
        <br></br>
        </p>

</div>
</div>
         <br></br><br></br>

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
                        width={340}
                    height={735.85}
                    sizes="(max-width: 50%) 33vw, (max-width: 50%) 50vw, 33vw"
                    alt='Pair Trading TSLA TESLA competition analysis HelloStocker Screenshot'
                    />
                    </Zoom>
                </div>

              </div>
              </div>
</center>
<br></br><br></br>
         <br></br><br></br>

         <center>

         <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight md:pr-8" style={{'color':'white', 'textShadow': '2px 2px 2px rgba(0, 0, 0, 0)'}} >
                 Speak with our Financial Advisor
                  <br></br> ex Goldman Sachs and Bank of America Trader
                 <br></br> with over 15 years in investing
               </h2>
                 <br></br>
                 <br></br>

                 <a href='https://www.linkedin.com/in/anesshusseinali/' target="_blank" ><button
                             style={{

                                  }}>  <div style={{
                                  'padding': '0.8rem',
                                  'color': 'black',
                                   'width':'31vw',
                                  'textAlign': 'center',
                                  'fontSize': 'min(19px,max(15px,2vw))',
                                  'borderRadius': '30px 30px 30px 30px',
                                  'background': '#00f75f',
                                  'maxWidth':'280px'
                                 }}>Check his LinkedIn</div></button></a>
                 <br></br>
                 <br></br>
         </center>
             <iframe title='' style={{width: '100%',height: '700px', 'borderRadius': '10px 10px 10px 10px'}} src={'https://meetings-eu1.hubspot.com/meetings/alex-hellostocker-ai/15-and-30min-meeting?embed=true'}/>
             <script type="text/javascript" src="https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js"></script>
         {/*
         <center><InstallButtonsWithQRAndLogo style={{ background: "linear-gradient(#4B6DFD, #617EF6, #00f75f)"}}/></center>
         */}
                 <br></br>
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