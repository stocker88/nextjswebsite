import {getSiteAuth} from './site-auth';
export type Certificate={id:string;name:string;issuedAt:string;level:number;courseVersion:string};
export type AcademyProgress={version:string;completedQuestions:string[];sectionSurveyProgress:Record<string,{passed:boolean;score:number;total:number}>;levelOneComplete:boolean;certificate:Certificate|null;reviewEligible:boolean;reviewLinkClicked?:boolean;levelTwoComplete?:boolean;feedback:null|{sectionId:string;passed:boolean;score:number;total:number;explanations:{question:string;correct:boolean;answer:string;explanation:string}[]}};
export async function academyAction(data:Record<string,unknown>={}):Promise<AcademyProgress>{
 const auth=await getSiteAuth(),uid=auth.currentUser?.uid;if(!uid)throw Error('Sign in to save your progress.');
 const {getFunctions,httpsCallable}=await import('firebase/functions');
 const result=await httpsCallable<Record<string,unknown>,AcademyProgress>(getFunctions(auth.app,'us-central1'),'websiteAcademy')(data);
 if(auth.currentUser?.uid!==uid)throw Error('Your account changed. Please try again.');return result.data;
}
export {downloadCertificate,printCertificate,certificateSvg} from './academy-certificate';
