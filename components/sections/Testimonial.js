import React, { useEffect, useState } from 'react';

import LinkedInIcon from '../../components/linkedinicon';
import classNames from 'classnames';
import { SectionTilesProps } from '../../utils/SectionProps';
import Image from 'next/image'
import { useSpringCarousel } from 'react-spring-carousel'
import { isMobile } from "react-device-detect";

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

const [index, setIndex] = useState(0);


const slides =    [
      {
        id: 'item-1',
        renderItem: (
             <center style={{width:'100%'}}>

            <a href='https://www.linkedin.com/in/charles-elie-labroy-6500b480/' target="_blank" >
              <Image
                 src='/assets/images/testimonies/charles.webp'
                 alt="Features tile icon 06"
                 width={130}
                 height={130}
                 style={{
                 'borderRadius': '45px 45px 45px 45px',
                 'border': '2px solid rgba(255, 255, 255, 1)'
                 }}
                />

                 <p className="text-1xl leading-relaxed mb-4" style={{'color':'lightgrey', padding:'1.5rem','textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' , 'maxWidth':'650px', 'textAlign': 'left',}}>

                    <b className="text-lg md:text-3xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'#8577FF'}}> Receive Buy & Sell Signals on Stocks and on Options </b>
                    <br></br>
                   <br></br>

                    "I was sceptical at first but after trying it out for a few weeks I am now ultimately convinced of this app's effectiveness.<br/><br/>Not only are the signals expertly researched with detailed breakdowns but also having a community of like-minded individuals, who all aim to support and inform each other is worth every penny."
                    <br></br>
                    <br></br>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px', // Adjust the gap between the icon and the text as needed
                      }}>
                    <LinkedInIcon/>

                          <div style={{
                              marginLeft: '10px', // Adjust this if needed to space out the text from the icon
                            }}>
               <b>  Charles-Elie Labroy
                 <br></br>
                 Data Science Manager @ META   </b>

                </div></div>
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
                   <p className="text-1xl leading-relaxed mb-4" style={{'color':'lightgrey', padding:'1.5rem','textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' , 'maxWidth':'650px', 'textAlign': 'left',}}>

                      <b className="text-lg md:text-3xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'#8577FF'}}> Stock Recommendations that Drive Performance </b>
                      <br></br>
                      <br></br>
                      "The AI tailors recommendations to match my preferences. You can access Long Term and Short Term strategies and pick AI Trading Signals that works best for you.
                       It's like a personal coach who listens to you, available 24/7.
                       It's not just about stocks; it's about market views and profits."

                      <br></br>
                      <br></br>
                      <div style={{
                                                          display: 'flex',
                                                          alignItems: 'center',
                                                          gap: '10px', // Adjust the gap between the icon and the text as needed
                                                        }}>
                                          <LinkedInIcon/>

                                                <div style={{
                                                                marginLeft: '10px', // Adjust this if needed to space out the text from the icon
                                                              }}>
                 <b>  Adrien Chenin
                   <br></br>
                   Quantitative Researcher @ Millenium Hedge Fund   </b>
</div></div>

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

              <p className="text-1xl leading-relaxed mb-4" style={{'color':'lightgrey', padding:'1.5rem','textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' , 'maxWidth':'650px', 'textAlign': 'left',}}>
                  <b className="text-lg md:text-3xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'#8577FF'}}> Simple and Easy to Understand </b>
                  <br></br>
                 <br></br>
                 "I asked for dividend stocks for passive income. Ideally a low risk company with stable yield.
                  I received suggestions straight to the point.
                 Everything is backed up by data, it is easy to review. The UX is friendly and easy to use. Great app and great customer support, I recommend."
                  <br></br>
                  <br></br>
                  <div style={{
                                                      display: 'flex',
                                                      alignItems: 'center',
                                                      gap: '10px', // Adjust the gap between the icon and the text as needed
                                                    }}>
                                      <LinkedInIcon/>

                                            <div style={{
                                                            marginLeft: '10px', // Adjust this if needed to space out the text from the icon
                                                          }}>
             <b>  Fabien Nieto
                                       <br></br>
                                       CEO & Founder @ SEO Marketing Agency   </b>
</div></div>

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
             <p className="text-1xl leading-relaxed mb-4" style={{'color':'lightgrey', padding:'1.5rem','textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' , 'maxWidth':'650px', 'textAlign': 'left',}}>

                <b className="text-lg md:text-3xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'#8577FF'}}> A Safe Playground for Learning </b>
                <br></br>
               <br></br>
               "Practise trading ideas without the risk!
                I used the virtual reality trading platform to make sure it's working well.
                It's a safe playground for learning and gaining confidence in their AI technology."
                <br></br>
                <br></br>
                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px', // Adjust the gap between the icon and the text as needed
                                                  }}>
                                    <LinkedInIcon/>

                                          <div style={{
                                                          marginLeft: '10px', // Adjust this if needed to space out the text from the icon
                                                        }}>
           <b>  Maxime Lonné
             <br></br>
             Paid Media Director @ Eskimoz   </b>
</div></div>

              </p>

             </a>
             </center>
        )
      }
    ];


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


        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0px' }}>
          {slides.map((_, i) => (
            <div
              key={i}
              className={`dot ${index === i ? 'active' : ''}`}
              style={{
                backgroundColor: index === i ? 'white' : 'grey',
                boxShadow: index === i ? '0 0 5px rgba(255, 255, 255, 1)' : 'none',
                width: '15px',
                height: '15px',
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
                <button style={{ padding: '20px 20px', color: 'white',}}
                   onClick={() => {
                                    console.log('Previous button clicked');
                                    slideToNextItem();
                                    setIndex((prevIndex) => (prevIndex + 1 + slides.length) % slides.length);
                                  }}>Next</button>
              </div>
<br></br> <br></br>
<br></br> <br></br>

</center>

    </section>
  );
}

Testimonial.propTypes = propTypes;
Testimonial.defaultProps = defaultProps;

export default Testimonial;
