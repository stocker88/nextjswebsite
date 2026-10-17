import OptionsLearningGuides from '../OptionsLearningGuides';
import Head from 'next/head';
import OptionsSignalsPromo from '../OptionsSignalsPromo';
import Header from '../layout/Header';
import styles from './OptionsTools.module.css';
import {ReactNode} from 'react';
export function OptionsToolNav({active}:{active:string}){return <nav className={styles.nav} aria-label="Options tools">{[['/options-activity/','Activity explorer'],['/options-profit-calculator/','Profit calculator'],['/options-strategies/','Prebuilt strategies']].map(([href,label])=><a key={href} href={href} aria-current={active===href?'page':undefined}>{label}<span className={styles.navArrow} aria-hidden="true">→</span></a>)}</nav>}
export default function OptionsToolLayout({title,description,path,children}:{title:string;description:string;path:string;children:ReactNode}){return <><Head><title>{title} | StocksToBuyNow.ai</title><meta name="description" content={description}/><link rel="canonical" href={'https://www.stockstobuynow.ai'+path}/></Head><Header forceDark homeHref="/" navBasePath="/"/><main className={styles.page}>{children}{path!=='/options-research-guide/'&&<OptionsLearningGuides/>}<OptionsSignalsPromo from={path.replace(/[^a-z]+/g,'_')}/><footer className={styles.footer}><span>StocksToBuyNow.ai · Options research tools</span><a href="/options-activity/">Explore options activity →</a><a href="/earnings-calendar/">Check upcoming earnings →</a></footer></main></>}
