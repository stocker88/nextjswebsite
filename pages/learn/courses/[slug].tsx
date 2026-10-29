import {coursePath, lessonPath, duration} from '../../../lib/learning-format';
import Link from 'next/link';
import PublicEducationPage from '../../../components/PublicEducationPage';
import {courses,lessons} from '../../../lib/learning';
import type {Course,Lesson} from '../../../lib/learning';
import {SITE,breadcrumbs} from '../../../lib/seo';
import s from '../../../styles/PublicEducation.module.css';

type CourseLesson = Pick<Lesson,'id'|'title'|'durationSeconds'|'thumbnail'>;
export default function CoursePage({course,videoList}:{course:Course;videoList:CourseLesson[]}){
  return <PublicEducationPage title={`${course.shortTitle} — free video course`} description={course.description} path={coursePath(course.slug)} image={course.thumbnail} schema={[
    {'@context':'https://schema.org','@type':'Course',name:course.shortTitle,description:course.description,url:SITE+coursePath(course.slug),isAccessibleForFree:true,inLanguage:'en',provider:{'@type':'Organization',name:'Stocks To Buy Now AI',url:SITE},creator:{'@type':'Person','@id':SITE+'/authors/aness-hussein-ali/#person',name:'Aness Hussein Ali'},hasPart:videoList.map(v=>({'@type':'LearningResource',name:v.title,url:SITE+lessonPath(v.id),learningResourceType:'Video lesson'}))},
    breadcrumbs([{name:'Learn',path:'/learn/'},{name:course.shortTitle,path:coursePath(course.slug)}])
  ]}>
    <nav className={s.breadcrumb} aria-label="Breadcrumb"><Link href="/learn/">Learning library</Link><span aria-hidden="true">/</span><span>{course.shortTitle}</span></nav>
    <section className={s.hero}><p className={s.eyebrow}>Free course · {course.level}</p><h1>{course.title}</h1><p className={s.lead}>{course.description}</p><div className={s.topics}>{course.topics.map(t=><span key={t}>{t}</span>)}</div><div className={s.byline}><img src="/assets/images/aness.jpg" width="50" height="50" alt=""/><div><Link href="/authors/aness-hussein-ali/"><strong>Aness Hussein Ali</strong></Link>Berkeley Haas MFE · Founder, Stocks To Buy Now AI</div></div><div className={s.actions}><Link className={s.button} href={lessonPath(videoList[0].id)}>Start learning <span aria-hidden="true">▶</span></Link><a className={s.secondary} href={`https://www.youtube.com/playlist?list=${course.playlistId}`} target="_blank" rel="noopener noreferrer">YouTube playlist ↗</a></div></section>
    <section><div className={s.sectionHead}><h2>Your lesson plan</h2><span className={s.meta}>{videoList.length} lessons · {duration(course.durationSeconds)} total</span></div><ol className={s.lessonList}>{videoList.map((v,i)=><li key={v.id}><Link className={s.lesson} href={lessonPath(v.id)}><span className={s.lessonNumber}>{String(i+1).padStart(2,'0')}</span><img src={v.thumbnail} alt="" loading="lazy" width="120" height="68"/><div><strong>{v.title}</strong><small>{duration(v.durationSeconds)} · Free video lesson</small></div><span aria-hidden="true" className={s.lessonArrow}>↗</span></Link></li>)}</ol><p className={s.notice}>Lessons follow the public YouTube playlist order. Unavailable or private videos are not included. Education and examples are not guarantees of future performance.</p></section>
    <div className={`${s.section} ${s.panel}`}><h3>Keep exploring</h3><p>Find more lessons on stock research, options pricing and the risks behind market signals.</p><div className={s.actions}><Link className={s.textLink} href="/learn/">All free courses →</Link><Link className={s.textLink} href="/glossary/">Investing glossary →</Link></div></div>
  </PublicEducationPage>;
}
export function getStaticPaths(){return {paths:courses.map(c=>({params:{slug:c.slug}})),fallback:false};}
export function getStaticProps({params}:{params:{slug:string}}){const course=courses.find(c=>c.slug===params.slug);if(!course)return {notFound:true};return {props:{course,videoList:course.videoIds.map(id=>{const v=lessons.find(v=>v.id===id)!;return {id:v.id,title:v.title,durationSeconds:v.durationSeconds,thumbnail:v.thumbnail};})}};}
