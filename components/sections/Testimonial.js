import React, { useState } from 'react';

import classNames from 'classnames';
import { SectionTilesProps } from '../../utils/SectionProps';
import Image from 'next/image'
import { useSpringCarousel } from 'react-spring-carousel'

const propTypes = {
  ...SectionTilesProps.types
}

const defaultProps = {
  ...SectionTilesProps.defaults
}

const Testimonial = ({
  ...props
}) => {

  const outerClasses = classNames(
    'features-tiles section',
  );

  const innerClasses = classNames(
    'testimonial-inner section-inner',
  );

  const tilesClasses = classNames(
    'tiles-wrap',
  );
  const splitItemImageStyle = {
    borderRadius: '10px',
  };

const slides =    [
      {
        id: 'item-0',
        renderItem: (


    <center style={{width:'100%'}}>
        <Image
          width={438*0.8}
          height={875*0.8}
          className="shadow-md"
          src="/assets/images/appstorerating.png"
          style={splitItemImageStyle}

          alt="App Store Ratings Reviews "
        />

    </center>

        )
      },{
        id: 'item-1',
        renderItem: (
             <center style={{width:'100%'}}>

            <a href='https://www.linkedin.com/in/hagege/' target="_blank" >
              <Image
                 src='/assets/images/testimonies/jerome.webp'
                 alt="Features tile icon 06"
                 width={130}
                 height={130}
                 style={{
                 'borderRadius': '45px 45px 45px 45px',
                 'border': '2px solid rgba(255, 255, 255, 1)'
                 }}
                />
                 <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey', padding:'2rem','textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' , 'maxWidth':'650px', 'textAlign': 'left',}}>

                    <b className="text-2xl md:text-5xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'#493bc3'}}> Saves 130+ Hours of Investing Research per Month </b>
                    <br></br>
                   <br></br>



                    HelloStocker AI tells me what to buy and sends data and explanations.
                    Once I understand why and agree I can pass my trades with eToro or Robinhood.
<br></br>
                    What I love the most is when the AI sends me notifications when it's time to sell and take profits.
<br></br>
                    They advise me and have my final interests in mind: big gains.
                    <br></br>
                    <br></br>
               <b>  Jerome Hagege
                 <br></br>
                 Data Science Manager - NLP Research   </b>


                  </p>

                 </a>
                 </center>
        )
      },
      {
        id: 'item-2',
        renderItem: (
            <center style={{width:'100%'}}>
             <br></br>
          <a href='https://www.linkedin.com/in/adrien-chenin-306b6131/' target="_blank" >

                 <Image
                   src='/assets/images/testimonies/adrien.webp'
                   alt="Features tile icon 06"
                   width={130}
                   height={130}
                   style={{
                   'borderRadius': '45px 45px 45px 45px',
                   'border': '2px solid rgba(255, 255, 255, 1)'
                   }}
                  />
                   <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey', padding:'2rem','textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' , 'maxWidth':'650px', 'textAlign': 'left',}}>

                      <b className="text-2xl md:text-5xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'#493bc3'}}> Stock Recommendations that Drive Performance </b>
                      <br></br>
                      <br></br>The AI tailors recommendations to match my preferences.
                       I ask the AI what he thinks before making any trade, it's like a personnal coach.
                       <br></br>
                       Your personal genie available 24/7! It's not just about stocks; it's about the right stocks that deliver profits.

                      <br></br>
                      <br></br>
                 <b>  Adrien Chenin
                   <br></br>
                   Quantitative Researcher @ Millenium Hedge Fund   </b>


                    </p>

                   </a>
               </center>
        )
      },
      {
        id: 'item-2',
        renderItem: (

        <center style={{width:'100%'}}>
         <br></br>
          <a href='https://www.linkedin.com/in/fabienns/' target="_blank" >
             <Image
               src='/assets/images/testimonies/fabien.webp'
               alt="Features tile icon 06"
               width={130}
               height={130}
               style={{
               'borderRadius': '45px 45px 45px 45px',
               'border': '2px solid rgba(255, 255, 255, 1)'
               }}
              />
              
              <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey', padding:'2rem','textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' , 'maxWidth':'650px', 'textAlign': 'left',}}>
                  <b className="text-2xl md:text-5xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'#493bc3'}}> Simple and Easy to Understand </b>
                  <br></br>
                 <br></br>
                 I wanted dividend stocks for passive income.
                  StocksToBuyNow AI trading advisor sent me stock recommendations well explained and straight to the point.
<br></br>
                 Finally financial advises that don't require a finance degree💪
                 I receive concise messages with easy-to-read graphs.
                 They have a user friendly ChatGPT like interface.
                 No more financial jargon Harvard show off.
                  <br></br>
                  <br></br>
             <b>  Fabien Nieto
                                       <br></br>
                                       CEO & Founder @ SEO Marketing Agency   </b>


                </p>

               </a></center>


        )
      },
      {
        id: 'item-2',
        renderItem: (
           <center style={{width:'100%'}}>
            <br></br>
            <a href='https://www.linkedin.com/in/maxime-lonn%C3%A9-b38a6829/' target="_blank" >
           <Image
             src='/assets/images/testimonies/maxime.webp'
             alt="Features tile icon 06"
             width={130}
             height={130}
             style={{
             'borderRadius': '45px 45px 45px 45px',
             'border': '2px solid rgba(255, 255, 255, 1)'
             }}
            />
             <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey', padding:'2rem','textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' , 'maxWidth':'650px', 'textAlign': 'left',}}>

                <b className="text-2xl md:text-5xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'#493bc3'}}> A Safe Playground for Learning </b>
                <br></br>
               <br></br>
               Practise trading ideas without the risk! StocksToBuyNow App nails it!
                It's about making sure you acquire the skillset and profit from it.
                <br></br>
                I use the virtual reality trading platform to practice investing ideas in all safety!
                It's a safe playground for learning and gaining confidence in their AI technology.
                <br></br>
                <br></br>
           <b>  Maxime Lonné
             <br></br>
             Paid Media Director @ Eskimoz   </b>


              </p>

             </a>
             </center>
        )
      }
    ];
      const [index, setIndex] = useState(0);

        const {
          carouselFragment,
         slideToPrevItem,
         slideToNextItem
        } = useSpringCarousel({
          withLoop: true, // -> make me loop!
        items: slides,
        });


  return (
    <section
      {...props}
      className={outerClasses}
    >
<center>
      <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                  width: '100%',
                   }}>
        {carouselFragment}


      </div>
</center>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0px' }}>
          {slides.map((_, i) => (
            <div
              key={i}
              className={`dot ${index === i ? 'active' : ''}`}
              style={{
                backgroundColor: index === i ? 'white' : 'grey',
                boxShadow: index === i ? '0 0 5px rgba(255, 255, 255, 1)' : 'none',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                margin: '0 5px', // Adjust as needed
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '10px' }}>
                {/* Previous Button */}
                <button
                  style={{ color: 'white' }}
                  onClick={() => {
                    console.log('Previous button clicked');
                    slideToPrevItem();
                    setIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
                  }}
                >Previous</button>

                {/* Next Button */}
                <button style={{ padding: '10px 20px', color: 'white',}}
                   onClick={() => {
                                    console.log('Previous button clicked');
                                    slideToNextItem();
                                    setIndex((prevIndex) => (prevIndex + 1 + slides.length) % slides.length);
                                  }}>Next</button>
              </div>
<br></br> <br></br>



    </section>
  );
}

Testimonial.propTypes = propTypes;
Testimonial.defaultProps = defaultProps;

export default Testimonial;
