import Link from 'next/link';
import {useState} from 'react';
import {moverArticleUrl, type MoverArticle} from '../lib/mover-research';

export default function MoverNewsCard({article:a, compact=false}:{article:MoverArticle;compact?:boolean}) {
  const [logoFailed,setLogoFailed]=useState(false);
  const date=new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(a.sessionDate+'T12:00:00Z'));
  const preview=a.recap[0].replace(/^[•\s]+/,'').match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim()||a.recap[0];
  return <article className={'mover-card'+(compact?' compact':'')}>
    <Link className="card-link" href={moverArticleUrl(a)}>
      <div className="card-top"><span className="topic">${a.symbol} insights <span aria-hidden="true">↗</span></span><time dateTime={a.sessionDate}>{date}</time></div>
      <div className="company-row">
        <span className="company-logo" aria-hidden="true">{logoFailed?a.symbol.slice(0,2):<img src={'/assets/logo/'+encodeURIComponent(a.symbol)+'.webp'} alt="" width={44} height={44} loading="lazy" onError={()=>setLogoFailed(true)}/>}</span>
        <span className="company-name">{a.companyName}<span>{a.earningsPeriod?'Earnings & research':'Market mover'}</span></span>
        <span className={'performance '+(a.move>0?'positive':'negative')} aria-label={'Session price change '+a.move.toFixed(2)+' percent'}>{a.move>0?'+':''}{a.move.toFixed(2)}%<small>Session snapshot</small></span>
      </div>
      <h2>{a.title}</h2>
      <p className="preview">{preview}</p>
      {!compact&&<div className="image-pair">{a.images.map(i=><figure key={i.title}><div className="image-frame"><img src={i.url} alt={i.alt||a.symbol+' '+i.title+' research preview'} width={1200} height={1200} loading="lazy" decoding="async"/></div><figcaption>{i.title}</figcaption></figure>)}</div>}
      <div className="card-footer"><span>{a.earningsPeriod||'Stock research'}</span><span className="read-link">Read research <span aria-hidden="true">→</span></span></div>
    </Link>
    <style jsx>{`
      .mover-card{height:100%;min-width:0;border:1px solid #2c3b52;border-radius:24px;background:linear-gradient(145deg,#111d2e,#0c1422);transition:border-color .2s,box-shadow .2s,transform .2s;overflow:hidden}
      .mover-card :global(.card-link){display:flex;flex-direction:column;height:100%;padding:26px;text-decoration:none;color:#f1f4fc;outline-offset:-4px;border-radius:24px}
      .mover-card:focus-within{border-color:#ad8dff;box-shadow:0 0 0 3px #ad8dff44}
      .mover-card :global(.card-link:focus-visible){outline:2px solid #c2a9ff}
      .card-top{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:24px}
      .topic{display:inline-flex;align-items:center;gap:14px;border:1px solid #8660d8;background:#8b5cf61a;border-radius:999px;padding:8px 13px;color:#d8c7ff;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
      time{font-size:12px;color:#a9b6ca;white-space:nowrap}
      .company-row{display:flex;align-items:center;gap:12px;margin-bottom:20px}
      .company-logo{display:flex;align-items:center;justify-content:center;width:44px;height:44px;flex-shrink:0;border-radius:50%;overflow:hidden;background:#263b56;color:#dce9ff;font-size:13px;font-weight:700}
      .company-logo img{width:100%;height:100%;object-fit:contain;background:white}
      .company-name{flex:1;min-width:0;font-size:14px;font-weight:600;line-height:1.4}
      .company-name>span{display:block;font-size:11px;font-weight:400;color:#96a7bd;margin-top:3px}
      .performance{border-radius:12px;padding:8px 10px;font-size:19px;font-weight:700;text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums}
      .positive{color:#7ce2bd;background:#25c48b12}.negative{color:#ff8d9c;background:#fb617612}
      .performance small{display:block;font-size:9px;letter-spacing:.02em;font-weight:400;margin-top:2px}
      h2{font-size:23px;line-height:1.35;letter-spacing:-.025em;margin:0 0 12px;color:#f0f4fc;font-weight:650}
      .preview{font-size:14px;line-height:1.65;color:#aabbd0;margin:0 0 22px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
      .image-pair{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:auto;margin-bottom:20px}
      figure{margin:0;min-width:0}.image-frame{aspect-ratio:1;background:#080f20;border-radius:13px;overflow:hidden;border:1px solid #ffffff08}
      .image-frame img{width:100%;height:100%;object-fit:contain;display:block}
      figcaption{text-align:center;font-size:12px;color:#b9c8dc;padding-top:9px}
      .card-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;border-top:1px solid #29394c;padding-top:16px;font-size:11px;color:#91a4bc;margin-top:auto}
      .read-link{font-size:13px;font-weight:600;color:#c8afff}.read-link>span{display:inline-block;margin-left:6px;transition:transform .2s}
      .compact h2{font-size:20px}.compact .card-top{margin-bottom:18px}
      @media(hover:hover){.mover-card:hover{transform:translateY(-3px);border-color:#9877e5;box-shadow:0 12px 30px #0004,0 0 24px #8b5cf60d}.mover-card:hover .read-link>span{transform:translateX(4px)}}
      @media(max-width:700px){.mover-card :global(.card-link){padding:20px}.card-top{gap:8px;margin-bottom:20px}.topic{font-size:10px;padding:7px 10px}time{font-size:11px}h2{font-size:21px}.company-row{gap:9px}.company-name{font-size:13px}.performance{font-size:17px;padding:7px}.image-pair{gap:10px}.preview{font-size:13px}}
      @media(prefers-reduced-motion:reduce){.mover-card,.read-link>span{transition:none}.mover-card:hover{transform:none}}
    `}</style>
  </article>;
}
