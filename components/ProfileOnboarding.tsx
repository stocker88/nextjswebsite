import {clientLanguage} from '../lib/localization/client-language';
import LanguageSelector from './localization/LanguageSelector';
import LocalizedContent from './localization/LocalizedContent';
import {profileCompletionDestination} from '../lib/site-auth';
import type {ReactNode} from 'react';
import type {User} from 'firebase/auth';
import {useEffect,useRef,useState} from 'react';
import {useRouter} from 'next/router';
import {signOutWebsiteDevice} from '../lib/account-devices';
import {lockedSignalPreviews,onboardingSignalPreviews,type ChartPoint} from '../lib/onboarding-signal-preview';
import {resolveSignupUsername,completeProfileOnboarding,onboardingQuestions,siteProfileExists,type OnboardingAnswers} from '../lib/profile-onboarding';
import TrustpilotWidget from './TrustpilotWidget';
import {trackSignupProgress,signupErrorCode,observeSignupStep} from '../lib/signup-progress';
import {linkWebsiteAcquisition,sourceOptions} from '../lib/acquisition';
import s from '../styles/ProfileOnboarding.module.css';
import OnboardingQuestion,{QuestionProgress} from './OnboardingQuestion';

const emptyAnswers:OnboardingAnswers={experience:'',interest:'',horizon:''};

function recommendation(answers:OnboardingAnswers){
 if(answers.horizon==='Long-term')return {title:'Look beyond the share price.',text:'Start with the business, its valuation and reported earnings.'};
 if(answers.experience==='Experienced'&&answers.interest!=='Options')return {title:'See the setup. Plan your risk.',text:'Start with trend, momentum and the levels that matter.'};
 return {title:'Be ready before earnings.',text:'Compare expectations with past results before the next release.'};
}

const chartDate=(value:string)=>Date.parse(`${value}T00:00:00Z`);
const labelDate=(value:string)=>new Intl.DateTimeFormat(clientLanguage(),{month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(`${value}T00:00:00Z`));
const labelValue=(value:number,unit:'price'|'revenue'|'eps')=>unit==='revenue'?`${(value/1e9).toFixed(value>=1e10?0:1)}B`:unit==='eps'?value.toFixed(value<1?.2:1):value>=1000?`${(value/1000).toFixed(1)}k`:Math.round(value).toString();

function chartGeometry(points:readonly ChartPoint[],width:number,height:number,padding:{left:number;right:number;top:number;bottom:number},zeroBased=false){
 const values=points.map(([,value])=>value),dates=points.map(([date])=>chartDate(date));
 const rawMin=zeroBased?0:Math.min(...values),rawMax=Math.max(...values),span=Math.max(rawMax-rawMin,1);
 const min=zeroBased?0:Math.max(0,rawMin-span*.08),max=rawMax+span*.08;
 const x=(date:string)=>padding.left+(chartDate(date)-dates[0])/Math.max(dates[dates.length-1]-dates[0],1)*(width-padding.left-padding.right);
 const y=(value:number)=>padding.top+(max-value)/Math.max(max-min,1)*(height-padding.top-padding.bottom);
 const coords=points.map(([date,value])=>[x(date),y(value)] as const);
 return {min,max,x,y,coords,path:coords.map(([px,py],index)=>`${index?'L':'M'}${px.toFixed(1)} ${py.toFixed(1)}`).join(' ')};
}

function PriceChart({symbol,points,signalDate,signalLabel,blurred=false}:{symbol:string;points:readonly ChartPoint[];signalDate:string;signalLabel:string;blurred?:boolean}){
 const width=420,height=210,padding={left:42,right:10,top:14,bottom:26},g=chartGeometry(points,width,height,padding),signalX=g.x(signalDate);
 const preSignal=g.coords.filter(([x])=>x<=signalX+1).map(([x,y],index)=>`${index?'L':'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
 const area=`${g.path} L${g.coords[g.coords.length-1][0].toFixed(1)} ${height-padding.bottom} L${g.coords[0][0].toFixed(1)} ${height-padding.bottom} Z`;
 const mid=Math.floor(points.length/2);
 return <LocalizedContent><div className={blurred?s.blurredPrice:s.pricePanel}>
  <svg className={s.priceChart} viewBox={`0 0 ${width} ${height}`} role={blurred?'presentation':'img'} aria-label={blurred?undefined:`${symbol} historical share price through ${points[points.length-1][0]}, with AI signal marker on ${signalDate}`}>
   <defs><linearGradient id={`price-fill-${symbol}-${blurred?'locked':'open'}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#25cf48" stopOpacity=".35"/><stop offset="1" stopColor="#0aa6d9" stopOpacity=".12"/></linearGradient></defs>
   {[0,.33,.66,1].map(value=><line key={value} x1={padding.left} x2={width-padding.right} y1={padding.top+(height-padding.top-padding.bottom)*value} y2={padding.top+(height-padding.top-padding.bottom)*value} className={s.gridLine}/>)}
   <path d={area} fill={`url(#price-fill-${symbol}-${blurred?'locked':'open'})`}/>
   <path d={g.path} pathLength="1" className={`${s.priceLine} ${s.drawLine}`}/>
   {preSignal&&<path d={preSignal} pathLength="1" className={`${s.preSignalLine} ${s.drawLine}`}/>}
   {!blurred&&<><line x1={signalX} x2={signalX} y1={padding.top} y2={height-padding.bottom} className={s.signalMarker}/><text x={Math.min(signalX+7,width-91)} y={height*.56} className={s.signalMarkerText}>{signalLabel}</text></>}
   {!blurred&&<><text x="4" y={padding.top+4} className={s.axisText}>{labelValue(g.max,'price')}</text><text x="4" y={(padding.top+height-padding.bottom)/2+4} className={s.axisText}>{labelValue((g.max+g.min)/2,'price')}</text><text x="4" y={height-padding.bottom+4} className={s.axisText}>{labelValue(g.min,'price')}</text><text x={padding.left} y={height-5} className={s.axisText}>{labelDate(points[0][0])}</text><text x={width/2} y={height-5} textAnchor="middle" className={s.axisText}>{labelDate(points[mid][0])}</text><text x={width-padding.right} y={height-5} textAnchor="end" className={s.axisText}>{labelDate(points[points.length-1][0])}</text></>}
  </svg>
 </div></LocalizedContent>;
}

function FinancialChart({title,unit,points,compact=false}:{title:string;unit:'revenue'|'eps';points:readonly ChartPoint[];compact?:boolean}){
 const width=420,height=compact?118:162,padding={left:42,right:10,top:12,bottom:24},g=chartGeometry(points,width,height,padding,true),innerWidth=width-padding.left-padding.right,slot=innerWidth/points.length,barWidth=Math.max(3,Math.min(9,slot*.46));
 const visibleLabels=compact?[0,points.length-1]:[0,Math.floor(points.length/2),points.length-1];
 return <LocalizedContent><section className={compact?s.compactFinancial:s.financialPanel} aria-label={`${title} historical chart`}>
  <h3>{title}</h3>
  <svg className={s.financialChart} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${title}, latest ${labelValue(points[points.length-1][1],unit)}`}>
   {[0,.5,1].map(value=><line key={value} x1={padding.left} x2={width-padding.right} y1={padding.top+(height-padding.top-padding.bottom)*value} y2={padding.top+(height-padding.top-padding.bottom)*value} className={s.gridLine}/>)}
   <text x="3" y={padding.top+4} className={s.axisText}>{labelValue(g.max,unit)}</text><text x="3" y={(padding.top+height-padding.bottom)/2+4} className={s.axisText}>{labelValue(g.max/2,unit)}</text>
   {points.map(([date,value],index)=>{const x=padding.left+slot*index+(slot-barWidth)/2,y=g.y(value);return <rect key={date} x={x} y={y} width={barWidth} height={height-padding.bottom-y} rx={barWidth/2} className={index>points.length*.58?s.financialBarRecent:s.financialBar} style={{animationDelay:`${index*24}ms`}}/>})}
   {visibleLabels.map(index=><text key={index} x={padding.left+slot*index+slot/2} y={height-5} textAnchor={index===0?'start':index===points.length-1?'end':'middle'} className={s.axisText}>{labelDate(points[index][0])}</text>)}
  </svg>
 </section></LocalizedContent>;
}

export function ProfileOnboarding({user,onComplete,learningOnly=false}:{user:User;onComplete:()=>void|Promise<void>;learningOnly?:boolean}){
 const [step,setStep]=useState(-1),[userName,setUserName]=useState('');
 const [answers,setAnswers]=useState<OnboardingAnswers>(emptyAnswers);
 const [error,setError]=useState(''),[saving,setSaving]=useState(false);
 const [needsSource,setNeedsSource]=useState(false),[heardFrom,setHeardFrom]=useState('');
 const usernameRequest=useRef<Promise<string>|null>(null);
 const prepareUsername=()=>{
  if(!usernameRequest.current)usernameRequest.current=resolveSignupUsername(user.displayName||'member',user.uid).then(name=>{setUserName(name);trackSignupProgress('profile','success');return name}).catch(cause=>{usernameRequest.current=null;throw cause});
  return usernameRequest.current;
 };
 useEffect(()=>{
  let active=true;
  void prepareUsername().catch(()=>{/* Retry on completion without blocking the questions. */});
  void linkWebsiteAcquisition(user.uid).then(result=>{
   if(!active)return;
   const required=result?.needsSourceQuestion!==false;
   setNeedsSource(required);setStep(required?0:1);
  }).catch(()=>{if(active){setNeedsSource(true);setStep(0)}});
  return()=>{active=false};
 },[user.uid]);
 const chooseSource=(value:string)=>{setHeardFrom(value);setError('')};
 const continueSource=()=>{
  if(heardFrom){trackSignupProgress('source','success');void linkWebsiteAcquisition(user.uid,heardFrom).catch(()=>{/* Saved again with the completed profile. */})}
  setStep(1);
 };
 useEffect(()=>{
  if(step<0)return;
  return observeSignupStep(step===0?'source':step<=onboardingQuestions.length?`question_${step}`:'results');
 },[step,user.uid]);
 const selectAnswer=(key:keyof OnboardingAnswers,value:string)=>{trackSignupProgress(`question_${step}`,'success');setAnswers(previous=>({...previous,[key]:value}));setError('');setStep(current=>current+1)};
 const finish=async()=>{
  if(saving)return;
  trackSignupProgress('save','attempt');
  setSaving(true);setError('');
  try{const resolvedName=await prepareUsername();await completeProfileOnboarding(user,{userName:resolvedName,photoFile:null,answers,heardFrom});trackSignupProgress('complete','success');await onComplete()}
  catch(cause){trackSignupProgress('save','error',signupErrorCode(cause));setError(cause instanceof Error?cause.message:'Could not finish your profile. Please try again.');setSaving(false);if(signupErrorCode(cause)==='username_taken')usernameRequest.current=null;}
 };
 const questionCount=onboardingQuestions.length;
 const question=step>=1&&step<=questionCount?onboardingQuestions[step-1]:null;
 const choice=recommendation(answers);
 const proAction=<div className={s.proAction}>
  <button className={s.primary} type="button" disabled={saving} onClick={()=>void finish()}>{saving?'Creating your profile…':'Receive new signals now →'}</button>
  {error&&<p className={s.fieldError} role="alert">{error}</p>}
 </div>;

 return <LocalizedContent><main className={s.page}>
  <div className={s.glow} aria-hidden="true"/>
  <section className={s.card} aria-labelledby="profile-onboarding-title">
   <header className={s.top}><LanguageSelector/><div className={s.brand}><img src="/assets/images/stockerRobotIcon.png" width="40" height="40" alt=""/><span>Stocks To Buy Now Research</span></div><span>{step<0?'Getting started':step===0?'Your discovery':question?'Your preferences':'Your results'}</span></header>
   {step<0&&<div className={s.content} role="status">Preparing your questions…</div>}
   {step===0&&<div className={s.content}>
    <QuestionProgress current={1} total={questionCount+1}/>
    <h1 id="profile-onboarding-title">How did you discover us?</h1>
    <p className={s.lead}>Help us understand where you found us. This question is optional.</p>
    <div className={s.choices}>{sourceOptions.map(([value,label])=><button key={value} type="button" className={heardFrom===value?s.selected:''} aria-pressed={heardFrom===value} onClick={()=>chooseSource(value)}>{label}<span aria-hidden="true">{heardFrom===value?'✓':'→'}</span></button>)}</div>
    <button className={s.primary} type="button" onClick={continueSource}>{heardFrom?'Continue →':'Skip →'}</button>
   </div>}
   {question&&<OnboardingQuestion current={step} progressCurrent={step+(needsSource?1:0)} progressTotal={questionCount+(needsSource?1:0)} questions={onboardingQuestions} answer={answers[question.key]} onBack={step>1||needsSource?()=>setStep(step-1):undefined} onSelect={value=>selectAnswer(question.key,value)}/>}
   {step===questionCount+1&&learningOnly&&<div className={s.content}><p className={s.eyebrow}>YOUR FREE LEARNING ACCOUNT</p><h1 id="profile-onboarding-title">Your academy is ready.</h1><p className={s.lead}>Continue to the free lessons, complete the questionnaires and earn your Level 1 course-completion certificate. No subscription is required.</p><button className={s.primary} disabled={saving} onClick={()=>void finish()}>{saving?'Creating your profile…':'Start learning'}</button></div>}
   {step===questionCount+1&&!learningOnly&&<div className={`${s.content} ${s.resultsContent}`}>
    <button className={s.back} type="button" onClick={()=>setStep(questionCount)}>← Back</button><p className={s.eyebrow}>ALL {questionCount} QUESTIONS COMPLETE · YOUR RESULTS</p><h1 id="profile-onboarding-title">Your first signals are ready.</h1><p className={s.lead}>{choice.title} {choice.text}</p>
    <div className={s.summary}><span>{answers.experience}</span><span>{answers.interest}</span><span>{answers.horizon}</span></div>
    {proAction}
    <div className={s.signalHeading}><div><strong>AI past predictions</strong><span>Real signals previously sent to members</span></div><span>PREVIEW</span></div>
    <div className={s.signalList}>
     {onboardingSignalPreviews.map((signal,index)=><article className={s.signalCard} key={signal.symbol} style={{animationDelay:`${index*120}ms`}}>
      <div className={s.signalIdentity}><img src={signal.logo} width="42" height="42" alt=""/><div><b>{signal.symbol}</b><span>{signal.name}</span></div><strong>{signal.returnLabel}</strong></div>
      <div className={s.priceTitle}><span>Share price</span><strong>${signal.price[signal.price.length-1][1].toLocaleString(clientLanguage(),{minimumFractionDigits:2,maximumFractionDigits:2})}</strong><small>as of {labelDate(signal.price[signal.price.length-1][0])}</small></div>
      <PriceChart symbol={signal.symbol} points={signal.price} signalDate={signal.signalDate} signalLabel={signal.signalLabel}/>
      <div className={s.signalMeta}><span>AI BUY SIGNAL</span><span>Price through {labelDate(signal.price[signal.price.length-1][0])}</span></div>
      <FinancialChart title={signal.financial.title} unit={signal.financial.unit} points={signal.financial.points}/>
      {proAction}
     </article>)}
     {lockedSignalPreviews.map((signal,index)=><article className={`${s.signalCard} ${s.lockedSignalCard}`} key={signal.symbol} style={{animationDelay:`${Math.min(index+2,8)*70}ms`}} aria-label="Additional member result: price and company are locked, financial trend is visible">
      <div className={s.lockedPriceWrap} aria-hidden="true">
       <div className={`${s.signalIdentity} ${s.lockedIdentity}`}><span className={s.lockedLogo}/><div><b>{signal.symbol}</b><span>{signal.name}</span></div><strong>{signal.returnLabel}</strong></div>
       <div className={s.lockedPriceBlank}/>
      </div>
      <div className={s.lockLabel}><span>🔒</span><strong>Company and price signal locked</strong></div>
      <FinancialChart title={signal.financial.title} unit={signal.financial.unit} points={signal.financial.points} compact/>
      {proAction}
     </article>)}
     <div className={s.moreSignals}><span>🔒</span><div><strong>Unlock every price signal</strong><small>All financial trends are visible. Start your trial to reveal each company and its performance.</small></div></div>
    </div>
    <p className={s.resultsNote}>Historical examples are educational and are not guarantees or recommendations.</p>
    <section className={s.onboardingTrust} aria-label="Independent Trustpilot reviews">
     <TrustpilotWidget templateId="53aa8912dec7e10d38f59f36" businessUnitId="670a2355c53c6130a02f3e50" height="124px"/>
    </section>
    <button className={s.primary} type="button" disabled={saving} onClick={()=>void finish()}>{saving?'Creating your profile…':'Continue to your free trial →'}</button>
   </div>}
   {error&&<p className={s.error} role="alert">{error}</p>}
   <footer>{userName&&<p>Your username is <strong>@{userName}</strong>. You can change it later in your profile.</p>}<button type="button" disabled={saving} onClick={()=>void signOutWebsiteDevice()}>Use another account</button><p>Your profile works in both the app and on the website.</p></footer>
  </section>
 </main></LocalizedContent>;
}

export default function ProfileOnboardingGate({user,children,onProfileReady}:{user:User;children:ReactNode;onProfileReady?:(uid:string,ready:boolean)=>void}){
 const router=useRouter();
 const cacheKey=`stbn.profileReady.v1:${user.uid}`;
 const [cached]=useState(()=>{try{return typeof window!=='undefined'&&sessionStorage.getItem(cacheKey)==='1'}catch{return false}});
 const [status,setStatus]=useState<'checking'|'required'|'complete'|'error'>(cached?'complete':'checking'),[attempt,setAttempt]=useState(0);
 useEffect(()=>{trackSignupProgress('profile_check',status==='checking'?'attempt':status==='error'?'error':'success')},[status]);
 useEffect(()=>{if(status==='checking')return observeSignupStep('profile_check')},[status,user.uid]);
 useEffect(()=>{if(status!=='checking')return;const timeout=setTimeout(()=>{if(!document.hidden)trackSignupProgress('profile_check','error','client/timeout')},10000);return()=>clearTimeout(timeout)},[status,user.uid]);
 useEffect(()=>{let active=true;if(cached)onProfileReady?.(user.uid,true);else setStatus('checking');siteProfileExists(user.uid).then(exists=>{if(!active)return;onProfileReady?.(user.uid,exists);if(exists){try{sessionStorage.setItem(cacheKey,'1')}catch{}setStatus('complete')}else{try{sessionStorage.removeItem(cacheKey)}catch{}setStatus('required')}}).catch(()=>{if(active&&!cached){onProfileReady?.(user.uid,false);setStatus('error')}});return()=>{active=false}},[user.uid,attempt,cached,cacheKey,onProfileReady]);
 if(status==='complete')return <LocalizedContent><>{children}</></LocalizedContent>;
 if(status==='required')return <LocalizedContent><ProfileOnboarding key={user.uid} user={user} learningOnly={profileCompletionDestination(router.pathname,router.query.next)==='/learn/get-certified/'} onComplete={async()=>{try{sessionStorage.setItem(cacheKey,'1')}catch{}onProfileReady?.(user.uid,true);const next=profileCompletionDestination(router.pathname,router.query.next);try{await router.replace(next)}catch{window.location.assign(next)}setStatus('complete')}}/></LocalizedContent>;
 if(status==='error')return <LocalizedContent><main className={s.page}><section className={s.errorCard}><img src="/assets/images/stockerRobotIcon.png" width="54" height="54" alt=""/><h1>Let’s reconnect your profile.</h1><p>We couldn’t verify whether your profile is ready. Nothing has been changed.</p><button className={s.primary} onClick={()=>setAttempt(value=>value+1)}>Try again</button><button className={s.secondary} onClick={()=>void signOutWebsiteDevice()}>Use another account</button></section></main></LocalizedContent>;
 return <LocalizedContent><div className={s.silentGate} role="status" aria-live="polite">Loading your profile…</div></LocalizedContent>;
}
