import {useEffect,useState} from 'react';
import Link from 'next/link';
import {mobileStoreUrl} from '../lib/mobile-app';
import styles from '../styles/MarketResearchNextSteps.module.css';
export default function MarketResearchNextSteps(){
 const [store,setStore]=useState(mobileStoreUrl(''));
 useEffect(()=>setStore(mobileStoreUrl(navigator.userAgent)),[]);
 return <aside className={styles.card} aria-label="Explore market research"><div><h2>Go deeper into the market</h2><p>Explore stock research, member insights and market alerts with Stocks To Buy Now.</p></div><Link className={styles.desktop} href="/membership/">Get Pro →</Link><a className={styles.mobile} href={store}>Explore in the app →</a></aside>;
}
