import {useEffect, useState} from 'react';
import {Disclosure, actionLabel, money, count, displayDate, positive, negative, validSnapshot} from '../lib/smart-money';
import {useSiteAccount} from './SiteAccount';
import {refreshMembershipStatus, MembershipStatus} from '../lib/membership-status';
import {bandAccess} from '../lib/band-access';
import {accountLoginUrl} from '../lib/site-auth';
import styles from '../styles/StockSmartMoney.module.css';
const categories = [['all','All'],['insiders','Insiders'],['funds','Funds'],['politicians','Politicians']];
export default function StockSmartMoney({symbol}:{symbol:string}) {
  const {user,ready}=useSiteAccount();
  const uid=user?.uid;
  const [verified,setVerified]=useState<{uid:string;status:MembershipStatus}|null>(null);
  const [checkFailed,setCheckFailed]=useState(false);
  const [retry,setRetry]=useState(0);
  // A signed-out uid and optional verified?.uid are both undefined; that is not a verified account.
  const membership=uid&&verified&&verified.uid===uid?verified.status:null;
  const access=ready?bandAccess(!!uid,membership):'checking';
  const allowed=access==='allowed';
  useEffect(()=>{
    setVerified(null);setCheckFailed(false);
    if(!uid)return;
    let active=true;
    refreshMembershipStatus(uid).then(status=>{
      if(active){setVerified({uid,status});setCheckFailed(status.status==='unknown'||status.billingVerified!==true);}
    }).catch(()=>{if(active)setCheckFailed(true)});
    return()=>{active=false};
  },[uid,retry]);
  const [items,setItems]=useState<Disclosure[]>([]),[category,setCategory]=useState('all'),[limit,setLimit]=useState(8),[asOf,setAsOf]=useState<string|null>(null),[notice,setNotice]=useState('');
  const [loading,setLoading]=useState(false);
  useEffect(()=>{
    setItems([]);setAsOf(null);setLimit(8);setCategory('all');setNotice('');setLoading(allowed);
    if(!allowed)return;
    let active=true;
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),15000);
    fetch('https://us-central1-stocker-fcda2.cloudfunctions.net/smartMoneySnapshot',{signal:controller.signal}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(data=>{
      if(!active)return;
      if(!validSnapshot(data))throw Error();
      {
        setItems(data.items.filter(r=>r.symbol.toUpperCase()===symbol.toUpperCase()));setAsOf(data.updatedAt);
      }
      setNotice(data.stale?'Showing saved disclosures.':'');
    }).catch(()=>{if(active)setNotice('Smart Money activity is temporarily unavailable.');}).finally(()=>{clearTimeout(timer);if(active)setLoading(false);});
    return()=>{active=false;clearTimeout(timer);controller.abort();};
  },[symbol,allowed,uid]);
  const rows=items.filter(r=>category==='all'||r.category===category).sort((a,b)=>b.filedDate.localeCompare(a.filedDate)||a.id.localeCompare(b.id));
  return <section className={styles.section} aria-label={`${symbol} Smart Money activity`}>
    <h2>Smart Money activity</h2>
    <p>Recent insider and politician transactions, and disclosed fund positions for {symbol}.</p>
    <div className={styles.filters} role="group" aria-label="Activity category">{categories.map(([id,label])=><button key={id} aria-pressed={category===id} onClick={()=>{setCategory(id);setLimit(8)}}>{label}</button>)}</div>
    {!allowed?<div className={styles.gate}>
      <strong>Get Pro to see what insiders are doing ahead of earnings.</strong>
      <p>Explore insider trades, fund holdings and politician activity with an active Pro membership.</p>
      {access==='checking' ? checkFailed ? <button onClick={()=>setRetry(n=>n+1)}>Retry membership check</button> : <p role="status">Checking membership…</p> : <a href={uid?'/membership/':accountLoginUrl('/membership/')}>{uid?'Get Pro':'Sign in to access Pro'}</a>}
    </div>:<>
    {loading&&<p role="status">Loading Smart Money activity…</p>}
    <small>{rows.length} records · Latest filed first{asOf?` · Updated ${displayDate(asOf)}`:''}</small>
    {notice&&<p role="status">{notice}</p>}
    {!loading&&!notice&&!rows.length&&<p>No {category==='all'?'':category+' '}disclosures for {symbol} in the available snapshot.</p>}
    {rows.slice(0,limit).map(r=><details key={r.id} className={styles.row}><summary>
      <span><strong>{r.investor}</strong><small>{categories.find(c=>c[0]===r.category)?.[1]} · Filed {displayDate(r.filedDate)}</small></span>
      <span className={styles.value}><strong style={{color:positive(r.action)?'#7edcc3':negative(r.action)?'#f18d9f':'#c5b0f5'}}>{actionLabel(r.action)}</strong><small>{r.category==='funds'?`${count(r.shares)} shares`:r.amount|| (r.value!==null?money(r.value):r.shares!==null?`${count(r.shares)} shares`:'Value not supplied')}</small></span>
    </summary><div className={styles.detail}>
      <p>{r.category==='funds'?`Quarter end: ${displayDate(r.period)} · Share change: ${count(r.changeShares)} · Reported position value: ${money(r.value)}`:`Transaction: ${displayDate(r.eventDate)} · ${r.role||''}${r.owner?' · '+r.owner:''}`}</p>
      {r.securityType&&<p>Security: {r.securityType}</p>}
      {r.sourceUrl&&/^https:\/\/(www\.)?(sec\.gov|disclosures-clerk\.house\.gov|efdsearch\.senate\.gov)\//.test(r.sourceUrl)&&<a href={r.sourceUrl} target="_blank" rel="noopener noreferrer">Original filing ↗</a>}
    </div></details>)}
    {rows.length>limit&&<button className={styles.more} onClick={()=>setLimit(n=>n+12)}>Show more ({rows.length-limit})</button>}
    <p className={styles.note}>Disclosures can lag activity. Fund entries are quarter-end 13F positions and changes, not individual trades. Coverage is limited to available filings.</p>
    </>}
  </section>;
}
