// Server-render the real onboarding screen at each step. No auth/network calls or writes.
// Optional: ONBOARDING_CAPTURE_DIR=/absolute/path node scripts/onboarding-progress-check.cjs
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const ts=require('typescript'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(__dirname,'..');
let step=1,hook=0;
const styles=new Proxy({},{get:(_,key)=>String(key)});
function load(relative){
 const exports={};
 const code=ts.transpileModule(fs.readFileSync(path.join(root,relative),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 const scopedRequire=name=>{
  if(name==='react')return {...React,useState:value=>{const index=hook++;return React.useState(index===0?step:index===3?{experience:'Beginner',interest:'Stocks',horizon:'Short-term'}:value)}};
  if(name.endsWith('.module.css'))return {default:styles};
  if(name==='next/router')return {useRouter:()=>({})};
  if(name.endsWith('/profile-onboarding'))return profile;
  if(name==='./OnboardingQuestion')return question;
  if(name==='./UsernameSuggestions')return suggestions;
  if(name==='./TrustpilotWidget')return {default:()=>null};
  if(name.endsWith('/onboarding-signal-preview'))return load('lib/onboarding-signal-preview.ts');
  if(name.endsWith('/acquisition'))return {sourceOptions:[]};
  if(/site-auth|site-account-hint|account-devices|signup-progress/.test(name))return {};
  return require(name);
 };
 vm.runInNewContext(code,{exports,require:scopedRequire,Intl,Date,URL},{filename:relative});
 return exports;
}
const profile=load('lib/profile-onboarding.ts');
const question=load('components/OnboardingQuestion.tsx');
const suggestions=load('components/UsernameSuggestions.tsx');
const {ProfileOnboarding}=load('components/ProfileOnboarding.tsx');
const output=process.env.ONBOARDING_CAPTURE_DIR;
const css=fs.readFileSync(path.join(root,'styles/ProfileOnboarding.module.css'),'utf8');
for(step=0;step<=profile.onboardingQuestions.length+1;step++){
 hook=0;
 const html=renderToStaticMarkup(React.createElement(ProfileOnboarding,{user:{uid:'local-preview-only',displayName:'preview',photoURL:'/assets/images/stockerRobotIcon.png'},onComplete:()=>{}}));
 assert(!html.includes('of 5'),'Do not count profile/results as questions');
 if(step>=1&&step<=profile.onboardingQuestions.length){
  assert(html.includes(`aria-valuenow="${step}"`));
  assert(html.includes(`aria-valuemax="${profile.onboardingQuestions.length}"`));
  assert(html.includes(`Question ${step} of ${profile.onboardingQuestions.length}`));
  const remaining=profile.onboardingQuestions.length-step;
  assert(html.includes(remaining===0?'Last question — your results are next.':`${remaining} more ${remaining===1?'question':'questions'} after this`));
 }else if(step===0){assert(html.includes('Then just 3 quick questions before your results.'));assert(html.includes('Choose your username.'));assert(!html.includes('type="file"'));}
 else {
  assert(html.includes('ALL 3 QUESTIONS COMPLETE'));
  const previews=load('lib/onboarding-signal-preview.ts');
  assert.equal((html.match(/Receive new signals now/g)||[]).length,1+previews.onboardingSignalPreviews.length+previews.lockedSignalPreviews.length,'Signal action must appear above previews and below every financial chart');
  for(const card of html.match(/<article class="signalCard lockedSignalCard"[\s\S]*?<\/article>/g)||[]){
   assert(card.indexOf('Receive new signals now')>card.indexOf('compactFinancial'),'Locked revenue charts must precede their signal action');
  }
  for(const card of html.match(/<article class="signalCard"[\s\S]*?<\/article>/g)||[]){
   assert(card.indexOf('Receive new signals now')>card.indexOf('financialPanel'),'Keep the price and financial charts together before the Pro action');
  }
 }
 if(output){
  fs.mkdirSync(output,{recursive:true});
  fs.writeFileSync(path.join(output,`web-question-${step}.html`),`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Onboarding preview</title><style>html,body{margin:0}*{box-sizing:border-box}${css}</style>${html}</html>`);
 }
}
// No provider photo still renders a usable username-only form.
step=0;hook=0;
const noPhoto=renderToStaticMarkup(React.createElement(ProfileOnboarding,{user:{uid:'local-preview-only',displayName:'preview',photoURL:null},onComplete:()=>{}}));
assert(!noPhoto.includes('Add profile picture')&&!noPhoto.includes('type="file"'));
assert(noPhoto.includes('Choose your username.')&&noPhoto.includes('Continue →'));
// A changed total remains accurate without UI edits.
const four=renderToStaticMarkup(React.createElement(question.QuestionProgress,{current:3,total:4}));
assert(four.includes('Question 3 of 4')&&four.includes('1 more question after this'));
console.log('PASS: actual onboarding screen renders profile, all 3 questions, remaining counts, results and dynamic totals.');
