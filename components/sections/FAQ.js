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
    background: 'linear-gradient(rgb(46, 105, 61), black)', // Green to Black gradient
    borderRadius: '30px', // Rounded corners
    border: '2px solid rgb(46, 105, 61)', // Green border around the container
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
        className="text-3xl md:text-5xl font-bold tracking-tighter leading-tight"
        style={{
          letterSpacing: '0.5px',
          color: 'white',
          textShadow: '0px 0px 3px rgba(0, 0, 0, 1)',
          marginBottom: '20px',
          textAlign: 'center',
          fontSize: '2rem', // Smaller title size
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
            If you dedicate between 1 to 2 hours a day and follow the indications, you should get your first results in 1 to 3 months.
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
            This is normal, most methods focus on things that do not generate profitability, with Stocks To Buy Now ai we keep it simple, we focus on very few things, but on the right things that work and that allow us to make money every day in the market.
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
            Absolutely nothing happens, with Stocks To Buy Now ai you can dedicate only 1 hour to trade the markets and the rest of the day do whatever you have or prefer to do.
          </div>
        )}

        {/* Question 5 */}
        <div
          style={questionBlockStyle}
          onClick={() => toggleAnswer('miner')}
        >
          <p style={{ fontSize: '1.3rem' }}>I am a miner, can I do it?</p>
          <span style={iconStyle}>
            {isOpen.miner ? '-' : '+'}
          </span>
        </div>
        {isOpen.miner && (
          <div style={{ marginLeft: '40px', color: 'white', fontSize: '1.2rem', marginBottom: '40px' }}>
            You can learn the strategy practise in our virtual trading simulator and be profitable with it. Then help your family members of legal age.
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
            With only $100 USD you can start, either with your own account or by buying a funding account as explained in the video, and be able to access 25k – 50k – 100k capitals.
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
            1 hour or even less is enough if you already know the strategy. If you are just starting, 2 hours would be enough.
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
            You don't need to know anything about the financial markets to make money in it, however, We will teach you everything you need to understand what you are doing.
          </div>
        )}
      </div>
    </section>
  );
}

export default FAQ;