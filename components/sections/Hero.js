import React, { useState } from 'react';
import classNames from 'classnames';
import { SectionProps } from '../../utils/SectionProps';
import ButtonGroup from '../elements/ButtonGroup';
import Button from '../elements/Button';
import InstallButtonsWithQR from '../elements/InstallButtonsWithQR';
import Image from '../elements/Image';
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


  const [pictureActive, setPictureActive] = useState(false);
  const openPicture = (e) => {
    e.preventDefault();
    setPictureActive(true);
  }

  const closePicture = (e) => {
    e.preventDefault();
    setPictureActive(false);
  }

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
          <br></br>
     <div style={{paddingTop: 10}}></div>
                <h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-tight" style={{ color: 'white', fontFamily: 'arial',lineHeight: 1.3,textShadow: '4px 4px 4px rgba(1, 74, 173, 0.6)' }} >
                                                             HelloStocker AI
                                                          </h1>
<br></br>
         {/*    <Image
              src={require('assets/images/stocker.png')}
              alt="hellostocker app stocks to buy ai stocks to watch market financial advisor economic tools investing virtual trading"
              width={700}
              height={58.33}
              />*/}

  <Image
                  src='/assets/images/hellostocker.webp'
                  alt="AI powered Virtual Investing Advisor App analysing hedge fund trading economic and financial big data to find the next Nvidia, Tesla, Roblox, the Next Apple"
                 style={{
                 width:'min(max(150px,10vw),170px)',
                  height:'min(max(150px,10vw),170px)',
                  }}

                  />
            <div className="container-xs">
            <br></br>
            <h1 className="text-4xl md:text-7xl tracking-tighter leading-tight" style={{ color: 'white', fontFamily: 'arial',lineHeight: 1.3,textShadow: '4px 4px 4px rgba(1, 74, 173, 0.6)', maxWidth: "700px" }} >
                                            Imagine someone told you about Nvidia when it was $50 instead of $500?
                                          </h1>
                                          <div style={{paddingTop: 20}}></div>
          <h2  style={{ color: 'lightGrey',fontWeight: 600, fontFamily: 'arial',fontSize: "min(18px,max(16px,3vw))", lineHeight: 1.3,textShadow: '4px 4px 4px rgba(1, 74, 173, 0.6)', maxWidth: "700px" }} >
            HelloStocker helps you find stocks before they blow up. Save time, save money and receive personalized AI recommendations based on your own tastes.
            </h2>
          </div>

        </div>

 </div>
 </center>
 </Container>
<NewsletterSignUp/>
<br></br>
<Container>



<center>
                              <Image
                                               src='/assets/images/usersRating.webp'
                                               alt="AI Financial Advisor & Virtual Investing App sends you hot stocks to watch and buy now: find the next Nvidia, Tesla, Roblox before they skyrocket"
                                              style={{width:240, height:60}}
                                               />
<div style={{ color: 'lightGrey', fontSize: "min(16px,max(15px,1.5vw))", fontFamily: 'arial', lineHeight: 1,maxWidth: "600px",textShadow: '5px 5px 5px rgba(0, 0, 0, 0)' }} className="reveal-from-bottom" data-reveal-delay="150">
                                               Join +12,800 investors using HelloStocker AI to receive investment recommendations adapted to their needs.
                                             </div>
<div style={{paddingTop: 20}}></div>
<br></br>
      <div className="container-sm has-animations" style={{  zIndex: 10 }}>
          <div className="hero-content">


        <Image
                                                            src='/assets/images/chatgptgooglecloud.webp'
                                                            alt="Google Cloud Platform Security and ChatGPT Open AI partners logos"
                                                           style={{width:195.9375, height:83.98}}
                                                            />
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
