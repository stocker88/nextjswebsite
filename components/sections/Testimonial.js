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

<a href='https://www.linkedin.com/in/fabienns/' target="_blank" >
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
                             Directeur Paid Media @ Eskimoz   </b>


                              </p>

                             </a>,
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

                              <b className="text-2xl md:text-5xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'#493bc3'}}> They Tell Me When To Realise My Gains </b>
                              <br></br>
                             <br></br>
                           What's the point of buying if you don't know when to sell?

                         It costs $10 monthly subscription, and that's it🚀

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

                             </a>
, <a href='https://www.linkedin.com/in/felix-revert-00998852/' target="_blank" >
                         <center><Image
                           src='/assets/images/testimonies/felix.webp'
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
                             I can't wait for boring emails newsletters and reports...

                              I get instant suggestions and replies.

                               This AI advisor is reactive and sends perfect recaps!

                                My time saving hero.
                             I don't wait weeks for email replies: their advisor sends me instant replies.
                             Time is money, especially in investing and trading.

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
                           width={130}
                           height={130}
                           style={{
                           'borderRadius': '45px 45px 45px 45px',
                           'border': '2px solid rgba(255, 255, 255, 1)'
                           }}
                          /></center>
                           <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey', padding:'2rem','textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' , 'maxWidth':'700px', 'textAlign': 'left',}}>

                              <b className="text-2xl md:text-5xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'#493bc3'}}> Access Early Trading Opportunities </b>
                             <br></br>
                             <br></br>
                             Being ahead of the curve matters.
                             StocksToBuyNow Financial Advisor spots stocks with huge upside potential before the masses catch on.
                             They send important reminders and insights.
                             That early advantage has made a real difference in my gains. I always double check with the AI before buying anything.
                             I perfectly timed Adobe, AMD, Ferrari & Workforce.
                              <br></br>
                              <br></br>
                         <b>  Alexia Karolewicz
                           <br></br>
                           Procurement Manager IP Acquisition   </b>


                            </p>

                           </a>
]}
           </div>
<br></br> <br></br>
      <br></br><br></br>

     <QuoteDisplay/>
     <br></br> <br></br>
     <br></br> <br></br>


    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 lg:gap-x-32 gap-y-20 md:gap-y-32 mb-32">

{[

     <a href='https://www.linkedin.com/in/kanishkbudhia/' target="_blank" >
                          <center><Image
                            src='/assets/images/testimonies/kanishk.webp'
                            alt="Features tile icon 06"
                            width={130}
                            height={130}
                            style={{
                            'borderRadius': '45px 45px 45px 45px',
                            'border': '2px solid rgba(255, 255, 255, 1)'
                            }}
                           /></center>
                            <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey', padding:'2rem','textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' , 'maxWidth':'700px', 'textAlign': 'left',}}>

                               <b className="text-2xl md:text-5xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'#493bc3'}}> Exponential Growth Potential </b>
                               <br></br>
                              <br></br>
                              It's not just about trading... it's about building wealth, and making it constantly grow.
                               I don't just 'realise profits': I track how well my stocks do over the sp500.
                               Finding stocks that go up is easy when everything goes up.
                               <br></br>Finding better trades than others and beating the sp500 market is the real way to go!
                               <br></br>
                               <br></br>
                          <b>  Kanishk Budhia
                            <br></br>
                            CEO & Founder @ Solino Home   </b>


                             </p>

                            </a>
, <a href='https://www.linkedin.com/in/charles-elie-labroy-6500b4130/' target="_blank" >
                         <center><Image
                           src='/assets/images/testimonies/charles.webp'
                           alt="Features tile icon 06"
                           width={130}
                           height={130}
                           style={{
                           'borderRadius': '45px 45px 45px 45px',
                           'border': '2px solid rgba(255, 255, 255, 1)'
                           }}
                          /></center>
                           <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey', padding:'2rem','textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' , 'maxWidth':'700px', 'textAlign': 'left',}}>

                              <b className="text-2xl md:text-5xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'#493bc3'}}> Join a Community of Investors Who Care About You</b>
                              <br></br>
                             <br></br>
                             StocksToBuyNow trading community is a goldmine! Top investors and hedge fund members have given me financial insights and great connections.
                              <br></br>They have my long term interests in mind and help me train with their tools.

                              <br></br>
                              <br></br>
                         <b>  Charles Elie Labroy
                           <br></br>
                           Machine Learning Software Developer @ Meta   </b>


                            </p>

                           </a>
, <a href='https://www.linkedin.com/in/mehrad-oroudji-0b122544/' target="_blank" >
                           <center><Image
                             src='/assets/images/testimonies/mehrad.webp'
                             alt="Features tile icon 06"
                             width={130}
                             height={130}
                             style={{
                             'borderRadius': '45px 45px 45px 45px',
                             'border': '2px solid rgba(255, 255, 255, 1)'
                             }}
                            /></center>
                             <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey', padding:'2rem','textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' , 'maxWidth':'700px', 'textAlign': 'left',}}>

                                <b className="text-2xl md:text-5xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'#493bc3'}}> Powered by ChatGPT </b>
                                <br></br>
                               <br></br>
                               No more complicated Bloomberg terminals!
                                StocksToBuyNow App is the way to go: ChatGPT advisor of investing.
                                They make it easy to navigate the stock market universe.
                                I received blue chip stocks recommendations that keep outperforming the sp500.
                                It's easy to find good stocks when the market goes up, but not as easy to beat the sp500 overall stock market!💸

                                <br></br>
                                <br></br>
                           <b>  Mehrad Oroudji
                                                     <br></br>
                                                     Senior Non Linear Credit Trader   </b>


                              </p>

                             </a>
,

                            <a href='https://www.linkedin.com/in/sachaberenfus/' target="_blank" >
                         <center><Image
                           src='/assets/images/testimonies/sacha.webp'
                           alt="Features tile icon 06"
                           width={130}
                           height={130}
                           style={{
                           'borderRadius': '45px 45px 45px 45px',
                           'border': '2px solid rgba(255, 255, 255, 1)'
                           }}
                          /></center>
                           <p className="text-lg leading-relaxed mb-4" style={{'color':'lightgrey', padding:'2rem','textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' , 'maxWidth':'700px', 'textAlign': 'left',}}>

                              <b className="text-2xl md:text-5xl font-bold mt-0 mb-12 center-content-mobile" style={{color:'#493bc3'}}> Access Transparent AI Data </b>
                              <br></br>
                             <br></br>Transparency like this builds trust. I can access the AI data and verify how investment decisions are made.


                            StocksToBuyNow AI tips don't hide a thing. I understand how my advisor takes decisions and can interact with the AI at any time.
                              I use the app everyday, I get new ideas and double check all ideas I have, I totally recommend!
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
