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
import InstallButtons from '../elements/InstallButtons';
import InstallButtonsWithQR from '../elements/InstallButtonsWithQR';
import { isMobile, browserName } from "react-device-detect";
import Blog from "../sections/Blog";
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
      id="resume"
      className={outerClasses}
      id="MeetingButton"
    >
<center>

 <div className="container-sm reveal-from-bottom">


<br></br><br></br>
<br></br>

                     <div style={{ color: 'white',  fontFamily: 'arial', fontSize: "min(28px,max(24px,2.3vw))", fontWeight: 600,lineHeight: 1.3,textShadow: '2px 2px 2px rgba(1, 74, 173, 0.6)' }} >
                  You have control over your own success 🕊
                     </div>
<br></br><br></br>
        <InstallButtonsWithQR/>
<br></br><br></br>



    </div>
    </center>
    </section>

  );
}

MeetingButton.propTypes = propTypes;
MeetingButton.defaultProps = defaultProps;

export default MeetingButton;
