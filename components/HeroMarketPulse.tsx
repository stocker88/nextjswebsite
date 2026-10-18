import snapshot from '../data/market-pulse-periods.json';
import MorphSparkline from './MorphSparkline';
import styles from '../styles/HeroProductReveal.module.css';

const signed = (value: number, digits: number) => `${value > 0 ? '+' : ''}${value.toFixed(digits)}`;
const dateLabel = (value: string) => new Date(value + 'T12:00:00Z').toLocaleDateString('en-US', {month:'short',day:'numeric',timeZone:'UTC'});

export default function HeroMarketPulse({period, label}:{period: "week"|"month"|"year";label:string}) {
  return <section className={styles.pulsePanel} aria-label={`Market pulse · ${label}`}>
    <div className={styles.panelHeading}><strong>Market pulse</strong><span className={styles.tag}>{label}</span></div>
    <p className={styles.pulseNote}>Price moves · Treasury changes in bp</p>
    <div className={styles.pulseGrid}>
      {snapshot.periods[period].map(row => <article data-depth-card key={row.id} className={styles.pulseCard} data-tone={row.yieldRate ? 'yield' : row.change >= 0 ? 'positive' : 'negative'}>
        <h4>{row.name}</h4><p>{row.detail}</p>
        <div className={styles.pulseValue}>{row.yieldRate ? `${row.value.toFixed(2)}%` : `${signed(row.change,2)}%`}</div>
        {row.yieldRate && <span className={styles.pulseDelta}>{signed(row.change,0)} bp</span>}
        <svg viewBox="0 0 150 40" className={styles.pulseSpark} aria-hidden="true"><MorphSparkline points={row.points} /></svg>
        <time dateTime={row.asOf}>{dateLabel(row.asOf)}</time>
      </article>)}
    </div>
    <a className={styles.panelLink} href="https://apps.apple.com/us/app/stocks-to-buy-now-ai-signals/id1565527320">Explore Market pulse in the app <span aria-hidden="true">↗</span></a>
  </section>;
}
