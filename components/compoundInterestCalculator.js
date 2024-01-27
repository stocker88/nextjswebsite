import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const CompoundInterestCalculator = () => {
  const [principal, setPrincipal] = useState('10000');
  const [dailyContrib, setDailyContrib] = useState('30');
  const [monthlyReturn, setMonthlyReturn] = useState('1.4');
  const [investmentYears, setInvestmentYears] = useState('30');
  const [data, setData] = useState([]);

  useEffect(() => {
    calculateCompoundInterest();
  }, []); // Empty dependency array to run the effect only once on mount

  const calculateCompoundInterest = () => {
    const monthlyInterestRate = monthlyReturn / 100;
    const periods = investmentYears * 12;

    let principalAmount = parseFloat(principal);
    let dailyContribution = parseFloat(dailyContrib) * 32;

    const dataPoints = [];

    for (let month = 0; month < periods; month++) {
      principalAmount += dailyContribution;
      const interest = principalAmount * monthlyInterestRate;
      principalAmount += interest;

      dataPoints.push({
        year: month / 12, // convert months to years
        totalWithInterest: principalAmount, // convert to thousands
        onlyAmountSaved: parseFloat(principal) + parseFloat(dailyContrib) * 32 * month,
      });
    }

    setData(dataPoints);
  };

  const formatYAxisValue = (value) => `$${value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  const formatXAxisValue = (value) => Math.round(value) % 5 === 0 ? Math.round(value) : '';

  return (
   <div style={{ color: 'black', padding: '2px' }}>
     <h2 className="text-2xl md:text-4xl font-bold tracking-tighter leading-tight" style={{ letterSpacing: '0.5px', color: 'white', textShadow: '0px 0px 3px rgba(0, 0, 0, 1)' }}>
       Each +0.1% matters:
       <br />
       Compound Interest Calculator
     </h2>

     <div style={{ marginTop: '20px', display: 'inline-block', textAlign: 'left' }}>
       <label style={{ display: 'block', marginBottom: '10px' }}>
         <span style={{ color: 'white', display: 'block', marginBottom: '5px' }}>Initial Amount:</span>
         <input
           type="number"
           value={principal}
           onChange={(e) => setPrincipal(e.target.value)}
           style={{ textAlign: 'center', borderRadius: '5px' }}
         />
       </label>

       <label style={{ display: 'block', marginBottom: '10px' }}>
         <span style={{ color: 'white', display: 'block', marginBottom: '5px' }}>Daily Contribution:</span>
         <input
           type="number"
           value={dailyContrib}
           onChange={(e) => setDailyContrib(e.target.value)}
           style={{ textAlign: 'center', borderRadius: '5px' }}
         />
       </label>

       <label style={{ display: 'block', marginBottom: '10px' }}>
         <span style={{ color: 'white', display: 'block', marginBottom: '5px' }}>Monthly Return (%):</span>
         <input
           type="number"
           value={monthlyReturn}
           onChange={(e) => setMonthlyReturn(e.target.value)}
           style={{ textAlign: 'center', borderRadius: '5px' }}
         />
       </label>

       <label style={{ display: 'block', marginBottom: '10px' }}>
         <span style={{ color: 'white', display: 'block', marginBottom: '5px' }}>Investment Period (Years):</span>
         <input
           type="number"
           value={investmentYears}
           onChange={(e) => setInvestmentYears(e.target.value)}
           style={{ textAlign: 'center', borderRadius: '5px' }}
         />
       </label>

       <button
         style={{
           padding: '8px',
           cursor: 'pointer',
           backgroundColor: '#4CAF50',
           color: 'white',
           border: 'none',
           borderRadius: '5px',
         }}
         onClick={calculateCompoundInterest}
       >
         Calculate
       </button>
     </div>



        {data.length > 0 && (
          <LineChart width={window.innerWidth < 300 ? 250 : window.innerWidth < 400 ? 350:window.innerWidth < 540 ? 500: window.innerWidth < 600 ? 480:500} height={400} data={data} margin={{ top: 20, right: 30, left: 37, bottom: 10 }}>
            <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottomRight', offset: -10 }} tickFormatter={formatXAxisValue} />
            <YAxis label={{ value: '', angle: -90, position: 'insideLeft' }} tickFormatter={formatYAxisValue} />
              <Tooltip
                formatter={(value) => `$${value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
                labelFormatter={(label) => <span style={{ color: 'white' }}>{`${label.toFixed(1)} years`}</span>}
                contentStyle={{ textShadow: '0px 0px 3px rgba(0, 0, 0, 1)', backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: '30px', fontWeight: 'bold' }}
              />

            <Line type="monotone" dataKey="totalWithInterest" stroke="#8884d8" name="Total with Compound Growth" />
            <Line type="monotone" dataKey="onlyAmountSaved" stroke="#82ca9d" name="Amount Saved without Compounding" />
          </LineChart>
        )}

    </div>
  );
};

export default CompoundInterestCalculator;
