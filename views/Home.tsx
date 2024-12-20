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



      <Hero className="illustration-section-01" style={{ background: "linear-gradient(hsl(200, 100%, 48%), hsl(250, 100%, 25%))" }}/>

        <div style={{ background: "linear-gradient(hsl(250, 100%, 5%), hsl(250, 100%, 5%), hsl(250, 100%, 5%))" }}>

      <br></br>

          <br></br>
          <br></br>
                <br></br>

                          <br></br>
                          <Container>
                          <div style={{ color: 'lightGreen', fontSize: '1.2rem', lineHeight: '1.8', letterSpacing: '0.05em', textAlign: 'center', paddingLeft: '10%', paddingRight: '10%' }}>
                            <p style={{ marginBottom: '20px' , fontSize: 'min(16px,max(12px,2.5vw)'}}>
                              While money doesn’t grow on trees, it can grow when you save and invest wisely.
                            </p>
                            <p style={{ marginBottom: '20px' , fontSize: 'min(16px,max(12px,2.5vw)' }}>
                              Knowing how to secure your financial well-being is one of the most important things you’ll ever need in life.
                            </p>
                            <p style={{ marginBottom: '20px' , fontSize: 'min(16px,max(12px,2.5vw)' }}>
                              You don’t have to be a genius to do it.
                            </p>
                            <p style={{ marginBottom: '20px' , fontSize: 'min(16px,max(12px,2.5vw)' }}>
                              You just need to know a few basics, form a plan, and be ready to stick to it.
                            </p>
                            <p style={{ marginBottom: '20px' , fontSize: 'min(16px,max(12px,2.5vw)' }}>
                              No matter how much or little money you have, the important thing is to educate yourself about your opportunities.
                            </p>
                            <p style={{ marginBottom: '20px' , fontSize: 'min(16px,max(12px,2.5vw)' }}>
                              No one can guarantee that you’ll make money from investments you make.
                              </p>
                              <p style={{ marginBottom: '20px' , fontSize: 'min(16px,max(12px,2.5vw)' }}>
                              But if you get the facts about saving and investing and follow through the intelligent
                              plan and recommendations we provide, you should be able to gain financial freedom and enjoy the benefits of managing your money.
                            </p>
                            <br/>
                            <br/>
                          </div>
                          <center  style={{
                           borderBottom: '0.3px solid #333', // Adjust the color and style as needed
                               // Adjust the margin to give some space between sections
                              width: '100%', // Take up 90% of the screen width
                              maxWidth: '1000px', // Set a maximum width of 1000 pixels
                              margin: '0 auto', // Center the sections horizontally
                           }}>


<div style={{
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2rem',
  padding: '20px',
  maxWidth: '400px',
  margin: '0 auto'
}}>



  {/* Android Store Row */}
  <a href='https://play.google.com/store/apps/details?id=com.newcompany.stocker' target="_blank" style={{ display: 'inline-flex', textDecoration: 'none' }}>
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  }}>

    <Image
      src='/assets/images/androidstore.png'
      alt="StocksToBuyNow AI App"
      priority={true}
      width={156}
      height={156}
      style={{
        borderRadius: '20px',
        opacity: 0.9,
        width: 'min(max(145px,13vw),200px)',
        height: 'min(max(145px,13vw),200px)',
      }}
    />
    <span style={{ fontWeight: 'bold', color: 'white',minWidth: '200px',fontSize: 'min(20px,max(18px,3.5vw)'}}>
    Android Store<br/>Reviews</span>
  </div>
  </a>

  {/* Apple Store Row */}
  <a href='https://apps.apple.com/us/app/stocks-to-buy-now-ai-signals/id1565527320' target="_blank" style={{ display: 'inline-flex', textDecoration: 'none' }}>
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  }}>
    <Image
      src='/assets/images/applestore.png'
      alt="StocksToBuyNow AI App"
      priority={true}
      width={156}
      height={156}
      style={{
        borderRadius: '20px',
        opacity: 0.9,
        width: 'min(max(145px,13vw),200px)',
        height: 'min(max(145px,13vw),200px)',
      }}
    />
    <span style={{ fontWeight: 'bold', color: 'white',minWidth: '200px',fontSize: 'min(20px,max(18px,3.5vw)'}}>
    Apple Store<br/>Reviews</span>
  </div>
  </a>


  {/* Trustpilot Row */}
  <a href='https://www.trustpilot.com/review/stockstobuynow.ai' target="_blank" style={{ display: 'inline-flex', textDecoration: 'none' }}>
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  }}>
    <Image
      src='/assets/images/trustpilot.png'
      alt="Trustpilot Reviews"
      priority={true}
      width={156}
      height={156}
      style={{
        borderRadius: '20px',
        opacity: 0.9,
        width: 'min(max(145px,13vw),200px)',
        height: 'min(max(145px,13vw),200px)',
      }}
    />
    <span style={{ fontWeight: 'bold', color: 'white',minWidth: '200px',fontSize: 'min(20px,max(18px,3.5vw)'}}>
    Trustpilot<br/>Reviews</span>
  </div>
  </a>

  {/* Stocker Robot Row */}
  <a href='https://www.linkedin.com/posts/anesshusseinali_multibagger-activity-7260416453328138242-S41Q' target="_blank" style={{ display: 'inline-flex', textDecoration: 'none' }}>
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  }}>

    <Image
      src='/assets/images/linkedin.png'
      alt="Stocker AI Robot"
      priority={true}
      width={156}
      height={156}
      style={{
        borderRadius: '20px',
        opacity: 0.9,
        width: 'min(max(145px,13vw),200px)',
        height: 'min(max(145px,13vw),200px)',
      }}
    />

    <span style={{ fontWeight: 'bold', color: 'white',minWidth: '200px',fontSize: 'min(20px,max(18px,3.5vw)'}}>
    LinkedIn<br/>& CV</span>
  </div>
  </a>
</div>


  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
</center>

</Container>
        <br></br>
        <br></br>
        <Container >
        <IntroApp/>
        </Container>
        <Swipe/>
        <Testimonial/>
           <br></br>
           <center>


           <div
             style={{
               display: 'flex',
               flexDirection: 'column',
               alignItems: 'center',
               paddingLeft: '10%',
               paddingRight: '10%',
               textAlign: 'center', // Center content overall
             }}
           >


 <Intro />
 <br/>
<h3
  className="text2xl md:text-3xl tracking-tighter leading-tight"
  style={{
    color: 'lightGrey',
    textShadow: '0px 0px 3px rgba(0, 0, 0, 1)',
    letterSpacing: '0.05em',
    textAlign: 'left',
    marginBottom: '60px',
    fontSize: '1.4rem'
  }}
>
  If you say <strong> YES </strong> to any of the below,
  <strong> StocksToBuyNow AI </strong> is for you:
</h3>
<br/>
<div style={{ color: 'lightGrey', fontSize: '1.3rem', lineHeight: '1.8', letterSpacing: '0.05em', textAlign: 'left' }}>
  <p style={{ display: 'flex', alignItems: 'center', marginBottom: '60px' }}>
    <span
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '48px',
        height: '48px',
        backgroundColor: 'green',
        borderRadius: '8px',
        marginRight: '20px',
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="32" height="32">
        <path d="M10 15.172l8.292-8.292 1.415 1.415-9.707 9.707-5.707-5.707 1.415-1.415z"/>
      </svg>
    </span>
    Want to create a side income alongside your job?
  </p>
  <p style={{ display: 'flex', alignItems: 'center', marginBottom: '60px' }}>
    <span
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '48px',
        height: '48px',
        backgroundColor: 'green',
        borderRadius: '8px',
        marginRight: '20px',
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="32" height="32">
        <path d="M10 15.172l8.292-8.292 1.415 1.415-9.707 9.707-5.707-5.707 1.415-1.415z"/>
      </svg>
    </span>
    Seeking flexibility to work from anywhere?
  </p>
  <p style={{ display: 'flex', alignItems: 'center', marginBottom: '60px' }}>
    <span
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '48px',
        height: '48px',
        backgroundColor: 'green',
        borderRadius: '8px',
        marginRight: '20px',
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="32" height="32">
        <path d="M10 15.172l8.292-8.292 1.415 1.415-9.707 9.707-5.707-5.707 1.415-1.415z"/>
      </svg>
    </span>
    Looking to take control of your financial future?
  </p>
  <p style={{ display: 'flex', alignItems: 'center', marginBottom: '60px' }}>
    <span
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '48px',
        height: '48px',
        backgroundColor: 'green',
        borderRadius: '8px',
        marginRight: '20px',
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="32" height="32">
        <path d="M10 15.172l8.292-8.292 1.415 1.415-9.707 9.707-5.707-5.707 1.415-1.415z"/>
      </svg>
    </span>
    Interested in reliable strategies for steady financial growth?
  </p>
</div>



<br></br><br></br><br></br><br></br><br></br><br></br>

 {/*
                 <PostPreview
                     key={heroPost.slug}
                     title={heroPost.title}
                     coverImage={heroPost.coverImage}
                     date={heroPost.date}
                     author={heroPost.author}
                     slug={heroPost.slug}
                     excerpt={heroPost.excerpt}
                   />
                   */}
            </div>


<FAQ/>

   </center>


        <Container>


         <center>

<section />





</center>


{/*         <TryWebAppLink/> */}



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
         {/*
        {posts.length > 0 && <MoreStories posts={isMobile?posts.slice(1, 7):posts.slice(1)} />}
*/}


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
      </div>

    </>
  );
}

export default Home;
