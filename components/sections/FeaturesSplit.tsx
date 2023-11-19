import React from 'react';
import classNames from 'classnames';
import { SectionSplitProps } from '../../utils/SectionProps';
import SectionHeader2 from './partials/SectionHeader2';
import Image from '../elements/Image';
import Button from '../elements/Button';
import ButtonGroup from '../elements/ButtonGroup';
import { useState } from 'react';
import Swipe from '../swiper/swipe';
import SwipeVideo from '../swiper/swipevideo';
import IntroApp from '../../components/introApp';
import WhyHellostocker from '../../components/whyHellostocker';
import IntroVideo from '../../components/introVideo';
import IntroDownload from '../../components/introDownload';
import Container from '../../components/container'
import InstallButtonsWithQRAndLogo from '../elements/InstallButtonsWithQRAndLogo';
import { isMobile} from "react-device-detect";
import PostPreview from './../post-preview'
import type Post from '../../interfaces/post'

type Props = {
  posts: Post[]
}

const propTypes = {
  ...SectionSplitProps.types
}

const defaultProps = {
  ...SectionSplitProps.defaults
}

const innerClasses = classNames(
'hero-inner section-inner',
);

const FeaturesSplit = ({
  posts,
  className,
  hasBgColor,
  invertMobile,
  imageFill,
  ...props
}) => {

  const outerClasses = classNames(
    'features-split section',
    hasBgColor && 'has-bg-color',
    className
  );

  const innerClasses = classNames(
    'features-split-inner section-inner',
  );

  const splitClasses = classNames(
    'split-wrap',
    invertMobile && 'invert-mobile',
  );

  return (
    <section
      {...props}
      className={outerClasses}
    >
    <Container>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>


        <IntroApp/>
        <Swipe/>

{/*
                  <center><div style={{maxWidth: "550px"}}>  <div className="grid grid-cols-1 md:grid-cols- md:gap-x-16 lg:gap-x-32 gap-y-20 md:gap-y-32 mb-32">
                      {[posts[2]].map((post) => (
                        <PostPreview
                          key={post.slug}
                          title={post.title}
                          coverImage={post.coverImage}
                          date={post.date}
                          author={post.author}
                          slug={post.slug}
                          excerpt={post.excerpt}
                        />
                      ))}
                    </div>
                    </div>
                    </center>
*/}
   <br></br>
        <br></br>
        <br></br>

        <IntroDownload/>
        <center><InstallButtonsWithQRAndLogo style={{ background: "linear-gradient(#4B6DFD, #617EF6, #FF79FA)"}}/></center>

        <br></br>
        <br></br>
                <br></br>
        <br></br>
        <br></br>
                <br></br>
        <br></br>
        <br></br>
                <br></br>
        <WhyHellostocker/>
        <br></br>
        <Container>
        <div style={{ color: 'lightgrey', fontSize: "min(22px,max(17px,1.6vw))", fontFamily: 'arial', fontWeight: 500,lineHeight: 1,textShadow: '2px 2px 2px rgba(0, 0, 0, 0)' }} >
        <br></br>

        <br></br>
        <div style={{color:'white'}}><b>1) You get insights you won’t find anywhere else.</b></div>
        <br></br>
        <br></br>
        We use advanced AI to track hundreds of signals and data points to help us filter noise and find high quality stocks.
<br></br>
<br></br>
<br></br>
<br></br>
<br></br>
        <div style={{color:'white'}}><b>2) Unbiased with no hidden agenda.</b></div>
<br></br>
<br></br>
        Other services are filled with opinions, recommendations, and pump-and-dump stocks.
        <br></br>
        <br></br>
        HelloStocker AI reports are 100% unbiased, objective, and data-driven.
<br></br>
<br></br>
<br></br>
<br></br>
<br></br>
        <div style={{color:'white'}}><b>3) Simple and easy to understand.</b></div>
<br></br>
<br></br>
        You don’t need another long financial report to read.
        <br></br>
        <br></br>
        Each report is a simple concise message with at most 2 market graphs easy to understand.
<br></br>
<br></br>
<br></br>
<br></br>
<br></br>
        <div style={{color:'white'}}><b>4) You save 80+ hours of research per month.</b></div>
<br></br>
<br></br>
        Our AI Advisor processed thousands of financial reports, stock earnings results, investor presentations, and 10-Ks every month so you don’t have to.
<br></br>
<br></br>
<br></br>
<br></br>
<br></br>
        <div style={{color:'white'}}><b>5) Get access to early opportunities.</b></div>
<br></br>
<br></br>
        No one wants to buy a stock after it’s gone up 56,978%.
        <br></br>
        <br></br>
        We look for stocks that still have huge upside according to the data.
<br></br>
<br></br>
<br></br>
<br></br>
<br></br>
        <div style={{color:'white'}}><b>6) Easy to use ChatGPT analytics.</b></div>
<br></br>
<br></br>
        Have you ever tried using a Bloomberg terminal? We have used them for decades.
        <br></br>
        <br></br>
        All you’ll need to get up to speed is a comfortable chair, 5 minutes of your time, and maybe a cup of coffee.
<br></br>
<br></br>
<br></br>
<br></br>
<br></br>
        <div style={{color:'white'}}><b>7) See what other Traders are doing</b></div>
<br></br>
<br></br>
        Join our community of investors, where you can connect with other pro trades!
<br></br>
<br></br>
        Discuss and view top investors trading activity: Cathy Wood predicted Tesla.
<br></br>
<br></br>
        Access their Portfolio Positions and Replicate them with Virtual Trading.
<br></br>
<br></br>
<br></br>
<br></br>
<br></br>
        <div style={{color:'white'}}><b>8) Practice Virtual Trading without any risk.</b></div>
<br></br>
<br></br>
        You will have unlimited Virtual Money to practise and consolidate your knowledge!
<br></br>
<br></br>
<br></br>
<br></br>
<br></br>
        <div style={{color:'white'}}><b>9) Transparent AI Training Data.</b></div>
<br></br>
<br></br>
        Artificial Intelligence and Big Data generate smart trading decisions by processing millions of data humans can't.
<br></br>
<br></br>
        Our user Front End AI is Powered By Open AI ChatGPT GPT4 model.
<br></br>
<br></br>
        We give you access to the data our Back End AI Model Processes so you can check it yourself!
<br></br>
<br></br>
<br></br>
<br></br>
<br></br>
        <div style={{color:'white'}}><b>10) Compound Interest will make your wealth grow Exponentially.</b></div>
<br></br>
<br></br>
Warren Buffett started investing at 11 years old during the great depression with only a couple of dollars.
<br></br>
<br></br>
If you save $10 a day in your bank account, in 10 years you will have $90,000.
<br></br>
<br></br>
If you invest $10 a day in the stock market, in 10 years you will have $2,000,000.
<br></br>
<br></br>
Compound Interest is like a snowball that makes your wealth grow exponentially: start now!
<br></br>
<br></br><br></br>
<br></br>
<br></br>
</div>
</Container>

        <br></br>
<center><InstallButtonsWithQRAndLogo style={{ background: "linear-gradient(#4B6DFD, #617EF6, #FF79FA)"}}/></center>

        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
                <br></br>
</Container>


    </section>
  );
}

FeaturesSplit.propTypes = propTypes;
FeaturesSplit.defaultProps = defaultProps;

export default FeaturesSplit;
