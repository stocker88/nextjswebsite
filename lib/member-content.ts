import {getSiteAuth} from './site-auth';
export type ResultMemberContent={recap:string[];quickTake?:string;accessUntil:string|null};
export async function fetchResultMemberContent(uid:string,id:string):Promise<ResultMemberContent>{
 const auth=await getSiteAuth();
 if(auth.currentUser?.uid!==uid)throw new Error('Account changed');
 const {getFunctions,httpsCallable}=await import('firebase/functions');
 const call=httpsCallable<{resultId:string},ResultMemberContent>(getFunctions(auth.app,'us-central1'),'getWebsiteResultContent',{timeout:35000});
 const response=await call({resultId:id});
 if(auth.currentUser?.uid!==uid)throw new Error('Account changed');
 const value=response.data;
 if(!value||!Array.isArray(value.recap)||!value.recap.every(line=>typeof line==='string'))throw new Error('Invalid results response');
 return value;
}
