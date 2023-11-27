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
                             "HelloStocker's insights are a game-changer! They dig deep into data that others overlook. Thanks to their advanced AI, I've uncovered stock opportunities that were hidden in plain sight and cashed on Nvidia."
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
                             "It's like having a personal stock genie! HelloStocker tailors recommendations to match my preferences. It's not just about hot stocks; it's about the right stocks for me. My portfolio's never been more aligned with my goals, I made plenty of money buying AI stocks."
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
                             "Finally, financial reports that don't require a finance degree! I asked for dividend stocks and received a quick reply with straightforward! HelloStocker delivers concise messages with easy-to-read graphs and user friendly ChatGPT model interface. No more complex jargon."
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
                             "HelloStocker is my time-saver hero! Instead of spending countless hours sifting through reports, I get suggestions that fit my preferences. I save time and made 3 digit profits on their biotech stocks"
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
                             "Being ahead of the curve matters, time is money, the more you wait the more you miss. HelloStocker spots stocks with huge upside potential before the masses catch on. That early advantage has made a real difference in my gains and perfectly timed Adobe, AMD & Workforce, they keep sending me blue chip stocks I like to follow"
                              <br></br>
                              <br></br>
                         <i>  Alexia Karolewicz
                           <br></br>
                           Procurement Manager IP Acquisition @ Reckitt </i>


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
                             "Move over, complicated Bloomberg terminals! HelloStocker powered by ChatGPT makes it easy to navigate the large stock universe. Their UX is very cool and I can test their ideas straight away with virtual money, much better than boring emails. I received many recommendations and they keep outperforming the sp500, pretty reassuring since I like to track my performance against the market."
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
                             "HelloStocker's community is a goldmine! Investors and hedge fund members has given me insights and connections clearly and it was well presented! eToro became a naughty mess they should rethink their UX. Above all HelloStocker AI Advisor is a must. He saves me time, money, and I don't miss any opportunity!"
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
                             "HelloStocker trading isn't just about stocks; it's about building wealth, and making it grow the smart way. I don't just 'make money': I track how much money I made over the sp500. Making money is easy when everything goes up, beating the sp500 market with their Stocker AI advisor is the real way to go!"
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
                             "Practise trading ideas without the risk! HelloStocker App nails it. I get as much virtual trading money as I want and can fine-tune my strategies without the fear of losing real cash. It's a safe playground for learning and gaining confidence in their smart technology."
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
                             "HelloStocker AI doesn't hide a thing! They give access to AI-processed data, allow me to verify and understand the decisions. Transparency like this builds trust. I understand how my ai advisor took the decisions. I can test ideas before executing them on my robinhood account. I've made more money with their signals than with my etfs. Stocker App great job!"
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
