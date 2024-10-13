import Image from 'next/image'
import React, { useRef, useState, useEffect } from "react";
import classNames from 'classnames';
import { isMobile, browserName } from "react-device-detect";
import IntroDataset from '../../components/introDataset';
import Container from '../../components/container'
import IntroDownload from '../../components/introDownload';
import InstallButtonsWithQRAndLogo from '../elements/InstallButtonsWithQRAndLogo';
import LinkedInButton from '../../components/connectLinkedin';
import SearchStocks from '../../components/SearchStocks';
import { stockDataSearch } from '../../components/constants';
import Testimonial from '../../components/sections/Testimonial'
import Ratings from '../../components/sections/Ratings'
import NewsletterSignUp from '../../components/formStocker'
import LinkedInIconWhite from '../../components/linkediniconwhite';

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
                              width: '100%', // Take up 90% of the screen width
                              maxWidth: '1800px', // Set a maximum width of 1000 pixels
                              margin: '0 auto', // Center the sections horizontally
                           }}>
      <center>

            <Image
              width={543.125}
              height={477.84}
              src="/assets/images/1.webp"
              style={splitItemImageStyle}
              sizes="(max-width: 80%) 83vw, (max-width: 80%) 90vw, 53vw"
              alt="We Predicted Netflix +40% StocksToBuyNow AI Screenshot"
            />


        </center>
<br></br>

      <center>

            <Image
              width={543.125}
              height={477.84}
              src="/assets/images/2.webp"
              style={splitItemImageStyle}
              sizes="(max-width: 50%) 33vw, (max-width: 50%) 50vw, 33vw"
              alt="We Predicted Netflix +40% StocksToBuyNow AI Screenshot"
            />


        </center>
        <br></br>
      <center>

            <Image
              width={543.125}
              height={477.84}
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
 <center>
 <section style={{

                   borderBottom: '0.03px solid #333', // Adjust the color and style as needed
                  paddingBottom: '5px', // Adjust the padding to give some space between the line and content
                  marginBottom: '10px', // Adjust the margin to give some space between sections
                  margin: '0 auto', // Center the sections horizontally
                   }}>

<br></br>
<br></br>
<br></br>
<h2 className="text-xl md:text-3xl font-bold tracking-tighter leading-tight " style={{letterSpacing: '0.5px','color':'white', 'textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' }} >
        A Safe Ground For Testing
        <br></br>
        Install The Social Virtual Investing App
        <br></br>
        Members are Posting Reviews and Results
        </h2>


<Ratings/>



                               <br></br></section>

                               <br></br>
                               <br></br>


         </center>




  <center >
  <Container>
<br></br>
         <br></br>
  <br></br>
<a href='https://www.linkedin.com/in/anesshusseinali/' target="_blank" >
<h3 className="text2xl md:text-3xl font-bold tracking-tighter leading-tight " style={{'color':'lightGrey', 'textShadow': '0px 0px 3px rgba(0, 0, 0, 1)'}} >
Meet Your Trading Advisors
<br></br>
<br></br>
</h3>
           <Image
                        src='/assets/images/aness.jpg'
                        alt="StocksToBuyNow AI App"

                        width={156}
                        height={156}
                       style={{
                       borderRadius: '40px',
                       opacity:0.9,
                       width:'min(max(145px,13vw),160px)',
                        height:'min(max(145px,13vw),160px)',
                        }}/>
</a>
<br></br>
<br></br>
<h3 className="text2xl md:text-3xl tracking-tighter leading-tight " style={{'color':'lightGrey', 'textShadow': '0px 0px 3px rgba(0, 0, 0, 1)'}} >

                               Former Goldman Sachs and
                                <br></br>Bank of America Directors
                                </h3>
<br></br>
      <Image
           src='/assets/images/aboutus.jpg'
           alt="About us: a team of ex Goldman Sachs, JP Morgan, Bank of America, Google AI and OpenAI Directors with over 15 years experience in Investing and AI"
             width={384/2}
             height={216/2}
             style={{
                opacity:0.95,
                 borderRadius: '20px',
                 boxShadow: '0px 0px 10px 0px rgba(255, 255, 255, 0.5)' // Adjust values as needed
               }}
           />


                               <br></br>
                               <h3 className="text2xl md:text-3xl tracking-tighter leading-tight " style={{'color':'lightGrey', 'textShadow': '0px 0px 3px rgba(0, 0, 0, 1)'}} >
Over 15 years in Investing and AI
</h3>


<br></br>
         <br></br>
    <LinkedInButton/>
  <br></br>
  <br></br>


              <br></br>
              <br></br>

<br></br>
</Container>
</center>



  <Container>
  <center>
<section style={{
                             borderBottom: '0.3px solid #333', // Adjust the color and style as needed
                                paddingBottom: '5px', // Adjust the padding to give some space between the line and content
                                marginBottom: '10px', // Adjust the margin to give some space between sections
                                width: '90%', // Take up 90% of the screen width
                                maxWidth: '1000px', // Set a maximum width of 1000 pixels
                                margin: '0 auto', // Center the sections horizontally
                             }}/>




                          <br ></br>
                     <br></br>

         <section className="flex-col  flex items-center md:justify-between mt-16 mb-16 md:mb-12">
               <h2 className="text-xl md:text-3xl font-bold tracking-tighter leading-tight " style={{letterSpacing: '0.5px','color':'white', 'textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' }} >
                <center> Earnings Surprise AI Predictions and Price Targets:</center>
           </h2>
             </section>


                 <SearchStocks stockData={stockDataSearch} />
                 <br></br>
                  <section className="flex-col  flex items-center md:justify-between mt-16 mb-16 md:mb-12">
                       <h2 className="text-xl md:text-3xl tracking-tighter leading-tight " style={{letterSpacing: '0.5px','color':'white', 'textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' }} >
                         Ask for Nvidia Best Alternative!<br></br>Better than Tesla: AI Picked Ferrari
                          <br></br>
                          +48% Over Performance

                         </h2>
                     </section>

</center>
</Container>
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