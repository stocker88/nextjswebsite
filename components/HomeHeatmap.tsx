import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {HeatSnapshot,HeatStock,dateLabel,heatColor,percent,stockGroups,tile,validSnapshot,heatmapEndpoint} from '../lib/market-heatmap';
import styles from './HomeHeatmap.module.css';
import savedSnapshot from '../data/market-heatmap.json';

export default function HomeHeatmap(){
  const root=useRef<HTMLElement>(null),map=useRef<HTMLDivElement>(null);
  const [data,setData]=useState<HeatSnapshot|null>(validSnapshot(savedSnapshot)?savedSnapshot:null),[loading,setLoading]=useState(false);
  const [width,setWidth]=useState(1000),[selected,setSelected]=useState<HeatStock|null>(null);
  useEffect(()=>{
    const controller=new AbortController();
    let interval:ReturnType<typeof setInterval>|undefined;
    let pending=false;
    const refresh=async()=>{
      if(pending||document.visibilityState==='hidden')return;
      pending=true;
      try{
        const response=await fetch(heatmapEndpoint,{signal:controller.signal});
        if(!response.ok)throw Error('Feed unavailable');
        const snapshot=await response.json();
        if(validSnapshot(snapshot)&&!controller.signal.aborted)setData(snapshot);
      }catch{/* Keep the dated saved snapshot if the feed is unavailable. */}
      finally{pending=false;if(!controller.signal.aborted)setLoading(false)}
    };
    const observer=new IntersectionObserver(entries=>{
      if(!entries.some(entry=>entry.isIntersecting))return;
      observer.disconnect();
      void refresh();
      interval=setInterval(refresh,300000);
    },{rootMargin:'300px'});
    if(root.current)observer.observe(root.current);
    return()=>{observer.disconnect();controller.abort();clearInterval(interval)};
  },[]);
  useEffect(()=>{
    if(!map.current)return;
    const observer=new ResizeObserver(entries=>setWidth(entries[0].contentRect.width));
    observer.observe(map.current);return()=>observer.disconnect();
  },[]);
  const mobile=width<600;
  const rows=[...(data?.rows||[])].sort((a,b)=>(b.weight||0)-(a.weight||0)||b.marketCap-a.marketCap).slice(0,mobile?12:30);
  const groups=stockGroups(rows,'sector');
  const groupTiles=tile(groups,g=>g.rows.reduce((s,r)=>s+(r.weight||1),0),width,350);
  const change=(r:HeatStock)=>r.asOf===data?.asOf?r.changes.day:null;
  return <section ref={root} className={styles.section} aria-labelledby="home-heatmap-title">
    <header className={styles.header}>
      <div><span className={styles.eyebrow}>THE MARKET AT A GLANCE</span><h2 id="home-heatmap-title">See where the market is moving.</h2><p>Explore the largest S&P 500 stocks, grouped by sector.</p></div>
      <Link className={styles.headerLink} href="/stock-market-heatmap/">Full heatmap <span aria-hidden="true">↗</span></Link>
    </header>
    <div className={styles.panel}>
      <div className={styles.meta}><span>{data?`${dateLabel(data.asOf)} · Daily close`:'Daily performance'}</span><span className={styles.legend}><i/> Down <i/> Up <i/> Unavailable</span></div>
      <div ref={map} className={styles.map} aria-busy={loading} style={{height:rows.length?(mobile?'auto':350):350}}>
        {!rows.length?<div className={styles.empty} role="status">{loading?'Loading market snapshot…':<>Market snapshot is currently unavailable. <Link href="/stock-market-heatmap/">View heatmap →</Link></>}</div>:groupTiles.map(g=>{
          const w=mobile?width:g.width,h=mobile?Math.max(100,Math.min(180,g.item.rows.length*40)):g.height;
          const cells=tile(g.item.rows,r=>r.weight||1,w,Math.max(1,h-24));
          return <div key={g.item.name} className={styles.group} style={mobile?{position:'relative',height:h,width:'100%'}:{position:'absolute',left:g.x,top:g.y,width:w,height:h}}>
            <div className={styles.groupLabel} title={g.item.name}>{g.item.name}</div>
            <div className={styles.cells}>{cells.map(c=><button key={c.item.symbol} className={styles.stock} style={{left:c.x,top:c.y,width:c.width,height:c.height,background:heatColor(change(c.item)),fontSize:Math.max(10,Math.min(23,c.width/5,c.height/3))}} aria-label={`${c.item.name} (${c.item.symbol}), ${percent(change(c.item))}`} aria-pressed={selected?.symbol===c.item.symbol} onMouseEnter={()=>setSelected(c.item)} onFocus={()=>setSelected(c.item)} onClick={()=>setSelected(c.item)}><b>{c.item.symbol}</b>{c.height>34&&c.width>42&&<span>{change(c.item)===null?'—':percent(change(c.item))}</span>}</button>)}</div>
          </div>;
        })}
      </div>
      <div className={styles.detail} aria-live="polite">{selected?<><div><strong>{selected.symbol} <span>{selected.name}</span></strong><p>{selected.sector} · {percent(change(selected))} · {selected.price>0?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(selected.price):'Price unavailable'} · {dateLabel(selected.asOf)}</p></div><Link href={'/stock-market-heatmap/?q='+encodeURIComponent(selected.symbol)}>Explore {selected.symbol} →</Link></>:<p>Hover or tap a stock to explore its daily move.</p>}</div>
      <p className={styles.caption}>{rows.length?`${rows.length} largest holdings shown · `:''}Tile size reflects index weight. Gray means unavailable data.</p>
    </div>
    <div className={styles.action}><Link href="/stock-market-heatmap/">Explore the market heatmap →</Link></div>
  </section>;
}
