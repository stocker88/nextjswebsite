import styles from './OptionsLearningGuides.module.css';
export const optionsGuides = [
  {id:'activity',number:'01',title:'What is the options activity telling you?',description:'Read unusual volume, open interest and call/put positioning together. Learn which clues deserve attention—and what the numbers cannot reveal.',label:'Read the options activity guide'},
  {id:'liquidity',number:'02',title:'Which contracts deserve a closer look?',description:'Compare strikes and expirations through volume, open interest and available volatility. Build a shortlist with liquidity and timing in mind.',label:'Read the contract selection guide'},
  {id:'strategies',number:'03',title:'Turn an options idea into a strategy.',description:'Explore calls, puts and spreads. Map the premium at risk, breakeven and expiration payoff before choosing your setup.',label:'Read the strategy planning guide'},
];
export default function OptionsLearningGuides({home=false}:{home?:boolean}){
  return <section className={`${styles.guides} ${home?styles.home:''}`} aria-label="Options learning guides">{optionsGuides.map(guide=><a className={styles.card} key={guide.id} href={'/options-research-guide/#'+guide.id}><div><span className={styles.eyebrow}>THE METHODOLOGY <span aria-hidden="true">· {guide.number}</span></span><h2>{guide.title}</h2><p>{guide.description}</p></div><span className={styles.link}>{guide.label}<span className={styles.arrow} aria-hidden="true">→</span></span></a>)}</section>;
}
