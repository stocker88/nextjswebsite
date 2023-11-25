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
import Container from '../../components/container'
import InstallButtonsWithQRAndLogo from '../elements/InstallButtonsWithQRAndLogo';
import { isMobile} from "react-device-detect";
import PostPreview from './../post-preview'
import type Post from '../../interfaces/post'
import Testimonial from './Testimonial'

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


<center>

<h2 className="text-4xl md:text-7xl font-bold tracking-tighter leading-tight md:pr-8" style={{'color':'white', 'textShadow': '2px 2px 2px rgba(0, 0, 0, 0)'}} >
        Get Help From An Investment Advisor
      </h2>
        <br></br>
        <br></br>

    <iframe title='' style={{width: '100%',height: '700px', 'borderRadius': '10px 10px 10px 10px'}} src={'https://meetings-eu1.hubspot.com/meetings/alex-hellostocker-ai/15-and-30min-meeting?embed=true'}/>
    <script type="text/javascript" src="https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js"></script>
{/*
<center><InstallButtonsWithQRAndLogo style={{ background: "linear-gradient(#4B6DFD, #617EF6, #00f75f)"}}/></center>
*/}
        <br></br>
        <br></br>
        <br></br>
        <br></br>


        <WhyHellostocker/>
        <br></br>

    <Testimonial/>
</center>
</Container>
    </section>
  );
}

FeaturesSplit.propTypes = propTypes;
FeaturesSplit.defaultProps = defaultProps;

export default FeaturesSplit;
