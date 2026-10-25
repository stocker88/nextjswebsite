import {useState} from 'react';
import AppDownloadModal from './AppDownloadModal';
export function MarketPredictionPrompt({onClose}:{onClose:()=>void}) {
 return <AppDownloadModal placement="macro_catalyst_hedging_ahead" title="Get the app for market predictions" description="Explore macro scenarios, market outlooks and the guide to trading major events. Build your plan before the next release." onClose={onClose}/>;
}
export default function HedgingAhead({compact=false,onActivate}:{compact?:boolean;onActivate?:()=>void}) {
 const [open,setOpen]=useState(false);
 return <><button type="button" className={'hedging-ahead'+(compact?' compact':'')} aria-haspopup="dialog" onClick={()=>onActivate?onActivate():setOpen(true)}>
  <span className="shield" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 3 4 6v5c0 5 4 8 8 10 4-2 8-5 8-10V6Z"/><path d="m8 12 3 3 5-6"/></svg></span>
  <span className="copy"><span className="flag">Hedging Ahead</span>{!compact&&<><span className="heading">Plan for the next market move</span><span className="detail">Macro scenarios · Event preparation</span></>}</span>
  {!compact&&<span className="action"><span className="pro">Pro</span>Market prediction <span aria-hidden="true">↗</span></span>}
 </button>{open&&<MarketPredictionPrompt onClose={()=>setOpen(false)}/>}
 <style jsx>{`
  .hedging-ahead{box-sizing:border-box;width:100%;display:flex;align-items:center;gap:14px;margin:18px 0 4px;padding:18px;border:1px solid #a989ef66;border-radius:18px;background:radial-gradient(ellipse at top right,#7855bc38,transparent 65%),linear-gradient(120deg,#241e3c,#122638);color:#e9ddff;text-align:left;cursor:pointer;font:inherit;transition:border-color .18s,box-shadow .18s,transform .18s}
  .shield{display:flex;align-items:center;justify-content:center;flex-shrink:0;width:40px;height:44px;border:1px solid #ac91e24d;border-radius:12px;background:#a78bfa1a;color:#d1b8ff}.copy{display:flex;flex:1;min-width:0;flex-direction:column;gap:5px}.flag{font-size:11px;font-weight:750;letter-spacing:.07em;text-transform:uppercase;color:#d2b5ff}.heading{font-size:15px;font-weight:650;line-height:1.4}.detail{font-size:11px;line-height:1.5;color:#a4b7cd}.action{font-size:12px;font-weight:600;line-height:1.6;color:#d8c4ff}.pro{display:block;font-size:9px;text-transform:uppercase;letter-spacing:.12em;color:#c09aff}
  .hedging-ahead:hover{border-color:#bc9af4;box-shadow:0 8px 24px #0003;transform:translateY(-1px)}.hedging-ahead:focus-visible{outline:2px solid #d2b5ff;outline-offset:3px}.compact{width:auto;max-width:100%;gap:6px;padding:8px;margin-top:10px;border-radius:10px}.compact .shield{width:18px;height:20px;border:0;background:none}.compact .shield svg{width:17px}.compact .flag{font-size:9px;letter-spacing:.02em}
  @media(max-width:500px){.hedging-ahead:not(.compact){flex-wrap:wrap;padding:14px;gap:10px}.heading{font-size:14px}.action{width:100%;padding-top:10px;border-top:1px solid #ad8de32e}.action .pro{display:inline;margin-right:8px}}
  @media(prefers-reduced-motion:reduce){.hedging-ahead{transition:none}.hedging-ahead:hover{transform:none}}
 `}</style></>;
}
