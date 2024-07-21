import React, { useEffect, useState } from 'react';

import classNames from 'classnames';
import { SectionTilesProps } from '../../utils/SectionProps';
import Image from 'next/image'
import { useSpringCarousel } from 'react-spring-carousel'
import { isMobile } from "react-device-detect";
import { isIOS, isMac } from '../../utils/deviceUtils';

const propTypes = {
  ...SectionTilesProps.types
}

const defaultProps = {
  ...SectionTilesProps.defaults
}

const Ratings = ({
  ...props
}) => {

  const outerClasses = classNames(
    'features-tiles section',
  );

  const innerClasses = classNames(
    'Ratings-inner section-inner',
  );

  const tilesClasses = classNames(
    'tiles-wrap',
  );
  const splitItemImageStyle = {
    borderRadius: '10px',
  };

const [index, setIndex] = useState(0);

    const [dynamicLink, setDynamicLink] = useState('');

  useEffect(() => {
    if (isIOS()) {
      setDynamicLink('https://apps.apple.com/app/stocker/id1565527320?platform=iphone');
    } else {
      setDynamicLink('https://play.google.com/store/apps/details?id=com.newcompany.stocker');
    }
  }, []);

  return (
    <section
      {...props}
      className={outerClasses}
    >


    <center style={{width:'100%'}}>
    <a href={dynamicLink} target="_blank">
        <Image
          width={438*0.85}
          height={875*0.85}
          className="shadow-md"
          src="/assets/images/appstorerating.webp"
          style={splitItemImageStyle}
            priority={true}
          alt="App Store Ratings Reviews "
        />
</a>
    </center>



    </section>
  );
}

Ratings.propTypes = propTypes;
Ratings.defaultProps = defaultProps;

export default Ratings;
