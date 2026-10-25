import ArticlePostEngagement from './ArticlePostEngagement';
import {AccountLink} from './SiteAccount';
import {useState} from 'react';
import {briefingUrl, type Briefing} from '../lib/market-briefings';
import AppDownloadModal from './AppDownloadModal';

export default function CatalystNewsCard({article:a}:{article:Briefing}) {
  const [logoFailed,setLogoFailed]=useState(false);
  const [appOpen,setAppOpen]=useState(false);
  const symbol=a.symbols.length===1?a.symbols[0]:null;
  const event=symbol?a.events.find(e=>e.symbol===symbol):undefined;
  const company=symbol?(a.events.find(e=>e.symbol===symbol)?.name||symbol):'Earnings calendar';
  const date=new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(a.sessionDate+'T12:00:00Z'));
  const preview=a.summary.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim()||a.summary;
  return <article className="catalyst-card" data-app-post-id={a.postId}>
    <div className="card-top"><span className="topic">{symbol?'$'+symbol+' insights':'Earnings insights'} <span aria-hidden="true">↗</span></span><time dateTime={a.sessionDate}>{date}</time></div>
    <div className="company-row">
      <span className="company-logo" aria-hidden="true">{symbol&&!logoFailed?<img src={'/assets/logo/'+encodeURIComponent(symbol)+'.webp'} alt="" width={44} height={44} loading="lazy" onError={()=>setLogoFailed(true)}/>:symbol?symbol.slice(0,2):'↗'}</span>
      <span className="company-name">{company}<span>{a.kind==='earnings_preview'?'Earnings preview':'Upcoming catalysts'}</span></span>
      <div className="prediction"><span className="pro">Pro</span><button type="button" onClick={()=>setAppOpen(true)} aria-label={'Explore earnings prediction in the app'+(symbol?' for '+symbol:'')}>Earnings<br/>Prediction <span aria-hidden="true">↗</span></button></div>
    </div>
    {event&&<p className="report-date"><span>{event.dateStatus==='issuer_confirmed'?'Report date':'Expected report'}</span> <time dateTime={event.date}>{new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(event.date+'T12:00:00Z'))}</time>{event.session==='bmo'?' · Before the open':event.session==='amc'?' · After the close':''}</p>}
    <h2><AccountLink className="article-link" destination={briefingUrl(a)}>{a.title}</AccountLink></h2>
    <p className="preview">{preview}</p>
    {!!a.images?.length&&<div className="image-pair" aria-label="Research images from the original app post">{a.images.slice(0,2).map(i=><figure key={i.url}><div className="image-frame"><img src={i.url} alt={i.alt||i.title+' research preview'} width={i.width} height={i.height} loading="lazy" decoding="async"/></div><figcaption>{i.title}</figcaption></figure>)}</div>}
    <div className="card-footer"><div className="footer-stats"><ArticlePostEngagement postId={a.postId}/><span>{a.kind==='earnings_weekly'?'Week ahead':'Earnings & research'}</span></div><span className="read-link">Read research <span aria-hidden="true">→</span></span></div>
    {appOpen&&<AppDownloadModal placement="catalyst_card_earnings_prediction" title={symbol?symbol+' earnings predictions':'Explore earnings predictions'} onClose={()=>setAppOpen(false)}/>}
    <style jsx>{`
      .catalyst-card{position:relative;display:flex;flex-direction:column;height:100%;min-width:0;padding:26px;border:1px solid #2c3b52;border-radius:24px;background:linear-gradient(145deg,#111d2e,#0c1422);transition:border-color .2s,box-shadow .2s,transform .2s}
      .card-top{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:24px}
      .topic{display:inline-flex;align-items:center;gap:14px;border:1px solid #8660d8;background:#8b5cf61a;border-radius:999px;padding:8px 13px;color:#d8c7ff;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
      time{font-size:12px;color:#a9b6ca;white-space:nowrap}
      .company-row{display:flex;align-items:center;gap:12px;margin-bottom:20px}
      .company-logo{display:flex;align-items:center;justify-content:center;width:44px;height:44px;flex-shrink:0;border-radius:50%;overflow:hidden;background:#263b56;color:#dce9ff;font-size:13px;font-weight:700}
      .company-logo img{width:100%;height:100%;object-fit:contain;background:white}
      .company-name{flex:1;min-width:0;font-size:14px;font-weight:600;line-height:1.4;color:#f1f4fc;overflow-wrap:anywhere}
      .company-name>span{display:block;font-size:11px;font-weight:400;color:#96a7bd;margin-top:3px}
      .prediction{flex-shrink:0;text-align:center}.pro{display:block;color:#c6a4ff;font-size:10px;font-weight:700;letter-spacing:.08em;margin-bottom:5px}
      .prediction button{position:relative;z-index:2;padding:10px 12px;border:1px solid #8c68cb66;border-radius:12px;background:#8b5cf61a;color:#dac7ff;font:inherit;font-size:12px;font-weight:600;line-height:1.4;cursor:pointer;transition:background .2s,border-color .2s}
      .prediction button:hover{background:#8b5cf633;border-color:#b38bef}.prediction button:focus-visible{outline:2px solid #c2a9ff;outline-offset:3px}
      h2{font-size:23px;line-height:1.35;letter-spacing:-.025em;margin:0 0 12px;font-weight:650}
       .catalyst-card h2 :global(.article-link){color:#f0f4fc;text-decoration:none}h2 :global(.article-link)::after{content:'';position:absolute;inset:0;z-index:1;border-radius:24px}
      .catalyst-card:focus-within{border-color:#ad8dff;box-shadow:0 0 0 3px #ad8dff44}
      .preview{font-size:14px;line-height:1.65;color:#aabbd0;margin:0 0 22px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
      .report-date{font-size:12px;line-height:1.6;color:#b9c8dc;margin:0 0 16px}.report-date>span{color:#91a4bc}.report-date time{font-size:inherit;color:#e0e8f7}.image-pair{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:0 0 20px}figure{margin:0;min-width:0}.image-frame{aspect-ratio:1;background:#080f20;border:1px solid #ffffff08;border-radius:13px;overflow:hidden}.image-frame img{display:block;width:100%;height:100%;object-fit:contain}figcaption{text-align:center;font-size:12px;color:#b9c8dc;padding-top:9px}.footer-stats{display:flex;flex-direction:column;gap:8px}.card-footer{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;border-top:1px solid #29394c;padding-top:16px;font-size:11px;color:#91a4bc;margin-top:auto}
      .read-link{font-size:13px;font-weight:600;color:#c8afff}.read-link>span{display:inline-block;margin-left:6px;transition:transform .2s}
      @media(hover:hover){.catalyst-card:hover{transform:translateY(-3px);border-color:#9877e5;box-shadow:0 12px 30px #0004,0 0 24px #8b5cf60d}.catalyst-card:hover .read-link>span{transform:translateX(4px)}}
      @media(max-width:700px){.catalyst-card{padding:20px}.card-top{gap:8px;margin-bottom:20px}.topic{font-size:10px;padding:7px 10px;gap:8px}time{font-size:11px}h2{font-size:21px}.company-row{gap:9px}.company-name{font-size:13px}.preview{font-size:13px}.prediction button{padding:8px;font-size:11px}}
      @media(prefers-reduced-motion:reduce){.catalyst-card,.read-link>span,.prediction button{transition:none}.catalyst-card:hover{transform:none}}
    `}</style>
  </article>;
}
