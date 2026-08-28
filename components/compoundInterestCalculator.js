import React, { useMemo, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Slider from '@mui/material/Slider';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const CompoundInterestCalculator = () => {
  const [principal, setPrincipal] = useState(100);
  const [dailyContrib, setDailyContrib] = useState(30);
  const [monthlyReturn, setMonthlyReturn] = useState(20);
  const [investmentYears, setInvestmentYears] = useState(4);

  const data = useMemo(() => {
    const annualInterestRate = (monthlyReturn * 1.04) / 100 * 12;
    const annualContribution = dailyContrib * 32 * 12;
    let balance = principal;
    const points = [{ year: 0, totalWithInterest: principal, onlyAmountSaved: principal }];

    for (let year = 1; year <= investmentYears; year += 1) {
      balance += annualContribution;
      balance += balance * annualInterestRate;
      points.push({
        year,
        totalWithInterest: balance,
        onlyAmountSaved: principal + annualContribution * year,
      });
    }

    return points;
  }, [principal, dailyContrib, monthlyReturn, investmentYears]);

  const finalPoint = data[data.length - 1];
  const projectedTotal = finalPoint?.totalWithInterest || 0;
  const amountSaved = finalPoint?.onlyAmountSaved || 0;
  const projectedGrowth = Math.max(0, projectedTotal - amountSaved);

  const controls = [
    {
      id: 'principal',
      label: 'Initial investment',
      prefix: '$',
      value: principal,
      min: 0,
      max: 100000,
      step: 500,
      setValue: setPrincipal,
    },
    {
      id: 'contribution',
      label: 'Daily contribution',
      prefix: '$',
      value: dailyContrib,
      min: 0,
      max: 250,
      step: 1,
      setValue: setDailyContrib,
    },
    {
      id: 'return',
      label: 'Option monthly return',
      suffix: '%',
      value: monthlyReturn,
      min: 0,
      max: 100,
      step: 0.1,
      setValue: setMonthlyReturn,
    },
    {
      id: 'years',
      label: 'Investment period',
      suffix: ' years',
      value: investmentYears,
      min: 1,
      max: 10,
      step: 1,
      setValue: setInvestmentYears,
    },
  ];

  return (
    <section className="compound-section" aria-labelledby="compound-title">
      <div className="compound-shell">
        <header className="compound-heading">
          <p>Interactive calculator</p>
          <h2 id="compound-title">See the power of compounding</h2>
          <span>Adjust the assumptions to explore how regular contributions and returns may affect long-term growth.</span>
        </header>

        <div className="compound-card">
          <div className="compound-controls">
            <div className="compound-controls__title">
              <span>Your assumptions</span>
              <small>Move the sliders or enter a value</small>
            </div>

            {controls.map((control) => (
              <div className="compound-control" key={control.id}>
                <div className="compound-control__topline">
                  <label htmlFor={`compound-${control.id}`}>{control.label}</label>
                  <div className="compound-input-wrap">
                    {control.prefix && <span>{control.prefix}</span>}
                    <input
                      id={`compound-${control.id}`}
                      type="number"
                      min={control.min}
                      max={control.max}
                      step={control.step}
                      value={control.value}
                      onChange={(event) => control.setValue(Number(event.target.value) || 0)}
                    />
                    {control.suffix && <span>{control.suffix}</span>}
                  </div>
                </div>
                <Slider
                  min={control.min}
                  max={control.max}
                  step={control.step}
                  value={control.value}
                  onChange={(_, value) => control.setValue(Array.isArray(value) ? value[0] : value)}
                  aria-label={control.label}
                  sx={{
                    color: '#1683ff',
                    '& .MuiSlider-rail': { backgroundColor: 'rgba(81, 165, 255, 0.28)' },
                    '& .MuiSlider-thumb': { boxShadow: '0 0 0 5px rgba(22, 131, 255, 0.14)' },
                  }}
                />
              </div>
            ))}
          </div>

          <div className="compound-results">
            <div className="compound-summary">
              <div className="compound-summary__primary">
                <span>Projected value</span>
                <strong>{currency.format(projectedTotal)}</strong>
                <small>After {investmentYears} years</small>
              </div>
              <div className="compound-summary__stat">
                <span>Total contributed</span>
                <strong>{currency.format(amountSaved)}</strong>
              </div>
              <div className="compound-summary__stat">
                <span>Projected growth</span>
                <strong>{currency.format(projectedGrowth)}</strong>
              </div>
            </div>

            <div className="compound-chart" aria-label="Projected compound growth chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 12, right: 12, left: 2, bottom: 4 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
                  <XAxis dataKey="year" tick={{ fill: '#7f8ba3', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis
                    width={66}
                    tick={{ fill: '#7f8ba3', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => value >= 1000000 ? `$${(value / 1000000).toFixed(1)}m` : `$${Math.round(value / 1000)}k`}
                  />
                  <Tooltip
                    formatter={(value, name) => [currency.format(value), name]}
                    labelFormatter={(year) => `Year ${year}`}
                    contentStyle={{ background: '#10182a', border: '1px solid rgba(255,255,255,.12)', borderRadius: 12, color: '#fff' }}
                  />
                  <Legend wrapperStyle={{ color: '#aab3c5', fontSize: 12, paddingTop: 10 }} />
                  <Line type="monotone" dataKey="totalWithInterest" stroke="#5daaff" strokeWidth={3} dot={false} name="Projected value" />
                  <Line type="monotone" dataKey="onlyAmountSaved" stroke="#55d69e" strokeWidth={2} dot={false} name="Contributions" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <p className="compound-disclaimer">Illustrative projections only. Returns are not guaranteed and this is not financial advice.</p>
        <div style={{ height: 'clamp(32px, 5vw, 64px)' }} />
      </div>
    </section>
  );
};

export default CompoundInterestCalculator;
