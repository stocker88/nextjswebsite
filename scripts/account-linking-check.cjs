const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),ts=require('typescript');
let linked=0,reloaded=0,popupError=null,now=0;
class TestDate extends Date{static now(){return now}}
const user={uid:'existing-member',email:'member@example.com',reload:async()=>{reloaded++}};
const auth={currentUser:user};
class Provider{setCustomParameters(){}addScope(){}static credentialFromError(error){return error.credential||null}}
const sdk={GoogleAuthProvider:Provider,FacebookAuthProvider:Provider,TwitterAuthProvider:Provider,OAuthProvider:Provider,
 signInWithPopup:async()=>{if(popupError)throw popupError;return {user:auth.currentUser}},
 linkWithCredential:async(target)=>{assert.equal(target.uid,'existing-member');linked++;return {user:target}},
 linkWithPopup:async(target)=>{assert.equal(target.uid,'existing-member');linked++;return {user:target}}};
const moduleExports={};
const code=ts.transpileModule(fs.readFileSync('lib/site-sign-in.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
vm.runInNewContext(code,{exports:moduleExports,require:name=>name==='./site-auth'?{getSiteAuth:async()=>auth}:name==='firebase/auth'?sdk:require(name),Promise,Error,Date:TestDate,process:{env:{NEXT_PUBLIC_FACEBOOK_SIGN_IN:'true',NEXT_PUBLIC_X_SIGN_IN:'true'}}});
(async()=>{
 const m=moduleExports;
 popupError={code:'auth/account-exists-with-different-credential',credential:{providerId:'twitter.com',secret:'test-only'},customData:{email:'member@example.com'}};
 await assert.rejects(m.signInSite('twitter'));assert.equal(linked,0);assert.equal(m.pendingSiteLink().provider,'twitter');assert.equal(m.pendingSiteLink().credential,undefined);
 popupError=null;await m.signInSite('google');assert.equal(linked,0,'Signing in must not silently link the pending provider');
 auth.currentUser={...user,email:'another@example.com'};await assert.rejects(m.completePendingSiteLink(),/same email/);assert.equal(linked,0);
 auth.currentUser=user;await m.completePendingSiteLink();assert.equal(linked,1);assert.equal(reloaded,1);assert.equal(auth.currentUser.uid,'existing-member');assert.equal(m.pendingSiteLink(),null);
 await m.linkSiteProvider('facebook');assert.equal(linked,2);assert.equal(auth.currentUser.uid,'existing-member');
 sdk.linkWithPopup=async()=>{throw {code:'auth/credential-already-in-use'}};
 await assert.rejects(m.linkSiteProvider('facebook'));assert.equal(auth.currentUser.uid,'existing-member');assert.equal(linked,2);
 assert.match(m.siteSignInError({code:'auth/credential-already-in-use'}),/No accounts or memberships were merged/);
 popupError={code:'auth/account-exists-with-different-credential',credential:{providerId:'twitter.com'},customData:{email:'member@example.com'}};
 await assert.rejects(m.signInSite('twitter'));now=10*60*1000;assert.equal(m.pendingSiteLink(),null);await assert.rejects(m.completePendingSiteLink(),/existing account first/);assert.equal(linked,2);
 console.log('Account linking: explicit confirmation, matching existing account, UID preservation and refusal to merge occupied credentials passed.');
})().catch(e=>{console.error(e);process.exitCode=1});
