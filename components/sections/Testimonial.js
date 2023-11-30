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

<a href='https://www.linkedin.com/in/adrien-chenin-306b6131/' target="_blank" >
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

                              <b style={{color:'#00f75f'}}> They Don't push Me To Buy - They Tell Me When To Sell' </b>
                             <br></br>
                             They don't make money by pushing me to trade, they make money by advising you and helping you out. It makes a HUUUUGEEEE difference.
                              Compared to other apps that push me to trade fast and leave me right after, HelloStocker tells me when to sell, and don't push me to trade with my real money, they have interests in mind and want to keep me forever.."
                              <br></br>
                              <br></br>
                         <b>  Adrien Chenin
                           <br></br>
                           Quantitative Researcher @ Millenium Hedge Fund   </b> 


                            </p>
                           </center>
                           </a>
, <a href='https://www.linkedin.com/in/hagege/' target="_blank" ><center>
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
                         <b>  Jerome Hagege
                           <br></br>
                           Data Science Manager - NLP Research   </b> 


                            </p>
                           </center>
                           </a>
, <a href='https://www.linkedin.com/in/fabienns/' target="_blank" ><center>
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
                         <b>  Fabien Nieto
                                                   <br></br>
                                                   CEO & Founder @ SEO Marketing Agency   </b> 


                            </p>
                           </center>
                           </a>
, <a href='https://www.linkedin.com/in/felix-revert-00998852/' target="_blank" ><center>
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
                             "HelloStocker App my time-saver hero! Instead of spending hours shifting through boring emails and reports, I get instant suggestions and replies that fit my preferences, right away. Time is money in trading, I can't afford to wait for email replies. After spending a couple of months practising with their virtual trading, I got a sense of how biotech works and made 3 digit profits!"
                              <br></br>
                              <br></br>
                         <b>  Felix Revert
                           <br></br>
                           Product Manager Data Science   </b> 


                            </p>
                           </center>
                           </a>
, <a href='https://www.linkedin.com/in/alexia-karolewicz-71a9b644/' target="_blank" ><center>
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
                             "Being ahead of the curve matters: time is money. HelloStocker Financial Advisor spots stocks with huge upside potential before the masses catch on. They notify you directly on your phone: you receive the information faster. That early advantage has made a real difference in my gains. I perfectly timed Adobe, AMD & Workforce."
                              <br></br>
                              <br></br>
                         <b>  Alexia Karolewicz
                           <br></br>
                           Procurement Manager IP Acquisition   </b> 


                            </p>
                           </center>
                           </a>
,<a href='https://www.linkedin.com/in/mehrad-oroudji-0b122544/' target="_blank" > <center>
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
                             "No more complicated Bloomberg terminals! Old school way! HelloStocker is the new way to go: the ChatGPT of investing. They make it easy to navigate the large stock universe. I received blue chip stocks recommendations that keep outperforming the sp500. It's easy to make money when the market goes up, but it's always hard to beat the sp500 market, well done team!"
                              <br></br>
                              <br></br>
                         <b>  Mehrad Oroudji
                                                   <br></br>
                                                   Senior Non Linear Credit Trader   </b> 


                            </p>
                           </center>
                           </a>
, <a href='https://www.linkedin.com/in/charles-elie-labroy-6500b480/' target="_blank" ><center>
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
                             "HelloStocker community is a goldmine! Investors and hedge fund members has given me financial insights and great connections, they are here to help. They don't push me to trade, in fact you can't real trade with them at all... They have my long term interests in mind and help me train with their tools. eToro became a naughty mess they should rethink their UX and get rid of all these influencers who want to make money by pushing you to buy anything now. Above all HelloStocker AI Advisor is a must: saves me time and my profits increased!"
                              <br></br>
                              <br></br>
                         <b>  Charles Elie Labroy
                           <br></br>
                           Machine Learning Software Developer @ Meta   </b> 


                            </p>
                           </center>
                           </a>
, <a href='https://www.linkedin.com/in/kanishkbudhia/' target="_blank" ><center>
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
                         <b>  Kanishk Budhia
                           <br></br>
                           CEO & Founder @ Solino Home   </b> 


                            </p>
                           </center>
                           </a>
, <a href='https://www.linkedin.com/in/maxime-lonn%C3%A9-b38a6829/' target="_blank" ><center>
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
                             "Practise trading ideas without the risk! HelloStocker App nails it. They don't take any money from you, it's not about pushing you to trade now: it's about making sure you acquire the skillset and profit from it. I get as much virtual trading money as I want and can practice trading ideas without the fear of losing real cash. It's a safe playground for learning and gaining confidence in their AI technology."
                              <br></br>
                              <br></br>
                         <b>  Maxime Lonné
                           <br></br>
                           Directeur Paid Media @ Eskimoz   </b> 


                            </p>
                           </center>
                           </a>,

                            <a href='https://www.linkedin.com/in/sachaberenfus/' target="_blank" ><center>
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
                         <b>  Sacha Berenfus
                           <br></br>
                           Sales Growth Manager @ Hubspot   </b> 


                            </p>
                           </center>
                           </a>

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
