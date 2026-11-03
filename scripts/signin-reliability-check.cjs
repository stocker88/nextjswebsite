const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript');
function load(file,mocks){const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,{exports,require:n=>{if(n in mocks)return mocks[n];throw Error(n)},process:{env:{}},Promise,Date,Error});return exports}
let calls=0,attempts=0,successes=0,failures=0,resolvePopup,rejectPopup;
class Provider{setCustomParameters(){}addScope(){}}
const sdk={GoogleAuthProvider:Provider,FacebookAuthProvider:Provider,TwitterAuthProvider:Provider,OAuthProvider:Provider,getAdditionalUserInfo:()=>({isNewUser:true}),signInWithPopup:()=>{calls++;return new Promise((r,j)=>{resolvePopup=r;rejectPopup=j})}};
const auth=load('lib/site-sign-in.ts',{'./analytics':{trackAuthentication(){}},'./site-auth':{getSiteAuth:async()=>({})},'firebase/auth':sdk,'./signup-progress':{beginSignupAuthentication(){attempts++;return{}},finishSignupAuthentication(){successes++},failSignupAuthentication(){failures++}}});
(async()=>{
 await auth.prepareSiteSignIn();
 const first=auth.signInSite('google');
 assert.equal(calls,1,'prepared popup starts synchronously within click handler');
 assert.equal(auth.signInSite('twitter'),first,'concurrent buttons reuse active attempt');
 resolvePopup({user:{uid:'test'}});await first;
 assert.equal(attempts,1);assert.equal(successes,1);
 const second=auth.signInSite('google');rejectPopup({code:'auth/popup-blocked'});await assert.rejects(second);assert.equal(failures,1);
 const third=auth.signInSite('google');resolvePopup({user:{uid:'test'}});await third;assert.equal(calls,3,'failed attempt releases lock');
 assert.match(auth.siteSignInError({code:'auth/popup-closed-by-user'}),/closed before/);
 assert.match(auth.siteSignInError({code:'auth/popup-blocked'}),/Allow pop-ups/);
 assert.match(auth.siteSignInError({code:'auth/web-storage-unsupported'}),/storage/);
 assert.ok(!auth.siteSignInError(Error('private@example.com token=secret')).includes('secret'));
 const progress=load('lib/signup-progress.ts',{'./site-auth':{},'./acquisition':{},'./signup-progress-queue':{}});
 for(const [name,code] of [['TypeError','client/type-error'],['ChunkLoadError','client/chunk-load-failed'],['SecurityError','client/security-error'],['AbortError','client/aborted']])assert.equal(progress.signupErrorCode({name,message:'secret'}),code);
 console.log('PASS: synchronous prepared popup, one active attempt, retry recovery, safe error guidance and diagnostic categories.');
})().catch(e=>{console.error(e);process.exitCode=1});
