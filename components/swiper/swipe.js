import Image from 'next/image'
import React, { useRef, useState, useEffect } from "react";
import classNames from 'classnames';
import { isMobile, browserName } from "react-device-detect";
import IntroDataset from '../../components/introDataset';
import Container from '../../components/container'
import IntroDownload from '../../components/introDownload';
import InstallButtonsWithQRAndLogo from '../elements/InstallButtonsWithQRAndLogo';
import BookingMeetingButton from '../../components/bookingMeetingButton';

import SearchStocks from '../../components/SearchStocks';
import { stockDataSearch } from '../../components/constants';
import Testimonial from '../../components/sections/Testimonial'
import Ratings from '../../components/sections/Ratings'
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
        <section style={{
                           borderBottom: '0.3px solid #333', // Adjust the color and style as needed
                              paddingBottom: '5px', // Adjust the padding to give some space between the line and content
                              marginBottom: '10px', // Adjust the margin to give some space between sections
                              width: '90%', // Take up 90% of the screen width
                              maxWidth: '1000px', // Set a maximum width of 1000 pixels
                              margin: '0 auto', // Center the sections horizontally
                           }}>
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
</section>
<br></br>
<br></br>
<br></br>
 <center>
 <section style={{
                   borderBottom: '0.03px solid #333', // Adjust the color and style as needed
                      paddingBottom: '5px', // Adjust the padding to give some space between the line and content
                      marginBottom: '10px', // Adjust the margin to give some space between sections
                      width: '90%', // Take up 90% of the screen width
                      maxWidth: '1000px', // Set a maximum width of 1000 pixels
                      margin: '0 auto', // Center the sections horizontally
                   }}>
<h2 className="text-xl md:text-4xl font-bold tracking-tighter leading-tight " style={{letterSpacing: '0.5px','color':'white', 'textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' }} >
        A Safe Ground For Testing
        <br></br>
        Install The Virtual Investing App
        </h2>

<Ratings/>



                               <br></br></section>

                               <br></br>
                               <br></br>


         </center>

<Container>
<center>

    <section className="flex-col  flex items-center md:justify-between mt-16 mb-16 md:mb-12">
      <h2 className="text-xl md:text-4xl font-bold tracking-tighter leading-tight " style={{letterSpacing: '0.5px','color':'white', 'textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' }} >
        Better than Tesla: AI Picked Ferrari
         <br></br>
         +42% Over Performance

        </h2>
    </section>

    <br></br>

         <section className="flex-col  flex items-center md:justify-between mt-16 mb-16 md:mb-12">
               <h2 className="text-xl md:text-4xl font-bold tracking-tighter leading-tight " style={{letterSpacing: '0.5px','color':'white', 'textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' }} >
                <center> Earnings Surprise AI Predictions and Price Targets:</center>
           </h2>
             </section>


          </center>
    </Container>
<br></br>
<br></br>
<br></br>
<br></br>
                 <SearchStocks stockData={stockDataSearch} />
                 <br></br>

                          <br></br>
                          <br></br>
                         
                          <br></br>
<Testimonial/>
                          <br></br>
                          <br></br>
                          <br></br>

 <br></br>
<section style={{
                             borderBottom: '0.3px solid #333', // Adjust the color and style as needed
                                paddingBottom: '5px', // Adjust the padding to give some space between the line and content
                                marginBottom: '10px', // Adjust the margin to give some space between sections
                                width: '90%', // Take up 90% of the screen width
                                maxWidth: '1000px', // Set a maximum width of 1000 pixels
                                margin: '0 auto', // Center the sections horizontally
                             }}/>






 <br></br>


 <br></br>


 <br></br>

<br></br>


    </>
  )
}