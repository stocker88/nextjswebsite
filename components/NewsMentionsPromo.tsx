import {useState} from 'react';
import AppDownloadButton from './formStocker';

const windows = [
  {id: 'hour', label: 'Past hour', short: '1H', hint: 'The latest headlines'},
  {id: 'day', label: 'Past day', short: '24H', hint: 'A wider daily view'},
  {id: 'week', label: 'Past week', short: '7D', hint: 'The bigger picture'},
] as const;

export default function NewsMentionsPromo() {
  const [selected, setSelected] = useState<typeof windows[number] | null>(null);
  return <section className="mentions-promo" aria-labelledby="mentions-title">
    <div className="mentions-copy">
      <span className="mentions-eyebrow"><span aria-hidden="true">✦</span> NEWS ATTENTION · EXPLORE IN THE APP</span>
      <h2 id="mentions-title">Headlines move fast.<br/><span>See who’s in focus.</span></h2>
      <p>Curious which stocks are mentioned most in the news? Choose your perspective, then continue your research with AI in the app.</p>
      <div className="mentions-features"><span>News mentions</span><span>Financial snapshots</span><span>Technical setups</span></div>
    </div>
    <div className="mentions-control">
      <div className="mentions-control-heading"><span>Choose a time window</span><span className="mentions-app-badge">APP ANALYTICS ↗</span></div>
      <div className="mentions-windows" role="group" aria-label="News mentions time window">
        {windows.map(window => <button type="button" key={window.id}
          aria-pressed={selected?.id === window.id}
          aria-controls="mentions-result"
          onClick={() => setSelected(window)}>
          <span className="mentions-window-short">{window.short}</span>
          <span>{window.label}</span>
        </button>)}
      </div>
      <div id="mentions-result" className={'mentions-result' + (selected ? ' is-selected' : '')} aria-live="polite" aria-atomic="true">
        <span className="mentions-result-icon" aria-hidden="true">{selected ? '✦' : '↗'}</span>
        <div>
          <h3>{selected ? 'Go deeper with AI analytics' : 'Find the hottest stock now'}</h3>
          <p>{selected ? `${selected.label} selected · ${selected.hint}. AI analytics are available in the app — explore news mentions alongside financials and technical setups.` : 'Select a window above to see which stocks are mentioned the most. Turn the news you read into companies worth researching.'}</p>
        </div>
      </div>
      {selected && <div className="mentions-download">
        <AppDownloadButton from={'news_mentions_' + selected.id} label="Get the app →"/>
        <span>Available on iOS & Android</span>
      </div>}
    </div>
    <style jsx>{`
      .mentions-promo{position:relative;isolation:isolate;overflow:hidden;display:grid;grid-template-columns:1.05fr 1fr;gap:40px;align-items:center;margin:24px 0 36px;padding:38px;border:1px solid #51446e;border-radius:24px;background:radial-gradient(ellipse at 5% 0%,#462a614a,transparent 65%),radial-gradient(ellipse at 100% 100%,#173e5d66,transparent 65%),#101525;color:#eef1ff;text-align:left}
      .mentions-eyebrow{display:flex;align-items:center;gap:8px;color:#c7aff3;font-size:10px;font-weight:700;letter-spacing:1.4px}.mentions-eyebrow>span{font-size:20px}
      .mentions-copy h2{font-size:clamp(27px,3.3vw,39px);letter-spacing:-1.2px;line-height:1.15;font-weight:650;margin:18px 0 16px}.mentions-copy h2>span{color:#c7b5ff}
      .mentions-copy p{max-width:440px;color:#adbbd1;font-size:14px;line-height:1.75;margin:0}.mentions-features{display:flex;flex-wrap:wrap;gap:8px 14px;margin-top:22px;color:#c5d1e5;font-size:10px}.mentions-features span:before{content:'·';color:#b697f2;margin-right:7px}
      .mentions-control{min-width:0;padding:22px;background:#080e1c99;border:1px solid #ffffff12;border-radius:18px}.mentions-control-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:12px;font-weight:600;margin-bottom:16px}.mentions-app-badge{font-size:8px;letter-spacing:1px;color:#b99dde;white-space:nowrap}
      .mentions-windows{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.mentions-windows button{font:inherit;cursor:pointer;min-width:0;display:flex;align-items:center;flex-direction:column;gap:6px;border:1px solid #33405b;border-radius:12px;padding:15px 5px;background:#172033;color:#bac6da;font-size:11px;transition:background .18s,border-color .18s,transform .18s}.mentions-windows button:hover{background:#252b46;border-color:#b397e8;transform:translateY(-2px)}.mentions-windows button[aria-pressed=true]{background:#3a2d55;border-color:#c1a0f6;color:#f3eaff;box-shadow:0 0 22px #b19ae012}.mentions-window-short{font-size:21px;font-weight:700;letter-spacing:-.5px}
      .mentions-result{display:flex;gap:12px;align-items:flex-start;margin-top:22px;min-height:110px}.mentions-result-icon{display:grid;place-items:center;flex:0 0 30px;height:30px;background:#b79aeb16;color:#cbb4f4;border-radius:9px;font-size:19px}.mentions-result h3{font-size:14px;line-height:1.4;margin:0 0 6px;color:#e8e9f8}.mentions-result p{font-size:12px;line-height:1.65;margin:0;color:#9eafc9}.is-selected h3{color:#d8c5ff}
      .mentions-download{display:flex;flex-direction:column;gap:10px;text-align:center;margin-top:14px}.mentions-download :global(a.app-download-cta){display:flex;justify-content:center;align-items:center;min-height:46px;padding:12px 18px;border-radius:10px;background:#c5a5ff;color:#171024!important;text-decoration:none;font-size:14px;font-weight:750;box-shadow:0 5px 25px #a985ee22}.mentions-download :global(a.app-download-cta:hover){background:#d4bdff}.mentions-download>span{font-size:10px;color:#97a9c5}.mentions-windows button:focus-visible,.mentions-download :global(a:focus-visible){outline:2px solid #dfcbff;outline-offset:3px}
      @media(max-width:760px){.mentions-promo{grid-template-columns:1fr;gap:24px;padding:24px 20px}.mentions-copy h2{font-size:32px}.mentions-copy p{max-width:none}.mentions-control{padding:18px}.mentions-features{margin-top:16px}.mentions-result{min-height:0}}
      @media(prefers-reduced-motion:reduce){.mentions-windows button{transition:none}.mentions-windows button:hover{transform:none}}
    `}</style>
  </section>;
}
