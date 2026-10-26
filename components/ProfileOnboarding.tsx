import type {ChangeEvent,ReactNode} from 'react';
import type {User} from 'firebase/auth';
import {useEffect,useMemo,useState} from 'react';
import {useRouter} from 'next/router';
import {signOutWebsiteDevice} from '../lib/account-devices';
import {lockedSignalPreviews,onboardingSignalPreviews,type ChartPoint} from '../lib/onboarding-signal-preview';
import {completeProfileOnboarding,isUsernameAvailable,normalizeUsername,onboardingQuestions,siteProfileExists,usernameValidationMessage,type OnboardingAnswers,type UsernameAvailability} from '../lib/profile-onboarding';
import s from '../styles/ProfileOnboarding.module.css';

const emptyAnswers:OnboardingAnswers={experience:'',interest:'',horizon:''};

function recommendation(answers:OnboardingAnswers){
 if(answers.horizon==='Long-term')return {title:'Look beyond the share price.',text:'Start with the business, its valuation and reported earnings.'};
 if(answers.experience==='Experienced'&&answers.interest!=='Options')return {title:'See the setup. Plan your risk.',text:'Start with trend, momentum and the levels that matter.'};
 return {title:'Be ready before earnings.',text:'Compare expectations with past results before the next release.'};
}

const chartDate=(value:string)=>Date.parse(`${value}T00:00:00Z`);
const labelDate=(value:string)=>new Intl.DateTimeFormat('en-US',{month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(`${value}T00:00:00Z`));
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
 return <div className={blurred?s.blurredPrice:s.pricePanel}>
  <svg className={s.priceChart} viewBox={`0 0 ${width} ${height}`} role={blurred?'presentation':'img'} aria-label={blurred?undefined:`${symbol} historical share price through ${points[points.length-1][0]}, with AI signal marker on ${signalDate}`}>
   <defs><linearGradient id={`price-fill-${symbol}-${blurred?'locked':'open'}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#25cf48" stopOpacity=".35"/><stop offset="1" stopColor="#0aa6d9" stopOpacity=".12"/></linearGradient></defs>
   {[0,.33,.66,1].map(value=><line key={value} x1={padding.left} x2={width-padding.right} y1={padding.top+(height-padding.top-padding.bottom)*value} y2={padding.top+(height-padding.top-padding.bottom)*value} className={s.gridLine}/>)}
   <path d={area} fill={`url(#price-fill-${symbol}-${blurred?'locked':'open'})`}/>
   <path d={g.path} pathLength="1" className={`${s.priceLine} ${s.drawLine}`}/>
   {preSignal&&<path d={preSignal} pathLength="1" className={`${s.preSignalLine} ${s.drawLine}`}/>}
   {!blurred&&<><line x1={signalX} x2={signalX} y1={padding.top} y2={height-padding.bottom} className={s.signalMarker}/><text x={Math.min(signalX+7,width-91)} y={height*.56} className={s.signalMarkerText}>{signalLabel}</text></>}
   {!blurred&&<><text x="4" y={padding.top+4} className={s.axisText}>{labelValue(g.max,'price')}</text><text x="4" y={(padding.top+height-padding.bottom)/2+4} className={s.axisText}>{labelValue((g.max+g.min)/2,'price')}</text><text x="4" y={height-padding.bottom+4} className={s.axisText}>{labelValue(g.min,'price')}</text><text x={padding.left} y={height-5} className={s.axisText}>{labelDate(points[0][0])}</text><text x={width/2} y={height-5} textAnchor="middle" className={s.axisText}>{labelDate(points[mid][0])}</text><text x={width-padding.right} y={height-5} textAnchor="end" className={s.axisText}>{labelDate(points[points.length-1][0])}</text></>}
  </svg>
 </div>;
}

function FinancialChart({title,unit,points,compact=false}:{title:string;unit:'revenue'|'eps';points:readonly ChartPoint[];compact?:boolean}){
 const width=420,height=compact?118:162,padding={left:42,right:10,top:12,bottom:24},g=chartGeometry(points,width,height,padding,true),innerWidth=width-padding.left-padding.right,slot=innerWidth/points.length,barWidth=Math.max(3,Math.min(9,slot*.46));
 const visibleLabels=compact?[0,points.length-1]:[0,Math.floor(points.length/2),points.length-1];
 return <section className={compact?s.compactFinancial:s.financialPanel} aria-label={`${title} historical chart`}>
  <h3>{title}</h3>
  <svg className={s.financialChart} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${title}, latest ${labelValue(points[points.length-1][1],unit)}`}>
   {[0,.5,1].map(value=><line key={value} x1={padding.left} x2={width-padding.right} y1={padding.top+(height-padding.top-padding.bottom)*value} y2={padding.top+(height-padding.top-padding.bottom)*value} className={s.gridLine}/>)}
   <text x="3" y={padding.top+4} className={s.axisText}>{labelValue(g.max,unit)}</text><text x="3" y={(padding.top+height-padding.bottom)/2+4} className={s.axisText}>{labelValue(g.max/2,unit)}</text>
   {points.map(([date,value],index)=>{const x=padding.left+slot*index+(slot-barWidth)/2,y=g.y(value);return <rect key={date} x={x} y={y} width={barWidth} height={height-padding.bottom-y} rx={barWidth/2} className={index>points.length*.58?s.financialBarRecent:s.financialBar} style={{animationDelay:`${index*24}ms`}}/>})}
   {visibleLabels.map(index=><text key={index} x={padding.left+slot*index+slot/2} y={height-5} textAnchor={index===0?'start':index===points.length-1?'end':'middle'} className={s.axisText}>{labelDate(points[index][0])}</text>)}
  </svg>
 </section>;
}

export function ProfileOnboarding({user,onComplete}:{user:User;onComplete:()=>void|Promise<void>}){
 const [step,setStep]=useState(0),[userName,setUserName]=useState(()=>normalizeUsername(user.displayName||''));
 const [photoFile,setPhotoFile]=useState<File|null>(null),[answers,setAnswers]=useState<OnboardingAnswers>(emptyAnswers);
 const [availability,setAvailability]=useState<UsernameAvailability>('idle'),[error,setError]=useState(''),[saving,setSaving]=useState(false);
 const photoPreview=useMemo(()=>photoFile?URL.createObjectURL(photoFile):user.photoURL||'',[photoFile,user.photoURL]);
 useEffect(()=>()=>{if(photoFile&&photoPreview)URL.revokeObjectURL(photoPreview)},[photoFile,photoPreview]);
 useEffect(()=>{
  const validation=usernameValidationMessage(userName);
  if(validation){setAvailability('idle');return}
  let active=true;
  setAvailability('checking');
  const timer=window.setTimeout(()=>void isUsernameAvailable(userName,user.uid).then(value=>{if(active)setAvailability(value?'available':'taken')}).catch(()=>{if(active)setAvailability('error')}),400);
  return()=>{active=false;window.clearTimeout(timer)};
 },[userName,user.uid]);

 const validation=usernameValidationMessage(userName);
 const choosePhoto=(event:ChangeEvent<HTMLInputElement>)=>{
  const file=event.target.files?.[0]||null;
  setError('');
  if(!file)return;
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)){setError('Choose a JPG, PNG or WebP image.');event.target.value='';return}
  if(file.size>5*1024*1024){setError('Choose an image smaller than 5 MB.');event.target.value='';return}
  setPhotoFile(file);
 };
 const continueProfile=async()=>{
  setError('');
  if(validation){setError(validation);return}
  if(!photoFile&&!user.photoURL){setError('Choose a profile picture to continue.');return}
  setAvailability('checking');
  try{const available=await isUsernameAvailable(userName,user.uid);setAvailability(available?'available':'taken');if(!available){setError('That username is already taken.');return}setStep(1)}
  catch{setAvailability('error');setError('We couldn’t check that username. Please try again.')}
 };
 const selectAnswer=(key:keyof OnboardingAnswers,value:string)=>{setAnswers(previous=>({...previous,[key]:value}));setError('');setStep(current=>current+1)};
 const finish=async()=>{
  setSaving(true);setError('');
  try{await completeProfileOnboarding(user,{userName,photoFile,answers});await onComplete()}
  catch(cause){setError(cause instanceof Error?cause.message:'Could not finish your profile. Please try again.');setSaving(false)}
 };
 const question=step>=1&&step<=3?onboardingQuestions[step-1]:null;
 const choice=recommendation(answers);
 const initials=(normalizeUsername(userName)||'A').slice(0,2).toUpperCase();

 return <main className={s.page}>
  <div className={s.glow} aria-hidden="true"/>
  <section className={s.card} aria-labelledby="profile-onboarding-title">
   <header className={s.top}><div className={s.brand}><img src="/assets/images/stockerRobotIcon.png" width="40" height="40" alt=""/><span>STOCKS TO BUY NOW AI</span></div><span>Step {Math.min(step+1,5)} of 5</span></header>
   <div className={s.progress} aria-hidden="true"><i style={{width:`${Math.min((step+1)/5*100,100)}%`}}/></div>
   {step===0&&<div className={s.content}>
    <p className={s.eyebrow}>CREATE YOUR PROFILE</p><h1 id="profile-onboarding-title">Make this space yours.</h1><p className={s.lead}>Choose a profile picture and a unique username before you continue.</p>
    <label className={s.photoPicker}>
     <span className={s.avatar}>{photoPreview?<img src={photoPreview} alt="Selected profile"/>:<b>{initials}</b>}</span>
     <span>{photoPreview?'Change profile picture':'Choose profile picture'}</span>
     <input type="file" accept="image/jpeg,image/png,image/webp" onChange={choosePhoto}/>
    </label>
    <label className={s.field}><span>Username</span><input autoFocus autoCapitalize="none" autoCorrect="off" maxLength={15} value={userName} onChange={event=>{setUserName(normalizeUsername(event.target.value));setError('')}} placeholder="your_username"/></label>
    <p className={`${s.fieldNote} ${validation||availability==='taken'||availability==='error'?s.fieldError:availability==='available'?s.fieldSuccess:''}`} aria-live="polite">{validation||(availability==='taken'?'That username is already taken.':availability==='error'?'We couldn’t check availability.':availability==='checking'?'Checking availability…':availability==='available'?'Username available.':'Letters, numbers and underscores only. Up to 5 digits.')}</p>
    <button className={s.primary} type="button" onClick={()=>void continueProfile()} disabled={availability==='checking'}>Continue →</button>
   </div>}
   {question&&<div className={s.content}>
    <button className={s.back} type="button" onClick={()=>setStep(step-1)}>← Back</button><p className={s.eyebrow}>QUICK QUESTION {step} OF 3</p><h1 id="profile-onboarding-title">{question.title}</h1><p className={s.lead}>{question.subtitle}</p>
    <div className={s.choices}>{question.options.map(option=><button key={option} type="button" className={answers[question.key]===option?s.selected:''} onClick={()=>selectAnswer(question.key,option)}>{option}<span>→</span></button>)}</div>
   </div>}
   {step===4&&<div className={`${s.content} ${s.resultsContent}`}>
    <button className={s.back} type="button" onClick={()=>setStep(3)}>← Back</button><p className={s.eyebrow}>YOUR RESULTS</p><h1 id="profile-onboarding-title">Your first signals are ready.</h1><p className={s.lead}>{choice.title} {choice.text}</p>
    <div className={s.summary}><span>{answers.experience}</span><span>{answers.interest}</span><span>{answers.horizon}</span></div>
    <div className={s.signalHeading}><div><strong>AI past predictions</strong><span>Real signals previously sent to members</span></div><span>PREVIEW</span></div>
    <div className={s.signalList}>
     {onboardingSignalPreviews.map((signal,index)=><article className={s.signalCard} key={signal.symbol} style={{animationDelay:`${index*120}ms`}}>
      <div className={s.signalIdentity}><img src={signal.logo} width="42" height="42" alt=""/><div><b>{signal.symbol}</b><span>{signal.name}</span></div><strong>{signal.returnLabel}</strong></div>
      <div className={s.priceTitle}><span>Share price</span><strong>${signal.price[signal.price.length-1][1].toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}</strong><small>as of {labelDate(signal.price[signal.price.length-1][0])}</small></div>
      <PriceChart symbol={signal.symbol} points={signal.price} signalDate={signal.signalDate} signalLabel={signal.signalLabel}/>
      <div className={s.signalMeta}><span>AI BUY SIGNAL</span><span>Price through {labelDate(signal.price[signal.price.length-1][0])}</span></div>
      <FinancialChart title={signal.financial.title} unit={signal.financial.unit} points={signal.financial.points}/>
     </article>)}
     {lockedSignalPreviews.map((signal,index)=><article className={`${s.signalCard} ${s.lockedSignalCard}`} key={signal.symbol} style={{animationDelay:`${Math.min(index+2,8)*70}ms`}} aria-label="Additional member result: price and company are locked, financial trend is visible">
      <div className={s.lockedPriceWrap} aria-hidden="true">
       <div className={s.signalIdentity}><img src={signal.logo} width="42" height="42" alt=""/><div><b>{signal.symbol}</b><span>{signal.name}</span></div><strong>{signal.returnLabel}</strong></div>
       <PriceChart symbol={`LOCKED-${signal.symbol}`} points={signal.price} signalDate={signal.signalDate} signalLabel="" blurred/>
      </div>
      <div className={s.lockLabel}><span>🔒</span><strong>Company and price signal locked</strong></div>
      <FinancialChart title={signal.financial.title} unit={signal.financial.unit} points={signal.financial.points} compact/>
     </article>)}
     <div className={s.moreSignals}><span>🔒</span><div><strong>Unlock every price signal</strong><small>All financial trends are visible. Start your trial to reveal each company and its performance.</small></div></div>
    </div>
    <p className={s.resultsNote}>Historical examples are educational and are not guarantees or recommendations.</p>
    <button className={s.primary} type="button" disabled={saving} onClick={()=>void finish()}>{saving?'Creating your profile…':'Continue to your free trial →'}</button>
   </div>}
   {error&&<p className={s.error} role="alert">{error}</p>}
   <footer><button type="button" disabled={saving} onClick={()=>void signOutWebsiteDevice()}>Use another account</button><p>Your profile works in both the app and on the website.</p></footer>
  </section>
 </main>;
}

export default function ProfileOnboardingGate({user,children,onProfileReady}:{user:User;children:ReactNode;onProfileReady?:(uid:string,ready:boolean)=>void}){
 const router=useRouter();
 const cacheKey=`stbn.profileReady.v1:${user.uid}`;
 const [cached]=useState(()=>{try{return typeof window!=='undefined'&&sessionStorage.getItem(cacheKey)==='1'}catch{return false}});
 const [status,setStatus]=useState<'checking'|'required'|'complete'|'error'>(cached?'complete':'checking'),[attempt,setAttempt]=useState(0);
 useEffect(()=>{let active=true;if(cached)onProfileReady?.(user.uid,true);else setStatus('checking');siteProfileExists(user.uid).then(exists=>{if(!active)return;onProfileReady?.(user.uid,exists);if(exists){try{sessionStorage.setItem(cacheKey,'1')}catch{}setStatus('complete')}else{try{sessionStorage.removeItem(cacheKey)}catch{}setStatus('required')}}).catch(()=>{if(active&&!cached){onProfileReady?.(user.uid,false);setStatus('error')}});return()=>{active=false}},[user.uid,attempt,cached,cacheKey,onProfileReady]);
 if(status==='complete')return <>{children}</>;
 if(status==='required')return <ProfileOnboarding user={user} onComplete={async()=>{try{sessionStorage.setItem(cacheKey,'1')}catch{}onProfileReady?.(user.uid,true);try{await router.replace('/membership/?from=onboarding')}catch{window.location.assign('/membership/?from=onboarding')}setStatus('complete')}}/>;
 if(status==='error')return <main className={s.page}><section className={s.errorCard}><img src="/assets/images/stockerRobotIcon.png" width="54" height="54" alt=""/><h1>Let’s reconnect your profile.</h1><p>We couldn’t verify whether your profile is ready. Nothing has been changed.</p><button className={s.primary} onClick={()=>setAttempt(value=>value+1)}>Try again</button><button className={s.secondary} onClick={()=>void signOutWebsiteDevice()}>Use another account</button></section></main>;
 return <div className={s.silentGate} aria-hidden="true"/>;
}
