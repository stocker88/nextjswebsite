import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import PublicEducationPage from '../../../components/PublicEducationPage';
import {academyLessons,academyLessonPath,academyLessonDescription,type AcademyLesson} from '../../../lib/academy-lessons';
import youtubeMapping from '../../../data/learning/academy-youtube.json';
import s from '../../../styles/AcademyLessons.module.css';
import {SITE} from '../../../lib/seo';
type Related=Pick<AcademyLesson,'slug'|'title'>;
export default function Lesson({lesson,related,previous,next}:{lesson:AcademyLesson;related:Related[];previous:Related|null;next:Related|null}){
 const path=academyLessonPath(lesson),description=academyLessonDescription(lesson);
 const mapping=(youtubeMapping as Record<string,{videoId:string;sourceVideo:string|null}>)[lesson.id];
 const video=mapping&&mapping.sourceVideo===(lesson.video??null)?mapping.videoId:null;
 return <PublicEducationPage title={lesson.title+' | Free Investing Lesson'} description={description} path={path} schema={{'@context':'https://schema.org','@graph':[{'@type':'LearningResource','@id':SITE+path,name:lesson.title,description,url:SITE+path,inLanguage:'en',isAccessibleForFree:true,learningResourceType:'Lesson',educationalLevel:lesson.level===1?'Beginner':'Advanced',about:lesson.section,provider:{'@type':'Organization',name:'Stocks to Buy Now Research',url:SITE},isPartOf:{'@type':'Course',name:'Investor Academy',url:SITE+'/learn/get-certified/'}},{'@type':'BreadcrumbList',itemListElement:[{name:'Learn',url:'/learn/'},{name:'Investing lessons',url:'/learn/lessons/'},{name:lesson.title,url:path}].map((x,i)=>({'@type':'ListItem',position:i+1,name:x.name,item:SITE+x.url}))}]}}>
 <nav className={s.breadcrumb} aria-label="Breadcrumb"><Link href="/learn/">Learn</Link><span> / </span><Link href="/learn/lessons/">Investing lessons</Link><span> / {lesson.section}</span></nav>
 <header className={s.hero}><p className={s.eyebrow}>LEVEL {lesson.level} · {lesson.section} · LESSON {lesson.position}</p><h1>{lesson.title}</h1><p>{lesson.description}</p><span className={s.byline}>Stocks to Buy Now Research · Investor Academy</span></header>
 <div className={s.layout}><article className={s.article}>
 {video?<div className={s.video}><iframe src={`https://www.youtube-nocookie.com/embed/${video}`} title={lesson.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/></div>:lesson.video?<video className={s.hosted} controls playsInline preload="none" src={lesson.video} aria-label={lesson.title}/>:null}
 {lesson.body?<ReactMarkdown>{lesson.body}</ReactMarkdown>:<p>Watch the lesson above to explore {lesson.title.toLowerCase()}. Continue to the academy to review this section and check your understanding.</p>}
 <nav className={s.next} aria-label="Previous and next lessons">{previous&&<Link href={academyLessonPath(previous)}>← {previous.title}</Link>}{next&&<Link href={academyLessonPath(next)}>{next.title} →</Link>}</nav>
 </article><aside className={s.aside}><h2>Put your learning into practice</h2><p>Follow the guided lessons, take section quizzes and work toward your course-completion certificate.</p><Link className={s.button} href="/learn/get-certified/">Start the guided academy →</Link><h2>More in {lesson.section}</h2><ul>{related.map(l=><li key={l.slug}><Link href={academyLessonPath(l)}>{l.title}</Link></li>)}</ul><Link href={'/learn/lessons/#'+lesson.sectionId}>Browse this topic →</Link></aside></div>
 </PublicEducationPage>;
}
export function getStaticPaths(){return {paths:academyLessons.map(l=>({params:{slug:l.slug.split('/')}})),fallback:false};}
export function getStaticProps({params}:{params:{slug:string[]}}){
 const lesson=academyLessons.find(l=>l.slug===params.slug.join('/'));if(!lesson)return {notFound:true};
 const peers=academyLessons.filter(l=>l.sectionId===lesson.sectionId),i=peers.findIndex(l=>l.slug===lesson.slug);
 const compact=(l:AcademyLesson)=>({slug:l.slug,title:l.title});
 return {props:{lesson,related:peers.filter(l=>l.slug!==lesson.slug).slice(Math.max(0,i-3),Math.max(0,i-3)+6).map(compact),previous:i?compact(peers[i-1]):null,next:i<peers.length-1?compact(peers[i+1]):null}};
}
