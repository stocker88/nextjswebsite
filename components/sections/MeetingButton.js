import React from 'react';
import classNames from 'classnames';
import { SectionSplitProps } from '../../utils/SectionProps';
import SectionHeader2 from './partials/SectionHeader2';
import Image from '../elements/Image';
import Button from '../elements/Button';
import ButtonGroup from '../elements/ButtonGroup';
import { useState } from 'react';
import Container from '../../components/container'
import SectionHeader from './partials/SectionHeader';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
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

<Container>
<center>

 <div className="container-sm reveal-from-bottom">
<br></br>
<br></br>
      <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight md:pr-8" style={{'color':'white', 'textShadow': '2px 2px 2px rgba(1, 74, 173, 0.6)'}}>
                  Unlock the Power of Big Data: Start Now
     </h2>
                     </div>
                       <br></br>
                      <br></br>
        <InstallButtonsWithQR/>
<br></br><br></br>
    </center>
</Container>
</section>

  );
}

MeetingButton.propTypes = propTypes;
MeetingButton.defaultProps = defaultProps;

export default MeetingButton;
