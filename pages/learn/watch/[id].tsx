import {coursePath, lessonPath, duration, lessonSummary} from '../../../lib/learning-format';
import Link from 'next/link';
import PublicEducationPage from '../../../components/PublicEducationPage';
import {courses,lessons} from '../../../lib/learning';
import type {Course,Lesson} from '../../../lib/learning';
import {SITE,breadcrumbs} from '../../../lib/seo';
import s from '../../../styles/PublicEducation.module.css';

type Adjacent = {id:string;title:string}|null;
export default function Watch({lesson,course,previous,next}:{lesson:Lesson;course:Course;previous:Adjacent;next:Adjacent}){
  const description=lessonSummary(lesson);
  const published=new Intl.DateTimeFormat('en-US',{dateStyle:'long',timeZone:'UTC'}).format(new Date(lesson.publishedAt));
  return <PublicEducationPage title={lesson.title} description={description} path={lessonPath(lesson.id)} image={lesson.thumbnail} schema={[
    {'@context':'https://schema.org','@type':'VideoObject','@id':SITE+lessonPath(lesson.id)+'#video',name:lesson.title,description,thumbnailUrl:[lesson.thumbnail],uploadDate:lesson.publishedAt,duration:`PT${lesson.durationSeconds}S`,embedUrl:`https://www.youtube-nocookie.com/embed/${lesson.id}`,url:SITE+lessonPath(lesson.id),isAccessibleForFree:true,inLanguage:'en',creator:{'@type':'Person','@id':SITE+'/authors/aness-hussein-ali/#person',name:'Aness Hussein Ali'},isPartOf:{'@type':'Course',name:course.shortTitle,url:SITE+coursePath(course.slug)}},
    breadcrumbs([{name:'Learn',path:'/learn/'},{name:course.shortTitle,path:coursePath(course.slug)},{name:lesson.title,path:lessonPath(lesson.id)}])
  ]}>
    <nav className={s.breadcrumb} aria-label="Breadcrumb"><Link href="/learn/">Learning library</Link><span aria-hidden="true">/</span><Link href={coursePath(course.slug)}>{course.shortTitle}</Link><span aria-hidden="true">/</span><span>Lesson {course.videoIds.indexOf(lesson.id)+1}</span></nav>
    <div className={s.player}><iframe src={`https://www.youtube-nocookie.com/embed/${lesson.id}`} title={lesson.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/></div>
    <p className={s.eyebrow}>Lesson {course.videoIds.indexOf(lesson.id)+1} of {course.videoIds.length} · {duration(lesson.durationSeconds)}</p><h1 className={s.watchTitle}>{lesson.title}</h1><div className={s.meta}><span>Published {published}</span><a className={s.textLink} href={`https://www.youtube.com/watch?v=${lesson.id}`} target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a></div>
    <div className={s.watchGrid}><section><h2>About this lesson</h2><p className={s.notesSummary}>Original lesson notes from the instructor’s YouTube description.</p><div className={s.notes}>{lesson.description || 'Watch the video above for the full lesson.'}</div>
      {!!lesson.transcript.length && <details className={s.details}><summary>{lesson.captionsAutomatic?'Automatic captions':'Video transcript'}</summary><p className={s.notice}>YouTube captions{lesson.captionsAutomatic?' may contain transcription errors':''}.</p><div className={s.notes}>{lesson.transcript.map((line,i)=><p key={i}>{line.text}</p>)}</div></details>}
      <p className={s.notice}>This lesson is educational. Examples reflect the context in which they were recorded and do not guarantee returns. Check current information before making a financial decision.</p>
    </section><aside><div className={s.panel}><div className={s.byline}><img src="/assets/images/aness.jpg" width="50" height="50" alt=""/><div><Link href="/authors/aness-hussein-ali/"><strong>Aness Hussein Ali</strong></Link>Your instructor</div></div><p>Master of Financial Engineering, UC Berkeley Haas. Founder of Stocks To Buy Now AI.</p><Link href="/authors/aness-hussein-ali/" className={s.cardLink}>View background ↗</Link></div><div className={`${s.panel} ${s.section}`}><span className={s.tag}>Continue the course</span><h3>{course.shortTitle}</h3>{next?<Link className={s.nextLesson} href={lessonPath(next.id)}><span>Up next →</span>{next.title}</Link>:<p>You’ve reached the last lesson in this playlist. Explore another course when you’re ready.</p>}{previous&&<Link className={s.nextLesson} href={lessonPath(previous.id)}><span>← Previous lesson</span>{previous.title}</Link>}<Link href={coursePath(course.slug)} className={s.button}>View all lessons</Link></div></aside></div>
  </PublicEducationPage>;
}
export function getStaticPaths(){return {paths:lessons.map(v=>({params:{id:v.id}})),fallback:false};}
export function getStaticProps({params}:{params:{id:string}}){const lesson=lessons.find(v=>v.id===params.id);if(!lesson)return {notFound:true};const course=courses.find(c=>c.videoIds.includes(lesson.id))!;const index=course.videoIds.indexOf(lesson.id);const adjacent=(i:number)=>{const v=lessons.find(v=>v.id===course.videoIds[i]);return v?{id:v.id,title:v.title}:null;};return {props:{lesson,course,previous:adjacent(index-1),next:adjacent(index+1)}};}
