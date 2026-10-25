import {useState} from 'react';
import {AccountLink} from './SiteAccount';
import ArticlePostEngagement from './ArticlePostEngagement';
import {optionResultHighlight,optionResultUrl,type OptionResultPreviewData} from '../lib/option-results';
import styles from '../styles/OptionResults.module.css';
const money=(value:number)=>value.toLocaleString('en-US',{style:'currency',currency:'USD'});
export default function OptionResultPreview({result}:{result:OptionResultPreviewData}){
 const [logoFailed,setLogoFailed]=useState(false);
 const {move,image}=optionResultHighlight(result);
 const date=new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(result.sessionDay+'T12:00:00Z'));
 return <article className={styles.previewCard} id={result.id} data-app-post-id={result.id}>
  <AccountLink className={styles.previewLink} destination={optionResultUrl(result)}>
   <div className={styles.previewTop}><span className={styles.tag}>${result.symbol} · RESULTS <span aria-hidden="true">↗</span></span><time dateTime={result.sessionDay}>{date}</time></div>
   <div className={styles.previewCompany}><span className={styles.previewLogo} aria-hidden="true">{logoFailed?result.symbol.slice(0,2):<img src={'/assets/logo/'+encodeURIComponent(result.symbol)+'.webp'} alt="" width={44} height={44} loading="lazy" onError={()=>setLogoFailed(true)}/>}</span><span><strong>{result.companyName}</strong><small>Options performance</small></span></div>
   <h2>{result.title}</h2>
   <div className={styles.previewResult}><div><small>Option price change</small><strong className={move.sessionPct>=0?styles.positive:styles.negative}>{move.sessionPct>0?'+':''}{move.sessionPct.toFixed(2)}%</strong><small>Since previous session close</small></div><div><small>${move.strike} {move.optionType||'call'} · Expiry {move.expiry}</small><strong>{money(move.previousClose)} <span aria-label="to">→</span> {money(move.sessionClose)}</strong><small>Premium per share · Before costs</small></div></div>
   {image&&<figure className={styles.previewImage}><img src={image.url} alt={`${result.symbol} $${move.strike} ${move.optionType||'call'} results, expiry ${move.expiry}`} width={image.width} height={image.height} loading="lazy" decoding="async"/></figure>}
   <div className={styles.previewFooter}><ArticlePostEngagement postId={result.id}/><span>View full results <span aria-hidden="true">→</span></span></div>
  </AccountLink>
 </article>;
}
