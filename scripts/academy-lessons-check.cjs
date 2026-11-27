const fs=require('node:fs'),ts=require('typescript'),assert=require('node:assert/strict');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true,target:ts.ScriptTarget.ES2020}}).outputText,f);
const {academyLessons,academyLessonPath,academyLessonDescription}=require('../lib/academy-lessons.ts');
const {learningPaths}=require('../lib/learning.ts');
const course=require('../data/learning/academy.json');
assert.equal(academyLessons.length,course.sections.reduce((n,s)=>n+s.lessons.length,0));
assert.equal(new Set(academyLessons.map(academyLessonPath)).size,academyLessons.length);
for(const l of academyLessons){assert(learningPaths().includes(academyLessonPath(l)));assert(l.body||l.video);assert(academyLessonDescription(l).length<=160);assert(l.title&&l.description);}
const page=fs.readFileSync('pages/learn/lessons/[...slug].tsx','utf8');
assert.match(page,/getStaticPaths/);assert.match(page,/fallback:false/);assert.match(page,/LearningResource/);assert.match(page,/BreadcrumbList/);assert.match(page,/<ReactMarkdown>\{lesson.body\}/);
assert.match(fs.readFileSync('pages/sitemap.xml.tsx','utf8'),/learningPaths\(\)/);
console.log(`Academy SEO checks passed: ${academyLessons.length} unique lessons, full content, descriptions and sitemap paths.`);
