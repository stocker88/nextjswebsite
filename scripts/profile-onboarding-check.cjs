const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript');
const source=fs.readFileSync('lib/profile-onboarding.ts','utf8');
const output=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const moduleExports={};
vm.runInNewContext(output,{exports:moduleExports,require:name=>name==='./site-auth'?{getSiteAuth:()=>Promise.reject(new Error('not used'))}:name==='./site-account-hint'?{rememberSiteAccount(){}}:require(name)});
assert.equal(moduleExports.normalizeUsername('  My Name  '),'my_name');
assert.equal(moduleExports.usernameValidationMessage('good_name'),'');
assert.match(moduleExports.usernameValidationMessage('me@example.com'),/not an email/i);
assert.match(moduleExports.usernameValidationMessage('bad-name'),/letters, numbers and underscores/i);
assert.match(moduleExports.usernameValidationMessage('abc123456'),/at most 5 digits/i);
assert.match(moduleExports.usernameValidationMessage('abcdefghijklmnop'),/15 characters/i);
assert.deepEqual(Array.from(moduleExports.onboardingQuestions,q=>[q.key,q.title,Array.from(q.options)]),[
 ['experience','Where are you starting?',['Beginner','Some experience','Experienced']],
 ['interest','What interests you most?',['Stocks','Options','Both']],
 ['horizon','What’s your time horizon?',['Short-term','Long-term','Both']],
]);
for(const expected of ["where('userName','==',name)",'That username is already taken.','profile_pictures/','quickOnboarding','onboardingNotifications','initial_cash_balance:10000'])assert.ok(source.includes(expected),`Missing onboarding invariant: ${expected}`);
const gate=fs.readFileSync('components/ProfileOnboarding.tsx','utf8');
for(const expected of ['Choose a profile picture to continue.','Your first signals are ready.','Unlock every price signal','All financial trends are visible.','Price through','Continue to your free trial →',"router.replace('/membership/?from=onboarding')",'ProfileOnboardingGate','siteProfileExists(user.uid)','sessionStorage.setItem(cacheKey','onProfileReady?.(user.uid,exists)','onProfileReady?.(user.uid,true)'])assert.ok(gate.includes(expected),`Missing profile gate invariant: ${expected}`);
const preview=fs.readFileSync('lib/onboarding-signal-preview.ts','utf8');
for(const expected of ["symbol:'LLY'","symbol:'NVDA'","title:'Revenues'","title:'Earnings per Share'","signalDate:'2022-12-14'","signalDate:'2022-12-26'",'2026-10-09','2026-10-19','lockedSignalPreviews',"title:'Revenue Growth'"])assert.ok(preview.includes(expected),`Missing real signal preview invariant: ${expected}`);
assert.ok(preview.indexOf("symbol:'LLY'")<preview.indexOf("symbol:'NVDA'"),'LLY must appear before NVDA in onboarding results.');
const lockedOrder=['MDB','RACE','SHOP','META','SNAP','VRTX','WIX','ADBE','RBLX','AVGO','BLK','HCA','DIS','RDDT','PLTR'];
let lockedPosition=preview.indexOf('lockedSignalPreviews');
for(const symbol of lockedOrder){const position=preview.indexOf(`symbol:'${symbol}'`,lockedPosition);assert.ok(position>lockedPosition,`${symbol} must follow the app's locked signal order.`);lockedPosition=position}
const plans=fs.readFileSync('components/MembershipPlans.tsx','utf8');
for(const expected of ["onboarding?'Free trial':'Free'",'Start your free trial in the app'])assert.ok(plans.includes(expected),`Missing signup trial invariant: ${expected}`);
const provider=fs.readFileSync('components/SiteAccount.tsx','utf8');
for(const expected of ['profileReadyUid===state.user.uid','if(!user||!profileReady)return','onProfileReady={handleProfileReady}','<ProfileOnboardingGate'])assert.ok(provider.includes(expected),`Missing profile-first device gate invariant: ${expected}`);
assert.ok(provider.indexOf('if(!user||!profileReady)return')<provider.indexOf('registerWebsiteDevice().then'), 'Device registration must wait for profile verification.');
console.log('Profile onboarding checks passed: app-matched questions, username policy, database availability, photo requirement, complete profile document and mandatory route gate.');
