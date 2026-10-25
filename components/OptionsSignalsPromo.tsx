import {DesktopActionText} from './DesktopAppLink';
import {useId,useState} from 'react';
import AppDownloadButton from './formStocker';
import styles from './OptionsSignalsPromo.module.css';

const choices=[
  {id:'volume',icon:'▥',label:'Unusual volume',hint:'Activity worth a closer look',title:'Spot activity that stands out.',body:'Explore elevated contract volume alongside open interest, price action and upcoming catalysts. Investigate the setup behind the activity before choosing a trade.'},
  {id:'flow',icon:'↗',label:'Calls & puts',hint:'Follow the positioning',title:'Look beyond the headline trade.',body:'Compare call and put activity to research what larger market participants may be doing. A large trade can be a hedge, a closing position or one leg of a spread—not simply a directional bet.'},
  {id:'liquidity',icon:'◎',label:'Liquidity',hint:'Check the contract',title:'Find activity where it matters.',body:'Review available volume and open interest across strikes and expirations. Then check current quotes and execution conditions with your broker before placing an order.'},
  {id:'strategies',icon:'⌁',label:'Strategy ideas',hint:'Understand the trade-off',title:'Turn research into a considered setup.',body:'Explore options signals in the app. Compare strikes, expirations and strategy structures, then assess the premium at risk, breakeven and potential payoff.'},
] as const;

export default function OptionsSignalsPromo({home=false,from='options_tools'}:{home?:boolean;from?:string}){
  const [selected,setSelected]=useState<typeof choices[number]>(choices[0]);
  const id=useId(),titleId=id+'-title',detailId=id+'-detail';
  return <div className={home?styles.home:styles.wrapper}><section className={styles.promo} aria-labelledby={titleId}>
    <div className={styles.copy}>
      <span className={styles.eyebrow}><span aria-hidden="true">✦</span> OPTIONS SIGNALS · IN THE APP</span>
      <h2 id={titleId}>Follow the activity.<br/><span>Find your next options idea.</span></h2>
      <p>Unusual volume. Call and put positioning. Liquidity and strategy selection. Bring the clues together as you explore options opportunities and research-backed signals in the app.</p>
      <p className={styles.secondary}>Curious about “smart money”? Look for activity worth investigating, then connect it with company catalysts and a strategy that fits your outlook.</p>
      <div className={styles.features}><span>Options research</span><span>Trade setups</span><span>Risk & reward</span></div>
    </div>
    <div className={styles.panel}>
      <div className={styles.panelHeading}><strong>Explore the signal behind the activity</strong><span>OPTIONS RESEARCH ↗</span></div>
      <div className={styles.choices} role="group" aria-label="Options signal research">{choices.map(choice=><button key={choice.id} type="button" aria-pressed={choice.id===selected.id} aria-controls={detailId} onClick={()=>setSelected(choice)}><span className={styles.icon} aria-hidden="true">{choice.icon}</span><strong>{choice.label}</strong><small>{choice.hint}</small></button>)}</div>
      <div id={detailId} className={styles.detail} aria-live="polite"><h3>{selected.title}</h3><p>{selected.body}</p></div>
      <div className={styles.download}><AppDownloadButton popup from={from+'_signals_'+selected.id} label="Review options signals in the app →"/><small><DesktopActionText desktopLabel="Membership access · Your account">{'Get the app · iOS & Android'}</DesktopActionText></small></div>
      <p className={styles.note}>Options activity does not identify hedge funds or confirm what “smart money” is buying. Signals are research ideas; options can lose their entire premium.</p>
    </div>
  </section></div>;
}
