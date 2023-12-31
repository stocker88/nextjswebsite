import React from 'react';
// import sections
import Hero from '../components/sections/Hero';
import FeaturesSplit from '../components/sections/FeaturesSplit';
import Blog from '../components/sections/Blog';
import Swipe from '../components/swiper/swipe';
import IntroVideo from '../components/introVideo';
import IntroApp from '../components/introApp';
import YoutubeSection from '../components/sections/YoutubeSection';
import TitleSplit from '../components/sections/TitleSplit';
import TitleSplit2 from '../components/sections/Title2Split';
import TitleSplit3 from '../components/sections/Title3Split';
import TitleSplit4 from '../components/sections/Title4Split';
import Testimonial from '../components/sections/Testimonial';
import Header from '../components/layout/Header';
import type Post from '../interfaces/post';
import Container from '../components/container'
import Intro from '../components/intro'
import MoreStories from '../components/more-stories'
import SearchStocks from '../components/SearchStocks';
import TryWebAppLink from '../components/TryWebAppLink';
import { stockDataSearch } from '../components/constants';
import { isMobile, browserName } from "react-device-detect";
import Image from 'next/image';

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
              'padding': '8px 16px',
              'background-color': '#3498db',
              'border-radius': '5px',
              'cursor': 'pointer',
              'z-index': '999',
              }}>Login</button>
      </header>
      {showModal && <SignUpModal onClose={toggleModal} />}
    </div>
*/}
      <Hero className="illustration-section-01" style={{ background: "linear-gradient(#00D9FF, #3700B3)" }}/>
      <br></br>

          <br></br>
          <br></br>
        <Container>
        <br></br>
        <br></br>
<IntroApp/>
        <Swipe/>
<center>
      <Image
       src='/assets/images/stockstobuynow.webp'
       alt="AI powered Virtual Investing Advisor App analysing hedge fund trading economic and financial data to find the next Nvidia, Tesla, Roblox, the Next Apple"
      width={151}
      height={151}

       />
<br></br>
         <br></br>

             <Image
              src='/assets/images/aboutus.jpg'
              alt="About us: a team of ex Goldman Sachs, JP Morgan, Bank of America, Google AI and OpenAI Directors with over 15 years experience in Investing and AI"
                width={384}
                height={216}
                style={{
                    borderRadius: '20px',
                    boxShadow: '0px 0px 10px 0px rgba(255, 255, 255, 0.5)' // Adjust values as needed
                  }}

              />

</center><br></br>
         <br></br>
        <SearchStocks stockData={stockDataSearch} />
        <TryWebAppLink/>
         <br></br>
<br></br>
        <br></br>
        <Intro />
      {/*  {heroPost && (
          <HeroPost
            title={heroPost.title}
            coverImage={heroPost.coverImage}
            date={heroPost.date}
            author={heroPost.author}
            slug={heroPost.slug}
            excerpt={heroPost.excerpt}
          />
        )}*/}
        {posts.length > 0 && <MoreStories posts={posts} />}

      </Container>
      {posts.length > 0 && <FeaturesSplit className="illustration-section-02" posts={posts} hasBgColor={true} invertMobile={true} imageFill={true}/>}
    </>
  );
}

export default Home;
