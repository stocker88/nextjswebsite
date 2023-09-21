import React, { useState } from 'react';
import classNames from 'classnames';
import { SectionProps } from '../../utils/SectionProps';
import ButtonGroup from '../elements/ButtonGroup';
import Button from '../elements/Button';
import Image from '../elements/Image';
import Modal from '../elements/Modal';
import { Linking } from 'react'
import * as emailjs from 'emailjs-com'
import ContactForm from '../elements/ContactUs';
import {Link} from 'react-router-dom'
import { openInbox } from 'react'

const propTypes = {
  ...SectionProps.types
}

const defaultProps = {
  ...SectionProps.defaults
}

const BlogHeader = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  ...props
}) => {


  const outerClasses = classNames(
    'hero section center-content',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'hero-inner section-inner',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  return (
    <section
      {...props}
      className={outerClasses}
    >
      <div >
        <a href="https://hellostocker.com">
            <Image
              src={require('assets/images/stocker.png')}
              alt="stocker ai app money income investing financial online trading stocks crypto"
              width={300}
              />
    </a>
      </div>
    </section>
  );
}

BlogHeader.propTypes = propTypes;
BlogHeader.defaultProps = defaultProps;

export default BlogHeader;
