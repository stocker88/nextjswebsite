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
                         
                         <center><Image
                           src='/assets/images/testimonies/adrien.webp'
                           alt="Features tile icon 06"
                           width={74}
                           height={74}
                           style={{
                           'borderRadius': '45px 45px 45px 45px',
                           'border': '2px solid rgba(255, 255, 255, 1)'
                           }}
                          </>></center>
                           <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey', padding:'2rem','textShadow': '2px 2px 2px rgba(0, 0, 0, 0)' , 'maxWidth':'400px', 'textAlign': 'left',}}>

                              <b style={{color:'#00f75f'}}> They Don't push Me To Buy - They Tell Me When To Sell' </b>
                             <br></br>They don't make money by pushing me to trade.
                              <br></br>They care about advising me and helping me out.
                               <br></br>It makes a HUUUUGEEEE difference.
                              <br></br> They have no direct interests in pushing me to trade unless I can profit from it.
                              <br></br>Compared to most of 'financial gurus' with email newsletters and telegram channels... HelloStocker notifies me when to Sell!
                              <br></br>They have interests in keeping me happy by making my wealth grow forever.."
                              <br></br>
                              <br></br>
                         <b>  Adrien Chenin
                           <br></br>
                           Quantitative Researcher @ Millenium Hedge Fund   </b> 


                            </p>
                         
                           </a>
, <a href='https://www.linkedin.com/in/hagege/' target="_blank" >
                         <center><Image
                           src='/assets/images/testimonies/jerome.webp'
                           alt="Features tile icon 06"
                           width={74}
                           height={74}
                           style={{
                           'borderRadius': '45px 45px 45px 45px',
                           'border': '2px solid rgba(255, 255, 255, 1)'
                           }}
                          </>></center>
                           <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey', padding:'2rem','textShadow': '2px 2px 2px rgba(0, 0, 0, 0)' , 'maxWidth':'400px', 'textAlign': 'left',}}>

                              <b style={{color:'#00f75f'}}> Stock Recommendations that Fit Your Preferences </b>
                             <br></br>
                             "Your personal genie available 24/7!
                             <br></br>HelloStocker tailors recommendations to match my preferences.
                             <br></br>It's not just about hot stocks; it's about the right stocks for me.
                             <br></br>I made plenty of money, sure gains, no rush, and it feels good!
                              <br></br>
                              <br></br>
                         <b>  Jerome Hagege
                           <br></br>
                           Data Science Manager - NLP Research   </b> 


                            </p>
                         
                           </a>
, <a href='https://www.linkedin.com/in/fabienns/' target="_blank" >
                         <center><Image
                           src='/assets/images/testimonies/fabien.webp'
                           alt="Features tile icon 06"
                           width={74}
                           height={74}
                           style={{
                           'borderRadius': '45px 45px 45px 45px',
                           'border': '2px solid rgba(255, 255, 255, 1)'
                           }}
                          </>></center>
                           <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey', padding:'2rem','textShadow': '2px 2px 2px rgba(0, 0, 0, 0)' , 'maxWidth':'400px', 'textAlign': 'left',}}>

                              <b style={{color:'#00f75f'}}> Simple and Easy to Understand </b>
                             <br></br>
                             "I wanted dividend stocks for passive income and received a clear reply straight to the point.
                             <br></br>
                             Finally financial advises that don't require a finance degree...
                             <br></br>HelloStocker delivers concise messages with easy-to-read graphs and user friendly ChatGPT model interface.
                             <br></br>No more financial jargon."
                              <br></br>
                              <br></br>
                         <b>  Fabien Nieto
                                                   <br></br>
                                                   CEO & Founder @ SEO Marketing Agency   </b> 


                            </p>
                         
                           </a>
, <a href='https://www.linkedin.com/in/felix-revert-00998852/' target="_blank" >
                         <center><Image
                           src='/assets/images/testimonies/felix.webp'
                           alt="Features tile icon 06"
                           width={74}
                           height={74}
                           style={{
                           'borderRadius': '45px 45px 45px 45px',
                           'border': '2px solid rgba(255, 255, 255, 1)'
                           }}
                          </>></center>
                           <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey', padding:'2rem','textShadow': '2px 2px 2px rgba(0, 0, 0, 0)' , 'maxWidth':'400px', 'textAlign': 'left',}}>

                              <b style={{color:'#00f75f'}}> Saves 80+ Hours of Investing Research per Month </b>
                             <br></br>
                             "HelloStocker App my time-saver hero!
                             <br></br>Instead of spending hours shifting through boring emails and reports, I get instant suggestions and replies that fit my preferences, right away.
                             <br></br>Time is money in trading, I can't afford to wait for email replies.
                             <br></br>After spending a couple of months practising with their virtual trading, I got a sense of how biotech works and made 3 digit profits!"
                              <br></br>
                              <br></br>
                         <b>  Felix Revert
                           <br></br>
                           Product Manager Data Science   </b> 


                            </p>
                         
                           </a>
, <a href='https://www.linkedin.com/in/alexia-karolewicz-71a9b644/' target="_blank" >
                         <center><Image
                           src='/assets/images/testimonies/alexia.webp'
                           alt="Features tile icon 06"
                           width={74}
                           height={74}
                           style={{
                           'borderRadius': '45px 45px 45px 45px',
                           'border': '2px solid rgba(255, 255, 255, 1)'
                           }}
                          </>></center>
                           <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey', padding:'2rem','textShadow': '2px 2px 2px rgba(0, 0, 0, 0)' , 'maxWidth':'400px', 'textAlign': 'left',}}>

                              <b style={{color:'#00f75f'}}> Access Early Trading Opportunities </b>
                             <br></br>
                             "Being ahead of the curve matters: time is money.
                             <br></br>HelloStocker Financial Advisor spots stocks with huge upside potential before the masses catch on.
                              <br></br>I get notifications directly on your phone: I receive the information faster.
                               <br></br>That early advantage has made a real difference in my gains.
                                <br></br>I perfectly timed Adobe, AMD & Workforce."
                              <br></br>
                              <br></br>
                         <b>  Alexia Karolewicz
                           <br></br>
                           Procurement Manager IP Acquisition   </b> 


                            </p>
                         
                           </a>
,<a href='https://www.linkedin.com/in/mehrad-oroudji-0b122544/' target="_blank" > 
                         <center><Image
                           src='/assets/images/testimonies/mehrad.webp'
                           alt="Features tile icon 06"
                           width={74}
                           height={74}
                           style={{
                           'borderRadius': '45px 45px 45px 45px',
                           'border': '2px solid rgba(255, 255, 255, 1)'
                           }}
                          </>></center>
                           <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey', padding:'2rem','textShadow': '2px 2px 2px rgba(0, 0, 0, 0)' , 'maxWidth':'400px', 'textAlign': 'left',}}>

                              <b style={{color:'#00f75f'}}> Powered by ChatGPT </b>
                             <br></br>
                             "No more complicated Bloomberg terminals! Old school way! HelloStocker is the new way to go: the ChatGPT of investing.
                              <br></br>They make it easy to navigate the large stock universe.
                              <br></br>I received blue chip stocks recommendations that keep outperforming the sp500.
                              <br></br>It's easy to make money when the market goes up, but it's always hard to beat the sp500 market, well done team!"
                              <br></br>
                              <br></br>
                         <b>  Mehrad Oroudji
                                                   <br></br>
                                                   Senior Non Linear Credit Trader   </b> 


                            </p>
                         
                           </a>
, <a href='https://www.linkedin.com/in/charles-elie-labroy-6500b480/' target="_blank" >
                         <center><Image
                           src='/assets/images/testimonies/charles.webp'
                           alt="Features tile icon 06"
                           width={74}
                           height={74}
                           style={{
                           'borderRadius': '45px 45px 45px 45px',
                           'border': '2px solid rgba(255, 255, 255, 1)'
                           }}
                          </>></center>
                           <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey', padding:'2rem','textShadow': '2px 2px 2px rgba(0, 0, 0, 0)' , 'maxWidth':'400px', 'textAlign': 'left',}}>

                              <b style={{color:'#00f75f'}}> Join a Community of Investors Who Care About You</b>
                             <br></br>
                             "HelloStocker community is a goldmine! Investors and hedge fund members has given me financial insights and great connections, they are here to help.
                             <br></br>They don't push me to trade, in fact you can't real trade with them at all...
                              <br></br>They have my long term interests in mind and help me train with their tools.
                              <br></br>eToro became a naughty mess they should 1) rethink their UX and 2) get rid of all these influencers who want to make money by pushing you to buy anything fast."
                              <br></br>
                              <br></br>
                         <b>  Charles Elie Labroy
                           <br></br>
                           Machine Learning Software Developer @ Meta   </b> 


                            </p>
                         
                           </a>
, <a href='https://www.linkedin.com/in/kanishkbudhia/' target="_blank" >
                         <center><Image
                           src='/assets/images/testimonies/kanishk.webp'
                           alt="Features tile icon 06"
                           width={74}
                           height={74}
                           style={{
                           'borderRadius': '45px 45px 45px 45px',
                           'border': '2px solid rgba(255, 255, 255, 1)'
                           }}
                          </>></center>
                           <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey', padding:'2rem','textShadow': '2px 2px 2px rgba(0, 0, 0, 0)' , 'maxWidth':'400px', 'textAlign': 'left',}}>

                              <b style={{color:'#00f75f'}}> Exponential Growth Potential </b>
                             <br></br>
                             "It's not just about investing, it's about building wealth, and making it grow the smart way.
                              <br></br>I don't just 'realise profits': I track how much I make over the sp500.
                              <br></br>Making money is easy when everything goes up, beating the sp500 market with their Stocker AI advisor is the real way to go!"
                              <br></br>
                              <br></br>
                         <b>  Kanishk Budhia
                           <br></br>
                           CEO & Founder @ Solino Home   </b> 


                            </p>
                         
                           </a>
, <a href='https://www.linkedin.com/in/maxime-lonn%C3%A9-b38a6829/' target="_blank" >
                         <center><Image
                           src='/assets/images/testimonies/maxime.webp'
                           alt="Features tile icon 06"
                           width={74}
                           height={74}
                           style={{
                           'borderRadius': '45px 45px 45px 45px',
                           'border': '2px solid rgba(255, 255, 255, 1)'
                           }}
                          </>></center>
                           <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey', padding:'2rem','textShadow': '2px 2px 2px rgba(0, 0, 0, 0)' , 'maxWidth':'400px', 'textAlign': 'left',}}>

                              <b style={{color:'#00f75f'}}> A Safe Playground for learning </b>
                             <br></br>
                             "Practise trading ideas without the risk! HelloStocker App nails it.
                             <br></br>They don't take any money from you, it's not about pushing you to trade now: it's about making sure you acquire the skillset and profit from it.
                              <br></br>I get as much virtual trading money as I want and can practice trading ideas without the fear of losing real cash.
                              <br></br>It's a safe playground for learning and gaining confidence in their AI technology."
                              <br></br>
                              <br></br>
                         <b>  Maxime Lonné
                           <br></br>
                           Directeur Paid Media @ Eskimoz   </b> 


                            </p>
                         
                           </a>,

                            <a href='https://www.linkedin.com/in/sachaberenfus/' target="_blank" >
                         <center><Image
                           src='/assets/images/testimonies/sacha.webp'
                           alt="Features tile icon 06"
                           width={74}
                           height={74}
                           style={{
                           'borderRadius': '45px 45px 45px 45px',
                           'border': '2px solid rgba(255, 255, 255, 1)'
                           }}
                          </>></center>
                           <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey', padding:'2rem','textShadow': '2px 2px 2px rgba(0, 0, 0, 0)' , 'maxWidth':'400px', 'textAlign': 'left',}}>

                              <b style={{color:'#00f75f'}}> Access Transparent AI Data </b>
                             <br></br>
                             "HelloStocker AI doesn't hide a thing, I get access to AI-processed data and can verify and understand how the decisions are made.
                              <br></br>Transparency like this builds trust.
                              <br></br>I understand how my ai advisor takes the decisions and can interact with the AI directly, better than sending emails and waiting for answers, makes me save time and cash on profits faster.
                              <br></br>Time is money especially in investing! Stocker App great job!"
                              <br></br>
                              <br></br>
                         <b>  Sacha Berenfus
                           <br></br>
                           Sales Growth Manager @ Hubspot   </b> 


                            </p>
                         
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
