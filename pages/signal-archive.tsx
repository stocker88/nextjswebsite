import {useEffect, useState} from 'react';
import ResearchPage from '../components/ResearchPage';
const endpoint = 'https://us-central1-stocker-fcda2.cloudfunctions.net/signalArchivePublic';
type RecordRow = {id:string;commitment:string;capturedAt:string;kind:string;status:string;revealed:boolean;bitcoin?:{timestamp:number;height:number}};
export default function SignalArchive() {
 const [rows,setRows]=useState<RecordRow[]>([]),[next,setNext]=useState<string|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState('');
 async function load(cursor?:string) {
  setBusy(true);setError('');
  try {const response=await fetch(endpoint+(cursor?'?after='+encodeURIComponent(cursor):''));if(!response.ok)throw new Error('Archive temporarily unavailable. Please retry.');const data=await response.json();setRows(old=>cursor?[...old,...data.records]:data.records);setNext(data.next);}
  catch(e){setError(e instanceof Error?e.message:'Could not load archive.');}finally{setBusy(false);}
 }
 useEffect(()=>{void load();},[]);
 return <ResearchPage title="Signal timestamp proofs" path="/signal-archive"><main className="archive">
  <p><a href="/methodology/">← Track record and methodology</a></p><h1>Signal timestamp proofs</h1>
  <p>Public fingerprints let readers check a revealed record without exposing active member research. Originals and corrections are kept as separate entries.</p>
  <p><strong>Pending</strong> means a calendar has accepted the commitment but Bitcoin confirmation has not yet been verified. <strong>Verified</strong> means the proof was checked against Bitcoin data through a public block explorer. You can independently check the downloaded proof with your own Bitcoin node.</p>
  <p>Historical imports retain their recorded signal dates, but their proofs begin when archived—not at the earlier publication date. These proofs establish existence by a verified time, not trade execution, completeness or investment performance.</p>
  <p><a href="https://opentimestamps.org/">OpenTimestamps verification tools ↗</a> · <a href={endpoint}>Public proof index (JSON)</a></p>
  {error&&<p role="alert">{error} <button disabled={busy} onClick={()=>load(next||undefined)}>Retry</button></p>}
  <ul>{rows.map(row=><li key={row.id}><header><strong>{row.kind.replaceAll('-',' ')}</strong><span>{row.status}</span></header>
   <p>Captured {new Date(row.capturedAt).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric',timeZone:'UTC'})}{row.bitcoin&&` · Bitcoin block ${row.bitcoin.height}`}</p>
   <code>{row.commitment}</code><div className="links"><a href={`${endpoint}?id=${row.id}`}>Details</a>{row.status!=='queued'&&<a href={`${endpoint}?id=${row.id}&format=ots`}>Download proof</a>}{row.revealed?<a href={`${endpoint}?id=${row.id}&format=reveal`}>Download revealed record</a>:<span>Signal details private</span>}</div>
  </li>)}</ul>

<br></br>
  <h2>Check a revealed record</h2><p>Download the revealed record and its proof. The SHA-256 hash of the exact record bytes must match the fingerprint above. OpenTimestamps verifies the proof separately. Keep the files unchanged; reformatting JSON changes its hash.</p>
  </main><style jsx>{`.archive{max-width:960px;margin:auto;padding:24px;line-height:1.65}.archive ul{list-style:none;padding:0}.archive li{padding:20px;border:1px solid #344157;border-radius:14px;margin:16px 0;background:#111e30}.archive header,.links{display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between}.archive code{display:block;overflow-wrap:anywhere;font-size:.8rem}.links{justify-content:flex-start;margin-top:14px}.links span{color:#b3bed1}.archive button{padding:10px 18px;border:1px solid #6d6098;border-radius:8px;background:#252542;color:inherit;cursor:pointer}.archive button:disabled{opacity:.6}`}</style></ResearchPage>;
}
