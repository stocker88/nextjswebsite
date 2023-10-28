import React from 'react';
import classNames from 'classnames';
import { SectionSplitProps } from '../../utils/SectionProps';
import SectionHeader2 from './partials/SectionHeader2';
import Image from '../elements/Image';
import Button from '../elements/Button';
import ButtonGroup from '../elements/ButtonGroup';
import { useState } from 'react';
import Modal from '../elements/Modal';

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
      className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12"
      id="MeetingButton"
    >

<center>

 <div className="container-sm reveal-from-bottom">
<br></br>
      <h2 className="text-4xl md:text-7xl font-bold tracking-tighter leading-tight md:pr-8" style={{'color':'white'}}>
                  Transform Your Financial Future: Install Now
     </h2>
                     </div>
        <InstallButtonsWithQR/>
<br></br><br></br>
    </center>
</section>



  );
}

MeetingButton.propTypes = propTypes;
MeetingButton.defaultProps = defaultProps;

export default MeetingButton;
