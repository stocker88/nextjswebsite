import React from 'react';
import classNames from 'classnames';
import { SectionSplitProps } from '../../utils/SectionProps';
import SectionHeader2 from './partials/SectionHeader2';
import Image from '../elements/Image';
import Button from '../elements/Button';
import ButtonGroup from '../elements/ButtonGroup';
import { useState } from 'react';
import Modal from '../elements/Modal';
import ContactForm from '../elements/ContactUs';

import SectionHeader from './partials/SectionHeader';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { Swiper, SwiperSlide } from "swiper/react";
import { isMobile } from "react-device-detect";
import "swiper/css";
import "swiper/css/pagination"
import SwiperCore, {
  EffectCoverflow,Pagination
} from 'swiper';

// install Swiper modules
SwiperCore.use([EffectCoverflow,Pagination]);
const propTypes = {
  ...SectionSplitProps.types
}

const defaultProps = {
  ...SectionSplitProps.defaults
}

const innerClasses = classNames(
'hero-inner section-inner',
);

const YoutubeSection = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  invertMobile,
  invertDesktop,
  alignTop,
  imageFill,
  ...props
}) => {

  const [videoModalActive, setVideomodalactive] = useState(false);
  const [pictureActive, setPictureActive] = useState(false);
  const showContactForm = useState(false)

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
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'features-split-inner section-inner',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  const splitClasses = classNames(
    'split-wrap',
    invertMobile && 'invert-mobile',
    invertDesktop && 'invert-desktop',
    alignTop && 'align-top'
  );

  const sectionHeader = {
    title: '',//We write about investing, analytics, and adjacent topics',
    paragraph: ''
  };
  return (
    <section
      {...props}
      id="youtube"
      className={outerClasses}
    >


 <Swiper effect={'coverflow'} slidesPerView={isMobile?1.2 : 2} spaceBetween={0} centeredSlides={true} loop={true} coverflowEffect={{
                                                                                    "rotate": 0,
                                                                                    "stretch": 0,
                                                                                    "depth": 0,
                                                                                    "scale":0.55,
                                                                                    "modifier": 1,
                                                                                    "slideShadows": false,
                                                                                  }} pagination={{
  "clickable": true
}} className="mySwiper">


             <SwiperSlide>
<center>
                               <div className="container-sm reveal-from-bottom" data-reveal-delay="300">
      <div className="video-responsive">
              <br></br>
                              <iframe
                                width="653vw"
                                height="367vw"
                                src={'https://www.youtube.com//embed/5hmp6UX5v_E'}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="Embedded youtube"
                              />
                                      <br></br>        <br></br>        <br></br>
                            </div>
                            </div>
</center>
  </SwiperSlide>


             <SwiperSlide>
<center>
                           <div className="reveal-from-bottom" data-reveal-delay="300">
                      <div className="video-responsive">
                       <br></br>
                              <iframe
                                width="653vw"
                                height="367vw"
                                src={'https://www.youtube.com//embed/bie2yvz578s'}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="Find the best investment ideas with Stocker"
                              />
                               <br></br> <br></br> <br></br>
                            </div>
                            </div>
</center>
  </SwiperSlide>


             <SwiperSlide>
<center>
                               <div className="container-sm reveal-from-bottom" data-reveal-delay="300">
      <div className="video-responsive">
              <br></br>
                              <iframe
                                width="653vw"
                                height="367vw"
                                src={'https://www.youtube.com//embed/fKLHaO2slHY'}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="Embedded youtube"
                              />
                                      <br></br>        <br></br>        <br></br>
                            </div>
                            </div>
</center>
  </SwiperSlide>



   </Swiper>
                                  <br></br>
    </section>

  );
}

YoutubeSection.propTypes = propTypes;
YoutubeSection.defaultProps = defaultProps;

export default YoutubeSection;
