const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript'),React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');
const course=require('../data/learning/academy.json');
assert.equal(course.sections.filter(s=>s.level===1).length,8);assert.equal(course.passPercent,.9);
for(const s of course.sections){assert(s.lessons.length&&s.questions.length);for(const l of s.lessons){assert(l.id&&l.title&&(l.body||l.video));if(l.video)assert.equal(new URL(l.video).protocol,'https:');}for(const q of s.questions){assert(q.choices.length>=2);assert(!('correctIndex'in q));assert(!('explanation'in q));}}
let user=null,progress=null,index=0,renderSection=0,renderLesson=0,renderQuiz=false;
const code=ts.transpileModule(fs.readFileSync('pages/learn/get-certified.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true,target:ts.ScriptTarget.ES2020}}).outputText;
const moduleObject={exports:{}};
new Function('require','module','exports',code)(name=>{
 if(name==='react')return {...React,useState:initial=>{const current=index++;return [current===0?(progress?{uid:'test',progress}:null):current===1?renderSection:current===2?renderLesson:current===3?renderQuiz:initial,()=>{}]},useEffect:()=>{}};
 if(name==='next/link')return ({href,children,...props})=>React.createElement('a',{href,...props},children);
 if(name==='react-markdown')return ({children})=>React.createElement('div',null,children);
 if(name.includes('PublicEducationPage'))return ({children})=>React.createElement('main',null,children);
 if(name.includes('AcademyNextStep'))return ()=>null;
 if(name.includes('SiteAccount'))return {useSiteAccount:()=>({user,ready:true})};
 if(name.includes('site-auth'))return {accountLoginUrl:next=>'/login/?next='+encodeURIComponent(next)};
 if(name.includes('lib/academy'))return {academyAction:()=>{throw Error('Rendering must not mutate progress')},downloadCertificate:()=>{},printCertificate:()=>{},certificateSvg:()=>'sample'};
 if(name.endsWith('academy-youtube.json'))return require('../data/learning/academy-youtube.json');
 if(name.endsWith('.json'))return course;
 if(name.endsWith('.css'))return new Proxy({},{get:(_,key)=>String(key)});
 return require(name);
},moduleObject,moduleObject.exports);
const render=()=>{index=0;return renderToStaticMarkup(React.createElement(moduleObject.exports.default));};
let html=render();assert.match(html,/Get certified/);assert.match(html,/Sign in to save progress/);assert.doesNotMatch(html,/Write a review on Trustpilot|Download certificate/);
user={uid:'test'};progress={version:course.version,completedQuestions:[],sectionSurveyProgress:{},levelOneComplete:false,certificate:null,reviewEligible:false,feedback:null};html=render();assert.doesNotMatch(html,/Download certificate|Create my certificate|Write a review on Trustpilot/);
progress={...progress,levelOneComplete:true,reviewEligible:true,sectionSurveyProgress:Object.fromEntries(course.sections.slice(0,8).map(s=>[s.category,{passed:true}]))};html=render();assert.match(html,/Create my certificate/);assert.match(html,/Write a review on Trustpilot/);assert.match(html,/No thanks/);
progress.certificate={id:'course-test',name:'Test <Learner>',issuedAt:'2026-11-27T12:00:00Z',level:1,courseVersion:course.version};html=render();assert.match(html,/Download certificate/);assert.match(html,/Test &lt;Learner&gt;/);assert.doesNotMatch(html,/Create my certificate/);
progress.reviewEligible=false;html=render();assert.match(html,/Download certificate/);assert.doesNotMatch(html,/Write a review on Trustpilot/);
user={uid:'different-account'};html=render();assert.doesNotMatch(html,/Download certificate|Test &lt;Learner&gt;/);
console.log('Academy checks passed: public curriculum without answer keys, signed-out/incomplete/certified states, optional review invitation, and account isolation.');

const youtubeMapping=require('../data/learning/academy-youtube.json');
const catalog=require('../data/learning/catalog.json');
for(const [id,mapping] of Object.entries(youtubeMapping)){
 const lesson=course.sections.flatMap(s=>s.lessons).find(l=>l.id===id);
 assert(lesson,'Mapping must reference an app lesson');
 assert.equal(mapping.sourceVideo,lesson.video??null,'Mapping must match current app video');
 assert(catalog.videos.some(v=>v.id===mapping.videoId),'Mapping must reference a known channel video');
}
user=null;progress=null;renderSection=course.sections.findIndex(s=>s.lessons.some(l=>l.id==='call_option'));
renderLesson=course.sections[renderSection].lessons.findIndex(l=>l.id==='call_option');
html=render();assert.match(html,/youtube-nocookie.com\/embed\/Fpin1GiI8i0/);assert.doesNotMatch(html,/<video/);
renderSection=0;renderLesson=course.sections[0].lessons.findIndex(l=>l.id==='starter_tips');
html=render();assert.match(html,/<video/);assert.doesNotMatch(html,/youtube-nocookie.com\/embed/);
console.log('YouTube lesson checks passed: verified mappings, embedded player and unmapped hosted fallback.');

renderSection=course.sections.findIndex(s=>s.lessons.some(l=>l.id==='Market Order vs. Limit Order'));renderLesson=course.sections[renderSection].lessons.findIndex(l=>l.id==='Market Order vs. Limit Order');html=render();assert.match(html,/youtube-nocookie.com\/embed\/MM1vZyTEq1Q/);console.log('Market/limit order lesson includes the execution video.');

renderSection=0;renderLesson=0;renderQuiz=true;user={uid:'test'};progress={version:course.version,completedQuestions:[],sectionSurveyProgress:{},levelOneComplete:false,certificate:null,reviewEligible:false,feedback:null};html=render();assert.doesNotMatch(html,/Check your understanding|>Section quiz</);assert.match(html,/Next lesson/);assert.match(html,/disabled=""[^>]*title="Pass the previous section/);
progress.completedQuestions=course.sections[0].lessons.map(l=>l.id);html=render();assert.match(html,/Check your understanding/);assert.match(html,/Submit questionnaire/);console.log('Sequential UI checks passed: quiz hidden until all lessons are reviewed and future sections locked.');

renderQuiz=false;progress.levelOneComplete=true;progress.sectionSurveyProgress=Object.fromEntries(course.sections.map(s=>[s.category,{passed:true}]));progress.reviewEligible=true;progress.levelTwoComplete=false;html=render();assert.match(html,/Start Level 2/);assert.match(html,/no review is required/);progress.reviewEligible=false;html=render();assert.match(html,/Start Level 2/);progress.levelTwoComplete=true;progress.reviewEligible=true;html=render();assert.match(html,/Want to see more learning content/);assert.doesNotMatch(html,/Start Level 2/);progress.reviewEligible=false;progress.reviewLinkClicked=true;html=render();assert.doesNotMatch(html,/Want to see more learning content/);console.log('Review flow checks passed: independent Level 2 access and conditional end-of-Level-2 invitation.');
