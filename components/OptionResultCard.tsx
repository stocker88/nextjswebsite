import ShareControl from './ShareControl';
import {AccountLink,useSiteAccount} from './SiteAccount';
import {useEffect,useState} from 'react';
import {ContentAccessPanel} from './ContentAccess';
import {clearResultMemberContent,fetchResultMemberContent,lastKnownResultMemberContent,type ResultMemberContent} from '../lib/member-content';
import {lastKnownMembershipStatus} from '../lib/membership-status';
import OptionResultPayoff from './OptionResultPayoff';
import ResearchImages from './ResearchImages';
import {optionResultUrl,type OptionResultPreviewData} from '../lib/option-results';
import styles from '../styles/OptionResults.module.css';
const money=(n:number)=>n.toLocaleString('en-US',{style:'currency',currency:'USD'});
const date=(value:string)=>new Date(value+'T12:00:00Z').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'});
export default function OptionResultCard({result,compact=false}:{result:OptionResultPreviewData;compact?:boolean}){
 return <article className={styles.report} id={compact?undefined:result.id}>
  <div className={styles.top}><span className={styles.tag}>${result.symbol} · OPTIONS PERFORMANCE</span><time dateTime={result.sessionDay}>{date(result.sessionDay)}</time></div>
  <div className={styles.company}><img src={`/assets/logo/${result.symbol}.webp`} alt="" width={48} height={48}/><div><strong>{result.companyName}</strong><span>Earnings &amp; option results</span></div></div>
  <h2>{result.title}</h2>{compact&&<ShareControl title={result.title} path={optionResultUrl(result)}/>}
  <UltraResultBody preview={result}/>

 </article>;
}

type UltraResultState={uid:string;id:string;data?:ResultMemberContent;denied?:boolean;error?:boolean};
function cachedUltraResultState(uid:string,id:string):UltraResultState|null{
 const membership=lastKnownMembershipStatus(uid);
 const knownNonUltra=membership?.status==='inactive'||membership?.status==='active'&&membership.isActive&&membership.hasUltra===false;
 if(knownNonUltra)return {uid,id,denied:true};
 const data=lastKnownResultMemberContent(uid,id);
 if(data)return {uid,id,data};
 return null;
}

function UltraResultBody({preview}:{preview:OptionResultPreviewData}){
 const {user,ready}=useSiteAccount();
 const [attempt,setAttempt]=useState(0);
 const [state,setState]=useState<UltraResultState|null>(()=>user?cachedUltraResultState(user.uid,preview.id):null);
 useEffect(()=>{
  if(!user){setState(null);return}
  let active=true,timer:ReturnType<typeof setTimeout>|undefined;
  const uid=user.uid,cached=cachedUltraResultState(uid,preview.id);
  setState(previous=>previous?.uid===uid&&previous.id===preview.id&&previous.data?previous:cached);
  fetchResultMemberContent(uid,preview.id).then(data=>{
   if(!active)return;
   if(data.accessUntil&&Date.parse(data.accessUntil)<=Date.now()){clearResultMemberContent(uid,preview.id);setState({uid,id:preview.id,denied:true});return;}
   setState({uid,id:preview.id,data});
   if(data.accessUntil){const delay=Date.parse(data.accessUntil)-Date.now();if(delay>0)timer=setTimeout(()=>{if(active){setState(null);setAttempt(n=>n+1)}},Math.min(delay,2147483647));}
  }).catch(error=>{if(active){
   if(error?.code==='functions/permission-denied'){clearResultMemberContent(uid,preview.id);setState({uid,id:preview.id,denied:true});return}
   setState(previous=>previous?.uid===uid&&previous.id===preview.id&&previous.data?previous:{uid,id:preview.id,error:true});
  }});
  return()=>{active=false;if(timer)clearTimeout(timer)};
 },[user?.uid,preview.id,attempt]);
 const ownState=user&&state?.uid===user.uid&&state.id===preview.id?state:null;
 // Auth can resolve between renders. Read the account-bound cache directly so
 // the result or upgrade card is present on that very first signed-in render,
 // before the effect performs its silent revalidation.
 const current=ownState||(user?cachedUltraResultState(user.uid,preview.id):null);
 const membership=user?lastKnownMembershipStatus(user.uid):null;
 const required=membership&&(membership.status==='inactive'||membership.status==='active'&&membership.hasPro===false)?'pro':'ultra';
 const path=optionResultUrl(preview),retry=()=>setAttempt(n=>n+1);
 if(!ready)return <ContentAccessPanel destination={path} kind="ultra" checking/>;
 if(!user)return <ContentAccessPanel destination={path} kind="ultra"/>;
 if(!current)return <ContentAccessPanel destination={path} kind="ultra" checking/>;
 if(!current.data)return <ContentAccessPanel destination={path} kind={required} error={current.error} onRetry={retry}/>;
 const result={...preview,...current.data},compact=false;
 return <div data-ultra-results={preview.id}>
  <ResearchImages images={result.images} appOnly={false}/>
  <p className={styles.intro}>{date(result.moves[0].previousSession)} close → price on {date(result.sessionDay)}, before costs.{result.moves.some(m=>m.priceSelection)&&' This comparison uses the higher of two recorded prices for the same contract that day.'}</p>
  {result.stock&&<p className={styles.intro}><strong>{result.symbol} stock: {result.stock.movePct>=0?'+':''}{result.stock.movePct.toFixed(2)}%</strong> {result.stock.basis==='past_24_hours'?'over 24 hours':'since the previous close'} · {money(result.stock.price)} on {new Date(result.stock.asOf).toLocaleDateString('en-US',{timeZone:'America/New_York',month:'short',day:'numeric',year:'numeric'})}.</p>}
  {!compact&&<>
   <section className={styles.recap}><h3>What happened</h3><ul>{result.recap.map((bullet,i)=><li key={i}>{bullet}</li>)}</ul></section>
   {result.quickTake&&<section className={styles.recap}><h3>Quick Take</h3><p className={styles.intro}>{result.quickTake}</p></section>}
  </>}
  <OptionResultPayoff key={result.id} result={result}/>
  <div className={styles.calls}>{result.moves.map(m=><section key={m.id} className={styles.call} aria-label={`${result.symbol} $${m.strike} ${m.optionType||'call'} performance`}>
   <div className={styles.callLabel}>${m.strike} {m.optionType==='put'?'PUT':'CALL'} <span>{date(m.expiry)} expiry</span></div>
   <strong className={styles.performance}>{m.sessionPct>0?'+':''}{m.sessionPct.toFixed(2)}%</strong><span className={styles.basis}>Since previous session close</span>
   <div className={styles.prices}>{money(m.previousClose)} <span>→</span> {money(m.sessionClose)}</div>
   <p>Per {m.multiplier}-share contract: {money(m.previousClose*m.multiplier)} → {money(m.sessionClose*m.multiplier)}</p>
   <p><strong>Maximum premium loss: {money(m.previousClose*m.multiplier)}</strong> {m.optionType==='put'?'if the stock finishes at or above the strike at expiry and the bought put becomes worthless.':'if the call expires worthless because the stock finishes at or below the strike.'}</p>
   <p><strong>Ending value: {money(m.sessionClose*m.multiplier)}</strong> · Gain: {money((m.sessionClose-m.previousClose)*m.multiplier)}, before costs.</p>
   <small>Price date: {m.aggregateAsOf?new Date(m.aggregateAsOf).toLocaleDateString('en-US',{timeZone:'America/New_York',month:'short',day:'numeric',year:'numeric'}):'Not available'}</small>
  </section>)}</div>
  {compact?<AccountLink className={styles.attachment} destination={optionResultUrl(result)}><strong>View {result.symbol} full results <span aria-hidden="true">↗</span></strong><p>See the option charts and the research behind these moves.</p></AccountLink>:<>
   {result.earningsUrl&&<AccountLink className={styles.attachment} destination={result.earningsUrl}><span>RELATED RESEARCH</span><strong>{result.companyName} · Latest insight <span aria-hidden="true">↗</span></strong><p>Read the related company research.</p></AccountLink>}
   <footer className={styles.footer}>Source: <a href="https://www.StocksToBuyNow.ai">www.StocksToBuyNow.ai</a><p>Options can lose their entire premium.</p></footer>
  </>}
 </div>;
}
