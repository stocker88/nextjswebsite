import Image from 'next/image'
import React, { useRef, useState, useEffect } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import classNames from 'classnames';
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination"
import { isMobile, browserName } from "react-device-detect";
import Zoom from 'react-medium-image-zoom'
import IntroDataset from '../../components/introDataset';
// import Swiper core and required modules
import SwiperCore, {
  EffectCoverflow,Pagination,Autoplay
} from 'swiper';
import IntroDownload from '../../components/introDownload';
import InstallButtonsWithQRAndLogo from '../elements/InstallButtonsWithQRAndLogo';
import BookingMeetingButton from '../../components/bookingMeetingButton';
// install Swiper modules
SwiperCore.use([EffectCoverflow,Pagination,Autoplay]);

export default function Swipe() {
const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const splitItemStyle = {
    width: '100%',
    marginBottom: '20px', // Space between images on mobile
  };

  const desktopStyles = {
    flexDirection: 'row',
    justifyContent: 'space-between',
  };

  const splitItemImageStyle = {
    borderRadius: '30px',
  };

  return (
    <>

    <div style={{ ...containerStyle, ...desktopStyles }}>
      <div style={splitItemStyle}>
      <center>
        <div className={classNames('split-item-image', 'center-content-mobile')}>
          <Zoom>
            <Image
              width={320}
              height={693}
              className="shadow-md"
              src="/assets/images/chatgpt2.webp"
              style={splitItemImageStyle}
              sizes="(max-width: 50%) 33vw, (max-width: 50%) 50vw, 33vw"
              alt="We Predicted Netflix +40% StocksToBuyNow AI Screenshot"
            />
          </Zoom>
        </div>
        </center>
      </div>

      <div style={splitItemStyle}>
      <center>
        <div className={classNames('split-item-image', 'center-content-mobile')}>
          <Zoom>
            <Image
              src="/assets/images/portfolio2.webp"
              width={320}
              height={693}
              className="shadow-md"
              style={splitItemImageStyle}
              sizes="(max-width: 50%) 33vw, (max-width: 50%) 50vw, 33vw"
              alt="Unlimited Virtual Money StocksToBuyNow Screenshot"
            />
          </Zoom>
        </div>
            </center>
      </div>

    </div>



<br></br>

<br></br><br></br>




 <br></br>


 <br></br>

<br></br>


    </>
  )
}