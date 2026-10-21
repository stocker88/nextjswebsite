import {useId,useState} from 'react';
import Link from 'next/link';
import {multiple} from '../lib/earnings';
import type {IndustrySummary} from '../lib/peer-analysis';
import styles from '../styles/PeerAnalysis.module.css';
export default function IndustryExplorer({industries,current,expanded=false}:{industries:IndustrySummary[];current?:string;expanded?:boolean}){
 const id=useId(),[query,setQuery]=useState(''),[showAll,setShowAll]=useState(expanded);
 const matches=industries.filter(i=>i.name.toLowerCase().includes(query.trim().toLowerCase())).sort((a,b)=>Number(b.name===current)-Number(a.name===current)||a.name.localeCompare(b.name));
 const shown=query||showAll?matches:matches.slice(0,8);
 return <section className={styles.card} id="industry-explorer" aria-label="Explore industries"><h3>Explore industries</h3><p>Open an industry for its comparison, valuation and companies.</p><div className={styles.search}><label htmlFor={id} className={styles.srOnly}>Find an industry</label><input id={id} type="search" placeholder="Find an industry" value={query} onChange={e=>setQuery(e.target.value)}/></div><ul className={styles.industries}>{shown.map(i=><li key={i.slug}><Link href={'/industries/'+i.slug+'/'} data-current={i.name===current}><span><strong>{i.name}</strong><small>{i.count} {i.count===1?'company':'companies'}{i.medianPE!=null?` · Median P/E ${multiple(i.medianPE)}`:''}</small>{i.peCount>0&&<small className={styles.coverage}>P/E based on {i.peCount} saved positive {i.peCount===1?'multiple':'multiples'}</small>}</span><span aria-hidden="true">›</span></Link></li>)}</ul>{!matches.length&&<p role="status">No industries match your search.</p>}{!query&&!showAll&&matches.length>8&&<button type="button" className={styles.textButton} onClick={()=>setShowAll(true)}>Show all {industries.length} industries</button>}<p className={styles.note}>U.S.-listed companies from the app’s catalog. Medians use saved positive P/E values; coverage and snapshot dates vary.</p></section>;
}
