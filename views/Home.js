import React from 'react';
// import sections
import Hero from '../components/sections/Hero';
import FeaturesTiles from '../components/sections/FeaturesTiles';
import OldFeaturesTiles from '../components/sections/OldFeaturesTiles';
import FeaturesSplit from '../components/sections/FeaturesSplit';
import Blog from '../components/sections/Blog';

import YoutubeSection from '../components/sections/YoutubeSection';
import TitleSplit from '../components/sections/TitleSplit';
import TitleSplit2 from '../components/sections/Title2Split';
import TitleSplit3 from '../components/sections/Title3Split';
import TitleSplit4 from '../components/sections/Title4Split';
import Testimonial from '../components/sections/Testimonial';
import { isMobile} from "react-device-detect";
import Header from '../components/layout/Header';


const Home = () => {

  return (
    <>
    <Header navPosition="right" className="reveal-from-bottom" />
      <Hero className="illustration-section-01" style={{ background: "linear-gradient(#00D9FF, #4B6DFD)" }}/>
      <FeaturesSplit hasBgColor invertMobile imageFill className="illustration-section-02" />
    </>
  );
}

export default Home;
