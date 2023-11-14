import React, { useState } from 'react';
import classNames from 'classnames';
import { SectionProps } from '../../utils/SectionProps';
import ButtonGroup from '../elements/ButtonGroup';
import Button from '../elements/Button';
import InstallButtonsWithQR from '../elements/InstallButtonsWithQR';
import Image from '../elements/Image';
import { openInbox } from 'react'

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


<center>
      <div className="container-sm has-animations" style={{  zIndex: 10 }}>

          <div className="hero-content">
          <br></br>
          <br></br>

         {/*    <Image
              src={require('assets/images/stocker.png')}
              alt="hellostocker app stocks to buy ai stock to watch market financial advisor economic tools investing virtual trading"
              width={700}
              height={58.33}
              />*/}

  <Image
                  src='/assets/images/hellostocker.webp'
                  alt="AI powered Virtual Investing App analyse hedge fund trading economic and financial data to find the next Nvidia, Tesla, Roblox, the Next Apple"
                 style={{width:200,height:200}}

                  />
            <div className="container-xs">
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-tight" style={{ color: 'white', fontFamily: 'arial',lineHeight: 2,textShadow: '3px 3px 3px rgba(1, 74, 173, 0.6)' }} >
                                            HelloStocker App
                                          </h1>
              <div style={{ color: 'white', fontSize: "min(40px,max(30px,3vw))", fontFamily: 'arial', fontWeight: 600,lineHeight: 1.3,textShadow: '2px 2px 2px rgba(1, 74, 173, 0.6)' }} className="reveal-from-bottom" data-reveal-delay="150">
                   Virtual Investing & Trading Signals


                </div>
<br></br>
                 <Image
                  src='/assets/images/usersRating.webp'
                  alt="AI powered Virtual Investing App analyse hedge fund trading economic and financial data to find the next Nvidia, Tesla, Roblox, the Next Apple"
                 style={{width:250, height:52}}
                  />
<div style={{ color: 'white', fontSize: "min(18px,max(14px,1.75vw))", fontFamily: 'arial', fontWeight: 600,lineHeight: 1.3,textShadow: '2px 2px 2px rgba(1, 74, 173, 0.6)' }} className="reveal-from-bottom" data-reveal-delay="150">
                  over 10,000 investors
                </div>
              <div className="reveal-from-bottom" data-reveal-delay="250">

          <br></br>
          <br></br>
                <div style={{ color: 'white', fontSize: "min(40px,max(30px,3vw))", fontFamily: 'arial', fontWeight: 600,lineHeight: 1.3,textShadow: '2px 2px 2px rgba(1, 74, 173, 0.6)' }} className="reveal-from-bottom" data-reveal-delay="150">
                                   Powered By ChatGPT | Install Now

                                </div>
                <InstallButtonsWithQR/>

          <br></br>
          <br></br>
          <br></br>
          <br></br>


             </div>

          </div>

        </div>

 </div>
 </center>
    </section>
  );
}

Hero.propTypes = propTypes;
Hero.defaultProps = defaultProps;

export default Hero;
