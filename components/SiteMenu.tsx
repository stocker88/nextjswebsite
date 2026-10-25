import {useSiteAccount} from './SiteAccount';
import {accountLoginUrl} from '../lib/site-auth';
import {useEffect, useRef, useState} from 'react';
import {siteNavigation} from '../lib/site-navigation';
import styles from '../styles/SiteMenu.module.css';

const find = (href:string) => siteNavigation.find(item => item.href === href)!;
const groups = [
  {name:'Markets', intro:'Your view of the market.', description:'From the big picture to the dates that matter.', links:[find('/stock-market-heatmap/'),find('/premarket-stock-heatmap/'),find('/after-hours-stock-heatmap/'),find('/fear-and-greed-index/'),find('/hormuz-transit-index/'),find('/pentagon-pizza-index/'),find('/stock-market-news/'),find('/earnings-calendar/'),find('/stock-market-calendar/'),find('/industries/')]},
  {name:'Research', intro:'Go beyond the ticker.', description:'Explore companies, stock ideas and options tools.', links:[find('/stocks-to-buy/'),find('/stocks/'),find('/smart-money/'),find('/insider-news/'),find('/options-activity/'),find('/results/'),{label:'Research methodology',href:'/methodology/',detail:'Understand the approach behind the research'}]},
  {name:'Learn', intro:'Build your understanding.', description:'Make space for a more informed investing routine.', links:[find('#how-it-works'),find('#watch-and-learn'),{label:'Investing glossary',href:'/glossary/',detail:'Understand the language of the market'},{label:'Editorial standards',href:'/editorial-policy/',detail:'How research and educational content are presented'}]},
  {name:'Company', intro:'Meet Stocks To Buy Now AI.', description:'The purpose, principles and people behind the product.', links:[{label:'About us',href:'/company/',detail:'Why we are building Stocks To Buy Now AI'},{label:'Culture',href:'/company/culture/',detail:'The principles we build by'},{label:'Careers',href:'/company/careers/',detail:'Explore future opportunities'},find('#about-aness'),{label:'Contact us',href:'mailto:support@stockstobuynow.ai',detail:'Get in touch with the team'}]},
];
export default function SiteMenu({isOpen,onClose,navBasePath=''}:{isOpen:boolean;onClose:()=>void;navBasePath?:string}) {
  const {user}=useSiteAccount();
  const [active,setActive]=useState<string|null>(null);
  const root=useRef<HTMLDivElement>(null);
  useEffect(()=>{if(!isOpen)setActive(null);},[isOpen]);
  useEffect(()=>{
    const escape=(event:KeyboardEvent)=>{if(event.key!=='Escape')return; const trigger=root.current?.querySelector<HTMLButtonElement>('button[aria-expanded="true"]');setActive(null);if(isOpen){onClose();document.querySelector<HTMLButtonElement>('[aria-controls="site-navigation-links"]')?.focus();}else trigger?.focus();};
    const outside=(event:PointerEvent)=>{if(!root.current?.contains(event.target as Node))setActive(null);};
    document.addEventListener('keydown',escape);document.addEventListener('pointerdown',outside);
    return()=>{document.removeEventListener('keydown',escape);document.removeEventListener('pointerdown',outside);};
  },[isOpen,onClose]);
  useEffect(()=>{
    if(!isOpen)return;
    const before=document.body.style.overflow;
    document.body.style.overflow='hidden';
    return()=>{document.body.style.overflow=before;};
  },[isOpen]);
  useEffect(()=>{
    if(!isOpen)return;
    const nav=root.current?.closest('nav');
    const trap=(event:KeyboardEvent)=>{
      if(event.key!=='Tab'||!nav)return;
      const items=Array.from(nav.querySelectorAll<HTMLElement>('a[href],button')).filter(item=>item.getClientRects().length>0);
      const first=items[0],last=items[items.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
    };
    const desktop=window.matchMedia('(min-width: 1000px)');
    const resize=()=>{if(desktop.matches)onClose();};
    desktop.addEventListener('change',resize);document.addEventListener('keydown',trap);
    return()=>{desktop.removeEventListener('change',resize);document.removeEventListener('keydown',trap);};
  },[isOpen,onClose]);
  const close=()=>{setActive(null);onClose();};
  return <div ref={root} id="site-navigation-links" className={`${styles.menu} ${isOpen?styles.mobileOpen:''}`} onMouseLeave={()=>{if(window.matchMedia('(min-width: 1000px) and (hover: hover)').matches)setActive(null);}} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node))setActive(null);}}>
    {groups.map(group=><div key={group.name} className={styles.group} onMouseEnter={()=>{if(window.matchMedia('(min-width: 1000px) and (hover: hover)').matches)setActive(group.name);}}>
      <button type="button" className={styles.trigger} aria-expanded={active===group.name} aria-controls={`menu-${group.name.toLowerCase()}`} onClick={()=>setActive(active===group.name?null:group.name)} onKeyDown={event=>{if(event.key==='ArrowDown'){event.preventDefault();setActive(group.name);requestAnimationFrame(()=>document.getElementById(`menu-${group.name.toLowerCase()}`)?.querySelector<HTMLAnchorElement>('a')?.focus());}}}>
        {group.name}<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>
      </button>
      <div id={`menu-${group.name.toLowerCase()}`} hidden={active!==group.name} className={styles.panel}>
        <div className={styles.intro}><span>EXPLORE / {group.name.toUpperCase()}</span><h2>{group.intro}</h2><p>{group.description}</p><span className={styles.arrow} aria-hidden="true">↗</span></div>
        <div className={styles.links}>{group.links.map(item=><a key={item.href} href={item.href==='/results/'&&!user?accountLoginUrl('/results/'):item.href.startsWith('#')?`${navBasePath||'/'}${item.href}`:item.href} onClick={close}><span>{item.label}<span aria-hidden="true">↗</span></span><small>{item.detail}</small></a>)}</div>
      </div>
    </div>)}
    <a className={styles.mobileContact} href="mailto:support@stockstobuynow.ai">Contact the team ↗</a>
  </div>;
}
