import type {ButtonHTMLAttributes} from 'react';
import styles from '../styles/ShareControl.module.css';
export default function ShareAction({kind='share',children,className='',...props}:ButtonHTMLAttributes<HTMLButtonElement>&{kind?:'share'|'save'}){
 return <button type="button" {...props} className={`${styles.button} ${kind==='save'?styles.save:''} ${className}`}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{kind==='share'?<><path d="M12 15V3m-4 4 4-4 4 4"/><path d="M6 11H4v10h16V11h-2"/></>:<><path d="M12 3v12m-4-4 4 4 4-4"/><path d="M4 16v5h16v-5"/></>}</svg><span>{children}</span></button>;
}
