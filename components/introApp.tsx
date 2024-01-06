import { CMS_NAME } from '../lib/constants'

const IntroApp = () => {
  return (

    <section className="flex-col  flex items-center md:justify-between mt-16 mb-16 md:mb-12">
      <h2 className="text-4xl md:text-7xl font-bold tracking-tighter leading-tight " style={{'color':'white', 'textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' }} >
        Ask for Hot Stocks To Buy Now
      </h2>
<br></br>
      <h2 className="text-2xl md:text-4xl font-bold tracking-tighter leading-tight " style={{'color':'lightGrey', 'textShadow': '0px 0px 3px rgba(0, 0, 0, 1)' }} >
        We Give You Virtual Money to Test AI Trading Signals Based On:
        <center>
        <br></br>
        Financial Economic Analysis
        <br></br>
        Technical Trading Projections
        <br></br>
        Social Hype Data
        <br></br>
        AI Quantitative Factors
        </center>
      </h2>
     {/* <h4 className="text-center md:text-left text-lg mt-5 md:pl-8">
        You have control over your own success

      </h4>*/}
    </section>

  )
}

export default IntroApp
