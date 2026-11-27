import LocalizedContent from './localization/LocalizedContent';
import type {onboardingQuestions} from '../lib/profile-onboarding';
import s from '../styles/ProfileOnboarding.module.css';

export function QuestionProgress({current,total}:{current:number;total:number}){
 const remaining=total-current;
 return <LocalizedContent><div className={s.questionProgress}>
  <div className={s.questionProgressTop}><strong>QUICK QUESTIONS</strong><span aria-hidden="true">{current} <small>/ {total}</small></span></div>
  <div className={s.questionSegments} role="progressbar" aria-label="Question progress" aria-valuemin={1} aria-valuemax={total} aria-valuenow={current} aria-valuetext={`Question ${current} of ${total}`}>
   {Array.from({length:total},(_,i)=><i key={i} className={i<current?s.segmentActive:undefined}/>)}
  </div>
  <p role="status">{remaining===0?'Last question — your results are next.':`${remaining} more ${remaining===1?'question':'questions'} after this, then your results.`}</p>
 </div></LocalizedContent>;
}

export default function OnboardingQuestion({current,progressCurrent=current,progressTotal,questions,answer,onBack,onSelect}:{current:number;progressCurrent?:number;progressTotal?:number;questions:typeof onboardingQuestions;answer:string;onBack?:()=>void;onSelect:(value:string)=>void}){
 const question=questions[current-1];
 return <LocalizedContent><div className={s.content}>
  {onBack&&<button className={s.back} type="button" onClick={onBack}>← Back</button>}
  <QuestionProgress current={progressCurrent} total={progressTotal??questions.length}/>
  <h1 id="profile-onboarding-title">{question.title}</h1><p className={s.lead}>{question.subtitle}</p>
  <div className={s.choices}>{question.options.map(option=><button key={option} type="button" className={answer===option?s.selected:''} onClick={()=>onSelect(option)}>{option}<span aria-hidden="true">→</span></button>)}</div>
 </div></LocalizedContent>;
}
