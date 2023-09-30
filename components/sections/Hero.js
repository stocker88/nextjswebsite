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
import { isMobile, browserName } from "react-device-detect";

const propTypes = {
  ...SectionProps.types
}

const defaultProps = {
  ...SectionProps.defaults
}

const Hero = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
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
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'hero-inner section-inner',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  return (
    <section
      {...props}
      className={outerClasses}
    >


<center>
      <div className="container-sm" style={{  zIndex: 10 }}>

          <div className="hero-content">
          <br></br>
          <br></br>

         {/*    <Image
              src={require('assets/images/stocker.png')}
              alt="stocker ai app money income investing financial invest budgeting trading stocks crypto personalfinance learn"
              width={700}
              height={58.33}
              />*/}

            <div className="container-xs">
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8 pl-4" style={{ color: 'white', fontFamily: 'arial',lineHeight: 3,textShadow: '3px 3px 3px rgba(1, 74, 173, 0.6)' }} >
                                            HelloStocker
                                          </h1>
              <div style={{ color: 'white', fontSize: "min(32px,max(25px,2.5vw))", fontFamily: 'arial', fontWeight: 600,lineHeight: 1.3,textShadow: '2px 2px 2px rgba(1, 74, 173, 0.6)' }} className="reveal-from-bottom" data-reveal-delay="150">
                  your 24/7 Personal Finance AI Ally
                  <br></br>


                </div>

              <div className="reveal-from-bottom" data-reveal-delay="200">
          <br></br>
          <br></br>
                <InstallButtonsWithQR/>

          <br></br>
          <br></br>


        <div style={{ color: 'white',  fontFamily: 'arial', fontSize: "min(26px,max(20px,2vw))", fontWeight: 600,lineHeight: 1.3,textShadow: '2px 2px 2px rgba(1, 74, 173, 0.6)' }} className="reveal-from-bottom" data-reveal-delay="150">
                where ChatGPT meets Virtual Trading without risking money for Financial Success

                        </div>
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
