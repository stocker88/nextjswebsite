import HeroMarketPulse from './HeroMarketPulse';
import HeroFeatureExplorer from './HeroFeatureExplorer';
import { CSSProperties, useEffect, useRef, useState } from 'react';
import snapshot from '../data/hero-market-preview.json';
import { heatColor, percent, tile } from '../lib/market-heatmap';
import styles from '../styles/HeroProductReveal.module.css';


const date = new Date(snapshot.asOf + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

/** Isolated hero experiment. Remove its single Home.tsx mount to revert. */
export default function HeroProductReveal() {
  const root = useRef<HTMLDivElement>(null);
  const heatRef = useRef<HTMLDivElement>(null);
  const [mapSize, setMapSize] = useState({width:400,height:290});
  const tiles = tile(snapshot.stocks, row => row.weight, mapSize.width, mapSize.height);
  useEffect(() => {
    const map = heatRef.current;
    if (!map) return;
    const observer = new ResizeObserver(([entry]) => {
      const width = Math.round(entry.contentRect.width), height = Math.round(entry.contentRect.height);
      if (width > 0 && height > 0) setMapSize(previous => previous.width===width && previous.height===height ? previous : {width,height});
    });
    observer.observe(map);
    return () => observer.disconnect();
  }, []);
  const [period, setPeriod] = useState<'week'|'month'|'year'>('year');
  const options = [{id:'week',label:'1W'}, {id:'month',label:'1M'}, {id:'year',label:'1Y'}] as const;
  const label = options.find(option => option.id === period)!.label;
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const heading = element.querySelector<HTMLElement>('[data-preview-heading]');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const draw = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
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

  return <div ref={root} className={styles.reveal} id="product-reveal">
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
        <div className={styles.toolbar}><div><span className={styles.eyebrow}>THE BIG PICTURE</span><h3>Market overview</h3></div><div className={styles.previewControls}><span className={styles.snapshot}>Saved snapshot · {date}</span><div className={styles.periods} role="group" aria-label="Market overview period">{options.map(option => <button type="button" key={option.id} aria-pressed={period===option.id} onClick={() => setPeriod(option.id)}>{option.label}</button>)}</div></div></div>
        <div className={styles.panels}>
          <HeroMarketPulse period={period} label={label} />
          <div className={styles.heatPanel}>
            <div className={styles.panelHeading}><span>Market leaders</span><span className={styles.tag}>{label}</span></div>
            <div ref={heatRef} className={styles.heatmap} role="img" aria-label={`${label} performance of fourteen leading S&P 500 holdings, ${date}`}>
              {tiles.map(({item,x,y,width,height}, index)=><div key={item.symbol} className={styles.tile} style={{left:`${x/mapSize.width*100}%`,top:`${y/mapSize.height*100}%`,width:`${width/mapSize.width*100}%`,height:`${height/mapSize.height*100}%`,'--tile-color':heatColor(item.changes[period],period==='year'?60:period==='month'?12:6),'--order':index} as CSSProperties}><div><b>{item.symbol}</b><span>{percent(item.changes[period])}</span></div></div>)}
            </div>
            <a className={styles.panelLink} href="/stock-market-heatmap/">Explore the full heatmap <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div className={styles.bottomBar}><span><i /> Perspective starts here.</span><span>Research <b>·</b> Compare <b>·</b> Understand</span></div>
      </div>
    </div>
    <div className={styles.footnote}>Product preview · Saved market data · Treasury: Federal Reserve via FRED</div>
    <HeroFeatureExplorer />
  </div>;
}
