import React, { Component } from 'react';
import { useState } from "react";

const QuoteDisplay = () => {
  const [quotes, setQuotes] = useState([
  "Opportunities in the stock market are like sunrises; if you wait too long, you'll miss them. - Warren Buffett",
    "If you don't find a way to make money while you sleep, you will work until you die. - Warren Buffett",
    "Investing is about using your money to make more money. - Robert Kiyosaki",
    "The stock market is a device for transferring money from the impatient to the patient. - Warren Buffett",
    "Price is what you pay. Value is what you get. - Warren Buffett",
    "In the short run, the market is a voting machine, but in the long run, it is a weighing machine. - Benjamin Graham",
    "The only thing we know about the stock market is that it will fluctuate. – Benjamin Graham",
    "Investing should be more like watching paint dry or watching grass grow. If you want excitement, take $800 and go to Las Vegas. – Paul Samuelson",
    "The stock market is a teacher; its lessons can be both rewarding and costly. - Benjamin Graham",
    "Your net worth is determined by your network – the people you learn from and grow with. - Warren Buffett",
    "A well-diversified portfolio is the shield that guards your financial future. - Benjamin Graham",
    "The stock market doesn't discriminate; it's open to anyone willing to learn and take action. - Warren Buffett",
    "Success in investing is built on a foundation of sound research and thoughtful decisions. - Warren Buffett",
    "The market is a giant discount machine. It's the only store where when everything goes on sale, people run out of the store. – Mark Cuban",
    // Add more quotes here as needed
  ]);

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const generateRandomQuote = () => {
    const newIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuoteIndex((currentQuoteIndex + 1)%quotes.length);
  };


  return (
    <div>

    <center>
      <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight md:pr-8" style={{maxWidth:'900px','color':'white', 'textShadow': '2px 2px 2px rgba(0, 0, 0, 0)' }}>
      {quotes[currentQuoteIndex]}</h2>
           <br></br>


        <button onClick={generateRandomQuote}
            style={{

                 }}>  <div style={{
                 'padding': '0.8rem',
                 'color': 'black',
                  'width':'31vw',
                 'textAlign': 'center',
                 'fontSize': 'min(19px,max(15px,2vw))',
                 'borderRadius': '30px 30px 30px 30px',
                 'background': '#00f75f',
                 'maxWidth':'280px'
                }}>Show me another quote</div></button>
      </center>
    </div>
  );
};

export default QuoteDisplay;
