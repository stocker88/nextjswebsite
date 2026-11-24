const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),ts=require('typescript'),React=require('react');
let hook=0,calls=[],fail=false;
const source=fs.readFileSync('components/ProfileOnboarding.tsx','utf8');
const exportsForTest={};
const jsx={jsx:(type,props)=>({type,props}),jsxs:(type,props)=>({type,props})};
const mockRequire=name=>{
 if(name==='react/jsx-runtime')return jsx;
 if(name==='react')return {...React,useState:v=>{const i=hook++;return [i===0?4:typeof v==='function'?v():v,()=>{}]},useEffect:()=>{},useMemo:f=>f(),useRef:v=>({current:v})};
 if(name.endsWith('.module.css'))return {default:new Proxy({},{get:(_,k)=>k})};
 if(name==='next/router')return {};
 if(name.endsWith('/profile-onboarding'))return {normalizeUsername:v=>v,usernameValidationMessage:()=>'',onboardingQuestions:[{},{},{}],completeProfileOnboarding:async()=>{calls.push('save');if(fail)throw Error('Save failed')}};
 if(name.endsWith('/onboarding-signal-preview'))return {onboardingSignalPreviews:[],lockedSignalPreviews:[]};
 if(name.endsWith('/signup-progress'))return {trackSignupProgress:(s,a)=>calls.push(s+':'+a),signupErrorCode:()=> 'unknown'};
 if(name.endsWith('/acquisition'))return {sourceOptions:[]};
 return {};
};
vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{exports:exportsForTest,require:mockRequire,Intl,Date,URL});
function find(node){if(!node||typeof node!=='object')return null;if(node.type==='button'&&node.props.children==='Receive new signals now →')return node;for(const child of [node.props?.children].flat(Infinity)){const result=find(child);if(result)return result}return null}
(async()=>{
 for(fail of [false,true]){
  hook=0;calls=[];
  const tree=exportsForTest.ProfileOnboarding({user:{uid:'test',displayName:'test'},onComplete:async()=>calls.push('navigate')});
  const button=find(tree);assert(button,'Signal button is present');button.props.onClick();await new Promise(resolve=>setImmediate(resolve));
  assert.deepEqual(calls,fail?['save:attempt','save','save:error']:['save:attempt','save','complete:success','navigate']);
 }
 assert(source.includes("router.replace('/membership/?from=onboarding')"));
 console.log('PASS: signal click saves profile before navigation; save errors prevent navigation.');
})().catch(e=>{console.error(e);process.exit(1)});
