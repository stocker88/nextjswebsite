// Deterministic social export from the same saved data as the methodology page.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const {QRCodeSVG}=require('qrcode.react'),{Resvg}=require('@resvg/resvg-js');
const root=path.join(__dirname,'..');
const report=require('../data/target-date-performance-2025-12-31.json');
const d=require('../data/signal-return-distribution-2025-12-31.json'),s=report.summary;
const annual=d.compoundedAnnualized;
const annualPct=v=>pct(v);
assert.equal(d.count,s.completed);assert.equal(d.bins.reduce((n,b)=>n+b.count,0),d.count);
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const pct=v=>`${v>0?'+':''}${v.toFixed(2)}%`;
const text=(v,x,y,size=24,color='#ecf1fc',weight=400)=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-weight="${weight}">${esc(v)}</text>`;
const qr=renderToStaticMarkup(React.createElement(QRCodeSVG,{value:'https://www.stockstobuynow.ai/methodology/',size:164,level:'M',includeMargin:true}));
const monthlyReturns=s.months.map(m=>m.meanReturnPct);
const monthlyMin=Math.min(...monthlyReturns),monthlyMax=Math.max(...monthlyReturns);
const axisMin=Math.floor(monthlyMin/25)*25,axisMax=(Math.floor(monthlyMax/25)+1)*25;
const bins=Array.from({length:(axisMax-axisMin)/25},(_,i)=>{const low=axisMin+i*25;return {low,high:low+25,count:monthlyReturns.filter(v=>v>=low&&v<low+25).length};});
assert.equal(bins.reduce((sum,b)=>sum+b.count,0),s.months.length);
const peak=Math.max(...bins.map(b=>b.count));
const scale=v=>64+(v-axisMin)/(axisMax-axisMin)*952;
const bars=bins.map(b=>{const x=scale(b.low),width=scale(b.high)-x,h=130*b.count/peak;return `<rect x="${x+8}" y="${922-h}" width="${width-16}" height="${h}" rx="5" fill="${b.high<=0?'#cf93aa':'#83dbc3'}"/>${text(`${b.count} (${(100*b.count/monthlyReturns.length).toFixed(1)}%)`,x+width/2,912-h,21,'#e8eefb',500).replace('<text ','<text text-anchor="middle" ')}`}).join('');
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
<defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#142039"/><stop offset="1" stop-color="#080f1d"/></linearGradient></defs>
<rect width="1080" height="1350" fill="url(#bg)"/><g font-family="Arial, sans-serif">
${text('STOCKS TO BUY NOW RESEARCH',64,76,22,'#c4aff5',700)}
${text('Track Record (Stocks Only)',64,163,60,'#ffffff',700)}
${text(new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'Europe/Paris'}),64,211,28,'#aabbcf')}
<rect x="64" y="250" width="952" height="182" rx="22" fill="#1c2c44"/>
${text('US SIGNALS · COMPOUNDED ANNUALIZED',88,290,20,'#aabbcf',600)}
${text(annualPct(annual.signalPct),88,350,48,'#90e2c9',700)}
${text('Weighted return + weighted holding period · not portfolio CAGR',88,394,23)}
${text('SAME-WINDOW COMPARISON · COMPOUNDED ANNUALIZED',64,489,23,'#c4aff5',600)}
${text('US signals',64,535,23,'#aabbcf')}${text('S&P 500 · SPY',414,535,23,'#aabbcf')}${text('Difference',764,535,23,'#aabbcf')}
${text(annualPct(annual.signalPct),64,603,48,'#90e2c9',700)}${text(annualPct(annual.spyPct),414,603,48,'#ecf1fc',700)}${text(annualPct(annual.signalPct-annual.spyPct).replace('%',' pp'),764,603,42,'#90e2c9',700)}
${text(`${annual.pairedCount} US pairs · same dates and weights · ${annual.weightedHoldingDays.toFixed(2)} weighted holding days`,64,650,22,'#aabbcf')}
${text('Annualized aggregate illustration, not achieved annual portfolio returns.',64,678,20,'#aabbcf')}
${text('MONTHLY OUTCOME DISTRIBUTION',64,714,22,'#c4aff5',600)}
${text(`${monthlyReturns.length} exit-month cohorts · each month counted once · gross, non-annualized`,64,745,20,'#aabbcf')}
${bars}<line x1="64" y1="924" x2="1016" y2="924" stroke="#53617a"/>
${Array.from({length:bins.length+1},(_,i)=>axisMin+i*25).map(v=>`<line x1="${scale(v)}" y1="924" x2="${scale(v)}" y2="931" stroke="#718099"/>`+text(`${v>0?'+':''}${v}%`,scale(v),955,18,'#aabbcf').replace('<text ',`<text text-anchor="${v===axisMax?'end':v===axisMin?'start':'middle'}" `)).join('')}
${text('Weighted signal outcomes by exit month, not monthly portfolio returns.',64,988,20,'#aabbcf')}
${text(`Minimum: ${pct(monthlyMin)} · Maximum: ${pct(monthlyMax)} · 25-point ranges`,64,1015,20,'#aabbcf')}
${text('Annualized = ((1 + weighted return / 100)^(365 / weighted days) − 1) × 100',64,1043,20)}
${text(`Chart: actual returns. 1% fallback. ${s.statuses.target_pending} pending + ${s.statuses.hold_no_target} Hold excluded.`,64,1077,21,'#aabbcf')}
<line x1="64" y1="1110" x2="1016" y2="1110" stroke="#35445c"/>
${text('Source: www.StocksToBuyNow.ai',64,1157,29,'#ffffff',700)}
${text('Signal archive + Yahoo Finance adjusted prices',64,1194,21,'#aabbcf')}
${text('Scan for methodology, monthly results & full ledger',64,1232,21,'#c4aff5')}
${text('Past returns do not predict future results.',64,1302,20,'#aabbcf')}
<g transform="translate(852 1127)">${qr}</g></g></svg>`;
const out=path.join(root,'public/data/track-record-2025-12-31.png');
fs.writeFileSync(out,new Resvg(svg,{font:{defaultFontFamily:'Arial'}}).render().asPng());
const template=svg.replace(/<text x="64" y="211"[^>]*>[^<]*<\/text>/,'');
fs.writeFileSync(path.join(root,'public/data/track-record-template.png'),new Resvg(template,{font:{defaultFontFamily:'Arial'}}).render().asPng());
console.log(out);
