import {heroGroupGeometry,heroTileFont,heroTileValue} from '../lib/hero-heatmap-layout';
import HeatmapShare from './heatmap/HeatmapShare';
import {stockPageHref} from '../lib/stock-page';
import {CSSProperties, useEffect, useMemo, useRef, useState} from 'react';
import {HeatStock, Period, heatColor, percent, periodScale, tile, TileSizing, HeatGrouping, stockGroups, stockWeight, fixedGroupTiles} from '../lib/market-heatmap';
import styles from '../styles/HeroProductReveal.module.css';

type Props = {maxHeight?:number; rows: HeatStock[]; period: Period; asOf: string; sessionLabel?:string; sharePath?:string; actions?:boolean; details?:boolean; sizing?:TileSizing; grouping?:HeatGrouping; universe?:HeatStock[]; colorblind?:boolean; fixed?:boolean; groupNames?:string[]};
export default function HeroOverviewHeatmap({rows, period, asOf, sessionLabel, sharePath, actions=true, details=true, sizing="weight", grouping="industry", universe=rows, colorblind=false, fixed=false, groupNames=[], maxHeight}: Props) {
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
  const mapHeight = maxHeight ? Math.min(size, maxHeight) : size;
  const weight = (row:HeatStock) => stockWeight(row,sizing,universe);
  const groups = useMemo(() => {
    const grouped=stockGroups(rows,grouping);
    return fixed?fixedGroupTiles(grouped,groupNames,size,mapHeight):tile(grouped,group=>group.rows.reduce((sum,row)=>sum+stockWeight(row,sizing,universe),0),size,mapHeight);
  }, [rows,size,mapHeight,grouping,sizing,universe,fixed,groupNames]);
  const change = (row: HeatStock) => row.asOf === asOf ? row.changes[period] : null;
  return <>
    {actions&&<div style={{display:'flex',justifyContent:'flex-end',marginBottom:10,alignItems:'center',gap:8,flexWrap:'wrap'}}><HeatmapShare rows={rows.map(r=>r.asOf===asOf?r:{...r,changes:{...r.changes,[period]:null}})} period={period} asOf={asOf} sector="all" sizing={sizing} grouping={grouping} universe={universe} sessionLabel={sessionLabel} viewUrl={`https://www.stockstobuynow.ai${sharePath||'/stock-market-heatmap/'}?period=${period}${sharePath?.includes('premarket')?'&session=preMarket':sharePath?.includes('after-hours')?'&session=afterHours':''}`} direction="all" colorblind={colorblind} fixed={fixed} groupNames={groupNames} renderSize={size}/></div>}
    <div ref={ref} className={styles.overviewMap} style={maxHeight ? {height:mapHeight,aspectRatio:"auto"} : undefined} aria-label={`S&P 500 heatmap, ${rows.length} holdings grouped by ${grouping}`}>
      {groups.map(groupTile => {
        const {item:group,x,y,width,height}=groupTile;
        const {header,gap,width:w,height:h,cells:stocks}=heroGroupGeometry(groupTile,size,weight);
        return <div key={group.name} className={styles.industryGroup} style={{left:`${x / size * 100}%`, top:`${y / mapHeight * 100}%`, width:`${width / size * 100}%`, height:`${height / mapHeight * 100}%`, '--industry-gap':`${gap}px`} as CSSProperties}>
          {header > 0 && <div className={styles.industryHeading} title={group.name} style={{height:header, fontSize: size < 450 ? 6.5 : 9}}>{group.name}</div>}
          <div className={styles.industryStocks} style={{top:header + gap}}>
            {stocks.map(({item, x: sx, y: sy, width: sw, height: sh}) => {
              const font = heroTileFont(item.symbol,sw,sh,size);
              const value = change(item);
              return <a href={stockPageHref(item.symbol)} key={item.symbol} className={styles.overviewTile} data-symbol={item.symbol} data-heat-stock={item.symbol} aria-label={`${item.name} (${item.symbol}), ${group.name}, ${percent(value)}`} title={`${item.symbol} · ${item.name}\n${group.name} · ${percent(value)}`} style={{left:`${sx / w * 100}%`,top:`${sy / h * 100}%`,width:`${sw / w * 100}%`,height:`${sh / h * 100}%`,fontSize:font,background:heatColor(value,periodScale[period],colorblind)}}>
                <b>{item.symbol}</b><span>{heroTileValue(value,sw)}</span>
              </a>;
            })}
          </div>
        </div>;
      })}
    </div>
    {details&&<div className={styles.overviewDetail}><strong>{rows.length} S&P 500 holdings · Sized by index weight</strong><span>Tap a stock to open its company page. Gray means unavailable data.</span></div>}
  </>;
}
