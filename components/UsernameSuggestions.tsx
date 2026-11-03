import {useEffect,useState} from 'react';
import {availableUsernameSuggestions} from '../lib/profile-onboarding';
import s from '../styles/ProfileOnboarding.module.css';

export default function UsernameSuggestions({value,uid,enabled,onSelect}:{value:string;uid:string;enabled:boolean;onSelect:(name:string)=>void}){
 const [result,setResult]=useState<{key:string;names:string[];failed:boolean}|null>(null);
 const key=JSON.stringify([uid,value]);
 useEffect(()=>{
  if(!enabled||!value.trim())return;
  let active=true;
  const timer=window.setTimeout(()=>void availableUsernameSuggestions(value,uid).then(names=>{if(active)setResult({key,names,failed:false})}).catch(()=>{if(active)setResult({key,names:[],failed:true})}),250);
  return()=>{active=false;window.clearTimeout(timer)};
 },[enabled,key,uid,value]);
 if(!enabled||!value.trim())return null;
 const current=result?.key===key?result:null;
 return <div className={s.usernameSuggestions} aria-live="polite">
  {!current?<p>Finding an available username…</p>:current.names.length?<><p>Try an available username:</p>{current.names.map(name=><button type="button" key={name} onClick={()=>onSelect(name)} aria-label={`Use username ${name}`}><strong>{name}</strong><span>Use this →</span></button>)}</>:<p>{current.failed?'Couldn’t check suggestions. You can edit your username and try again.':'Try adding a short word to your username.'}</p>}
 </div>;
}
