import type {ReactNode} from 'react';
import {ExtendedSession,SessionKind,sessionInfo} from '../lib/extended-hours';
import {sessionPulseRows} from '../lib/session-pulse';
import {percent} from '../lib/market-heatmap';
import styles from '../styles/HeroProductReveal.module.css';
export default function SessionMarketPulse({session,kind,formatTime,periodControls}:{session:ExtendedSession;kind:SessionKind;formatTime:(value:string)=>string;periodControls?:ReactNode}) {
 return <section className={styles.pulsePanel} aria-label={`Market pulse · ${sessionInfo[kind].label}`}>{periodControls}<div className={styles.panelHeading}><strong>Market pulse</strong><span className={styles.tag}>{sessionInfo[kind].label}</span></div><p className={styles.pulseNote}>Price moves versus the {sessionInfo[kind].basis}. Quote times shown for each instrument.</p><div className={`${styles.pulseGrid} ${styles.widePulseGrid}`}>{sessionPulseRows(session,kind).map(row=><article key={row.id} className={styles.pulseCard} data-tone={row.change===null?'unavailable':row.change>=0?'positive':'negative'}><h4>{row.name}</h4><p>{row.detail}</p><div className={styles.pulseValue}>{percent(row.change)}</div>{row.quotedAt?<time dateTime={row.quotedAt}>{formatTime(row.quotedAt)}</time>:<small>No usable quote in this session</small>}</article>)}</div></section>;
}
