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
import NewsletterSignUp from '../components/formStocker'
import Header from '../components/layout/Header';
import type Post from '../interfaces/post';
import Container from '../components/container'
import Intro from '../components/intro'
import MoreStories from '../components/more-stories'
import TryWebAppLink from '../components/TryWebAppLink';
import { isMobile, browserName } from "react-device-detect";
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
      <Hero className="illustration-section-01" style={{ background: "linear-gradient(hsl(200, 100%, 48%), hsl(250, 100%, 25%))" }}/>
      <br></br>

          <br></br>
          <br></br>

        <br></br>
        <br></br>
        <Container>
        <IntroApp/>
        </Container>
        <Swipe/>


           <br></br>
           <center>
           <Container>
                 <PostPreview
                     key={heroPost.slug}
                     title={heroPost.title}
                     coverImage={heroPost.coverImage}
                     date={heroPost.date}
                     author={heroPost.author}
                     slug={heroPost.slug}
                     excerpt={heroPost.excerpt}
                   />

</Container>
              <br></br>

              <br></br>
                       <br></br>
     <br></br>
   </center>


        <Container>



         <center>

<section style={{
                             borderBottom: '0.3px solid #333', // Adjust the color and style as needed
                                paddingBottom: '5px', // Adjust the padding to give some space between the line and content
                                marginBottom: '10px', // Adjust the margin to give some space between sections
                                width: '90%', // Take up 90% of the screen width
                                maxWidth: '1000px', // Set a maximum width of 1000 pixels
                                margin: '0 auto', // Center the sections horizontally
                             }}/>
<br/>



                       <br></br>

</center>


{/*         <TryWebAppLink/> */}
         <br></br>
         <br></br>
         <br></br>
         <br></br>
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
        {posts.length > 0 && <MoreStories posts={isMobile?posts.slice(1, 6):posts.slice(1)} />}

      <br></br><br></br>

     <QuoteDisplay from='inspiration_button_homePage'/>

      </Container>
      <br/>
      <br/>
      <br/>
           <br></br>
         <br></br>
         <br></br>
         <center>
         <CompoundInterestCalculator/>
         </center>
         <br></br>
         <br></br>
      <br/>
      <br/>
      <br/>
    </>
  );
}

export default Home;
