import {useState} from 'react';
import Link from 'next/link';
import PublicEducationPage from '../../../components/PublicEducationPage';
import {academyLessons,academyLessonPath} from '../../../lib/academy-lessons';
import s from '../../../styles/AcademyLessons.module.css';
type Entry={slug:string;title:string;description:string;section:string;sectionId:string;level:number};
export default function Lessons({lessons}:{lessons:Entry[]}){
 const [query,setQuery]=useState('');const sections=Array.from(new Set(lessons.map(l=>l.sectionId)));
 const matches=lessons.filter(l=>(l.title+' '+l.description+' '+l.section).toLowerCase().includes(query.trim().toLowerCase()));
 return <PublicEducationPage title="Free Investing Lessons: Stocks, Options & Risk Management" description="Browse free investing lessons on stock analysis, call and put options, portfolio allocation, earnings, risk management and macro events. Read or watch at your pace." path="/learn/lessons/">
 <header className={s.hero}><p className={s.eyebrow}>INVESTOR ACADEMY · FREE LEARNING LIBRARY</p><h1>Learn the topic.<br/>Understand the trade.</h1><p>{lessons.length} lessons on stocks, options, market events and risk. Read any topic freely, or follow the academy to complete quizzes and earn your certificate.</p><Link className={s.button} href="/learn/get-certified/">Start the guided academy →</Link></header>
 <p><Link href="/guides/how-to-make-1000-a-month-trading-stocks/">How much capital would $1,000 a month from stocks require? Explore the guide and calculator →</Link></p><label className={s.search}>Find a lesson<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try call options, earnings, bid and ask…"/></label>
 <nav className={s.topics} aria-label="Lesson topics">{sections.map(id=><a key={id} href={'#'+id}>{lessons.find(l=>l.sectionId===id)!.section}</a>)}</nav>
 {sections.map(id=>{const list=matches.filter(l=>l.sectionId===id);return list.length?<section id={id} className={s.section} key={id}><p className={s.eyebrow}>LEVEL {list[0].level}</p><h2>{list[0].section}</h2><div className={s.grid}>{list.map(l=><Link className={s.card} href={academyLessonPath(l)} key={l.slug}><h3>{l.title} ↗</h3><p>{l.description}</p></Link>)}</div></section>:null;})}
 {!matches.length&&<p>No matching lessons. Try another topic.</p>}
 </PublicEducationPage>;
}
export function getStaticProps(){return {props:{lessons:academyLessons.map(({slug,title,description,section,sectionId,level})=>({slug,title,description,section,sectionId,level}))}};}
