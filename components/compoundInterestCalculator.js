import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import Slider from '@mui/material/Slider';

const CompoundInterestCalculator = () => {
  const [principal, setPrincipal] = useState('10000');
  const [dailyContrib, setDailyContrib] = useState('30');
  const [monthlyReturn, setMonthlyReturn] = useState('0.9');
  const [investmentYears, setInvestmentYears] = useState('20');
  const [data, setData] = useState([]);

  const [sliderValue, setSliderValue] = useState(30);
  const [sliderMonthlyReturnValue, setSliderMonthlyReturnValue] = useState(0.9);
  const [sliderDailyContribValue, setSliderDailyContribValue] = useState(20);
  const [sliderPrincipalValue, setSliderPrincipalValue] = useState(10000);


    const handleSliderMonthlyReturnChange = (value) => {
      setMonthlyReturn(value);
      setSliderMonthlyReturnValue(value);
    };

    const handleSliderPrincipalChange = (value) => {
      setPrincipal(value);
      setSliderPrincipalValue(value);
    };

    const handleSliderDailyContribChange = (value) => {
      setDailyContrib(value);
      setSliderDailyContribValue(value);
    };

  useEffect(() => {
    calculateCompoundInterest();
  }, [principal, dailyContrib, monthlyReturn, investmentYears]); // Empty dependency array to run the effect only once on mount

  const calculateCompoundInterest = () => {
    const annualInterestRate = (monthlyReturn*1.04) / 100*12;
    const periods = investmentYears;

    let principalAmount = parseFloat(principal);
    let dailyContribution = parseFloat(dailyContrib) * 32 * 12;

    const dataPoints = [];

    for (let month = 0; month < periods; month++) {
      principalAmount += dailyContribution;
      const interest = principalAmount * annualInterestRate;
      principalAmount += interest;

      dataPoints.push({
        year: month, // convert months to years
        totalWithInterest: principalAmount, // convert to thousands
        onlyAmountSaved: parseFloat(principal) + parseFloat(dailyContrib) * 32 * 12* month,
      });
    }

    setData(dataPoints);
  };

  const formatYAxisValue = (value) => `$${value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  const formatXAxisValue = (value) => Math.round(value) % 5 === 0 ? Math.round(value) : '';

  return (
          <section style={{
                                width: '90%', // Take up 90% of the screen width
                                maxWidth: '1000px', // Set a maximum width of 1000 pixels
                                margin: '0 auto', // Center the sections horizontally
                             }}>

   <div style={{ color: 'black', padding: '2px' }}>
   <br/>
   <br/>
     <h2 className="text-xl md:text-3xl font-bold tracking-tighter leading-tight" style={{ letterSpacing: '0.5px', color: 'white', textShadow: '0px 0px 3px rgba(0, 0, 0, 1)' }}>


       Compounding Interest: Watch Your Money Snowball!
     </h2>
<br/>
<br/>

     <div style={{ marginTop: '20px', display: 'inline-block', textAlign: 'left' }}>



       <label style={{ display: 'block', marginBottom: '10px' }}>
         <span style={{ color: 'white', display: 'block', marginBottom: '0px' }}>Initial Amount ($)</span>
         <input
           type="number"
           value={principal}
           onChange={(e) => handleSliderPrincipalChange(e.target.value)}
           style={{ textAlign: 'center', borderRadius: '5px' }}
         />
       </label>

        <Slider
             min={0}
             max={20000}
             step={100}
             value={sliderPrincipalValue}
             onChange={(e) => handleSliderPrincipalChange(e.target.value)}

           />

       <label style={{ display: 'block', marginBottom: '10px' }}>
         <span style={{ color: 'white', display: 'block', marginBottom: '0px' }}>Daily Contribution ($)</span>
         <input
           type="number"
           value={dailyContrib}
           onChange={(e) => handleSliderDailyContribChange(e.target.value)}
           style={{ textAlign: 'center', borderRadius: '5px' }}
         />
       </label>


          <Slider
             min={0}
             max={150}
             step={1}
             value={sliderDailyContribValue}
             onChange={(e) => handleSliderDailyContribChange(e.target.value)}

           />

       <label style={{ display: 'block', marginBottom: '10px' }}>
         <span style={{ color: 'white', display: 'block', marginBottom: '0px' }}>Monthly Return (%)</span>
         <input
           type="number"
           value={monthlyReturn}
           onChange={(e) => handleSliderMonthlyReturnChange(e.target.value)}
           style={{ textAlign: 'center', borderRadius: '5px' }}
         />
       </label>


          <Slider
             min={0}
             max={5}
             step={0.1}
             value={sliderMonthlyReturnValue}
             onChange={(e) => handleSliderMonthlyReturnChange(e.target.value)}
           />
     </div>

<br></br>

        {data.length > 0 && (
          <LineChart width={window.innerWidth < 340 ? 250 : window.innerWidth < 460 ? 340:window.innerWidth < 540 ? 460: window.innerWidth < 600 ? 480:500} height={400} data={data} margin={{ top: 20, right: 30, left: 37, bottom: 10 }}>
            <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottomRight', offset: -10 }} tickFormatter={formatXAxisValue} />
            <YAxis label={{ value: '', angle: -90, position: 'insideLeft' }} tickFormatter={formatYAxisValue} />
              <Tooltip
                formatter={(value) => `$${value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
                labelFormatter={(label) => <span style={{ color: 'white' }}>{`${label.toFixed(1)} years`}</span>}
                contentStyle={{ textShadow: '0px 0px 3px rgba(0, 0, 0, 1)', backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: '30px', fontWeight: 'bold' }}
              />

            <Line type="monotone" dataKey="totalWithInterest" stroke="#8884d8" name="Amount with Profits" />
            <Line type="monotone" dataKey="onlyAmountSaved" stroke="#82ca9d" name="Amount Saved" />
          </LineChart>
        )}

    </div>
    <br/>
    <br/>



    </section>
  );
};

export default CompoundInterestCalculator;
