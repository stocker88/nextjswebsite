import {useEffect,useState,type ReactNode} from 'react';
import {useRouter} from 'next/router';
import Head from 'next/head';
import {isDesktopDevice} from '../lib/device-access';
import {isMobileAccountPath} from '../lib/mobile-app';
import MobileStoreLink from './MobileStoreLink';
import styles from '../styles/AccountLogin.module.css';
export default function MobileAppBoundary({children}:{children:ReactNode}){
 const router=useRouter();
 const [mobile,setMobile]=useState<boolean|null>(null);
 useEffect(()=>setMobile(!isDesktopDevice(navigator)),[]);
 if(!isMobileAccountPath(router.pathname))return <>{children}</>;
 // Resolve the device before mounting sign-in, onboarding or checkout effects.
 if(mobile===null)return null;
 if(!mobile)return <>{children}</>;
 return <><Head><title>Get the app | Stocks To Buy Now AI</title></Head><main className={styles.page}><section className={styles.card}>
  <img src="/assets/images/stockerRobotIcon.png" alt="Stocks To Buy Now AI" width="80" height="80"/>
  <h1>Get the app</h1><p>Create your account and get started in the app.</p>
  <MobileStoreLink placement="mobile_account_handoff"/>
 </section></main></>;
}
