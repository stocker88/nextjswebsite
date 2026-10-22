import { useState } from 'react';
import { createAcquisitionRecoveryCode } from '../lib/acquisition';

export default function ReferralRecovery() {
  const [code,setCode]=useState(''),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
  const generate=async()=>{setBusy(true);setMessage('');try{setCode(await createAcquisitionRecoveryCode());}catch(_){setMessage('Could not create a code. Please try again.');}finally{setBusy(false);}};
  return <details style={{margin:'20px auto',maxWidth:420,color:'#c5cde1',fontSize:14,textAlign:'left'}}>
    <summary style={{cursor:'pointer'}}>Keep your referral when installing (optional)</summary>
    <p style={{fontSize:14,lineHeight:1.6,fontWeight:400,textTransform:'none',letterSpacing:0,color:'#c5cde1'}}>Save a code before installing. Enter it at signup to connect this website visit to your account. It expires in 7 days.</p>
    {!code?<button type="button" onClick={generate} disabled={busy} style={{color:'#d0b6ff',padding:'10px 14px',border:'1px solid #78629f',borderRadius:12,background:'#191b31'}}>{busy?'Creating…':'Create referral code'}</button>:<><code style={{display:'block',fontSize:18,letterSpacing:1,marginBottom:8}}>{code}</code><button type="button" onClick={async()=>{try{await navigator.clipboard.writeText(code);setMessage('Copied. Keep this code until signup.');}catch(_){setMessage('Select and copy the code above.');}}}>Copy code</button></>}
    <p role="status" style={{fontSize:14,fontWeight:400,textTransform:'none',letterSpacing:0}}>{message}</p>
  </details>;
}
