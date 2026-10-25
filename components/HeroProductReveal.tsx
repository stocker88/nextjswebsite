import MarketMovers from './MarketMovers';
import extendedStyles from '../styles/ExtendedHours.module.css';
import {scheduleMarketRefresh} from '../lib/scheduled-market-refresh';
import {useDefaultMarketView} from '../lib/use-default-market-view';
import ExtendedHoursSnapshot from './ExtendedHoursSnapshot';
import savedExtended from '../data/extended-hours.json';
import {ExtendedSession} from '../lib/extended-hours';
import HeroOverviewHeatmap from './HeroOverviewHeatmap';
import HeroMarketPulse from './HeroMarketPulse';
import HeroFeatureExplorer from './HeroFeatureExplorer';
import { useEffect, useRef, useState } from 'react';
import snapshot from '../data/hero-market-preview.json';
import { HeatStock, HeatSnapshot, heatmapEndpoint, validSnapshot } from '../lib/market-heatmap';
import styles from '../styles/HeroProductReveal.module.css';


const savedDate = new Date(snapshot.asOf + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

/** Isolated hero experiment. Remove its single Home.tsx mount to revert. */
export default function HeroProductReveal() {
  const root = useRef<HTMLDivElement>(null);
  const [latest, setLatest] = useState<HeatSnapshot | null>(null);
  const date = latest?.overviewRows?.length ? new Date(latest.asOf + 'T12:00:00Z').toLocaleDateString('en-US', {month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}) : savedDate;
  const stocks = latest?.overviewRows?.length ? latest.overviewRows : snapshot.stocks as HeatStock[];
  useEffect(() => {
    const controller = new AbortController();
    let pending = false;
    let queued = false;
    const refresh = async () => {
      if (document.visibilityState === 'hidden') return;
      if (pending) { queued = true; return; }
      pending = true;
      try {
        const response = await fetch(heatmapEndpoint, {signal: controller.signal, cache: 'no-store'});
        if (!response.ok) throw new Error('Market feed unavailable');
        const data = await response.json();
        if (validSnapshot(data) && (!data.overviewRows || validSnapshot({...data, rows:data.overviewRows})) && !controller.signal.aborted) setLatest(previous => !previous || data.asOf >= previous.asOf ? data : previous);
      } catch { /* Retain the last successfully loaded, dated snapshot. */ }
      finally { pending = false; if (queued && !controller.signal.aborted) { queued = false; void refresh(); } }
    };
    void refresh();
    const stop = scheduleMarketRefresh(refresh);
    return () => { controller.abort(); stop(); };
  }, []);
  const [view,selectView] = useDefaultMarketView();
  const sessionKind = view==='preMarket'||view==='afterHours' ? view : null;
  const period = sessionKind ? 'day' : view as 'day'|'week'|'month'|'year';
  const options = [{id:'day',label:'1D'}, {id:'week',label:'1W'}, {id:'month',label:'1M'}, {id:'year',label:'1Y'}] as const;
  const label = options.find(option => option.id === period)!.label;
  const periodSelector = (ariaLabel: string) => <div className={styles.periods} role="group" aria-label={ariaLabel}>
    <button type="button" className={styles.appPeriod} aria-pressed={sessionKind==='preMarket'} onClick={() => selectView('preMarket')}>Pre-Market</button>
    <button type="button" className={styles.appPeriod} aria-pressed={sessionKind==='afterHours'} onClick={() => selectView('afterHours')}>After-Hours</button>
    {options.map(option => <button type="button" key={option.id} aria-pressed={!sessionKind&&period===option.id} onClick={() => selectView(option.id)}>{option.label}</button>)}
  </div>;
  const sectionSelector=(name:string)=><div className={`${styles.mobileHeatControls} ${styles.sectionPeriodControls}`}>{periodSelector(name)}</div>;
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const heading = element.querySelector<HTMLElement>('[data-preview-heading]');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const draw = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      element.dataset.scrollStarted=String(window.scrollY>8);
      if (heading) {
        // A tall viewport can include this heading before the visitor scrolls.
        // Keep it hidden at the top, even with reduced motion enabled.
        if (window.scrollY <= 24) heading.dataset.titleVisible = 'false';
        else if (heading.getBoundingClientRect().top < window.innerHeight * .85) {
          heading.dataset.titleVisible = 'true';
        }
      }
      // Continue the exact lower-left hero glow across the section boundary.
      const halo = document.querySelector('.hero-atmosphere i:last-child')?.getBoundingClientRect();
      if (halo) {
        element.style.setProperty('--halo-x', `${halo.left - rect.left}px`);
        element.style.setProperty('--halo-y', `${halo.top - rect.top}px`);
        element.style.setProperty('--halo-w', `${halo.width}px`);
        element.style.setProperty('--halo-h', `${halo.height}px`);
      }
      const p = reduced.matches ? 1 : Math.max(0, Math.min(1, (window.innerHeight - rect.top) / Math.min(window.innerHeight * .85, 690)));
      element.style.setProperty('--reveal', p.toFixed(4));
      element.style.setProperty('--draw', String(Math.max(0, Math.min(1, (p - .12) / .76))));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
    const observer = new IntersectionObserver(entries => {
      window.removeEventListener('scroll', schedule);
      if (entries[0].isIntersecting) window.addEventListener('scroll', schedule, { passive: true });
      schedule();
    }, { rootMargin: '100px' });
    observer.observe(element);
    window.addEventListener('resize', schedule);
    reduced.addEventListener('change', schedule);
    draw();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      reduced.removeEventListener('change', schedule);
    };
  }, []);

  return <div ref={root} className={styles.reveal} id="product-reveal" tabIndex={-1}>
    <div className={styles.gradientTail} aria-hidden="true"><i /></div>
    <div data-preview-heading data-title-visible="false" className={styles.heading}>
      <span className={styles.eyebrow}>A CLEARER VIEW OF THE MARKET</span>
      <h2>Every move.<br className={styles.mobileBreak} /> More perspective.</h2>
      <p>From the big picture to the details that matter.</p>
    </div>
    <div className={styles.scene}>
      <div className={styles.halo} aria-hidden="true" />
      <div className={styles.dashboard}>
        <div className={styles.topbar}>
          <div className={styles.brand}><img src="/assets/images/stockerRobotIcon.png" width="30" height="30" alt="" /><span>Stocks to Buy Now<span className={styles.brandAI}> AI</span></span></div>
          <span className={styles.previewLabel}><i /> PRODUCT PREVIEW</span>
        </div>
        <div className={styles.toolbar}>
          <div><span className={styles.eyebrow}>THE BIG PICTURE</span><h3>Market overview</h3></div>
          <div className={styles.previewControls}>
            {periodSelector('Market overview period')}
            <span className={styles.snapshot}>{sessionKind?'Free extended-hours snapshot':`Saved snapshot · ${date}`}</span>
          </div>
        </div>
        {sessionKind?<div style={{padding:'0 24px 24px'}}><div className={styles.mobileHeatControls}>{periodSelector('Extended-hours period')}</div><ExtendedHoursSnapshot embedded kind={sessionKind} session={(latest?.[sessionKind] || savedExtended[sessionKind]) as ExtendedSession} moversControls={sectionSelector('Top movers period')} pulseControls={sectionSelector('Market pulse period')}/></div>:<div className={styles.regularSnapshot}><div className={styles.mobileHeatControls}>{periodSelector('Regular-session period')}</div><div className={`${extendedStyles.grid} ${extendedStyles.dashboardGrid}`}><div className={extendedStyles.marketColumn}>
          <div className={styles.heatPanel}>
            <div className={styles.panelHeading}><span>S&P 500 by industry</span><span className={styles.tag}>{label}</span></div>
            <HeroOverviewHeatmap rows={stocks} period={period} asOf={latest?.overviewRows?.length ? latest.asOf : snapshot.asOf} />
            <a className={styles.panelLink} href="/stock-market-heatmap/">Explore the full heatmap <span aria-hidden="true">↗</span></a>
          </div>
          <div className={extendedStyles.sessionPulse}><HeroMarketPulse compact latest={latest} period={period} label={label} periodControls={sectionSelector('Market pulse period')}/></div></div>
          <MarketMovers rows={latest?.moverRows ?? stocks} period={period} label={label} periodControls={sectionSelector('Top movers period')}/>
        </div></div>
        }
        <div className={styles.bottomBar}><span><i /> Perspective starts here.</span><span>Research <b>·</b> Compare <b>·</b> Understand</span></div>
      </div>
    </div>
    <div className={styles.footnote}>Product preview · Saved market data · Treasury: Federal Reserve via FRED</div>
    <HeroFeatureExplorer />
  </div>;
}
