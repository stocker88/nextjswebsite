import React, { useState } from 'react';
import classNames from 'classnames';
import { SectionProps } from '../../utils/SectionProps';
import ButtonGroup from '../elements/ButtonGroup';
import Button from '../elements/Button';
import InstallButtons from '../elements/InstallButtons';
import InstallButtonsWithQR from '../elements/InstallButtonsWithQR';
import Image from '../elements/Image';
import Modal from '../elements/Modal';
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

  const openModal = (e) => {
    e.preventDefault();
    setVideomodalactive(true);
  }

  const openPicture = (e) => {
    e.preventDefault();
    setPictureActive(true);
  }

  const closeModal = (e) => {
    e.preventDefault();
    setVideomodalactive(false);
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
                  src='/assets/images/hellostocker.png'
                  alt="Make money with the power of Big Data! Your ChatGPT like AI Advisor will send you investment and economic analysis with the Stocks to Buy now: join a social community of investors, learn how to invest in Stocks with virtual trading! Passive income & financial freedom with stock market & crypto trading, make money online now!"
                 style={{width:200}}

                  />
            <div className="container-xs">
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-tight" style={{ color: 'white', fontFamily: 'arial',lineHeight: 2,textShadow: '3px 3px 3px rgba(1, 74, 173, 0.6)' }} >
                                            HelloStocker
                                          </h1>
              <div style={{ color: 'white', fontSize: "min(32px,max(25px,2.5vw))", fontFamily: 'arial', fontWeight: 600,lineHeight: 1.3,textShadow: '2px 2px 2px rgba(1, 74, 173, 0.6)' }} className="reveal-from-bottom" data-reveal-delay="150">
                   ChatGPT meets Investing

                </div>
<br></br>
                 <Image
                  src='/assets/images/usersRating.png'
                  alt="Make money with the power of Big Data! Your ChatGPT like AI Advisor will send you investment and economic analysis with the Stocks to Buy now: join a social community of investors, learn how to invest in Stocks with virtual trading! Passive income & financial freedom with stock market & crypto trading, make money online now!"
                 style={{width:250}}
                 priority
                  />
<div style={{ color: 'lightgrey', fontSize: "min(16px,max(12px,1.5vw))", fontFamily: 'arial', fontWeight: 600,lineHeight: 1.3,textShadow: '2px 2px 2px rgba(1, 74, 173, 0.6)' }} className="reveal-from-bottom" data-reveal-delay="150">
                  +10,000 contributing users

                </div>
              <div className="reveal-from-bottom" data-reveal-delay="250">
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
