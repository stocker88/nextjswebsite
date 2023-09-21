import React from 'react';
// import sections

import Header from '../components/layout/Header';
import Attribution from '../components/sections/blog_articles/Attribution';
import Footer from '../components/layout/Footer';

const AttributionBlog = () => {

  return (
    <>
      <Header navPosition="right" className="reveal-from-bottom" />
      <Attribution  hasBgColor/>
      <Footer  style={{  background: "linear-gradient(#1387FF, #00D9FF)" }}/>
    </>
  );
}

export default AttributionBlog;
