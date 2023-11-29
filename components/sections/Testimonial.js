import React from 'react';
import classNames from 'classnames';
import { SectionTilesProps } from '../../utils/SectionProps';
import Image from 'next/image'

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

                         <center>
                         <Image
                           src='/assets/images/testimonies/adrien.webp'
                           alt="Features tile icon 06"
                           width={74}
                           height={74}
                           style={{
                           'borderRadius': '45px 45px 45px 45px',
                           'border': '2px solid rgba(255, 255, 255, 1)'
                           }}
                           />
                           <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey', padding:'2rem','textShadow': '2px 2px 2px rgba(0, 0, 0, 0)' }}>

                              <b style={{color:'#00f75f'}}> Insights You Won’t Find Anywhere Else </b>
                             <br></br>
                             "HelloStocker is a game-changer! They spot trends and relevant information others overlook. I've discovered stock opportunities thanks to their AI Advisor and cashed 3 digits profits on Nvidia Meta and some biotech stocks. Instead of spending hours on boring emails and newsletters, get instant suggestions that fit your preferences, right away. Time is money in trading, you can't afford to wait for email replies."
                              <br></br>
                              <br></br>
                         <i>  Adrien Chenin
                           <br></br>
                           Quantitative Researcher @ Millenium Hedge Fund </i>


                            </p>
                           </center>
, <center>
                         <Image
                           src='/assets/images/testimonies/jerome.webp'
                           alt="Features tile icon 06"
                           width={74}
                           height={74}
                           style={{
                           'borderRadius': '45px 45px 45px 45px',
                           'border': '2px solid rgba(255, 255, 255, 1)'
                           }}
                           />
                           <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey', padding:'2rem','textShadow': '2px 2px 2px rgba(0, 0, 0, 0)' }}>

                              <b style={{color:'#00f75f'}}> Stock Recommendations that Fit Your Preferences </b>
                             <br></br>
                             "Your personal genie available 24/7! HelloStocker tailors recommendations to match my preferences. It's not just about hot stocks; it's about the right stocks for me. I made plenty of money and it feels good gogogo HelloStocker team!"
                              <br></br>
                              <br></br>
                         <i>  Jerome Hagege
                           <br></br>
                           Data Science Manager - NLP Research </i>


                            </p>
                           </center>
, <center>
                         <Image
                           src='/assets/images/testimonies/fabien.webp'
                           alt="Features tile icon 06"
                           width={74}
                           height={74}
                           style={{
                           'borderRadius': '45px 45px 45px 45px',
                           'border': '2px solid rgba(255, 255, 255, 1)'
                           }}
                           />
                           <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey', padding:'2rem','textShadow': '2px 2px 2px rgba(0, 0, 0, 0)' }}>

                              <b style={{color:'#00f75f'}}> Simple and Easy to Understand </b>
                             <br></br>
                             "I wanted dividend stocks for passive income and received a clear reply straight to the point. Finally financial advises that don't require a finance degree... HelloStocker delivers concise messages with easy-to-read graphs and user friendly ChatGPT model interface. No more financial jargon."
                              <br></br>
                              <br></br>
                         <i>  Fabien Nieto
                                                   <br></br>
                                                   CEO & Founder @ SEO Marketing Agency </i>


                            </p>
                           </center>
, <center>
                         <Image
                           src='/assets/images/testimonies/felix.webp'
                           alt="Features tile icon 06"
                           width={74}
                           height={74}
                           style={{
                           'borderRadius': '45px 45px 45px 45px',
                           'border': '2px solid rgba(255, 255, 255, 1)'
                           }}
                           />
                           <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey', padding:'2rem','textShadow': '2px 2px 2px rgba(0, 0, 0, 0)' }}>

                              <b style={{color:'#00f75f'}}> Saves 80+ Hours of Investing Research per Month </b>
                             <br></br>
                             "HelloStocker App my time-saver hero! Instead of spending hours shifting through boring emails and reports, I get instant suggestions and replies that fit my preferences, right away. Time is money in trading, I can't afford to wait for email replies. I made 3 digit profits on their biotech and real estate stocks"
                              <br></br>
                              <br></br>
                         <i>  Felix Revert
                           <br></br>
                           Product Manager Data Science </i>


                            </p>
                           </center>
, <center>
                         <Image
                           src='/assets/images/testimonies/alexia.webp'
                           alt="Features tile icon 06"
                           width={74}
                           height={74}
                           style={{
                           'borderRadius': '45px 45px 45px 45px',
                           'border': '2px solid rgba(255, 255, 255, 1)'
                           }}
                           />
                           <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey', padding:'2rem','textShadow': '2px 2px 2px rgba(0, 0, 0, 0)' }}>

                              <b style={{color:'#00f75f'}}> Access Early Trading Opportunities </b>
                             <br></br>
                             "Being ahead of the curve matters: time is money. The more you wait the more you miss.... HelloStocker Financial Advisor spots stocks with huge upside potential before the masses catch on. That early advantage has made a real difference in my gains. I perfectly timed Adobe, AMD & Workforce, they keep sending me blue chip stocks I love to follow"
                              <br></br>
                              <br></br>
                         <i>  Alexia Karolewicz
                           <br></br>
                           Procurement Manager IP Acquisition</i>


                            </p>
                           </center>
, <center>
                         <Image
                           src='/assets/images/testimonies/mehrad.webp'
                           alt="Features tile icon 06"
                           width={74}
                           height={74}
                           style={{
                           'borderRadius': '45px 45px 45px 45px',
                           'border': '2px solid rgba(255, 255, 255, 1)'
                           }}
                           />
                           <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey', padding:'2rem','textShadow': '2px 2px 2px rgba(0, 0, 0, 0)' }}>

                              <b style={{color:'#00f75f'}}> Powered by ChatGPT </b>
                             <br></br>
                             "No more complicated Bloomberg terminals! Old school way! HelloStocker is the new way to go: the ChatGPT of investing. They make it easy to navigate the large stock universe. I received recommendations that keep outperforming the sp500. It's easy to make money when the market goes up, but it's always hard to beat the sp500 market, well done team!"
                              <br></br>
                              <br></br>
                         <i>  Mehrad Oroudji
                                                   <br></br>
                                                   Senior Non Linear Credit Trader </i>


                            </p>
                           </center>
, <center>
                         <Image
                           src='/assets/images/testimonies/charles.webp'
                           alt="Features tile icon 06"
                           width={74}
                           height={74}
                           style={{
                           'borderRadius': '45px 45px 45px 45px',
                           'border': '2px solid rgba(255, 255, 255, 1)'
                           }}
                           />
                           <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey', padding:'2rem','textShadow': '2px 2px 2px rgba(0, 0, 0, 0)' }}>

                              <b style={{color:'#00f75f'}}> Join a Pro Community of Investors </b>
                             <br></br>
                             "HelloStocker community is a goldmine! Investors and hedge fund members has given me financial insights and great connections, they are here to help. eToro became a naughty mess they should rethink their UX and how followers interact with each other. Above all HelloStocker AI Advisor is a must: saves me time and my profits increased!"
                              <br></br>
                              <br></br>
                         <i>  Charles Elie Labroy
                           <br></br>
                           Machine Learning Software Developer @ Meta </i>


                            </p>
                           </center>
, <center>
                         <Image
                           src='/assets/images/testimonies/kanishk.webp'
                           alt="Features tile icon 06"
                           width={74}
                           height={74}
                           style={{
                           'borderRadius': '45px 45px 45px 45px',
                           'border': '2px solid rgba(255, 255, 255, 1)'
                           }}
                           />
                           <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey', padding:'2rem','textShadow': '2px 2px 2px rgba(0, 0, 0, 0)' }}>

                              <b style={{color:'#00f75f'}}> Exponential Growth Potential </b>
                             <br></br>
                             "It's not just about investing, it's about building wealth, and making it grow the smart way. I don't just 'realise profits': I track how much I make over the sp500. Making money is easy when everything goes up, beating the sp500 market with their Stocker AI advisor is the real way to go!"
                              <br></br>
                              <br></br>
                         <i>  Kanishk Budhia
                           <br></br>
                           CEO & Founder @ Solino Home </i>


                            </p>
                           </center>
, <center>
                         <Image
                           src='/assets/images/testimonies/maxime.webp'
                           alt="Features tile icon 06"
                           width={74}
                           height={74}
                           style={{
                           'borderRadius': '45px 45px 45px 45px',
                           'border': '2px solid rgba(255, 255, 255, 1)'
                           }}
                           />
                           <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey', padding:'2rem','textShadow': '2px 2px 2px rgba(0, 0, 0, 0)' }}>

                              <b style={{color:'#00f75f'}}> A Safe Playground for learning </b>
                             <br></br>
                             "Practise trading ideas without the risk! HelloStocker App nails it. I get as much virtual trading money as I want and can work on my skills without the fear of losing real cash. It's a safe playground for learning and gaining confidence in their smart technology."
                              <br></br>
                              <br></br>
                         <i>  Maxime Lonné
                           <br></br>
                           Directeur Paid Media @ Eskimoz </i>


                            </p>
                           </center>, <center>
                         <Image
                           src='/assets/images/testimonies/sacha.webp'
                           alt="Features tile icon 06"
                           width={74}
                           height={74}
                           style={{
                           'borderRadius': '45px 45px 45px 45px',
                           'border': '2px solid rgba(255, 255, 255, 1)'
                           }}
                           />
                           <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey', padding:'2rem','textShadow': '2px 2px 2px rgba(0, 0, 0, 0)' }}>

                              <b style={{color:'#00f75f'}}> Access Transparent AI Data </b>
                             <br></br>
                             "HelloStocker AI doesn't hide a thing, I get access to AI-processed data and can verify and understand how the decisions are made. Transparency like this builds trust. I understand how my ai advisor takes the decisions and can interact with the AI directly, better than sending emails and waiting for answers, makes me save time and cash on profits faster. Time is money especially in investing! Stocker App great job!"
                              <br></br>
                              <br></br>
                         <i>  Sacha Berenfus
                           <br></br>
                           Sales Growth Manager @ Hubspot </i>


                            </p>
                           </center>

]}


<br></br>
<br></br>
<br></br>
           </div>
    </section>
  );
}

Testimonial.propTypes = propTypes;
Testimonial.defaultProps = defaultProps;

export default Testimonial;
