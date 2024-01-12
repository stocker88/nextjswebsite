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

      <center>
          <Zoom>
            <Image
              width={600}
              height={337.5}
              className="shadow-md"
              src="/assets/images/1.webp"
              style={splitItemImageStyle}
              sizes="(max-width: 50%) 33vw, (max-width: 50%) 50vw, 33vw"
              alt="We Predicted Netflix +40% StocksToBuyNow AI Screenshot"
            />
          </Zoom>

        </center>

      <center>
          <Zoom>
            <Image
              width={600}
              height={337.5}
              className="shadow-md"
              src="/assets/images/2.webp"
              style={splitItemImageStyle}
              sizes="(max-width: 50%) 33vw, (max-width: 50%) 50vw, 33vw"
              alt="We Predicted Netflix +40% StocksToBuyNow AI Screenshot"
            />
          </Zoom>

        </center>

      <center>
          <Zoom>
            <Image
              width={600}
              height={337.5}
              className="shadow-md"
              src="/assets/images/3.webp"
              style={splitItemImageStyle}
              sizes="(max-width: 50%) 33vw, (max-width: 50%) 50vw, 33vw"
              alt="We Predicted Netflix +40% StocksToBuyNow AI Screenshot"
            />
          </Zoom>

        </center>

      <center>
          <Zoom>
            <Image
              width={600}
              height={337.5}
              className="shadow-md"
              src="/assets/images/4.webp"
              style={splitItemImageStyle}
              sizes="(max-width: 50%) 33vw, (max-width: 50%) 50vw, 33vw"
              alt="We Predicted Netflix +40% StocksToBuyNow AI Screenshot"
            />
          </Zoom>

        </center>

      <center>
          <Zoom>
            <Image
              width={600}
              height={337.5}
              className="shadow-md"
              src="/assets/images/5.webp"
              style={splitItemImageStyle}
              sizes="(max-width: 50%) 33vw, (max-width: 50%) 50vw, 33vw"
              alt="We Predicted Netflix +40% StocksToBuyNow AI Screenshot"
            />
          </Zoom>

        </center>





<br></br>

<br></br><br></br>




 <br></br>


 <br></br>

<br></br>


    </>
  )
}