import React from 'react';
// import sections
import Hero from '../components/sections/Hero';
import FeaturesSplit from '../components/sections/FeaturesSplit';
import Blog from '../components/sections/Blog';

import YoutubeSection from '../components/sections/YoutubeSection';
import TitleSplit from '../components/sections/TitleSplit';
import TitleSplit2 from '../components/sections/Title2Split';
import TitleSplit3 from '../components/sections/Title3Split';
import TitleSplit4 from '../components/sections/Title4Split';
import Testimonial from '../components/sections/Testimonial';
import Header from '../components/layout/Header';
import type Post from '../interfaces/post';

type Props = {
  posts: Post[]
}

const Home =  ({ posts }: Props) =>  {

  return (
    <>
    <Header navPosition="right" className="reveal-from-bottom" />
      <Hero className="illustration-section-01" style={{ background: "linear-gradient(#00D9FF, #3700B3)" }}/>
      {posts.length > 0 && <FeaturesSplit className="illustration-section-02" posts={posts} hasBgColor={true} invertMobile={true} imageFill={true}/>}
    </>
  );
}

export default Home;
