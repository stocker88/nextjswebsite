import { useState } from 'react';

function FAQ() {
  const [isOpen, setIsOpen] = useState({
    time: false,
    knowledge: false,
    money: false,
    strategy: false,
    miner: false,
    results: false,
  });

  // Toggle function to open/close answers
  const toggleAnswer = (question) => {
    setIsOpen((prevState) => ({
      ...prevState,
      [question]: !prevState[question],
    }));
  };

  // Styles for the overall container with gradient and border
  const containerStyle = {
    background: 'linear-gradient(#5348A3, black)', // Green to Black gradient
    borderRadius: '30px', // Rounded corners
    border: '2px solid #5348A3', // Green border around the container
   padding: '20px',
    width: '95%',
    maxWidth: '1000px',
    margin: '2.5%',
  };

  // Styles for each question block
  const questionBlockStyle = {
    marginBottom: '20px',
    padding: '15px',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
  };

  // Styles for the plus/minus icon
  const iconStyle = {
    fontSize: '28px', // Larger icon size
    color: 'white',
    transition: 'color 0.3s ease',
    cursor: 'pointer',
  };

  return (
    <section style={containerStyle}>
      <h2
        className="text-2xl md:text-4xl tracking-tighter leading-tight"
        style={{
          letterSpacing: '0.5px',
          color: 'white',
          textShadow: '0px 0px 3px rgba(0, 0, 0, 1)',
          marginBottom: '20px',
          textAlign: 'center',
          fontSize: '1.7rem', // Smaller title size
        }}
      >
        FREQUENTLY ASKED QUESTIONS...
      </h2>

      <div
        style={{
          color: 'lightGrey',
          fontSize: '1.4rem', // Smaller question size
          lineHeight: '1.6',
          letterSpacing: '0.05em',
          textAlign: 'left',
          paddingLeft: '10px',
          paddingRight: '10px',
        }}
      >
        {/* Question 1 */}
        <div
          style={questionBlockStyle}
          onClick={() => toggleAnswer('results')}
        >
          <p style={{ fontSize: '1.3rem' }}>How long will  it take to get results?</p>
          <span style={iconStyle}>
            {isOpen.results ? '-' : '+'}
          </span>
        </div>
        {isOpen.results && (
          <div style={{ marginLeft: '40px', color: 'white', fontSize: '1.2rem', marginBottom: '40px' }}>
            If you dedicate between 10 to 20 minutes a day and follow the indications, you should get results within 1 month.
          </div>
        )}

        {/* Question 2 */}
        <div
          style={questionBlockStyle}
          onClick={() => toggleAnswer('strategy')}
        >
          <p style={{ fontSize: '1.3rem' }}>I have already tried other strategies and have not obtained results</p>
          <span style={iconStyle}>
            {isOpen.strategy ? '-' : '+'}
          </span>
        </div>
        {isOpen.strategy && (
          <div style={{ marginLeft: '40px', color: 'white', fontSize: '1.2rem', marginBottom: '40px' }}>
            We are different, and we are making a difference.
            <br/>
            <br/>Our advisors:
            <br/>
             <br/>- Managed billions for Wall Street Hedge Funds.
             <br/>- Built AI tools for big tech giants.
             <br/>- Delivered x5 to x30 stock picks returns on over 100 stocks:
             <br/>
             <br/>Nvidia Stock: +3,100% bought at $5,
             <br/>Palantir Stock : +680% in 2 years,
             <br/>SoundHound AI Options: +3,280% in 1 month,
             <br/>
             <br/>You will receiving coaching from Goldman Sachs and Bank of America investors, Math PhDs and Macro Economics experts who have been investing for over 15 years.
          </div>
        )}

        {/* Question 3 */}
        <div
          style={questionBlockStyle}
          onClick={() => toggleAnswer('works')}
        >
          <p style={{ fontSize: '1.3rem' }}>It will work for me?</p>
          <span style={iconStyle}>
            {isOpen.works ? '-' : '+'}
          </span>
        </div>
        {isOpen.works && (
          <div style={{ marginLeft: '40px', color: 'white', fontSize: '1.2rem', marginBottom: '40px' }}>
            This works for anyone, no matter your age, country, gender, or economic situation, because it is a method that is validated with numbers, and all you have to do is make the same decisions as I did to get similar results and that is exactly what I teach in the program.
          </div>
        )}

        {/* Question 4 */}
        <div
          style={questionBlockStyle}
          onClick={() => toggleAnswer('work')}
        >
          <p style={{ fontSize: '1.3rem' }}>What happens if I work?</p>
          <span style={iconStyle}>
            {isOpen.work ? '-' : '+'}
          </span>
        </div>
        {isOpen.work && (
          <div style={{ marginLeft: '40px', color: 'white', fontSize: '1.2rem', marginBottom: '40px' }}>
            You can dedicate only 10 minutes to trade the markets and the rest of the day do whatever you have or prefer to do.
          </div>
        )}

        {/* Question 5 */}
        <div
          style={questionBlockStyle}
          onClick={() => toggleAnswer('miner')}
        >
          <p style={{ fontSize: '1.3rem' }}>I made huge profits, could you please teach my kids?</p>
          <span style={iconStyle}>
            {isOpen.miner ? '-' : '+'}
          </span>
        </div>
        {isOpen.miner && (
          <div style={{ marginLeft: '40px', color: 'white', fontSize: '1.2rem', marginBottom: '40px' }}>
            Many parents have been bringing their kids on the platform.
            <br/>They can learn the strategies and practise in our virtual trading simulator.
            <br/>Who else will teach them investing for less than $20?
          </div>
        )}

        {/* Question 6 */}
        <div
          style={questionBlockStyle}
          onClick={() => toggleAnswer('money')}
        >
          <p style={{ fontSize: '1.3rem' }}>I don’t have much money to invest</p>
          <span style={iconStyle}>
            {isOpen.money ? '-' : '+'}
          </span>
        </div>
        {isOpen.money && (
          <div style={{ marginLeft: '40px', color: 'white', fontSize: '1.2rem', marginBottom: '40px' }}>
            You can start with $100 if you want to jump on option plays.
            <br/>Some plays deliver x35 within a month, +$3,500 per $100 invested.
            <br/>However we recommended long term stock investing.
            <br/>You can start stock investing is $500.
          </div>
        )}

        {/* Question 7 */}

        <div
          style={questionBlockStyle}
          onClick={() => toggleAnswer('timeInvest')}
        >
          <p style={{ fontSize: '1.3rem' }}>How much time do I have to invest?</p>
          <span style={iconStyle}>
            {isOpen.timeInvest ? '-' : '+'}
          </span>
        </div>
        {isOpen.timeInvest && (
          <div style={{ marginLeft: '40px', color: 'white', fontSize: '1.2rem', marginBottom: '40px' }}>
            10 minutes or even less is enough if you already know the strategy.
            <br/>If you are just starting, 30 minutes would be enough to ramp up.
          </div>
        )}

        {/* Question 8 */}
        <div
          style={questionBlockStyle}
          onClick={() => toggleAnswer('noKnowledge')}
        >
          <p style={{ fontSize: '1.3rem' }}>What if I don’t know anything about financial markets?</p>
          <span style={iconStyle}>
            {isOpen.noKnowledge ? '-' : '+'}
          </span>
        </div>
        {isOpen.noKnowledge && (
          <div style={{ marginLeft: '40px', color: 'white', fontSize: '1.2rem', marginBottom: '40px' }}>
            You don't need to know anything to get started.
             <br/>We will teach you everything you need and save you 200 hours of research.
          </div>
        )}
      </div>
    </section>
  );
}

export default FAQ;