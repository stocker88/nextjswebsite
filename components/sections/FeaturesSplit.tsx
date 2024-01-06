import React from 'react';
import classNames from 'classnames';
import { SectionSplitProps } from '../../utils/SectionProps';
import SectionHeader2 from './partials/SectionHeader2';
import Image from 'next/image';
import Button from '../elements/Button';
import ButtonGroup from '../elements/ButtonGroup';
import { useState } from 'react';
import SwipeVideo from '../swiper/swipevideo';
import WhyStocksToBuyNow from '../../components/whyHellostocker';
import Container from '../../components/container'
import InstallButtonsWithQRAndLogo from '../elements/InstallButtonsWithQRAndLogo';
import { isMobile} from "react-device-detect";
import PostPreview from './../post-preview'
import type Post from '../../interfaces/post'
import Testimonial from './Testimonial'
import QuoteDisplay from '../../components/inspiration';
import AboutUs from '../../components/aboutUs';
import LinkedInButton from '../../components/connectLinkedin';

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




 <br></br>
 <br></br>
 <center>
       <AboutUs/>
</center>


         <center>

         <h2 className="text-3xl md:text-5xl font-bold tracking-tighter leading-tight " style={{'color':'lightGrey', 'textShadow': '0px 0px 3px rgba(0, 0, 0, 1)'}} >
                 Ex Goldman Sachs, Bank of America and OpenAI Directors

                 </h2>


                  <h3 className="text-3xl md:text-5xl font-bold tracking-tighter leading-tight " style={{'color':'lightGrey', 'textShadow': '0px 0px 3px rgba(0, 0, 0, 1)'}} >
                 <br></br> Over 15 Years in Investing and AI
                 <br></br>

                 <br></br>

                    <LinkedInButton/>

               </h3>


                 <br></br>

                     </center>



        <br></br>
        <br></br>



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
<center>

    <Testimonial/>

    <br></br> <br></br>
    <br></br><br></br>
</center>
</Container>
    </section>
  );
}

FeaturesSplit.propTypes = propTypes;
FeaturesSplit.defaultProps = defaultProps;

export default FeaturesSplit;
