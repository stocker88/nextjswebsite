import React from 'react';
import classNames from 'classnames';
import { SectionSplitProps } from '../../utils/SectionProps';
import SectionHeader2 from './partials/SectionHeader2';
import Image from 'next/image';
import Button from '../elements/Button';
import ButtonGroup from '../elements/ButtonGroup';
import { useState } from 'react';
import Container from '../../components/container'
import SectionHeader from './partials/SectionHeader';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import InstallButtonsWithQR from '../elements/InstallButtonsWithQR';
import { isMobile, browserName } from "react-device-detect";
import NewsletterSignUp from '../formStocker'
import Blog from "../sections/Blog";
import IntroDownload from '../../components/introDownload';
import CompanyList from '../../components/CompanyList';
import SearchStocks from '../../components/SearchStocks';
import { stockDataSearch } from '../../components/constants';

const stockData =[{"ticker": "AAPL", "name": "Apple", "logo": "AAPL.webp", "marketCap": 2964985733703}, {"ticker": "MSFT", "name": "Microsoft", "logo": "MSFT.webp", "marketCap": 2772753328450}, {"ticker": "GOOGL", "name": "Alphabet", "logo": "GOOGL.webp", "marketCap": 1724164665217}, {"ticker": "AMZN", "name": "Amazon", "logo": "AMZN.webp", "marketCap": 1487062555345}, {"ticker": "NVDA", "name": "NVIDIA", "logo": "NVDA.webp", "marketCap": 1233616869959}, {"ticker": "META", "name": "Meta Platforms", "logo": "META.webp", "marketCap": 865991483383}, {"ticker": "TSLA", "name": "Tesla", "logo": "TSLA.webp", "marketCap": 766755478862}, {"ticker": "BTC-USD", "name": "Bitcoin USD", "logo": "BTC-USD.webp", "marketCap": 713162883072}, {"ticker": "LLY", "name": "Eli Lilly and", "logo": "LLY.webp", "marketCap": 562559309764}, {"ticker": "V", "name": "Visa", "logo": "V.webp", "marketCap": 517913947499}, {"ticker": "TSM", "name": "Taiwan Semiconductor Manufactur", "logo": "TSM.webp", "marketCap": 510394625519}, {"ticker": "UNH", "name": "UnitedHealth", "logo": "UNH.webp", "marketCap": 499080301273}, {"ticker": "NVO", "name": "Novo Nordisk A/S", "logo": "NVO.webp", "marketCap": 458501594288}, {"ticker": "JPM", "name": "JP Morgan Chase &", "logo": "JPM.webp", "marketCap": 442237810572}, {"ticker": "WMT", "name": "Walmart", "logo": "WMT.webp", "marketCap": 419506533268}, {"ticker": "XOM", "name": "Exxon Mobil", "logo": "XOM.webp", "marketCap": 418480327775}, {"ticker": "AVGO", "name": "Broadcom", "logo": "AVGO.webp", "marketCap": 404975594888}, {"ticker": "SPY", "name": "S&P 500", "logo": "SPY.webp", "marketCap": 393766764544}, {"ticker": "MA", "name": "Mastercard", "logo": "MA.webp", "marketCap": 380502638001}, {"ticker": "JNJ", "name": "Johnson & Johnson", "logo": "JNJ.webp", "marketCap": 363788161189}, {"ticker": "PG", "name": "Procter & Gamble", "logo": "PG.webp", "marketCap": 352614331095}, {"ticker": "MC.PA", "name": "LVMH", "logo": "MC.PA.webp", "marketCap": 352334444183}, {"ticker": "IVV", "name": "iShares Core S&P 500 ETF", "logo": "IVV.webp", "marketCap": 341270003712}, {"ticker": "ORCL", "name": "Oracle", "logo": "ORCL.webp", "marketCap": 317987231701}, {"ticker": "HD", "name": "Home Depot", "logo": "HD.webp", "marketCap": 305361375023}, {"ticker": "ADBE", "name": "Adobe", "logo": "ADBE.webp", "marketCap": 278183742554}, {"ticker": "CVX", "name": "Chevron", "logo": "CVX.webp", "marketCap": 271911499631}, {"ticker": "ASML", "name": "ASML N.V. - New York Re", "logo": "ASML.webp", "marketCap": 270065292007}, {"ticker": "MRK", "name": "Merck &", "logo": "MRK.webp", "marketCap": 259002191692}, {"ticker": "COST", "name": "Costco Wholesale", "logo": "COST.webp", "marketCap": 258693556221}, {"ticker": "KO", "name": "Coca-Cola", "logo": "KO.webp", "marketCap": 250887472380}, {"ticker": "TM", "name": "Toyota Motor", "logo": "TM.webp", "marketCap": 247381137803}, {"ticker": "ETH-USD", "name": "Ethereum USD", "logo": "ETH-USD.webp", "marketCap": 245656567808}, {"ticker": "ABBV", "name": "AbbVie", "logo": "ABBV.webp", "marketCap": 244933352217}, {"ticker": "BAC", "name": "Bank of America", "logo": "BAC.webp", "marketCap": 234721232016}, {"ticker": "PEP", "name": "Pepsico", "logo": "PEP.webp", "marketCap": 230701517565}, {"ticker": "OR.PA", "name": "L\'OREAL", "logo": "OR.PA.webp", "marketCap": 229026093826}, {"ticker": "FMX", "name": "Fomento Economico Mexicano", "logo": "FMX.webp", "marketCap": 221330798441}, {"ticker": "SHEL", "name": "Shell", "logo": "SHEL.webp", "marketCap": 218967872664}, {"ticker": "CRM", "name": "Salesforce", "logo": "CRM.webp", "marketCap": 218936556852}, {"ticker": "NFLX", "name": "Netflix", "logo": "NFLX.webp", "marketCap": 207876121343}, {"ticker": "ACN", "name": "Accenture plc", "logo": "ACN.webp", "marketCap": 207442917334}, {"ticker": "RMS.PA", "name": "HERMES INTL", "logo": "RMS.PA.webp", "marketCap": 204242490686}, {"ticker": "MCD", "name": "McDonald\'s", "logo": "MCD.webp", "marketCap": 203436676113}, {"ticker": "BABA", "name": "Alibaba", "logo": "BABA.webp", "marketCap": 201042811839}, {"ticker": "LIN", "name": "Linde plc", "logo": "LIN.webp", "marketCap": 199731035085}, {"ticker": "AZN", "name": "Astrazeneca", "logo": "AZN.webp", "marketCap": 199257069645}, {"ticker": "NVS", "name": "Novartis AG", "logo": "NVS.webp", "marketCap": 198105226070}, {"ticker": "QQQ", "name": "Invesco QQQ Trust", "logo": "QQQ.webp", "marketCap": 194685435904}, {"ticker": "CSCO", "name": "Cisco Systems", "logo": "CSCO.webp", "marketCap": 194675529539}, {"ticker": "AMD", "name": "Advanced Micro Devices", "logo": "AMD.webp", "marketCap": 192502989729}, {"ticker": "TMO", "name": "Thermo Fisher Scientific", "logo": "TMO.webp", "marketCap": 186381994740}, {"ticker": "INTC", "name": "Intel", "logo": "INTC.webp", "marketCap": 183986237427}, {"ticker": "SAP", "name": "SAP ", "logo": "SAP.webp", "marketCap": 178379245120}, {"ticker": "ABT", "name": "Abbott Laboratories", "logo": "ABT.webp", "marketCap": 176921884219}, {"ticker": "SHEL.L", "name": "SHELL ORD EUR0.07", "logo": "SHEL.L.webp", "marketCap": 171960223918}, {"ticker": "TMUS", "name": "T-Mobile US", "logo": "TMUS.webp", "marketCap": 171864493506}, {"ticker": "CMCSA", "name": "Comcast", "logo": "CMCSA.webp", "marketCap": 171468404585}, {"ticker": "PFE", "name": "Pfizer", "logo": "PFE.webp", "marketCap": 171086225964}, {"ticker": "DIS", "name": "Walt Disney", "logo": "DIS.webp", "marketCap": 168215438520}, {"ticker": "NKE", "name": "Nike", "logo": "NKE.webp", "marketCap": 165132265344}, {"ticker": "DHR", "name": "Danaher", "logo": "DHR.webp", "marketCap": 160982631442}, {"ticker": "BHP", "name": "BHP", "logo": "BHP.webp", "marketCap": 158313141158}, {"ticker": "AZN.L", "name": "ASTRAZENECA ORD", "logo": "AZN.L.webp", "marketCap": 157966828831}, {"ticker": "INTU", "name": "Intuit", "logo": "INTU.webp", "marketCap": 157556007065}, {"ticker": "PDD", "name": "PDDs", "logo": "PDD.webp", "marketCap": 155896740102}, {"ticker": "WFC", "name": "Wells Fargo &", "logo": "WFC.webp", "marketCap": 154707861185}, {"ticker": "HSBC", "name": "HSBCs, plc.", "logo": "HSBC.webp", "marketCap": 149667021879}, {"ticker": "TTE.PA", "name": "TOTALENERGIES", "logo": "TTE.PA.webp", "marketCap": 149171349750}, {"ticker": "HDB", "name": "HDFC Bank", "logo": "HDB.webp", "marketCap": 148875197023}, {"ticker": "PM", "name": "Philip Morris International", "logo": "PM.webp", "marketCap": 144063651253}, {"ticker": "QCOM", "name": "QUALCOMM", "logo": "QCOM.webp", "marketCap": 141784801053}, {"ticker": "AMGN", "name": "Amgen", "logo": "AMGN.webp", "marketCap": 140655481675}, {"ticker": "IBM", "name": "International Business Machines", "logo": "IBM.webp", "marketCap": 140538144940}, {"ticker": "TXN", "name": "Texas Instruments", "logo": "TXN.webp", "marketCap": 139345737978}, {"ticker": "NOW", "name": "ServiceNow", "logo": "NOW.webp", "marketCap": 137058772353}, {"ticker": "COP", "name": "ConocoPhillips", "logo": "COP.webp", "marketCap": 136754013054}, {"ticker": "UNP", "name": "Union Pacific", "logo": "UNP.webp", "marketCap": 135330759552}, {"ticker": "BA", "name": "Boeing", "logo": "BA.webp", "marketCap": 132048337613}, {"ticker": "SPGI", "name": "S&P Global", "logo": "SPGI.webp", "marketCap": 131079171094}, {"ticker": "GE", "name": "General Electric", "logo": "GE.webp", "marketCap": 130487078354}, {"ticker": "MS", "name": "Morgan Stanley", "logo": "MS.webp", "marketCap": 128793593937}, {"ticker": "BX", "name": "Blackstone", "logo": "BX.webp", "marketCap": 127944080231}, {"ticker": "UPS", "name": "United Parcel Service", "logo": "UPS.webp", "marketCap": 127592963056}, {"ticker": "CAT", "name": "Caterpillar", "logo": "CAT.webp", "marketCap": 126970889719}, {"ticker": "HON", "name": "Honeywell International", "logo": "HON.webp", "marketCap": 126075166391}, {"ticker": "BHP.L", "name": "BHP GROUP LIMITED ORD NPV (DI)", "logo": "BHP.L.webp", "marketCap": 126053167688}, {"ticker": "AMAT", "name": "Applied Materials", "logo": "AMAT.webp", "marketCap": 124852701888}, {"ticker": "BUD", "name": "Anheuser-Busch Inbev Sponsor", "logo": "BUD.webp", "marketCap": 123239343652}, {"ticker": "CDI.PA", "name": "CHRISTIAN DIOR", "logo": "CDI.PA.webp", "marketCap": 123130512960}, {"ticker": "RY", "name": "Royal Bank Of Canada", "logo": "RY.webp", "marketCap": 122024272207}, {"ticker": "UL", "name": "Unilever", "logo": "UL.webp", "marketCap": 120153723791}, {"ticker": "HSBA.L", "name": "HSBC HOLDINGS ORD (UK", "logo": "HSBA.L.webp", "marketCap": 119437719030}, {"ticker": "NEE", "name": "NextEra Energy", "logo": "NEE.webp", "marketCap": 118958142078}, {"ticker": "AXP", "name": "American Express", "logo": "AXP.webp", "marketCap": 118268180851}, {"ticker": "SBUX", "name": "Starbucks", "logo": "SBUX.webp", "marketCap": 117864429093}, {"ticker": "SNY", "name": "Sanofi", "logo": "SNY.webp", "marketCap": 117003883369}, {"ticker": "T", "name": "AT&T", "logo": "T.webp", "marketCap": 115758829173}, {"ticker": "LOW", "name": "Lowe\'s Companies", "logo": "LOW.webp", "marketCap": 114303397076}, {"ticker": "RIO", "name": "Rio Tinto Plc", "logo": "RIO.webp", "marketCap": 113959476363}];

const propTypes = {
  ...SectionSplitProps.types
}

const defaultProps = {
  ...SectionSplitProps.defaults
}

const innerClasses = classNames(
'hero-inner section-inner',
);

const MeetingButton = ({
  ...props
}) => {

  const outerClasses = classNames(
    'features-split section',
    'has-top-divider',
    'has-bottom-divider',
    'has-bg-color',
    'invert-color',
  );

  const innerClasses = classNames(
    'features-split-inner section-inner',
    'has-top-divider',
    'has-bottom-divider'
  );

  const splitClasses = classNames(
    'split-wrap',
    'invert-mobile',
    'invert-desktop',
    
  );

  const sectionHeader = {
    title: '',//We write about investing, analytics, and adjacent topics',
    paragraph: ''
  };
  return (
    <section
      {...props}
      className="flex-col md:flex-row flex items-center md:justify-between "
      id="MeetingButton"
    >
     <div style={{  'width': '100%' }}>
    <center>
      <div className="container-sm has-animations" style={{  zIndex: 10 }}>
          <div className="hero-content">
<Container>
<center>

 <div className="container-sm reveal-from-bottom">
<br></br>
<br></br>
<br></br>
<br></br>
      <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight " style={{'color':'white', 'textShadow': '0px 0px 8px rgba(1, 74, 1, 0.7)'}}>
                  Unlock the Power of Big Data
     </h2>
                     </div>
<div style={{paddingTop: 'max(25px,2.2vw)'}}></div>
           <h2  style={{ color: 'white',fontWeight: 600, fontFamily: 'arial',fontSize: "min(20px,max(18px,3.5vw))", lineHeight: 1.3,textShadow: '0px 0px 5px rgba(1, 0, 1, 0.7)', maxWidth: "650px" }} >
                    Maximize Profits, Minimize Risks. Our cutting-edge AI stock recommendations outperform the rest. Unleash financial success!
                    </h2>
<br></br>

         </center>
         </Container>
        <NewsletterSignUp from='Footer'/>
<div style={{paddingTop: 'max(25px,2.2vw)'}}></div>



        <Container>


            <Image
                src='/assets/images/usersRating.webp'
                alt="AI Financial Advisor & Virtual Investing App sends you hot stocks to watch and buy now: find the next Nvidia, Tesla, Roblox before they skyrocket"
                width={240}
                height={60}
            />


    <div style={{ color: 'lightGrey', fontSize: "min(14px,max(13px,1.3vw))", fontFamily: 'arial', lineHeight: 1,maxWidth: "350px",textShadow: '5px 5px 5px rgba(0, 0, 0, 0)' }} className="reveal-from-bottom" data-reveal-delay="150">
       Join a community of +12,800 investors

       </div>

            <div style={{paddingTop: 'max(25px,2.2vw)'}}></div>

            <br></br>


<br></br><br></br><br></br>
<SearchStocks stockData={stockDataSearch} />
<br></br>
     <CompanyList companies={stockData} />
<div style={{paddingTop: 'max(100px,10vw)'}}></div>


             <div style={{paddingTop: 'max(70px,5vw)'}}></div>

                 {/*    <Image
                      src={require('assets/images/stockstobuynow.png')}
                      alt="StocksToBuyNow app stocks to buy ai stocks to watch market financial advisor economic tools investing virtual trading"
                      width={700}
                      height={58.33}
                      />*/}

          <Image
                          src='/assets/images/stockstobuynow.webp'
                          alt="StocksToBuyNow AI App"
                          priority={true}
                          width={256}
                          height={256}
                         style={{
                         width:'min(max(165px,14vw),250px)',
                          height:'min(max(165px,14vw),250px)',
                          }}

                          />
                    <div className="container-xs">
                    <br></br>
                    <h1 className="text-4xl md:text-7xl tracking-tighter leading-tight" style={{ color: 'white', fontFamily: 'arial',lineHeight: 1.2,textShadow: '0px 0px 7px rgba(1, 0, 1, 0.7)', maxWidth: "800px" }} >
                        Wish someone told you about Nvidia when it was <b>$50 instead of $500</b>?
                      </h1>
        <div style={{paddingTop: 'max(25px,2.2vw)'}}></div>
                   <h2  style={{ color: 'white',fontWeight: 600, fontFamily: 'arial',fontSize: "min(20px,max(18px,3.5vw))", lineHeight: 1.3,textShadow: '0px 0px 5px rgba(1, 0, 1, 0.7)', maxWidth: "650px" }} >
                            Maximize Profits, Minimize Risks. Our cutting-edge AI stock recommendations outperform the rest. Unleash financial success!
                            </h2>
        <br></br>
</div>

  <NewsletterSignUp from='FinalFooter'/>
<br></br>
<br></br>
<br></br>
<br></br>
<br></br>
             </Container>
                 </div>

                     </div>
                     </center>
                     </div>

        <div style={{paddingTop: 'max(100px,20vw)'}}></div>
        <div style={{paddingTop: 'max(100px,20vw)'}}></div>


</section>

  );
}

MeetingButton.propTypes = propTypes;
MeetingButton.defaultProps = defaultProps;

export default MeetingButton;
