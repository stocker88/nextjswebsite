import {DesktopActionText} from './DesktopAppLink';
import {useState} from 'react';
import AppDownloadButton from './formStocker';
const inputs=[
 {label:'Fundamentals',icon:'▥',detail:'Understand the business through revenue, profitability, valuation and financial strength.'},
 {label:'Technicals',icon:'↗',detail:'Review price trends, momentum, volume and key levels alongside the business fundamentals.'},
 {label:'Earnings catalysts',icon:'◷',detail:'Track upcoming reports, expectations and company developments that could change the outlook.'},
 {label:'Market environment',icon:'◎',detail:'Put each stock in context with economic events, industry trends and recent news.'},
];
export default function StockResearchPromo(){
 const [selected,setSelected]=useState(0);
 return <section className="prediction-promo" aria-labelledby="stock-research-promo-title">
  <div className="prediction-copy"><span className="eyebrow"><span aria-hidden="true">✦</span> STOCK IDEAS · RESEARCH IN THE APP</span>
   <h2 id="stock-research-promo-title">More than a ticker.<br/><span>A complete investment picture.</span></h2>
   <p>We track fundamentals, technicals, earnings catalysts and the market environment to identify our best stocks to buy now and send you research-backed ideas through the app.</p>
   <div className="features"><span>Company research</span><span>Timely catalysts</span><span>Stock idea alerts</span></div>
  </div>
  <div className="prediction-panel"><div className="panel-heading"><strong>What goes into each idea</strong><span>AI RESEARCH ↗</span></div>
   <div className="choices markets" role="group" aria-label="Stock research inputs">{inputs.map((input,index)=><button type="button" key={input.label} aria-pressed={selected===index} aria-controls="stock-research-detail" onClick={()=>setSelected(index)}><span className="choice-icon" aria-hidden="true">{input.icon}</span><strong style={{fontSize:13}}>{input.label}</strong></button>)}</div>
   <div className="detail" id="stock-research-detail" aria-live="polite"><h3>{inputs[selected].label}</h3><p>{inputs[selected].detail}</p></div>
   <div className="download"><AppDownloadButton popup from="home_stock_research_promo" label="Explore best stocks to buy now →"/><small><DesktopActionText desktopLabel="Membership access · Your account">{'Get the app · iOS & Android'}</DesktopActionText></small></div>
   <p className="forecast-note">Research ideas to evaluate, with risks to consider. Returns are not guaranteed.</p>
  </div>
  <style jsx>{`
   .prediction-promo{box-sizing:border-box;max-width:1120px;width:100%;margin:52px auto 64px;padding:38px;display:grid;grid-template-columns:1.05fr 1fr;align-items:center;gap:36px;border:1px solid #51446e;border-radius:24px;background:radial-gradient(ellipse at 5% 0%,#462a614a,transparent 65%),radial-gradient(ellipse at 100% 100%,#173e5d66,transparent 65%),#101525;color:#eef1ff;text-align:left}
   .eyebrow{display:flex;align-items:center;gap:8px;color:#c7aff3;font-size:10px;font-weight:700;letter-spacing:1.4px}.eyebrow>span{font-size:20px}.prediction-copy h2{font-size:clamp(27px,3.3vw,39px);letter-spacing:-1.2px;line-height:1.16;font-weight:650;margin:20px 0}.prediction-copy h2>span{color:#c7b5ff}.prediction-copy p{color:#adbbd1;font-size:14px;line-height:1.8;margin:0}.features{display:flex;gap:10px 15px;flex-wrap:wrap;margin-top:24px;font-size:10px;color:#c5d1e5}.features span:before{content:'·';color:#b697f2;margin-right:7px}
   .prediction-panel{min-width:0;padding:24px;border:1px solid #ffffff12;border-radius:18px;background:#080e1c99}.panel-heading{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:18px;font-size:12px}.panel-heading>span{font-size:8px;letter-spacing:1px;color:#b99dde}.choices{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.choices.markets{grid-template-columns:repeat(2,minmax(0,1fr))}.choices button{cursor:pointer;min-width:0;padding:15px 8px;display:flex;align-items:center;flex-direction:column;gap:7px;border:1px solid #33405b;border-radius:12px;background:#172033;color:#bac6da;transition:background .18s,border-color .18s}.choices button:hover{border-color:#b397e8}.choices button[aria-pressed=true]{border-color:#b397e8;background:#302641;color:#e3d3ff}.choices strong{font-size:12px;line-height:1.4}.markets strong{font-size:22px}.choice-icon{font-size:25px;color:#c7b5ff}.choices small{font-size:9px;color:#aab8cd}.choices button:focus-visible{outline:2px solid #c7b5ff;outline-offset:3px}.detail{margin:22px 0 18px;min-height:90px}.detail h3{font-size:16px;font-weight:600;margin:0 0 8px}.detail p{font-size:12px;color:#aabbd4;line-height:1.7;margin:0}.download{display:flex;flex-direction:column;align-items:flex-start;gap:10px}.download :global(.app-download-cta){display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:12px 19px;border-radius:25px;background:#c1a3ff;color:#211332;font-size:12px;font-weight:700;text-decoration:none;text-align:center}.download :global(.app-download-cta:hover){background:#d0baff}.download small{font-size:10px;color:#aabbd4}.forecast-note{font-size:10px;line-height:1.6;color:#869ab7;margin:18px 0 0}
   @media(max-width:760px){.prediction-promo{grid-template-columns:1fr;padding:24px;gap:24px;margin:36px auto 44px}.prediction-copy h2{font-size:30px}.prediction-panel{padding:18px}.detail{min-height:0}.features{margin-top:18px}}@media(max-width:400px){.prediction-promo{padding:19px}.choices strong{font-size:10px}.markets strong{font-size:20px}.panel-heading{flex-wrap:wrap}.eyebrow{font-size:8px;letter-spacing:1px}}
  `}</style>
 </section>;
}
