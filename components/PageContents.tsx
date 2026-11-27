import {useEffect,useState,type RefObject} from 'react';
import {useSiteLanguage} from '../lib/localization/use-site-language';
import styles from '../styles/PageContents.module.css';
type Entry={id:string;label:string};
const titles={en:'On this page',es:'En esta página',de:'Auf dieser Seite',fr:'Sur cette page',ja:'このページの内容',ko:'이 페이지의 내용'};
/** Uses the actual rendered headings, so conditional sections and translations stay in sync. */
export default function PageContents({content,path}:{content:RefObject<HTMLElement>;path:string}){
 const {language}=useSiteLanguage();
 const [entries,setEntries]=useState<Entry[]>([]),[active,setActive]=useState('');
 useEffect(()=>{
  const main=content.current;if(!main)return;
  const desktop=window.matchMedia('(min-width:1024px)');
  let frame=0,headings:HTMLElement[]=[];
  const update=()=>{
   frame=0;if(!desktop.matches)return;
   headings=Array.from(main.querySelectorAll<HTMLElement>('h2')).filter(h=>h.getClientRects().length>0&&!h.closest('[role="dialog"],nav,aside'));
   const next=headings.map((heading,index)=>{
    if(!heading.id){let suffix=index+1;while(document.getElementById(`page-section-${suffix}`))suffix++;heading.id=`page-section-${suffix}`;}
    return {id:heading.id,label:heading.textContent?.replace(/\s+/g,' ').trim()||''};
   }).filter(entry=>entry.label);
   setEntries(previous=>JSON.stringify(previous)===JSON.stringify(next)?previous:next);
   let current=headings[0]?.id||'';
   for(const heading of headings){if(heading.getBoundingClientRect().top<=170)current=heading.id;else break;}
   setActive(current);
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)};
  const observer=new MutationObserver(schedule);observer.observe(main,{childList:true,subtree:true,characterData:true});
  const resize=new ResizeObserver(schedule);resize.observe(main);
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);desktop.addEventListener('change',schedule);
  update();
  let hash='';try{hash=decodeURIComponent(window.location.hash.slice(1))}catch{/* Ignore malformed URL fragments. */}
  if(hash.startsWith('page-section-'))document.getElementById(hash)?.scrollIntoView();
  return()=>{cancelAnimationFrame(frame);observer.disconnect();resize.disconnect();window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);desktop.removeEventListener('change',schedule)};
 },[content,path,language]);
 if(entries.length<2)return null;
 return <aside className={styles.rail}><nav aria-label={titles[language]}><p className={styles.title}>{titles[language]}</p><ol className={styles.links}>{entries.map(entry=><li key={entry.id}><a data-public-content="true" href={`#${entry.id}`} aria-current={active===entry.id?'location':undefined} onClick={()=>setActive(entry.id)}>{entry.label}</a></li>)}</ol></nav></aside>;
}
