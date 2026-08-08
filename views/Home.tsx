import React from 'react';
import {useRef} from 'react';
// import sections
import Hero from '../components/sections/Hero';
import FeaturesSplit from '../components/sections/FeaturesSplit';
import Blog from '../components/sections/Blog';
import Swipe from '../components/swiper/swipe';
import IntroVideo from '../components/introVideo';
import IntroApp from '../components/introApp';
import YoutubeSection from '../components/sections/YoutubeSection';
import FAQ from '../components/sections/FAQ';
import TitleSplit from '../components/sections/TitleSplit';
import TitleSplit2 from '../components/sections/Title2Split';
import TitleSplit3 from '../components/sections/Title3Split';
import TitleSplit4 from '../components/sections/Title4Split';
import Testimonial from '../components/sections/Testimonial';
import NewsletterSignUp from '../components/formStocker'
import Header from '../components/layout/Header';
import type Post from '../interfaces/post';
import Container from '../components/container'
import Intro from '../components/intro'
import SearchStocks from '../components/SearchStocks';
import { stockDataSearch } from '../components/constants';
import MoreStories from '../components/more-stories'
import Image from 'next/image';
import Link from 'next/link';
import PostPreview from '../components/post-preview'
import QuoteDisplay from '../components/inspiration';
import CompoundInterestCalculator from '../components/compoundInterestCalculator';

type Props = {
  posts: Post[]
}

const Home =  ({ posts }: Props) =>  {
{/*
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };
*/}

const stockData = [
  { ticker: 'AAPL', name: 'Apple Inc.', logo: 'aapl.webp' },
  // Add more company data here...
];

const heroPost = posts[0]
  return (
    <>

    <Header navPosition="right" className="reveal-from-bottom" />
{/*    import { useState } from 'react';
import SignUpModal from '../SignUpModal';
 <div>
      <header>
        <button
         onClick={toggleModal}
            style={{
              'position': 'fixed',
              'top': '20px',
              'right': '20px',
              'padding': '8px 30px',
              'background-color': '#3498db',
              'border-radius': '5px',
              'cursor': 'pointer',
              'z-index': '999',
              }}>Login</button>
      </header>
      {showModal && <SignUpModal onClose={toggleModal} />}
    </div>
*/}


<div className="trustpilot-widget" data-locale="en-US" data-template-id="539adbd6dec7e10e686debee" data-businessunit-id="670a2355c53c6130a02f3e50" data-style-height="1500px" data-style-width="100%" data-stars="4,5" data-theme="dark" data-review-languages="en">
  <a href="https://www.trustpilot.com/review/stockstobuynow.ai" target="_blank" rel="noopener">Trustpilot</a>
</div>

    </>
  );
}

export default Home;
