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

export function usernameValidationMessage(value:string){
 const name=normalizeUsername(value);
 if(!name)return 'Choose a username.';
 if(/[@.\uFF20\uFF0E\u3002\uFF61]/.test(name))return 'Use a username, not an email address or website.';
 if(!/^[a-z0-9_]+$/.test(name))return 'Use only letters, numbers and underscores.';
 if((name.match(/[0-9]/g)||[]).length>5)return 'Your username can contain at most 5 digits in total.';
 if(name.length>15)return 'Use 15 characters or fewer.';
 return '';
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

export async function completeProfileOnboarding(user:User,input:{userName:string;photoFile:File|null;answers:OnboardingAnswers}){
 const userName=normalizeUsername(input.userName),validation=usernameValidationMessage(userName);
 if(validation)throw new Error(validation);
 if(!input.photoFile&&!user.photoURL)throw new Error('Choose a profile picture to continue.');
 const auth=await getSiteAuth();
 if(auth.currentUser?.uid!==user.uid)throw new Error('Your account changed. Please sign in again.');
 if(!await isUsernameAvailable(userName,user.uid))throw new Error('That username is already taken.');
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
  if(!await isUsernameAvailable(userName,user.uid))throw new Error('That username is already taken.');
  let created=false;
  await sdk.runTransaction(db,async transaction=>{
   const existing=await transaction.get(userRef);
   const existingData=existing.data();
   if(existing.exists()&&typeof existingData?.userName==='string'&&existingData.userName.trim())return;
   const completedAt=sdk.serverTimestamp();
   const profile=profileDocument(user,userName,photoUrl,input.answers,completedAt);
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
 rememberSiteAccount({displayName:userName,email:user.email});
 window.dispatchEvent(new CustomEvent('site-profile-updated',{detail:{userName,photoUrl}}));
}
