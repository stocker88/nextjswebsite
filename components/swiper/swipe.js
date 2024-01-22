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
import Container from '../../components/container'
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
    borderRadius: '10px',
    maxWidth:'800px',
  };

  return (
    <>

      <center>
          <Zoom>
            <Image
              width={493.75}
              height={434.4}
              className="shadow-md"
              src="/assets/images/1.webp"
              style={splitItemImageStyle}
              sizes="(max-width: 50%) 33vw, (max-width: 50%) 50vw, 33vw"
              alt="We Predicted Netflix +40% StocksToBuyNow AI Screenshot"
            />
          </Zoom>

        </center>
<br></br>

      <center>
          <Zoom>
            <Image
              width={493.75}
              height={434.4}
              className="shadow-md"
              src="/assets/images/2.webp"
              style={splitItemImageStyle}
              sizes="(max-width: 50%) 33vw, (max-width: 50%) 50vw, 33vw"
              alt="We Predicted Netflix +40% StocksToBuyNow AI Screenshot"
            />
          </Zoom>

        </center>
        <br></br>
      <center>
          <Zoom>
            <Image
              width={493.75}
              height={434.4}
              className="shadow-md"
              src="/assets/images/3.webp"
              style={splitItemImageStyle}
              sizes="(max-width: 50%) 33vw, (max-width: 50%) 50vw, 33vw"
              alt="We Predicted Netflix +40% StocksToBuyNow AI Screenshot"
            />
          </Zoom>

        </center>

<br></br>
<Container>
    <section className="flex-col  flex items-center md:justify-between mt-16 mb-16 md:mb-12">
      <h2 className="text-2xl md:text-4xl font-bold tracking-tighter leading-tight " style={{'color':'white', 'textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' }} >
        Should You Buy Tesla?
        <br></br>
        <br></br>
        AI Recommended Ferrari as a Better Alternative
        <br></br>
        <br></br>
        Since then Tesla Did -5%
        <br></br>
        <br></br>
        Ferrari Took +20%
        </h2>
    </section>
    <br></br>
    </Container>

    <center>
    <Zoom>
        <Image
          width={600}
          height={600}
          className="shadow-md"
          src="/assets/images/teslarace.jpg"
          style={splitItemImageStyle}
          sizes="(max-width: 50%) 33vw, (max-width: 50%) 50vw, 33vw"
          alt="Tesla vs Ferrari"
          layout="responsive"
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