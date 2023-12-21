import React from 'react';
import classNames from 'classnames';
import { SectionSplitProps } from '../../utils/SectionProps';
import SectionHeader2 from './partials/SectionHeader2';
import Image from 'next/image';
import Button from '../elements/Button';
import ButtonGroup from '../elements/ButtonGroup';
import { useState } from 'react';
import Container from '../../components/container'
import SectionHeader from './partials/SectionHeader';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import InstallButtonsWithQR from '../elements/InstallButtonsWithQR';
import { isMobile, browserName } from "react-device-detect";
import NewsletterSignUp from '../formStocker'
import Blog from "../sections/Blog";
import IntroDownload from '../../components/introDownload';

const propTypes = {
  ...SectionSplitProps.types
}

const defaultProps = {
  ...SectionSplitProps.defaults
}

const innerClasses = classNames(
'hero-inner section-inner',
);

const MeetingButton = ({
  ...props
}) => {

  const outerClasses = classNames(
    'features-split section',
    'has-top-divider',
    'has-bottom-divider',
    'has-bg-color',
    'invert-color',
  );

  const innerClasses = classNames(
    'features-split-inner section-inner',
    'has-top-divider',
    'has-bottom-divider'
  );

  const splitClasses = classNames(
    'split-wrap',
    'invert-mobile',
    'invert-desktop',
    
  );

  const sectionHeader = {
    title: '',//We write about investing, analytics, and adjacent topics',
    paragraph: ''
  };
  return (
    <section
      {...props}
      className="flex-col md:flex-row flex items-center md:justify-between "
      id="MeetingButton"
    >
     <div style={{  'width': '100%' }}>
    <center>
      <div className="container-sm has-animations" style={{  zIndex: 10 }}>
          <div className="hero-content">
<Container>
<center>

 <div className="container-sm reveal-from-bottom">
<br></br>
<br></br>
<br></br>
<br></br>
      <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight " style={{'color':'white', 'textShadow': '0px 0px 8px rgba(1, 74, 1, 0.7)'}}>
                  Unlock the Power of Big Data
     </h2>
                     </div>
<div style={{paddingTop: 'max(25px,2.2vw)'}}></div>
           <h2  style={{ color: 'white',fontWeight: 600, fontFamily: 'arial',fontSize: "min(20px,max(18px,3.5vw))", lineHeight: 1.3,textShadow: '0px 0px 5px rgba(1, 0, 1, 0.7)', maxWidth: "650px" }} >
                    We send you hot stocks before they blow up: you save time, save money, and receive the best opportunities.
                    </h2>
<br></br>

         </center>
         </Container>
        <NewsletterSignUp/>
<div style={{paddingTop: 'max(25px,2.2vw)'}}></div>



        <Container>

        <center>
            <Image
                src='/assets/images/usersRating.webp'
                alt="AI Financial Advisor & Virtual Investing App sends you hot stocks to watch and buy now: find the next Nvidia, Tesla, Roblox before they skyrocket"
                width={240}
                height={60}
            />


    <div style={{ color: 'lightGrey', fontSize: "min(14px,max(13px,1.3vw))", fontFamily: 'arial', lineHeight: 1,maxWidth: "350px",textShadow: '5px 5px 5px rgba(0, 0, 0, 0)' }} className="reveal-from-bottom" data-reveal-delay="150">
       Join a community of +12,800 investors who receive high quality stocks adapted to their own preferences

       </div>

            <div style={{paddingTop: 'max(25px,2.2vw)'}}></div>

            <br></br>

    </center>
</Container>
    </div>

        </div>

        </center>
        </div>
</section>

  );
}

MeetingButton.propTypes = propTypes;
MeetingButton.defaultProps = defaultProps;

export default MeetingButton;
