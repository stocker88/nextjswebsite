import {useEffect,useRef,type KeyboardEvent} from 'react';
import type {DeviceNotice} from '../lib/account-devices';
import {accountLoginUrl} from '../lib/site-auth';
import s from '../styles/DeviceCapacityNotice.module.css';
export default function DeviceCapacityNotice({notice,onDismiss}:{notice:DeviceNotice;onDismiss:()=>void}){
 const warning=notice.kind==='warning',card=useRef<HTMLElement>(null);
 useEffect(()=>{const previous=document.activeElement;card.current?.querySelector<HTMLElement>('a,button')?.focus();return()=>{if(previous instanceof HTMLElement)previous.focus()}},[notice.id,notice.kind]);
 function keyboard(event:KeyboardEvent<HTMLElement>){
  if(event.key==='Escape'&&warning){event.preventDefault();onDismiss();return;}
  if(event.key!=='Tab')return;const controls=Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a,button')),first=controls[0],last=controls.at(-1);
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}
 }
 return <div className={s.overlay}><section ref={card} onKeyDown={keyboard} className={s.card} role="alertdialog" aria-modal="true" aria-labelledby="device-capacity-title"><span className={s.eyebrow}>YOUR CONNECTED DEVICES</span><h2 id="device-capacity-title">{warning?'Keep your devices connected':'Device limit reached'}</h2><p>{notice.message}</p>{warning&&<p><strong>Resolve by {new Date(notice.deadlineAt).toLocaleString()}.</strong></p>}<div className={s.actions}>{warning?<><a href="/account/?devices=upgrade#more-devices" onClick={onDismiss}>Add more slots</a><a href="/account/#devices-title" onClick={onDismiss}>Manage devices</a><button onClick={onDismiss}>Not now</button></>:<a href={accountLoginUrl('/account/')} onClick={onDismiss}>Sign in to manage devices</a>}</div></section></div>;
}
