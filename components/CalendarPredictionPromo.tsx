import {useState} from 'react';
import AppDownloadButton from './formStocker';

export default function CalendarPredictionPromo({kind}:{kind:'market'|'earnings'}) {
 const market=kind==='market';
 const choices=market?['S&P 500','QQQ']:['Market conditions','Industry reports','Company news'];
 const [selected,setSelected]=useState(choices[0]);
 const titleId=kind+'-prediction-title';
 const descriptions:Record<string,string>={
  'S&P 500':'Explore the daily outlook for the broader U.S. market, with the events and research behind the forecast.',
  'QQQ':'Review the daily outlook for QQQ, the ETF tracking the Nasdaq-100, and the catalysts that could shape its next move.',
  'Market conditions':'Put this quarter’s earnings expectations in context with the economic backdrop and market conditions.',
  'Industry reports':'Look at peer reporting and industry developments for clues about demand, costs and margins.',
  'Company news':'Connect product releases and recent company news with the upcoming quarterly report.',
 };
 return <section className="prediction-promo" aria-labelledby={titleId}>
  <div className="prediction-copy">
   <span className="eyebrow"><span aria-hidden="true">✦</span> {market?'DAILY MARKET OUTLOOK':'EARNINGS INTELLIGENCE'} · IN THE APP</span>
   <h2 id={titleId}>{market?'The next market move.':'Before the earnings release.'}<br/><span>{market?'See the research behind it.':'Explore the beat potential.'}</span></h2>
   <p>{market?'Review our daily S&P 500 and QQQ predictions. We combine market events, statistical analysis, news research and Wall Street research to estimate how the market could move.':'Will a company beat earnings expectations this quarter? We use market conditions, industry reporting, product releases and recent company news to inform our earnings predictions.'}</p>
   <div className="features">{(market?['Statistical analysis','Event catalysts','Wall Street research']:['Quarterly outlook','Company catalysts','Earnings expectations']).map(t=><span key={t}>{t}</span>)}</div>
  </div>
  <div className="prediction-panel">
   <div className="panel-heading"><strong>{market?'Choose your market':'Explore the research inputs'}</strong><span>AI RESEARCH ↗</span></div>
   <div className={'choices '+(market?'markets':'')} role="group" aria-label={market?'Market outlook':'Earnings research input'}>
    {choices.map((choice,index)=><button key={choice} type="button" aria-pressed={selected===choice} aria-controls={kind+'-prediction-detail'} onClick={()=>setSelected(choice)}><span className="choice-icon" aria-hidden="true">{market?(index===0?'↗':'⌁'):['◷','▥','✦'][index]}</span><strong>{choice}</strong><small>{market?'Daily prediction':'Quarterly context'}</small></button>)}
   </div>
   <div className="detail" id={kind+'-prediction-detail'} aria-live="polite"><h3>{market?selected+' market prediction':'A clearer view before results'}</h3><p>{descriptions[selected]}</p></div>
   <div className="download"><AppDownloadButton popup from={kind+'_calendar_prediction_'+selected.toLowerCase().replace(/[^a-z0-9]+/g,'_')} label={market?'Review market predictions →':'Explore earnings jump prediction →'}/><small>Get the app · iOS & Android</small></div>
   <p className="forecast-note">{market?'Forecasts can change as new information arrives.':'An earnings beat does not guarantee a rising stock price.'} Predictions are not guarantees.</p>
  </div>
  <style jsx>{`
   .prediction-promo{box-sizing:border-box;max-width:1120px;width:100%;margin:52px auto 64px;padding:38px;display:grid;grid-template-columns:1.05fr 1fr;align-items:center;gap:36px;border:1px solid #51446e;border-radius:24px;background:radial-gradient(ellipse at 5% 0%,#462a614a,transparent 65%),radial-gradient(ellipse at 100% 100%,#173e5d66,transparent 65%),#101525;color:#eef1ff;text-align:left}
   .eyebrow{display:flex;align-items:center;gap:8px;color:#c7aff3;font-size:10px;font-weight:700;letter-spacing:1.4px}.eyebrow>span{font-size:20px}.prediction-copy h2{font-size:clamp(27px,3.3vw,39px);letter-spacing:-1.2px;line-height:1.16;font-weight:650;margin:20px 0}.prediction-copy h2>span{color:#c7b5ff}.prediction-copy p{color:#adbbd1;font-size:14px;line-height:1.8;margin:0}.features{display:flex;gap:10px 15px;flex-wrap:wrap;margin-top:24px;font-size:10px;color:#c5d1e5}.features span:before{content:'·';color:#b697f2;margin-right:7px}
   .prediction-panel{min-width:0;padding:24px;border:1px solid #ffffff12;border-radius:18px;background:#080e1c99}.panel-heading{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:18px;font-size:12px}.panel-heading>span{font-size:8px;letter-spacing:1px;color:#b99dde}.choices{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.choices.markets{grid-template-columns:repeat(2,minmax(0,1fr))}.choices button{cursor:pointer;min-width:0;padding:15px 8px;display:flex;align-items:center;flex-direction:column;gap:7px;border:1px solid #33405b;border-radius:12px;background:#172033;color:#bac6da;transition:background .18s,border-color .18s}.choices button:hover{border-color:#b397e8}.choices button[aria-pressed=true]{border-color:#b397e8;background:#302641;color:#e3d3ff}.choices strong{font-size:12px;line-height:1.4}.markets strong{font-size:22px}.choice-icon{font-size:25px;color:#c7b5ff}.choices small{font-size:9px;color:#aab8cd}.choices button:focus-visible{outline:2px solid #c7b5ff;outline-offset:3px}.detail{margin:22px 0 18px;min-height:90px}.detail h3{font-size:16px;font-weight:600;margin:0 0 8px}.detail p{font-size:12px;color:#aabbd4;line-height:1.7;margin:0}.download{display:flex;flex-direction:column;align-items:flex-start;gap:10px}.download :global(.app-download-cta){display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:12px 19px;border-radius:25px;background:#c1a3ff;color:#211332;font-size:12px;font-weight:700;text-decoration:none;text-align:center}.download :global(.app-download-cta:hover){background:#d0baff}.download small{font-size:10px;color:#aabbd4}.forecast-note{font-size:10px;line-height:1.6;color:#869ab7;margin:18px 0 0}
   @media(max-width:760px){.prediction-promo{grid-template-columns:1fr;padding:24px;gap:24px;margin:36px auto 44px}.prediction-copy h2{font-size:30px}.prediction-panel{padding:18px}.detail{min-height:0}.features{margin-top:18px}}@media(max-width:400px){.prediction-promo{padding:19px}.choices strong{font-size:10px}.markets strong{font-size:20px}.panel-heading{flex-wrap:wrap}.eyebrow{font-size:8px;letter-spacing:1px}}
  `}</style>
 </section>;
}
