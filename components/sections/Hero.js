import React, { useState } from 'react';
import classNames from 'classnames';
import { SectionProps } from '../../utils/SectionProps';
import ButtonGroup from '../elements/ButtonGroup';
import Button from '../elements/Button';
import InstallButtonsWithQR from '../elements/InstallButtonsWithQR';
import Image from 'next/image';
import { openInbox } from 'react'
import Container from '../container'
import NewsletterSignUp from '../formStocker'

const propTypes = {
  ...SectionProps.types
}

const defaultProps = {
  ...SectionProps.defaults
}

const Hero = ({
  className,
  ...props
}) => {



  const outerClasses = classNames(
    'hero section center-content',
    'has-bg-color',
    className
  );

  const innerClasses = classNames(
    'hero-inner section-inner',
  );

  return (
    <section
      {...props}
      className={outerClasses}
    >
<Container>

<center>
      <div className="container-sm has-animations" style={{  zIndex: 10 }}>
          <div className="hero-content">
     <div style={{paddingTop: 'min(110px,20.5vw)'}}></div>

         {/*    <Image
              src={require('assets/images/stockstobuynow.png')}
              alt="StocksToBuyNow app stocks to buy ai stocks to watch market financial advisor economic tools investing virtual trading"
              width={700}
              height={58.33}
              />*/}

        <Image
                  src='/assets/images/stockerRobotIcon.png'
                  alt="StocksToBuyNow AI App"
                  priority={true}
                  width={156}
                  height={156}
                 style={{
                 borderRadius: '10px',
                 opacity:0.9,
                 width:'min(max(145px,13vw),160px)',
                  height:'min(max(145px,13vw),160px)',
                  }}

                  />
            <div className="container-xs">
            <br></br>
            <h1 className="text-3xl md:text-6xl tracking-tighter leading-tight" style={{ color: 'white', lineHeight: 1.2,textShadow: '0px 0px 7px rgba(1, 0, 1, 0.7)', maxWidth: "800px" }} >
                Wish someone told you about Nvidia when it was <b>$50 instead of $500</b>?
              </h1>
              <div style={{paddingTop: 'max(25px,2.2vw)'}}></div>
          <h2  style={{ color: 'white',fontWeight: 600, fontSize: "min(19px,max(17px,3vw))", lineHeight: 1.3,textShadow: '0px 0px 5px rgba(1, 0, 1, 0.7)', maxWidth: "650px" }} >
             Profit 30x Faster with AI Stock Trading Signals: Stocks to Buy Now AI sends you hot stocks to buy before they blow up!
            </h2>
          </div>

        </div>
<div style={{paddingTop: 'max(25px,2.2vw)'}}></div>
 </div>
 </center>
 </Container>
<NewsletterSignUp from='Hero'/>
<div style={{paddingTop: 'max(25px,2.2vw)'}}></div>
<Container>
<center>

          <Image
           src='/assets/images/usersRating.webp'
           alt="AI Financial Advisor & Virtual Investing App sends you hot stocks to watch and buy now: find the next Nvidia, Tesla, Roblox before they skyrocket"
           priority={true}
          width={150}
          height={50*3/4}
           />

    <div style={{ color: 'lightGrey', fontSize: "min(14px,max(13px,1.3vw))", lineHeight: 1,maxWidth: "350px",textShadow: '5px 5px 5px rgba(0, 0, 0, 0)' }} className="reveal-from-bottom" data-reveal-delay="150">
       Join a community of +48,000 investors

       </div>


      <div className="container-sm has-animations" style={{  zIndex: 10 }}>
          <div className="hero-content">

<div style={{paddingTop: 'max(25px,2.2vw)'}}></div>
        {/*<Image
        src='/assets/images/chatgptgooglecloud.webp'
        alt="Google Cloud Platform Security and ChatGPT Open AI partners logos"
       width={130}
       height={54.46667}
       priority={true}
        />*/}
                <br></br>
             <br></br>
                <br></br>
                <br></br>
                                          <br></br>
                <br></br>

                   <br></br>


          </div>

        </div>


 </center>
 </Container>
    </section>
  );
}

Hero.propTypes = propTypes;
Hero.defaultProps = defaultProps;

export default Hero;
