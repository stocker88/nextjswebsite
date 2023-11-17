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
        <div style={{ color: 'white', fontSize: "min(40px,max(30px,3vw))", fontFamily: 'arial', fontWeight: 600,lineHeight: 1.3,textShadow: '2px 2px 2px rgba(1, 74, 173, 0.6)' }} className="reveal-from-bottom" data-reveal-delay="150">
        Having a coffee break? Chat with your own personal financial advisor let's make money!
        <br></br>
        We send you hot stocks to buy now: find the next Nvidia, Netflix and Tesla before they do +999%
        <br></br>
        Your AI Advisor processes:
        <br></br>
        - Hedge fund trading data
        <br></br>
        - Wall St analyst ratings
        <br></br>
        - Social media sentiment data on Reddit and Twitter
        - Fundamental analysis
        - Quantitative analysis
        <br></br>
        You will receive Stock Market Analysis with:
        - What the company does
        - Why it's growing in interest
        - How it could be more valuable
        - Risks to watch out for
        - What competitors to watch for

        We predicted these stocks would go up and our users profited over +400% on these names!

        You get insights you won’t find anywhere else.

        We use advanced AI to track hundreds of signals and data points to help us filter through the noise and find high quality stocks.

        Unbiased with no hidden agenda.

        Other services are filled with opinions, recommendations, and pump-and-dump stocks. HelloStocker AI reports are 100% unbiased, objective, and data-driven.

        Simple and easy to understand.

        You don’t need another long financial report to read. Each report is a simple concise message with at most 2 market graphs easy to understand.

        You save 80+ hours of research per month.

        Our AI Advisor processed thousands of financial reports, stock earnings results, investor presentations, and 10-Ks every month so you don’t have to.

        Get access to early opportunities.

        No one wants to buy a stock after it’s gone up 56,978%. We look for stocks that still have huge upside according to the data.

        No complicated tools or dashboards.

        Have you ever tried using a Bloomberg terminal? We have used them for decades. All you’ll need to get up to speed is a comfortable chair, 5 minutes of your time, and maybe a cup of coffee: Install HelloStocker now!

        Warren Buffet started his love for stock investing at 11 years old.

        He bought his first stocks during the great depression, and is now a billionaire investors: not millionnaire, billionnaire!

        Start early and Compound Interest to grow your wealth exponentially.

        Want to view what other top traders do?

        Join our awesome community of investors, where you can connect with other pro trades!

        Our community discussed the hottest stocks and cryptos to watch!

        We uses AI to study social hot market trends that make money!

        Stay updated with financial news.

        In HelloStocker you can view top investors trading activity: Cathy Wood predicted Tesla.

        Access their Portfolio Positions and Replicate them with Virtual Trading.

        A Virtual Trading App to practice making money without any risk.

        You will have unlimited Virtual Money to try our AI Analysis.

        Advisory AI is the future of investing.

        Artificial Intelligence and Big Data generate smart trading decisions by processing millions of data humans can't.

        Our user front AI is Powered By Open AI ChatGPT GPT4 model.

        We send you the processed data in interactive analysis:
        - Find high earnings growth rates stocks,
        - Buy dividend stocks with +20% dividend yield,
        - Access discounted value stock analysis,
        - Receive market Price predictions based on Reddit & other social platform analysis,
        - Access stock price forecast from over 1,200 Portfolio Analyst Researchers.

        Have extra time to search and learn yourself?

        Use our AI investment screener to learn investing and improve your trading skills!

        Trading Strategies are built in for you.

        One click and the AI model will show you a menu of stocks to buy based on what you want!

        Make money now with your AI Investment Advisor powered by ChatGPT.

        HelloStocker can help you achieve financial freedom and early retirement with passive income revenues.

        Start early: compound interest grows your wealth exponentially.
        </div>
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
