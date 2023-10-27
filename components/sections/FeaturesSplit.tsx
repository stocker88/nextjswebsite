import React from 'react';
import classNames from 'classnames';
import { SectionSplitProps } from '../../utils/SectionProps';
import SectionHeader2 from './partials/SectionHeader2';
import Image from '../elements/Image';
import Button from '../elements/Button';
import ButtonGroup from '../elements/ButtonGroup';
import { useState } from 'react';
import Modal from '../elements/Modal';
import Swipe from '../swiper/swipe';
import SwipeVideo from '../swiper/swipevideo';
import IntroApp from '../../components/introApp';
import IntroVideo from '../../components/introVideo';
import IntroDownload from '../../components/introDownload';
import Container from '../../components/container'
import InstallButtonsWithQR from '../elements/InstallButtonsWithQR';
import Plx from "react-plx";
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

  const [videoModalActive, setVideomodalactive] = useState(false);
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

<Plx
        parallaxData={[
          {
            start: 0,
            end: 600,
            easing: "ease-in",
            properties: [
              {
                startValue: 0.7,
                endValue: 1,
                property: "scale"
              }
            ]
          }
        ]}
        style={{
          left: 0,

          width: "100%",
        }}
      >


        <IntroApp/>
        <Swipe/>
</Plx>

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
        <br></br>
        <Plx
                parallaxData={[
                  {
                    start: 0,
                    end: 1400,
                    easing: "ease-in",
                    properties: [
                      {
                        startValue: 0.7,
                        endValue: 1,
                        property: "scale"
                      }
                    ]
                  }
                ]}
                style={{
                  left: 0,

                  width: "100%",
                }}
              >

        <IntroVideo/>
        <center><iframe width="321" height="571" src="https://www.youtube.com/embed/KkJQW4PVb6Q" title="Make Money with Investing" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe></center>

        </Plx>


        <br></br>
        <br></br>

        <br></br>
        <br></br>
        <br></br>
        <br></br>
         <Plx
                                parallaxData={[
                                  {
                                    start: 0,
                                    end: 2400,
                                    easing: "ease-in",
                                    properties: [
                                      {
                                        startValue: 0.7,
                                        endValue: 1,
                                        property: "scale"
                                      }
                                    ]
                                  }
                                ]}
                                style={{
                                  left: 0,

                                  width: "100%",
                                }}
                              >
        <IntroDownload/>
        <center><InstallButtonsWithQR style={{ background: "linear-gradient(#4B6DFD, #617EF6, #FF79FA)"}}/></center>
        </Plx>
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
