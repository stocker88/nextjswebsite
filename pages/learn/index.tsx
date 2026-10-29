import {coursePath, lessonPath, duration, lessonSummary} from '../../lib/learning-format';
import {useState} from 'react';
import Link from 'next/link';
import PublicEducationPage from '../../components/PublicEducationPage';
import {courses, lessons} from '../../lib/learning';
import type {Course} from '../../lib/learning';
import {SITE} from '../../lib/seo';
import s from '../../styles/PublicEducation.module.css';

type SearchLesson = {id: string; title: string; durationSeconds: number; thumbnail: string};
export default function Learn({courseList, videoList}: {courseList: Course[]; videoList: SearchLesson[]}) {
  const [query,setQuery]=useState('');
  const matches=videoList.filter(v=>v.title.toLowerCase().includes(query.trim().toLowerCase()));
  return <PublicEducationPage title="Free stock & options courses with Aness Hussein Ali" description="Explore free courses on stocks, options and trading setups. Watch lessons by Aness Hussein Ali, founder of Stocks To Buy Now AI and Berkeley Haas MFE graduate." path="/learn/" schema={{'@context':'https://schema.org','@type':'CollectionPage',name:'Stocks To Buy Now AI course library',url:SITE+'/learn/',mainEntity:{'@type':'ItemList',itemListElement:courseList.map((c,i)=>({'@type':'ListItem',position:i+1,url:SITE+coursePath(c.slug),name:c.shortTitle}))}}}>
    <section className={s.hero}>
      <p className={s.eyebrow}>The learning library · Free to explore</p>
      <h1>Understand the market.<br/><span className={s.accent}>Build your own judgment.</span></h1>
      <p className={s.lead}>Learn the foundations, understand the risks, and connect the dots behind a setup. Practical video lessons with Aness Hussein Ali.</p>
      <div className={s.heroStats}><div><strong>{courseList.length} courses</strong>A clear place to start</div><div><strong>{videoList.length} lessons</strong>Watch at your own pace</div><div><strong>Open to everyone</strong>No account or subscription needed</div></div>
      <div className={s.actions}><a href="#courses" className={s.button}>Explore the courses <span aria-hidden="true">↓</span></a><Link href="/authors/aness-hussein-ali/" className={s.secondary}>Meet your instructor ↗</Link></div>
    </section>
    <section id="courses" className={s.section}>
      <div className={s.sectionHead}><div><p className={s.eyebrow}>Choose your starting point</p><h2>A foundation for every next step.</h2></div></div>
      <div className={s.grid}>{courseList.map(c=><article className={s.card} key={c.slug}>
        <Link href={coursePath(c.slug)} tabIndex={-1} aria-hidden="true"><img src={c.thumbnail} alt="" className={s.cardImage} loading="lazy" width="480" height="270"/></Link>
        <div className={s.cardBody}><span className={s.tag}>{c.level}</span><h2><Link href={coursePath(c.slug)}>{c.shortTitle}</Link></h2><p>{c.description}</p><div className={s.meta}><span>{c.videoIds.length} lessons</span><span>{duration(c.durationSeconds)} total</span></div><Link className={s.cardLink} href={coursePath(c.slug)}>Explore course <span aria-hidden="true">↗</span></Link></div>
      </article>)}</div>
    </section>
    <section className={s.section} aria-labelledby="find-lesson"><h2 id="find-lesson">Find a lesson.</h2><label className={s.search}><span aria-hidden="true">⌕</span><input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try calls, allocation, earnings…" aria-label="Search all course lessons"/></label>
      {query.trim() && <><p className={s.notice} role="status">{matches.length} {matches.length===1?'lesson':'lessons'} found</p><ul className={s.lessonList}>{matches.map((v,i)=><li key={v.id}><Link href={lessonPath(v.id)} className={s.lesson}><span className={s.lessonNumber}>{String(i+1).padStart(2,'0')}</span><img src={v.thumbnail} alt="" loading="lazy" width="120" height="68"/><div><strong>{v.title}</strong><small>{duration(v.durationSeconds)} · Watch lesson</small></div><span className={s.lessonArrow} aria-hidden="true">↗</span></Link></li>)}</ul></>}
    </section>
    <section className={`${s.section} ${s.teacher}`}><img src="/assets/images/aness.jpg" alt="Aness Hussein Ali" width="190" height="190" loading="lazy"/><div><span className={s.tag}>Meet your instructor</span><h2>Aness Hussein Ali</h2><p>Founder of Stocks To Buy Now AI. Master of Financial Engineering, UC Berkeley Haas, with experience at Goldman Sachs. Explore his background, diploma and professional profile.</p><div className={s.actions}><Link href="/authors/aness-hussein-ali/" className={s.textLink}>Education & experience ↗</Link></div></div></section>
    <p className={s.notice}>These courses are for education. Examples illustrate concepts and are not promises of returns. Options can lose their full premium; understand a strategy’s risks before using it.</p>
  </PublicEducationPage>;
}
export function getStaticProps(){return {props:{courseList:courses,videoList:lessons.map(({id,title,durationSeconds,thumbnail})=>({id,title,durationSeconds,thumbnail}))}};}
