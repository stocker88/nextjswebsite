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
import IntroApp from 'components/introApp';
import IntroVideo from 'components/introVideo';
import IntroDownload from 'components/introDownload';
import Container from 'components/container'
import InstallButtonsWithQR from '../elements/InstallButtonsWithQR';
import Plx from "react-plx";
import { isMobile} from "react-device-detect";

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
        <center><iframe width="321" height="571" src="https://youtube.com/shorts/KkJQW4PVb6Q" title="The mathematics of compounding: personal finance can make you a millionnaire" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></center>
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
