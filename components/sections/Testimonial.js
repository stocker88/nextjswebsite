import React from 'react';
import classNames from 'classnames';
import { SectionTilesProps } from '../../utils/SectionProps';
import Image from 'next/image'
import QuoteDisplay from '../../components/inspiration';

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


  return (
    <section
      {...props}
      className={outerClasses}
    >

    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 lg:gap-x-32 gap-y-20 md:gap-y-32 mb-32">

{[


                             <a href='https://www.linkedin.com/in/hagege/' target="_blank" >
                         <center><Image
                           src='/assets/images/testimonies/jerome.webp'
                           alt="Features tile icon 06"
                           width={130}
                           height={130}
                           style={{
                           'borderRadius': '45px 45px 45px 45px',
                           'border': '2px solid rgba(255, 255, 255, 1)'
                           }}
                          /></center>
                           <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey', padding:'2rem','textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' , 'maxWidth':'700px', 'textAlign': 'left',}}>

                              <b className="text-2xl md:text-5xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'#493bc3'}}> Saves 130+ Hours of Investing Research per Month </b>
                              <br></br>
                             <br></br>
                           What's the point of buying if you don't know when to sell?


                                Compared to others who say 'buy buy buy', StocksToBuyNow AI has my final interests in mind.

                              They tell me when to buy and send me signals when it's time to realize my gains.
                              <br></br>
                              <br></br>
                         <b>  Jerome Hagege
                           <br></br>
                           Data Science Manager - NLP Research   </b>


                            </p>

                           </a>
, <a href='https://www.linkedin.com/in/adrien-chenin-306b6131/' target="_blank" >

                           <center><Image
                             src='/assets/images/testimonies/adrien.webp'
                             alt="Features tile icon 06"
                             width={130}
                             height={130}
                             style={{
                             'borderRadius': '45px 45px 45px 45px',
                             'border': '2px solid rgba(255, 255, 255, 1)'
                             }}
                            /></center>
                             <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey', padding:'2rem','textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' , 'maxWidth':'700px', 'textAlign': 'left',}}>

                                <b className="text-2xl md:text-5xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'#493bc3'}}> Stock Recommendations that Fit Your Preferences </b>
                                <br></br>
                                <br></br>The AI tailors recommendations to match my preferences.
                                I ask the AI what he thinks before making any trade, it's like a personnal coach.
                                 Your personal genie available 24/7! It's not just about stocks; it's about the right stocks for me.

                                <br></br>
                                <br></br>
                           <b>  Adrien Chenin
                             <br></br>
                             Quantitative Researcher @ Millenium Hedge Fund   </b>


                              </p>

                             </a>,<a href='https://www.linkedin.com/in/fabienns/' target="_blank" >
                                                           <center><Image
                                                             src='/assets/images/testimonies/fabien.webp'
                                                             alt="Features tile icon 06"
                                                             width={130}
                                                             height={130}
                                                             style={{
                                                             'borderRadius': '45px 45px 45px 45px',
                                                             'border': '2px solid rgba(255, 255, 255, 1)'
                                                             }}
                                                            /></center>
                                                             <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey', padding:'2rem','textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' , 'maxWidth':'700px', 'textAlign': 'left',}}>

                                                                <b className="text-2xl md:text-5xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'#493bc3'}}> Simple and Easy to Understand </b>
                                                                <br></br>
                                                               <br></br>
                                                               I wanted dividend stocks for passive income.
                                                                StocksToBuyNow AI trading advisor sent me stock recommendations well explained and straight to the point.

                                                               Finally financial advises that don't require a finance degree💪
                                                               StocksToBuyNow delivers concise messages with easy-to-read graphs.
                                                               They have a user friendly ChatGPT like interface.
                                                               No more financial jargon Harvard show off.
                                                                <br></br>
                                                                <br></br>
                                                           <b>  Fabien Nieto
                                                                                     <br></br>
                                                                                     CEO & Founder @ SEO Marketing Agency   </b>


                                                              </p>

                                                             </a>
                                  , <a href='https://www.linkedin.com/in/maxime-lonn%C3%A9-b38a6829/' target="_blank" >
                                                             <center><Image
                                                               src='/assets/images/testimonies/maxime.webp'
                                                               alt="Features tile icon 06"
                                                               width={130}
                                                               height={130}
                                                               style={{
                                                               'borderRadius': '45px 45px 45px 45px',
                                                               'border': '2px solid rgba(255, 255, 255, 1)'
                                                               }}
                                                              /></center>
                                                               <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey', padding:'2rem','textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' , 'maxWidth':'700px', 'textAlign': 'left',}}>

                                                                  <b className="text-2xl md:text-5xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'#493bc3'}}> A Safe Playground for Learning </b>
                                                                  <br></br>
                                                                 <br></br>
                                                                 Practise trading ideas without the risk! StocksToBuyNow App nails it.
                                                                  It's about making sure you acquire the skillset and profit from it.
                                                                  They have a virtual reality trading platform so you can practice investing ideas without the fear of losing.
                                                                  It's a safe playground for learning and gaining confidence in their AI technology.
                                                                  <br></br>
                                                                  <br></br>
                                                             <b>  Maxime Lonné
                                                               <br></br>
                                                               Paid Media Director @ Eskimoz   </b>


                                                                </p>

                                                               </a>
]}
           </div>
<br></br> <br></br>
      <br></br><br></br>

     <QuoteDisplay from='inspiration_button_homePage'/>
     <br></br> <br></br>
     <br></br> <br></br>


    </section>
  );
}

Testimonial.propTypes = propTypes;
Testimonial.defaultProps = defaultProps;

export default Testimonial;
