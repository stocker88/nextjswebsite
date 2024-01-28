import Image from 'next/image'
import React, { useRef, useState, useEffect } from "react";
import classNames from 'classnames';
import { isMobile, browserName } from "react-device-detect";
import IntroDataset from '../../components/introDataset';
import Container from '../../components/container'
import IntroDownload from '../../components/introDownload';
import InstallButtonsWithQRAndLogo from '../elements/InstallButtonsWithQRAndLogo';
import BookingMeetingButton from '../../components/bookingMeetingButton';
import CompoundInterestCalculator from '../../components/compoundInterestCalculator';
import SearchStocks from '../../components/SearchStocks';
import { stockDataSearch } from '../../components/constants';
import Testimonial from '../../components/sections/Testimonial'
import NewsletterSignUp from '../../components/formStocker'

export default function Swipe() {
const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const splitItemStyle = {
    width: '100%',
    marginBottom: '20px', // Space between images on mobile
  };

  const desktopStyles = {
    flexDirection: 'row',
    justifyContent: 'space-between',
  };

  const splitItemImageStyle = {
    borderRadius: '10px',
  };

  return (
    <>

      <center>

            <Image
              width={493.75}
              height={434.4}
              className="shadow-md"
              src="/assets/images/1.webp"
              style={splitItemImageStyle}
              sizes="(max-width: 50%) 33vw, (max-width: 50%) 50vw, 33vw"
              alt="We Predicted Netflix +40% StocksToBuyNow AI Screenshot"
            />


        </center>
<br></br>

      <center>

            <Image
              width={493.75}
              height={434.4}
              className="shadow-md"
              src="/assets/images/2.webp"
              style={splitItemImageStyle}
              sizes="(max-width: 50%) 33vw, (max-width: 50%) 50vw, 33vw"
              alt="We Predicted Netflix +40% StocksToBuyNow AI Screenshot"
            />


        </center>
        <br></br>
      <center>

            <Image
              width={493.75}
              height={434.4}
              className="shadow-md"
              src="/assets/images/3.webp"
              style={splitItemImageStyle}
              sizes="(max-width: 50%) 33vw, (max-width: 50%) 50vw, 33vw"
              alt="We Predicted Netflix +40% StocksToBuyNow AI Screenshot"
            />


        </center>

<br></br>
<br></br>
<br></br>
<br></br>
 <center>
<h2 className="text-2xl md:text-4xl font-bold tracking-tighter leading-tight " style={{letterSpacing: '0.5px','color':'white', 'textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' }} >
        A Safe Ground For Testing
        <br></br>
        Install The Virtual Investing App
        </h2>
<br></br>
    <Testimonial/>


<br></br>
<NewsletterSignUp from='PostTestimonial'/>
         <br></br>
    <br></br>
                               <br></br>
                               <br></br>
                               <br></br>
                               <br></br>
                               <br></br>
                               <CompoundInterestCalculator/>
                               <br></br>
                               <br></br>
                               <br></br>
                               <br></br>
                               <br></br>
                               <br></br>
<br></br>
         <br></br>

         </center>

<br></br>
<br></br>
<Container>
<center>
     <br></br>
        <br></br>
    <section className="flex-col  flex items-center md:justify-between mt-16 mb-16 md:mb-12">
      <h2 className="text-2xl md:text-4xl font-bold tracking-tighter leading-tight " style={{letterSpacing: '0.5px','color':'white', 'textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' }} >
        Should You Buy Tesla?
        <br></br>
        <br></br>
        AI Picked Ferrari
         <br></br>
         <br></br>
         Better Alternative: +28% Over Performance
<br></br>
         <br></br>
         Maximize Your Profits
        </h2>
    </section>
    </center>
    <br></br>
    </Container>

    <center>

        <Image
          width={500}
          height={500}
          className="shadow-md"
          src="/assets/images/teslarace.webp"
          style={splitItemImageStyle}
          sizes="(max-width: 70%) 33vw, (max-width: 70%) 50vw, 33vw"
          alt="Tesla vs Ferrari"
        />

    </center>


<br></br>

<br></br><br></br>
              <br></br>

         <br></br>
                  <br></br>
             <br></br>
         <section className="flex-col  flex items-center md:justify-between mt-16 mb-16 md:mb-12">
               <h2 className="text-2xl md:text-4xl font-bold tracking-tighter leading-tight " style={{letterSpacing: '0.5px','color':'white', 'textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' }} >
                 Access AI Price Predictions:
           </h2>
             </section>

                 <SearchStocks stockData={stockDataSearch} />
                 <br></br>
                          <br></br>

                          <br></br>





 <br></br>


 <br></br>


 <br></br>


 <br></br>

<br></br>


    </>
  )
}