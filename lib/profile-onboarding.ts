import type {User} from 'firebase/auth';
import {getSiteAuth} from './site-auth';
import {rememberSiteAccount} from './site-account-hint';

export const onboardingQuestions=[
 {key:'experience',title:'Where are you starting?',subtitle:'We’ll help you explore at your own pace.',options:['Beginner','Some experience','Experienced']},
 {key:'interest',title:'What interests you most?',subtitle:'Choose the research you want to explore.',options:['Stocks','Options','Both']},
 {key:'horizon',title:'What’s your time horizon?',subtitle:'A quick setup or a longer investment story?',options:['Short-term','Long-term','Both']},
] as const;

export type OnboardingAnswerKey=(typeof onboardingQuestions)[number]['key'];
export type OnboardingAnswers=Record<OnboardingAnswerKey,string>;
export type UsernameAvailability='idle'|'checking'|'available'|'taken'|'error';

export const normalizeUsername=(value:string)=>value.trim().toLowerCase().replace(/\s+/g,'_');

export function usernameValidationCode(value:string){
 const name=normalizeUsername(value);
 if(!name)return 'username_empty';
 if(/[@.\uFF20\uFF0E\u3002\uFF61]/.test(name))return 'username_email_or_url';
 if(!/^[a-z0-9_]+$/.test(name))return 'username_characters';
 if((name.match(/[0-9]/g)||[]).length>5)return 'username_too_many_digits';
 if(name.length>15)return 'username_too_long';
 return '';
}

export function usernameValidationMessage(value:string){
 const reason=usernameValidationCode(value);
 return reason?{
  username_empty:'Choose a username.',
  username_email_or_url:'Use a username, not an email address or website.',
  username_characters:'Use only letters, numbers and underscores (a–z, 0–9, _).',
  username_too_many_digits:'Your username can contain at most 5 digits in total.',
  username_too_long:'Use 15 characters or fewer.',
 }[reason]:'';
}

async function firestore(){
 const auth=await getSiteAuth();
 const sdk=await import('firebase/firestore');
 return {auth,sdk,db:sdk.getFirestore(auth.app)};
}

export async function siteProfileExists(uid:string){
 const {sdk,db}=await firestore();
 const profile=await sdk.getDoc(sdk.doc(db,'users',uid)),data=profile.data();
 return profile.exists()&&typeof data?.userName==='string'&&data.userName.trim().length>0;
}

export async function isUsernameAvailable(value:string,uid:string){
 const name=normalizeUsername(value),validation=usernameValidationMessage(name);
 if(validation)return false;
 const {sdk,db}=await firestore();
 const result=await sdk.getDocs(sdk.query(sdk.collection(db,'users'),sdk.where('userName','==',name),sdk.limit(2)));
 return result.docs.every(item=>item.id===uid);
}

export function usernameCandidates(value:string){
 let digits=0;
 const base=normalizeUsername(value).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').split(/[@＠]/)[0]
  .replace(/[^a-z0-9_]+/g,'_').replace(/[0-9]/g,digit=>++digits<=5?digit:'').replace(/^_+|_+$/g,'').slice(0,15)||'member';
 const candidates=usernameValidationMessage(value)?[base]:[];
 // Letter suffixes also work when the original name already has five digits.
 for(const suffix of ['_hi','_now','_go','_me','_ai','_new','_one','_plus'])candidates.push(base.slice(0,15-suffix.length)+suffix);
 return Array.from(new Set(candidates)).filter(name=>name!==normalizeUsername(value)&&!usernameValidationMessage(name)).slice(0,9);
}

export async function availableUsernameSuggestions(value:string,uid:string){
 const candidates=usernameCandidates(value);
 const {sdk,db}=await firestore();
 // One bounded batch query, not repeated calls for every proposed name.
 const result=await sdk.getDocs(sdk.query(sdk.collection(db,'users'),sdk.where('userName','in',candidates)));
 const taken=new Set(result.docs.filter(item=>item.id!==uid).map(item=>item.data().userName));
 return candidates.filter(name=>!taken.has(name)).slice(0,2);
}

/** Preserve the requested name when available; otherwise pick a checked variant. */
export async function resolveSignupUsername(value:string,uid:string){
 const name=normalizeUsername(value);
 if(await isUsernameAvailable(name,uid))return name;
 for(let attempt=0;attempt<4;attempt++){
  const suffix=Array.from({length:6},()=>String.fromCharCode(97+Math.floor(Math.random()*26))).join('');
  const base=attempt===0?name:`${name.slice(0,7)}_${suffix}`;
  const [available]=await availableUsernameSuggestions(base,uid);
  if(available)return available;
 }
 throw new Error('We couldn’t choose an available username. Please try again.');
}

function localeParts(){
 const locale=(navigator.language||'en').replace('_','-'),parts=locale.split('-');
 return {languageCode:parts[0]||'en',countryCode:parts[1]?.toUpperCase()||''};
}

function profileDocument(user:User,userName:string,photoUrl:string,answers:OnboardingAnswers,completedAt:unknown){
 const now=Math.floor(Date.now()/1000),locale=localeParts();
 return {
  lifetimeAccess:false,isVIP:false,isElite:false,madeFirstPayment:false,trialMade:false,isLocked:false,isLockedSocial:null,isMuted:false,
  id:user.uid,email:user.email||'',pushToken:'',date_of_birth:'',badgeNumber:0,karma:null,userName,phone:user.phoneNumber||'',photoUrl,
  deviceData:JSON.stringify({isWeb:true,userAgent:navigator.userAgent}),invitedFrom:'',firstUtmSource:'',firstUtmMedium:'',firstUtmCampaign:'',websiteRedirectId:'',
  aboutMe:'',firstName:'',lastName:'',personnalWebsiteUrl:'',deviceHeight:window.innerHeight,deviceWidth:window.innerWidth,initial_cash_balance:10000,
  number_of_insights:0,number_of_following:0,number_of_followers:0,muted_users:[],isHiddenPositions:false,creationTime:now,numberOfComments:0,
  planPurchaseDateUnix:null,commissionFree:false,riskDisclosuresAccepted:false,riskDisclosuresAcceptedAt:0,riskDisclosuresVersion:0,referralCount:0,
  countryCode:locale.countryCode,languageCode:locale.languageCode,planPurchased:'',paidVia:'',userBadgeColor:'UserBadgeColor.none',
  experience:'',age:'',gender:'removed',heardFrom:'',heardFromOther:'',a_doYouInvest:false,a_interests:[],a_investmentPreferences:[],a_Income:'removedTemporary',
  isEmailVerified:user.emailVerified,
  quickOnboarding:{version:2,answers,completedAt,source:'website'},profileSetupVersion:1,profileSetupCompletedAt:completedAt,
 };
}

export async function completeProfileOnboarding(user:User,input:{userName:string;photoFile:File|null;answers:OnboardingAnswers;heardFrom?:string}){
 let userName=normalizeUsername(input.userName);const validation=usernameValidationMessage(userName);
 if(validation)throw Object.assign(new Error(validation),{code:usernameValidationCode(userName)});
 const auth=await getSiteAuth();
 if(auth.currentUser?.uid!==user.uid)throw new Error('Your account changed. Please sign in again.');
 userName=await resolveSignupUsername(userName,user.uid);
 const {sdk,db}=await firestore();
 const userRef=sdk.doc(db,'users',user.uid);
 const currentProfile=await sdk.getDoc(userRef),currentData=currentProfile.data();
 if(currentProfile.exists()&&typeof currentData?.userName==='string'&&currentData.userName.trim())return;

 let photoUrl=user.photoURL||'',uploadedReference:import('firebase/storage').StorageReference|null=null;
 if(input.photoFile){
  const storage=await import('firebase/storage');
  const extension=input.photoFile.type==='image/png'?'png':input.photoFile.type==='image/webp'?'webp':'jpg';
  uploadedReference=storage.ref(storage.getStorage(auth.app),`profile_pictures/${user.uid}-${Date.now()}.${extension}`);
  await storage.uploadBytes(uploadedReference,input.photoFile,{contentType:input.photoFile.type,cacheControl:'public,max-age=31536000,immutable'});
  photoUrl=await storage.getDownloadURL(uploadedReference);
 }

 try{
  userName=await resolveSignupUsername(userName,user.uid);
  if(auth.currentUser?.uid!==user.uid)throw new Error('Your account changed. Please sign in again.');
  let created=false;
  await sdk.runTransaction(db,async transaction=>{
   const existing=await transaction.get(userRef);
   const existingData=existing.data();
   if(existing.exists()&&typeof existingData?.userName==='string'&&existingData.userName.trim())return;
   const completedAt=sdk.serverTimestamp();
   const profile=profileDocument(user,userName,photoUrl,input.answers,completedAt);
   if(input.heardFrom)profile.heardFrom=input.heardFrom;
   transaction.set(userRef,existing.exists()?{...profile,...existingData,userName,photoUrl,quickOnboarding:profile.quickOnboarding,profileSetupVersion:1,profileSetupCompletedAt:completedAt}:profile);
   transaction.set(sdk.doc(db,'onboardingNotifications',user.uid),{numberAutoMessagesSent:0,id:user.uid,userName});
   created=true;
  });
  if(!created){if(uploadedReference){const storage=await import('firebase/storage');await storage.deleteObject(uploadedReference).catch(()=>{});}return;}
 }catch(error){
  if(uploadedReference){const storage=await import('firebase/storage');await storage.deleteObject(uploadedReference).catch(()=>{});}
  throw error;
 }

 const authSdk=await import('firebase/auth');
 await authSdk.updateProfile(user,{displayName:userName,photoURL:photoUrl}).catch(()=>{});
 try{localStorage.setItem(`quickOnboarding:${user.uid}`,JSON.stringify({version:2,answers:input.answers,completedAt:new Date().toISOString()}));}catch{/* Firestore remains authoritative. */}
 rememberSiteAccount({uid:user.uid,displayName:userName,email:user.email,photoURL:photoUrl},Date.now(),true);
 window.dispatchEvent(new CustomEvent('site-profile-updated',{detail:{userName,photoUrl}}));
}
