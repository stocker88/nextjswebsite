import DesktopAppLink from './DesktopAppLink';
import {overnightOptionsResult} from '../lib/featured-research';
import {useSiteAccount} from './SiteAccount';
import {useState} from 'react';
import {researchUrl} from '../lib/research';
import styles from '../styles/HeroProductReveal.module.css';
const app = 'https://apps.apple.com/us/app/stocks-to-buy-now-ai-signals/id1565527320';
const features = [
  {group:'Markets',title:'Stock Market Heatmap',copy:'See the largest stocks and sector performance.',href:'/stock-market-heatmap/',icon:'▦'},
  {group:'Markets',title:'Premarket heatmap',copy:'Explore a free snapshot of stock moves before the opening bell.',href:'/premarket-stock-heatmap/',icon:'▦'},
  {group:'Markets',title:'After-hours heatmap',copy:'See saved stock moves after the regular session closes.',href:'/after-hours-stock-heatmap/',icon:'▦'},
  {group:'Markets',title:'Fear & Greed',copy:'Explore market sentiment and its seven indicators.',href:'/fear-and-greed-index/',icon:'◔'},
  {group:'Markets',title:'Market pulse',copy:'Follow indices, gold, oil and Treasury yields.',href:app,icon:'⌁'},
  {group:'Signals',title:'Stocks to Buy',copy:'Explore stock ideas and the research behind them.',href:'/stocks-to-buy/',icon:'↗'},
  {group:'Signals',title:'Stock & options signals',copy:'Discover setups and review the original shared ideas.',href:app,icon:'ϟ'},
  {group:'Research',title:'Search for a Stock',copy:'Find company research by name or ticker.',href:'/stocks/',icon:'⌕'},
  {group:'Research',title:'Politician Trades',copy:'Explore disclosed House and Senate trades, reporting dates and research signals.',href:'/politician-trades/',icon:'≡'},
  {group:'Research',title:'Hedge Fund Activity',copy:'Compare disclosed fund holdings, new positions and quarterly portfolio changes.',href:'/hedge-fund-activity/',icon:'▥'},
  {group:'Research',title:'Insider Trades',copy:'Follow reported executive and director transactions and explore insider buying signals.',href:'/insider-trades/',icon:'◎'},
  {group:'Research',title:'Peer comparison analysis',copy:'Compare companies, industry metrics and P/S and P/E distributions.',href:app,icon:'◎'},
  {group:'Research',title:'Financials & forecasts',copy:'Explore company fundamentals and forward-looking scenarios.',href:app,icon:'▥'},
  {group:'Research',title:'Technical analysis',copy:'Study price trends, performance and technical indicators.',href:app,icon:'⌁'},
  {group:'Research',title:'Research methodology',copy:'Understand the approach behind the analysis.',href:'/methodology/',icon:'◇'},
  {group:'Options',title:'Options activity',copy:'Explore volume, open interest, calls and puts.',href:'/options-activity/',icon:'▥'},
  {group:'Options',title:'Options profit calculator',copy:'Model a payoff, breakeven and the premium at risk.',href:'/options-profit-calculator/',icon:'±'},
  {group:'Options',title:'Options strategies',copy:'Build and compare different ways to express a view.',href:'/options-strategies/',icon:'⌘'},
  {group:'News & calendar',title:'Stock Market News',copy:'Follow the latest news, research and company developments.',href:'/stock-market-news/',icon:'≡'},
  {group:'News & calendar',title:'Earnings Calendar',copy:'Plan the week ahead around company earnings.',href:'/earnings-calendar/',icon:'□'},
  {group:'News & calendar',title:'Stock Market Calendar',copy:'Track economic events, central banks and key dates.',href:'/stock-market-calendar/',icon:'▦'},
];
const iconPaths:Record<string,string> = {
 '▦':'M3 3h18v18H3z M3 10h18 M10 3v18 M16 10v11',
 '◔':'M12 3a9 9 0 1 0 9 9 M12 3v9h9 M16 3.9a9 9 0 0 1 4.1 4.1',
 '⌁':'M3 15l4-5 4 3 5-8 5 3', '↗':'M4 18L18 4 M6 4h12v12',
 'ϟ':'M13 2L4 14h7l-1 8 10-13h-8z', '⌕':'M10.5 3a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15 M16 16l5 5',
 '◎':'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18 M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10',
 '▥':'M4 20V10h4v10 M10 20V4h4v16 M16 20V7h4v13',
 '◇':'M12 2l10 10-10 10L2 12z M8 12h8 M12 8v8',
 '±':'M5 8h14 M12 3v10 M5 19h14', '⌘':'M4 5h5v5H4z M15 14h5v5h-5z M9 8h8v6 M6 10v7h9',
 '≡':'M4 3h16v18H4z M8 7h8 M8 11h8 M8 15h5',
 '□':'M3 5h18v16H3z M3 10h18 M7 3v4 M17 3v4 M7 14h3 M14 14h3'
};
const groups=['All features','Markets','Signals','Research','Options','News & calendar'];
export default function HeroFeatureExplorer(){
 const {desktop}=useSiteAccount();
 const [group,setGroup]=useState('All features');
 const shown=features.filter(f=>group==='All features'||f.group===group);
 return <div className={styles.explorer}>
  <div data-depth-card className={styles.results}>
   <div><span className={styles.eyebrow}>SELECTED RESULTS WE’VE SHARED</span><h3>Options moves worth revisiting.</h3><p>Explore the ideas, then build your own perspective.</p></div>
   <div className={styles.resultValue}><strong>30×–100×</strong><span>Overnight options examples</span></div>
   <a href={researchUrl(overnightOptionsResult.id, overnightOptionsResult.title)} className={styles.resultLink}>Revisit the shared SNOW 30× example <span aria-hidden="true">↗</span></a>
   <small>Selected historical results, not typical returns or a guarantee of future performance. Options can lose their entire premium.</small>
  </div>
  <div className={styles.explorerHeading}><div><span className={styles.eyebrow}>THE COMPLETE RESEARCH TOOLKIT</span><h3>Go from the headline to the whole picture.</h3></div><span>{features.length} ways to explore</span></div>
  <div className={styles.featureTabs} role="group" aria-label="Explore product features">{groups.map(g=><button key={g} type="button" aria-pressed={g===group} aria-controls="hero-feature-list" onClick={()=>setGroup(g)}>{g}</button>)}</div>
  <div className={styles.featureGrid} id="hero-feature-list">{shown.map(f=>{const FeatureLink=f.href===app?DesktopAppLink:'a';return <FeatureLink data-depth-card key={f.title} href={f.href} target={f.href===app ? '_blank' : undefined} rel={f.href===app ? 'noopener noreferrer' : undefined} className={styles.featureCard}>{f.href===app&&<span className={styles.featureAppBadge}>{desktop?'Membership':'In app'}</span>}<span className={styles.featureIcon} aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={iconPaths[f.icon]} /></svg></span><div><span className={styles.featureGroup}>{f.group}{f.href===app&&!desktop?' · IN THE APP':''}</span><h4>{f.title}</h4><p>{f.copy}</p></div><span className={styles.featureArrow} aria-hidden="true">↗</span></FeatureLink>})}</div>
 </div>;
}
