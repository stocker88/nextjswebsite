import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {aggregate,OptionSnapshot} from '../lib/options';
import {Leg,strategies,expirationMetrics,usd,validateLegs} from '../lib/options-strategies';
import {setupHref} from '../lib/options-workspace';
import ExpirationChart from './options/ExpirationChart';
import styles from './HomeOptionsPreview.module.css';

const compact=(value:number|null)=>value===null?'—':new Intl.NumberFormat('en-US',{notation:'compact',maximumFractionDigits:1}).format(value);
const tabs=[{id:'activity',label:'Activity explorer'},{id:'calculator',label:'Profit calculator'},{id:'strategies',label:'Prebuilt strategies'}] as const;
export default function HomeOptionsPreview(){
  const root=useRef<HTMLElement>(null);
  const [visible,setVisible]=useState(false),[tab,setTab]=useState<string>('activity'),[symbol,setSymbol]=useState('SPY');
  const [snapshots,setSnapshots]=useState<Record<string,OptionSnapshot|null>>({});
  const [strike,setStrike]=useState(100),[premium,setPremium]=useState(5);
  useEffect(()=>{const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){setVisible(true);observer.disconnect()}},{rootMargin:'250px'});if(root.current)observer.observe(root.current);return()=>observer.disconnect()},[]);
  useEffect(()=>{
    if(!visible||tab!=='activity'||snapshots[symbol]!==undefined)return;
    const controller=new AbortController();
    // Read saved coverage only. Never enqueue a provider fetch from this preview.
    fetch('/api/options/?symbol='+symbol,{signal:controller.signal}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(d=>{
      if(d.symbol!==symbol||d.mode==='example'||!Array.isArray(d.contracts))throw Error();
      setSnapshots(v=>({...v,[symbol]:d}));
    }).catch(()=>{if(!controller.signal.aborted)setSnapshots(v=>({...v,[symbol]:null}))});
    return()=>controller.abort();
  },[visible,tab,symbol,snapshots]);
  const snapshot=snapshots[symbol],loading=snapshot===undefined,contracts=snapshot?.contracts||[],totals=aggregate(contracts);
  const grouped=new Map<number,{strike:number;call:number;put:number}>();
  contracts.forEach(c=>{if(c.oi===null)return;const row=grouped.get(c.strike)||{strike:c.strike,call:0,put:0};row[c.type]+=c.oi;grouped.set(c.strike,row)});
  const bars=Array.from(grouped.values()).sort((a,b)=>(b.call+b.put)-(a.call+a.put)).slice(0,8).sort((a,b)=>a.strike-b.strike);
  const maximum=Math.max(1,...bars.flatMap(b=>[b.call,b.put]));
  const legs:Leg[]=[{type:'call',side:'buy',strike,premium,quantity:1}],valid=!validateLegs(legs),metrics=valid?expirationMetrics(legs):null;
  const calculatorHref=valid?setupHref({version:1,name:'Long call',symbol:'',expiry:'',asOf:'',reference:strike,fee:0,legs}):'/options-profit-calculator/';
  return <section ref={root} className={styles.section} aria-labelledby="home-options-title">
    <header className={styles.header}><span className={styles.eyebrow}>EXPLORE YOUR NEXT SETUP</span><h2 id="home-options-title">From market moves<br/><em>to options possibilities.</em></h2><p>Explore positioning, model a payoff and compare ways to express your view.</p></header>
    <div className={styles.tabs} role="group" aria-label="Options tools preview">{tabs.map(t=><button key={t.id} aria-pressed={tab===t.id} aria-controls="home-options-panel" onClick={()=>setTab(t.id)}>{t.label} <span aria-hidden="true">→</span></button>)}</div>
    <div id="home-options-panel" className={styles.panel}>
      {tab==='activity'&&<>
        <div className={styles.top}><div><h3>Where are positions concentrated?</h3><p>Call and put open interest across available expirations.</p></div><div className={styles.symbols} role="group" aria-label="Preview ticker">{['SPY','QQQ','AAPL','NVDA'].map(s=><button key={s} aria-pressed={s===symbol} onClick={()=>setSymbol(s)}>{s}</button>)}</div></div>
        <div className={styles.activity} aria-busy={loading}>
          <div className={styles.stats}><div><span>Call open interest</span><strong className={styles.call}>{loading?'…':compact(totals.callOi)}</strong></div><div><span>Put open interest</span><strong className={styles.put}>{loading?'…':compact(totals.putOi)}</strong></div><p>{loading?'Loading options snapshot…':snapshot?.asOf?new Date(snapshot.asOf).toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZone:'America/New_York'})+' ET · Saved snapshot':'Snapshot unavailable'}<br/>Totals cover available contracts.</p></div>
          <div><div className={styles.legend}><span className={styles.call}>● Calls</span><span className={styles.put}>● Puts</span></div><div className={styles.bars}>{bars.length?bars.map(b=><div key={b.strike} className={styles.barColumn} aria-label={`Strike ${b.strike}: ${b.call.toLocaleString()} call OI, ${b.put.toLocaleString()} put OI`} title={`Calls: ${b.call.toLocaleString()} · Puts: ${b.put.toLocaleString()}`}><div className={styles.barPair}><i style={{height:160*b.call/maximum}}/><i style={{height:160*b.put/maximum}}/></div><span>{b.strike}</span></div>):<div className={styles.empty}>{loading?'Loading concentration chart…':<Link href={'/options-activity/?symbol='+symbol}>View available options data →</Link>}</div>}</div><p className={styles.note}>Largest open-interest strikes. Call/put totals do not establish market direction.</p></div>
        </div><Link className={styles.cta} href={'/options-activity/?symbol='+symbol}>Explore {symbol} options activity →</Link>
      </>}
      {tab==='calculator'&&<>
        <div className={styles.top}><div><h3>What could your option be worth?</h3><p>Try a long call, then open the calculator to build your own position.</p></div><span className={styles.badge}>ILLUSTRATIVE INPUTS</span></div>
        <div className={styles.calculator}><div><div className={styles.inputs}><label>Strike price ($)<input type="number" min="0.01" max="1000000" step="1" value={Number.isFinite(strike)?strike:''} onChange={e=>setStrike(e.target.value===''?NaN:Number(e.target.value))}/></label><label>Premium per share ($)<input type="number" min="0" max="1000000" step="0.1" value={Number.isFinite(premium)?premium:''} onChange={e=>setPremium(e.target.value===''?NaN:Number(e.target.value))}/></label></div><div className={styles.metrics}><div><span>Breakeven</span><strong>{metrics?usd(strike+premium):'—'}</strong></div><div><span>Maximum loss</span><strong>{metrics?usd(metrics.maxLoss):'—'}</strong></div></div><p className={styles.note}>One call · 100 shares · At expiration · Fees excluded. Editable examples, not market quotes.</p></div><div>{valid?<ExpirationChart legs={legs} low={Math.max(0,strike*.8)} high={Math.max(strike*1.2,strike+premium*2)}/>:<p className={styles.empty}>Enter a positive strike and a nonnegative premium.</p>}</div></div>
        <Link className={styles.cta} href={calculatorHref}>Calculate your payoff →</Link>
      </>}
      {tab==='strategies'&&<>
        <div className={styles.top}><div><h3>Different ways to express a view.</h3><p>Explore the trade-offs before choosing a strategy.</p></div></div>
        <div className={styles.strategies}>{['long-call','bull-call-spread','covered-call'].map(id=>{const s=strategies.find(s=>s.id===id)!;return <Link key={id} href={'/options-profit-calculator/?strategy='+id} className={styles.strategy}><span className={styles.badge}>{s.outlook}</span><h4>{s.name} <span aria-hidden="true">→</span></h4><ExpirationChart legs={s.legs} mini/><p>{s.risk}</p></Link>})}</div><p className={styles.note}>Illustrative expiration payoff shapes; each chart uses its own scale.</p>
        <Link className={styles.cta} href="/options-strategies/">Explore all strategies →</Link>
      </>}
    </div>
  </section>;
}
