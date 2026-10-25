import DesktopAppLink from './DesktopAppLink';
import ShareControl from './ShareControl';
import type {HeatSnapshot} from '../lib/market-heatmap';
import type {ReactNode} from 'react';
import {dailyPreviewChange} from '../lib/market-preview';
import snapshot from '../data/market-pulse-periods.json';
import MorphSparkline from './MorphSparkline';
import styles from '../styles/HeroProductReveal.module.css';

const signed = (value: number, digits: number) => `${value > 0 ? '+' : ''}${value.toFixed(digits)}`;
const dateLabel = (value: string) => new Date(value + 'T12:00:00Z').toLocaleDateString('en-US', {month:'short',day:'numeric',timeZone:'UTC'});

export default function HeroMarketPulse({latest, period, label, periodControls,compact=false}:{latest?:HeatSnapshot|null;period: "day"|"week"|"month"|"year";label:string;periodControls?:ReactNode;compact?:boolean}) {
  const rows = period === 'day' ? snapshot.periods.week.map(row => {
    if (row.yieldRate) {
      const observations = latest?.preMarket?.analyticsContext?.treasury?.[row.id];
      const previous = observations?.[observations.length - 2], current = observations?.[observations.length - 1];
      if (previous && current && current.date >= row.asOf && Number.isFinite(previous.value) && Number.isFinite(current.value)) {
        return {...row, value: current.value, change: (current.value - previous.value) * 100, asOf: current.date};
      }
    }
    if (row.yieldRate || !latest) return {...row, change: dailyPreviewChange(row)};
    const quote = latest.pulse?.[row.id];
    const available = quote && Number.isFinite(quote.price) && Number.isFinite(quote.previousClose) && quote.previousClose > 0 && quote.quotedAt?.startsWith(latest.asOf);
    return {...row, change: available ? (quote.price / quote.previousClose - 1) * 100 : null, asOf: available ? quote.quotedAt.slice(0,10) : latest.asOf};
  }) : snapshot.periods[period];
  return <section className={`${styles.pulsePanel} ${compact?styles.compactPulse:''}`} aria-label={`Market pulse · ${label}`}>
    {periodControls}
    <div className={styles.panelHeading}><strong>Market pulse</strong><span className={styles.tag}>{label}</span></div>
    <div className={styles.pulseShare}><ShareControl title="Market pulse" path={`/?period=${period}#product-reveal`} subtitle={`${label} · Price moves / Treasury changes in bp`} rows={rows.filter(r=>r.id!=='DGS30').map(r=>({label:r.name,value:r.yieldRate?`${r.value.toFixed(2)}% (${r.change===null?'—':signed(r.change,0)} bp)`:r.change===null?'Unavailable':`${signed(r.change,2)}%`,detail:`${r.detail} · ${r.asOf}`}))}/></div>
    <p className={styles.pulseNote}>Price moves · Treasury changes in bp</p>
    <div className={styles.pulseGrid}>
      {rows.filter(row => row.id !== 'DGS30').map(row => <article data-depth-card key={row.id} className={styles.pulseCard} data-tone={row.yieldRate ? 'yield' : row.change === null ? 'unavailable' : row.change >= 0 ? 'positive' : 'negative'}>
        <h4>{row.name}</h4><p>{row.detail}</p>
        <div className={styles.pulseValue}>{row.yieldRate ? `${row.value.toFixed(2)}%` : row.change === null ? 'Unavailable' : `${signed(row.change,2)}%`}</div>
        {row.yieldRate && <span className={styles.pulseDelta}>{row.change === null ? 'Change unavailable' : `${signed(row.change,0)} bp`}</span>}
        {period !== 'day' && <svg viewBox="0 0 150 40" className={styles.pulseSpark} aria-hidden="true"><MorphSparkline points={row.points} /></svg>}
        <time dateTime={row.asOf}>{dateLabel(row.asOf)}</time>
      </article>)}
    </div>
    <DesktopAppLink className={styles.panelLink} href="https://apps.apple.com/us/app/stocks-to-buy-now-ai-signals/id1565527320">{'Explore Market pulse in the app ↗'}</DesktopAppLink>
  </section>;
}
