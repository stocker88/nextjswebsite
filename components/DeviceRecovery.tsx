import {useState} from 'react';
import AccountDevices from './AccountDevices';
import DeviceUpgrade from './DeviceUpgrade';
import {refreshDeviceAllowance,signOutWebsiteDevice,type DeviceList} from '../lib/account-devices';
import s from '../styles/DeviceRecovery.module.css';
export default function DeviceRecovery({removedUntil,onChanged}:{removedUntil?:string;onChanged:()=>void}){
 const [view,setView]=useState<'main'|'manage'|'upgrade'>('main'),[status,setStatus]=useState<DeviceList|null>(null),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 async function upgrade(){setBusy(true);setError('');try{const result=await refreshDeviceAllowance();setStatus({...result,devices:[],canSupportSkip:false,nextReplacementAt:null});setView('upgrade')}catch{setError('Could not load device plans. Please try again.')}finally{setBusy(false)}}
 return <main className={s.page}><section className={s.card}><h1>{removedUntil?'This device was removed':'Device limit reached'}</h1><p>{removedUntil?'This device can reconnect after the 15-day waiting period. Add more device slots to reconnect sooner. The restriction ends if this account no longer has an active paid membership.':'Your account has reached its device allowance. Manage your connected devices or add more slots to continue here.'}</p>{removedUntil&&<p className={s.date}>Available again: {new Date(removedUntil).toLocaleString()}</p>}{view==='main'?<div className={s.actions}><button disabled={busy} onClick={()=>void upgrade()}>{busy?'Loading…':'Add more device slots'}</button><button className={s.secondary} onClick={()=>removedUntil?void signOutWebsiteDevice():setView('manage')}>{removedUntil?'Back to sign in':'Manage signed-in devices'}</button></div>:<><button className={s.secondary} onClick={()=>{setView('main');onChanged()}}>Back</button>{view==='manage'?<AccountDevices onChanged={onChanged}/>:status&&<DeviceUpgrade status={status} forceShow/>}</>}{error&&<p role="alert">{error}</p>}</section></main>;
}
