import {stockPageHref} from '../lib/stock-page';
import {CSSProperties, useEffect, useMemo, useRef, useState} from 'react';
import {HeatStock, Period, heatColor, percent, periodScale, tile} from '../lib/market-heatmap';
import styles from '../styles/HeroProductReveal.module.css';

type Props = {rows: HeatStock[]; period: Period; asOf: string};
export default function HeroOverviewHeatmap({rows, period, asOf}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(640);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) setSize(entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const groups = useMemo(() => {
    const byIndustry = new Map<string, {name: string; sector: string; rows: HeatStock[]; weight: number}>();
    for (const row of rows) {
      const name = row.industry || row.sector || 'Unclassified';
      const key = `${row.sector}/${name}`;
      const group = byIndustry.get(key) || {name, sector: row.sector, rows: [], weight: 0};
      group.rows.push(row); group.weight += row.weight && row.weight > 0 ? row.weight : 1;
      byIndustry.set(key, group);
    }
    return tile(Array.from(byIndustry.values()), group => group.weight, size, size);
  }, [rows, size]);
  const change = (row: HeatStock) => row.asOf === asOf ? row.changes[period] : null;
  return <>
    <div ref={ref} className={styles.overviewMap} aria-label={`S&P 500 heatmap, ${rows.length} holdings grouped by industry`}>
      {groups.map(({item: group, x, y, width, height}) => {
        const header = height > 26 && width > 25 ? (size < 450 ? 9 : 13) : 0;
        const gap = size < 450 ? 1 : 2;
        const w = Math.max(1, width - gap * 2), h = Math.max(1, height - header - gap * 2);
        const stocks = tile(group.rows, row => row.weight && row.weight > 0 ? row.weight : 1, w, h);
        return <div key={`${group.sector}/${group.name}`} className={styles.industryGroup} style={{left:`${x / size * 100}%`, top:`${y / size * 100}%`, width:`${width / size * 100}%`, height:`${height / size * 100}%`, '--industry-gap':`${gap}px`} as CSSProperties}>
          {header > 0 && <div className={styles.industryHeading} title={`${group.sector} · ${group.name}`} style={{height:header, fontSize: size < 450 ? 6.5 : 9}}>{group.name}</div>}
          <div className={styles.industryStocks} style={{top:header + gap}}>
            {stocks.map(({item, x: sx, y: sy, width: sw, height: sh}) => {
              const font = Math.max(2, Math.min(size < 450 ? 11 : 19, (sw - 2) / (Math.max(item.symbol.length, 6) * .7), (sh - 2) / 2.7));
              const value = change(item);
              return <a href={stockPageHref(item.symbol)} key={item.symbol} className={styles.overviewTile} data-symbol={item.symbol} aria-label={`${item.name} (${item.symbol}), ${group.name}, ${percent(value)}`} title={`${item.symbol} · ${item.name}\n${group.name} · ${percent(value)}`} style={{left:`${sx / w * 100}%`,top:`${sy / h * 100}%`,width:`${sw / w * 100}%`,height:`${sh / h * 100}%`,fontSize:font,background:heatColor(value,periodScale[period])}}>
                <b>{item.symbol}</b><span>{value === null ? '—' : `${value > 0 ? '+' : ''}${value.toFixed(sw < 34 ? 1 : 2)}%`}</span>
              </a>;
            })}
          </div>
        </div>;
      })}
    </div>
    <div className={styles.overviewDetail}><strong>{rows.length} S&P 500 holdings · Sized by index weight</strong><span>Tap a stock to open its company page. Gray means unavailable data.</span></div>
  </>;
}
