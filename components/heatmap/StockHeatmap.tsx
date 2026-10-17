import {useEffect,useMemo,useRef,useState} from 'react';
import {HeatSnapshot,HeatStock,Period,PERIOD_OPTIONS,periodLabel,periodScale,tile,heatColor,percent,dateLabel,validSnapshot,heatmapEndpoint,TileSizing,HeatGrouping,sizeLabels,stockWeight,stockGroups,fixedGroupTiles,readWatchlist,returnColor} from '../../lib/market-heatmap';
import HeatmapShare from './HeatmapShare';
import HeatmapZoom from './HeatmapZoom';
import {Movers,SectorLeaderboard,IndustryPeers} from './HeatmapInsights';
import styles from './Heatmap.module.css';
const compact=(v:number)=>new Intl.NumberFormat('en-US',{notation:'compact',maximumFractionDigits:2}).format(v);
const money=(v:number)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(v);
export default function StockHeatmap({initial}:{initial:HeatSnapshot}){
 const [data,setData]=useState(initial),[period,setPeriod]=useState<Period>('day'),[sector,setSector]=useState('all'),[query,setQuery]=useState(''),[limit,setLimit]=useState(100),[view,setView]=useState('map'),[mobileLayout,setMobileLayout]=useState('compact'),[selected,setSelected]=useState<HeatStock|null>(null),[width,setWidth]=useState(1200),[viewportHeight,setViewportHeight]=useState(900),[refreshing,setRefreshing]=useState(false);
 const [sizing,setSizing]=useState<TileSizing>('weight'),[grouping,setGrouping]=useState<HeatGrouping>('sector'),[industry,setIndustry]=useState('all'),[direction,setDirection]=useState('all'),[expanded,setExpanded]=useState(false),[copied,setCopied]=useState(false),[linkFallback,setLinkFallback]=useState('');
 const [colorblind,setColorblind]=useState(false),[fixed,setFixed]=useState(false),[watchlist,setWatchlist]=useState<string[]>([]),[watchOnly,setWatchOnly]=useState(false),[sharedSymbols,setSharedSymbols]=useState<string[]|null>(null),[preferencesReady,setPreferencesReady]=useState(false),[storageMessage,setStorageMessage]=useState(''),[highlighted,setHighlighted]=useState('');
 const [preview,setPreview]=useState<{symbol:string;x:number;y:number;pinned:boolean}|null>(null);
 const previewHoverTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 function cancelPreviewHover(){if(previewHoverTimer.current!==null){clearTimeout(previewHoverTimer.current);previewHoverTimer.current=null}}
 useEffect(()=>()=>cancelPreviewHover(),[]);
 useEffect(()=>{cancelPreviewHover()},[preview]);
 const mapRef=useRef<HTMLDivElement>(null),detailRef=useRef<HTMLDivElement>(null),panelRef=useRef<HTMLDivElement>(null),expandRef=useRef<HTMLButtonElement>(null),previewRef=useRef<HTMLElement>(null);
 useEffect(()=>{const el=mapRef.current;if(!el)return;const observer=new ResizeObserver(([entry])=>{if(entry.contentRect.width>0)setWidth(entry.contentRect.width)});observer.observe(el);return()=>observer.disconnect()},[view]);
 useEffect(()=>{
  const q=new URLSearchParams(window.location.search);
  try{setWatchlist(readWatchlist(localStorage.getItem('stbn-heatmap-watchlist')));setColorblind(localStorage.getItem('stbn-heatmap-colors')==='accessible')}catch{/* Session-only preferences remain usable. */}
  if(q.has('colors'))setColorblind(q.get('colors')==='accessible');
  if(q.get('fixed')==='1')setFixed(true);
  if(q.get('watch')==='1'){
   setWatchOnly(true);
   if(q.has('symbols'))setSharedSymbols(readWatchlist(JSON.stringify(q.get('symbols')!.split(','))));
  }
  setPreferencesReady(true);

  if(PERIOD_OPTIONS.some(p=>p.value===q.get('period')))setPeriod(q.get('period') as Period);
  if(['weight','marketCap','equal'].includes(q.get('size')||''))setSizing(q.get('size') as TileSizing);
  if(['sector','industry'].includes(q.get('group')||''))setGrouping(q.get('group') as HeatGrouping);
  if(['column','compact'].includes(q.get('layout')||''))setMobileLayout(q.get('layout')!);
  if(['up','down','missing'].includes(q.get('moves')||''))setDirection(q.get('moves')!);
  if(q.get('view')==='table')setView('table');
  if(q.get('limit')==='50')setLimit(50);
  if(q.has('q'))setQuery(q.get('q')!.slice(0,100));
  if(q.has('sector'))setSector(q.get('sector')!);
  if(q.has('industry'))setIndustry(q.get('industry')!);
 },[]);
 useEffect(()=>{
  if(!preferencesReady)return;
  try{localStorage.setItem('stbn-heatmap-watchlist',JSON.stringify(watchlist));localStorage.setItem('stbn-heatmap-colors',colorblind?'accessible':'standard');setStorageMessage('')}catch{setStorageMessage('Browser storage is unavailable. Your stars and colors will last for this visit only.')}
 },[watchlist,colorblind,preferencesReady]);
 const toggleStar=(symbol:string)=>setWatchlist(old=>old.includes(symbol)?old.filter(s=>s!==symbol):[...old,symbol].slice(0,100));
 useEffect(()=>{
  if(!expanded)return;
  const previous=document.body.style.overflow;document.body.style.overflow='hidden';panelRef.current?.focus();
  const key=(e:KeyboardEvent)=>{
   if(document.querySelector('dialog[open]'))return;
   if(e.key==='Escape'){setExpanded(false);setPreview(null);return;}
   if(e.key==='Tab'){
    const items=Array.from(panelRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],input,select,[tabindex="0"]')||[]).filter(el=>el.getClientRects().length);
    const first=items[0],last=items[items.length-1];
    if(e.shiftKey&&(document.activeElement===first||document.activeElement===panelRef.current)){e.preventDefault();last?.focus()}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}
   }
  };
  document.addEventListener('keydown',key);
  return()=>{document.body.style.overflow=previous;document.removeEventListener('keydown',key);expandRef.current?.focus()};
 },[expanded]);
 useEffect(()=>{
  const dismiss=(e:PointerEvent)=>{if(!previewRef.current?.contains(e.target as Node)&&!(e.target as Element).closest?.('[data-heat-stock]'))setPreview(null)};
  const key=(e:KeyboardEvent)=>{if(e.key==='Escape')setPreview(null)};
  const scroll=()=>setPreview(current=>current?.pinned?current:null);
  const resize=()=>{setPreview(null);setViewportHeight(window.innerHeight);if(window.matchMedia('(max-width:680px), (hover: none) and (pointer: coarse)').matches)setExpanded(false)};resize();
  document.addEventListener('pointerdown',dismiss);document.addEventListener('keydown',key);window.addEventListener('scroll',scroll,true);window.addEventListener('resize',resize);
  return()=>{document.removeEventListener('pointerdown',dismiss);document.removeEventListener('keydown',key);window.removeEventListener('scroll',scroll,true);window.removeEventListener('resize',resize)};
 },[]);
 useEffect(()=>{setPreview(null);setCopied(false);setLinkFallback('')},[period,sector,query,limit,view,mobileLayout,sizing,grouping,industry,direction,colorblind,fixed,watchOnly,sharedSymbols]);
 const refresh=async()=>{setRefreshing(true);try{const r=await fetch(heatmapEndpoint);if(!r.ok)throw Error();const d=await r.json();if(!validSnapshot(d))throw Error();setData(d);}catch{/* Keep the dated snapshot until the next automatic check. */}finally{setRefreshing(false)}};
 useEffect(()=>{refresh();const timer=setInterval(()=>{if(document.visibilityState==='visible')refresh()},300000);return()=>clearInterval(timer)},[]);
 const sectors=useMemo(()=>Array.from(new Set(data.rows.map(r=>r.sector))).sort(),[data]);
 const baseRows=useMemo(()=>{const q=query.trim().replace(/^\$/,'').toLowerCase();return data.rows.filter(r=>(!watchOnly||(sharedSymbols??watchlist).includes(r.symbol))&&(sector==='all'||r.sector===sector)&&(industry==='all'||r.industry===industry)&&(!q||[r.symbol,r.name,r.industry].some(s=>s.toLowerCase().includes(q)))).slice(0,watchOnly?100:limit)},[data,sector,industry,query,limit,watchOnly,watchlist,sharedSymbols]);
 const rows=baseRows.filter(r=>direction==='all'||(direction==='up'&&(r.changes[period]??0)>0)||(direction==='down'&&(r.changes[period]??0)<0)||(direction==='missing'&&r.changes[period]===null));
 const weight=(r:HeatStock)=>stockWeight(r,sizing,data.rows);
 const grouped=stockGroups(rows,grouping);
 const mobile=width<680,column=mobile&&mobileLayout==='column',dense=mobile&&!column,chartHeight=Math.min(expanded?Math.max(180,viewportHeight-300):760,Math.round(width*.65));
 const groupNames=stockGroups(baseRows,grouping).map(g=>g.name);
 const groups=fixed?fixedGroupTiles(grouped,groupNames,width,chartHeight):tile(grouped,g=>g.rows.reduce((s,r)=>s+weight(r),0),width,chartHeight);
 const up=baseRows.filter(r=>(r.changes[period]??0)>0).length,down=baseRows.filter(r=>(r.changes[period]??0)<0).length,missing=baseRows.filter(r=>r.changes[period]===null).length;
 const pick=(r:HeatStock)=>{setPreview(null);setSelected(r);setTimeout(()=>detailRef.current?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest'}),0)};
 const showPreview=(r:HeatStock,el:HTMLElement,pinned=false)=>{
  cancelPreviewHover();
  const box=el.getBoundingClientRect(),right=box.right+8,left=box.left-288;
  let x=box.left,y=box.bottom+8;
  if(right+280<=window.innerWidth-8){x=right;y=box.top}
  else if(left>=8){x=left;y=box.top}
  else if(y+305>window.innerHeight-8)y=box.top-313;
  setPreview({symbol:r.symbol,x:Math.max(8,Math.min(x,window.innerWidth-288)),y:Math.max(8,Math.min(y,window.innerHeight-315)),pinned});
 };
 // Switch hovered stocks only after the pointer settles. Crossing other tiles
 // on the way to the action card must not replace its content.
 const hoverPreview=(r:HeatStock,el:HTMLElement)=>{
  cancelPreviewHover();
  if(preview?.pinned||preview?.symbol===r.symbol)return;
  if(!preview){showPreview(r,el);return;}
  previewHoverTimer.current=setTimeout(()=>{
   previewHoverTimer.current=null;
   if(el.isConnected&&el.matches(':hover')&&!previewRef.current?.matches(':hover'))showPreview(r,el);
  },300);
 };
 const currentSelected=selected?data.rows.find(r=>r.symbol===selected.symbol)||selected:null;
 const previewStock=preview?data.rows.find(r=>r.symbol===preview.symbol):null;
 function viewUrl(){
  const url=new URL('https://www.stockstobuynow.ai/stock-market-heatmap/');
  const values={period,sector,industry,q:query,limit:String(limit),view,layout:mobileLayout,size:sizing,group:grouping,moves:direction,colors:colorblind?'accessible':'standard',fixed:fixed?'1':'0',watch:watchOnly?'1':'0',symbols:watchOnly?(sharedSymbols??watchlist).join(','):''};
  const defaults:Record<string,string>={period:'day',sector:'all',industry:'all',q:'',limit:'100',view:'map',layout:'compact',size:'weight',group:'sector',moves:'all',colors:'standard',fixed:'0',watch:'0',symbols:''};
  Object.entries(values).forEach(([key,value])=>{if(value!==defaults[key]||key==='colors'||(key==='symbols'&&watchOnly))url.searchParams.set(key,value)});return url.toString();
 }
 function highlightStock(r:HeatStock){
  setHighlighted(r.symbol);setPreview(null);setView('map');
  setTimeout(()=>{const target=Array.from(mapRef.current?.querySelectorAll<HTMLElement>('[data-heat-stock]')||[]).find(el=>el.dataset.heatStock===r.symbol);target?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'})},0);
 }
 async function copyView(){const url=viewUrl();try{await navigator.clipboard.writeText(url);setCopied(true)}catch{setLinkFallback(url)}}
 return <div ref={panelRef} tabIndex={expanded?-1:undefined} role={expanded?'dialog':undefined} aria-modal={expanded?true:undefined} aria-label={expanded?'Expanded stock market heatmap':undefined} className={expanded?styles.expanded:undefined}>
 <div className={styles.snapshot} hidden={expanded}><div><span className={styles.eyebrow}>LATEST SAVED SESSION</span><strong>{dateLabel(data.asOf)}</strong><span>Daily close data · refreshed after the market closes</span></div></div>
 {data.rows.length<data.coverage.total&&<p className={styles.note} role="status">{refreshing?'Loading full coverage…':`Showing ${data.rows.length} loaded stocks. Coverage updates automatically.`}</p>}
 <div className={styles.controls}><label className={styles.search}><span className={styles.srOnly}>Find a company or ticker</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search company or ticker"/></label><label><span className={styles.srOnly}>Sector</span><select value={sector} onChange={e=>setSector(e.target.value)}><option value="all">All sectors</option>{sectors.map(s=><option key={s}>{s}</option>)}</select></label><label><span className={styles.srOnly}>Number of stocks</span><select value={limit} onChange={e=>setLimit(+e.target.value)}><option value={50}>Largest 50</option><option value={100}>Largest 100</option></select></label></div>
 {rows.length>0&&<Movers rows={rows} period={period} colorblind={colorblind} onPick={highlightStock}/>}
 <div className={styles.mapHeading}><div><h2>{industry!=='all'?industry+' stock heatmap':sector==='all'?'Stock market heatmap by '+grouping:sector+' stock heatmap'}</h2><p>{rows.length} stocks shown · {data.weightSource?`${rows.reduce((sum,r)=>sum+(r.weight||0),0).toFixed(1)}% of SPY holdings`:'saved prices'} · {sizeLabels[sizing].toLowerCase()}</p></div><div className={styles.segment}><button aria-pressed={view==='map'} onClick={()=>setView('map')}>Heatmap</button><button aria-pressed={view==='table'} onClick={()=>setView('table')}>Table</button></div></div>
 <div className={styles.summary}><div className={styles.shareControls}><div className={styles.mapShare}><HeatmapShare rows={rows} period={period} asOf={data.asOf} sector={sector} sizing={sizing} grouping={grouping} universe={data.rows} viewUrl={viewUrl()} direction={direction} colorblind={colorblind} fixed={fixed} groupNames={groupNames}/><label className={styles.periodPicker}><span className={styles.srOnly}>Performance period</span><select value={period} onChange={e=>setPeriod(e.target.value as Period)}>{PERIOD_OPTIONS.map(p=><option key={p.value} value={p.value}>{p.label}</option>)}</select></label></div><div className={styles.mobileViews} role="group" aria-label="Mobile heatmap layout"><button aria-pressed={mobileLayout==='column'} onClick={()=>{setMobileLayout('column');setGrouping('industry');setView('map')}}>Industry view</button><button aria-pressed={mobileLayout==='compact'} onClick={()=>{setMobileLayout('compact');setView('map')}}>Compact view</button></div></div><button className={styles.moveFilter} aria-pressed={direction==='up'} onClick={()=>setDirection(direction==='up'?'all':'up')}><i className={styles.green} style={colorblind?{background:'#83bfff'}:undefined}/>{up} advancing</button><button className={styles.moveFilter} aria-pressed={direction==='down'} onClick={()=>setDirection(direction==='down'?'all':'down')}><i className={styles.red} style={colorblind?{background:'#ffc184'}:undefined}/>{down} declining</button><button className={styles.moveFilter} aria-pressed={direction==='missing'} onClick={()=>setDirection(direction==='missing'?'all':'missing')}><i className={styles.gray}/>{missing} unavailable</button>{direction!=='all'&&<button className={styles.textButton} onClick={()=>setDirection('all')}>Show all</button>}<div className={styles.scale} aria-label={`Color scale from minus ${periodScale[period]} percent to plus ${periodScale[period]} percent`}><span>−{periodScale[period]}%</span>{[-1,-.5,0,.5,1].map(v=><i key={v} style={{background:heatColor(v*periodScale[period],periodScale[period],colorblind)}}/>)}<span>+{periodScale[period]}%</span></div></div>
 <div className={styles.exploreControls}>
 <label>Size by <select aria-label="Tile size" value={sizing} onChange={e=>setSizing(e.target.value as TileSizing)}>{Object.entries(sizeLabels).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
 <label>Group by <select aria-label="Group stocks by" value={grouping} onChange={e=>{setGrouping(e.target.value as HeatGrouping);setIndustry('all');if(e.target.value==='sector')setMobileLayout('compact')}}><option value="sector">Sector</option><option value="industry">Industry</option></select></label>
 {industry!=='all'&&<button className={styles.textButton} onClick={()=>setIndustry('all')}>All industries ×</button>}
 <button className={styles.toolButton} aria-pressed={watchOnly} onClick={()=>{if(sharedSymbols){setSharedSymbols(null);setWatchOnly(true)}else setWatchOnly(v=>!v)}}>{sharedSymbols&&watchOnly?'Shared watchlist':`☆ My watchlist (${watchlist.length})`}</button>
 <details className={styles.mapSettings}><summary>Display options</summary><div><label><input type="checkbox" checked={fixed} onChange={e=>setFixed(e.target.checked)}/> Fixed group positions</label><label><input type="checkbox" checked={colorblind} onChange={e=>setColorblind(e.target.checked)}/> Colorblind colors</label><small>{fixed?'Groups use equal space; sizing applies within each group.':'Groups are sized by their stocks.'}</small></div></details>
 <button className={styles.toolButton} onClick={copyView}>{copied?'Link copied ✓':'Copy view link'}</button>
 <button ref={expandRef} className={`${styles.toolButton} ${styles.desktopFullscreen}`} onClick={()=>{setPreview(null);setExpanded(v=>!v)}}>{expanded?'↙ Exit full screen':'⛶ Full screen'}</button>
 </div>
 {watchOnly&&<div className={styles.watchNotice}>{sharedSymbols?'Shared list; your own saved stars are unchanged.':'Stars are saved in this browser. Only stocks in our loaded coverage appear here.'}<button className={styles.textButton} onClick={()=>{setWatchOnly(false);setSharedSymbols(null)}}>All stocks</button>{sharedSymbols&&<button className={styles.textButton} onClick={()=>{setWatchlist(old=>Array.from(new Set([...old,...sharedSymbols])).slice(0,100));setSharedSymbols(null)}}>Save this list</button>}</div>}
 {storageMessage&&<p className={styles.watchNotice} role="status">{storageMessage}</p>}
 {linkFallback&&<label className={styles.linkFallback}>Copy this view link<input readOnly value={linkFallback} onFocus={e=>e.currentTarget.select()}/></label>}
 <span className={styles.srOnly} role="status">{copied?'View link copied. ':''}{rows.length} stocks shown{direction==='up'?', advancing only':direction==='down'?', declining only':direction==='missing'?', unavailable prices only':''}.</span>
 {!rows.length&&<p className={styles.empty}>No stocks match these filters. {watchOnly?'Star stocks from their preview or table to build your watchlist, or adjust your filters.':'Try another ticker, sector or movement filter.'}</p>}
 <div ref={mapRef} className={styles.map} style={view!=='map'?{display:'none'}:undefined} aria-label="Interactive stock market heatmap"><HeatmapZoom width={width} height={chartHeight} enabled={!column} resetKey={[sector,industry,query,limit,view,mobileLayout,sizing,grouping,direction,fixed,highlighted,rows.map(r=>r.symbol).join(',')].join('|')} onGesture={()=>setPreview(null)}>
 {groups.map(g=>{const gap=dense?2:4,headerHeight=dense?(g.height>32?Math.min(16,g.height*.18):0):28,w=column?Math.max(1,width-2):Math.max(1,g.width-gap-2),h=column?260:Math.max(1,g.height-gap-headerHeight-2);const cells=tile(g.item.rows,weight,w,h);return <section key={g.item.name} className={styles.sector} style={column?{position:'relative',width:'100%',height:292,marginBottom:6}:{left:g.x,top:g.y,width:Math.max(1,g.width-gap),height:Math.max(1,g.height-gap)}}><button className={styles.sectorTitle} style={{height:headerHeight,padding:dense?'0 3px':undefined,fontSize:dense?8:undefined,display:headerHeight?'flex':'none'}} onClick={()=>grouping==='sector'?setSector(sector===g.item.name?'all':g.item.name):setIndustry(industry===g.item.name?'all':g.item.name)} title={`Focus on ${g.item.name}`}>{g.item.name}{!dense&&<span>{g.item.rows.length} ↗</span>}</button><div className={styles.cells} style={{height:h}}>{cells.map(({item:r,x,y,width:cw,height:ch})=>{const small=cw<(dense?18:46)||ch<(dense?12:34);return <button key={r.symbol} aria-label={`${r.name} (${r.symbol}), ${percent(r.changes[period])}, price date ${r.asOf}`} className={styles.stock} data-heat-stock={r.symbol} data-highlighted={highlighted===r.symbol} onPointerEnter={e=>{if(e.pointerType==='mouse')hoverPreview(r,e.currentTarget)}} onPointerMove={e=>{if(e.pointerType==='mouse')hoverPreview(r,e.currentTarget)}} onPointerLeave={cancelPreviewHover} onFocus={e=>{if(e.currentTarget.matches(':focus-visible'))showPreview(r,e.currentTarget)}} onClick={e=>showPreview(r,e.currentTarget,true)} style={{left:x,top:y,width:cw,height:ch,background:heatColor(r.changes[period],periodScale[period],colorblind),fontSize:dense?Math.min(18,Math.max(5,Math.min(cw/Math.max(3.5,r.symbol.length*.75),ch/3))):Math.min(32,Math.max(10,Math.min(cw/4.8,ch/3.6))),gap:dense?1:undefined}}>{!small&&<><b>{r.symbol}{watchlist.includes(r.symbol)&&<span className={styles.tileStar} aria-label="Saved stock"> ★</span>}</b>{(!dense||(cw>28&&ch>22))&&<span>{r.changes[period]===null?'—':percent(r.changes[period])}</span>}{!dense&&cw>130&&ch>120&&<small>{r.name}</small>}</>}</button>})}</div></section>})}</HeatmapZoom></div>
 {view==='table'&&<div className={styles.table}><table><caption className={styles.srOnly}>Saved stock performance and market capitalization</caption><thead><tr><th><span className={styles.srOnly}>Watchlist</span></th><th>Stock</th><th>Sector</th><th>Change</th><th>Market cap</th><th>Price date</th></tr></thead><tbody>{rows.map(r=><tr key={r.symbol}><td><button className={styles.starButton} aria-label={`${watchlist.includes(r.symbol)?'Remove':'Save'} ${r.symbol} ${watchlist.includes(r.symbol)?'from':'to'} watchlist`} aria-pressed={watchlist.includes(r.symbol)} onClick={()=>toggleStar(r.symbol)}>{watchlist.includes(r.symbol)?'★':'☆'}</button></td><td><button onClick={()=>pick(r)}>{r.symbol}</button><small>{r.name}</small></td><td>{r.sector}</td><td style={{color:returnColor(r.changes[period],colorblind)}}>{percent(r.changes[period])}</td><td>{r.marketCap>0?'$'+compact(r.marketCap):'—'}</td><td>{dateLabel(r.asOf)}</td></tr>)}</tbody></table></div>}
 <SectorLeaderboard rows={rows} period={period} colorblind={colorblind} onSector={s=>{setSector(s);setIndustry('all')}}/>
 <p className={styles.note}>{!['day','week','month'].includes(period)&&'Longer ranges use saved weekly or monthly closes, so the starting date may precede the exact lookback date. '}{fixed&&'Fixed positions give each group equal space; the sizing selector applies within groups. '}Gray tiles have missing or older data; they do not mean a 0% return. {data.coverage.current} of {data.coverage.total} covered stocks have prices dated {dateLabel(data.asOf)}. Select a tile for its dates and details.</p>
 {preview&&previewStock&&<aside ref={previewRef} className={styles.stockPreview} aria-label={`${previewStock.symbol} preview`} style={{left:preview.x,top:preview.y}} onPointerEnter={cancelPreviewHover} onPointerLeave={()=>{if(!preview.pinned)setPreview(null)}}>
 <div><strong>{previewStock.symbol}</strong><button aria-label="Close stock preview" onClick={()=>setPreview(null)}>×</button></div><p>{previewStock.name}</p>
 <dl><div><dt>Adjusted close</dt><dd>{previewStock.price>0?money(previewStock.price):'Unavailable'}</dd></div><div><dt>{periodLabel(period)} return</dt><dd>{percent(previewStock.changes[period])}</dd></div><div><dt>Index weight</dt><dd>{previewStock.weight?previewStock.weight.toFixed(2)+'%':'Unavailable'}</dd></div><div><dt>Price date</dt><dd>{dateLabel(previewStock.asOf)}</dd></div></dl>
 <div className={styles.previewActions}><button className={styles.toolButton} aria-pressed={watchlist.includes(previewStock.symbol)} onClick={()=>toggleStar(previewStock.symbol)}>{watchlist.includes(previewStock.symbol)?'★ Saved':'☆ Save stock'}</button><button className={styles.toolButton} onClick={()=>pick(previewStock)}>Compare peers</button></div><button className={styles.toolButton} onClick={()=>pick(previewStock)}>View stock details →</button>
 </aside>}
 <div ref={detailRef}>{currentSelected&&<section className={styles.detail} aria-label={`${currentSelected.symbol} details`}><div className={styles.detailHeading}><div><span className={styles.eyebrow}>{currentSelected.sector} / {currentSelected.industry}</span><h3>{currentSelected.symbol} <span>{currentSelected.name}</span></h3></div><button aria-label="Close company details" onClick={()=>setSelected(null)}>×</button></div><div className={styles.detailStats}>{!['day','week','month'].includes(period)&&<div><small>{periodLabel(period)}</small><strong>{percent(currentSelected.changes[period])}</strong></div>}<div><small>Adjusted close</small><strong>{currentSelected.price>0?money(currentSelected.price):'Unavailable'}</strong></div><div><small>1 day</small><strong>{percent(currentSelected.changes.day)}</strong></div><div><small>1 week</small><strong>{percent(currentSelected.changes.week)}</strong></div><div><small>1 month</small><strong>{percent(currentSelected.changes.month)}</strong></div><div><small>Saved market cap</small><strong>{currentSelected.marketCap>0?'$'+compact(currentSelected.marketCap):'—'}</strong></div></div>{currentSelected.periodDetails?.[period]&&<p>Starting {currentSelected.periodDetails[period]!.basis==='monthly'?'month':'week'}: {dateLabel(currentSelected.periodDetails[period]!.basePeriod)} · Return through {dateLabel(currentSelected.asOf)}.</p>}<p>Price date: {dateLabel(currentSelected.asOf)}. {currentSelected.asOf!==data.asOf?'This stock has older data; its performance is excluded from the color scale.':''}</p><button className={styles.toolButton} aria-pressed={watchlist.includes(currentSelected.symbol)} onClick={()=>toggleStar(currentSelected.symbol)}>{watchlist.includes(currentSelected.symbol)?'★ Saved to watchlist':'☆ Save to watchlist'}</button><IndustryPeers stock={currentSelected} rows={data.rows} period={period} colorblind={colorblind} onPick={pick}/>
<a href={'/stocks/?q='+encodeURIComponent(currentSelected.symbol)}>Explore {currentSelected.symbol} research ↗</a></section>}</div>
 </div>;
}
