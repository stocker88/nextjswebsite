import {getSiteAuth} from './site-auth';
export type ResultMemberContent={recap:string[];quickTake?:string;accessUntil:string|null};

type CachedResultMemberContent={value:ResultMemberContent;cachedAt:number};
const memoryCache=new Map<string,CachedResultMemberContent>();
const cacheKey=(uid:string,id:string)=>`stbn.resultMemberContent.v1:${uid}:${id}`;

function validResultMemberContent(value:unknown):value is ResultMemberContent{
 if(!value||typeof value!=='object')return false;
 const candidate=value as ResultMemberContent;
 return Array.isArray(candidate.recap)&&candidate.recap.every(line=>typeof line==='string')&&
  (candidate.quickTake===undefined||typeof candidate.quickTake==='string')&&
  (candidate.accessUntil===null||typeof candidate.accessUntil==='string');
}

function accessStillValid(value:ResultMemberContent,now=Date.now()):boolean{
 if(!value.accessUntil)return true;
 const expiry=Date.parse(value.accessUntil);
 return Number.isFinite(expiry)&&expiry>now;
}

function forgetResultMemberContent(uid:string,id:string){
 const key=cacheKey(uid,id);memoryCache.delete(key);
 if(typeof window==='undefined')return;
 for(const storage of [window.sessionStorage,window.localStorage])try{storage.removeItem(key)}catch{/* The other cache can still be cleared. */}
}

function rememberResultMemberContent(uid:string,id:string,value:ResultMemberContent){
 const key=cacheKey(uid,id),entry={value,cachedAt:Date.now()};memoryCache.set(key,entry);
 if(typeof window==='undefined')return;
 const encoded=JSON.stringify(entry);
 try{window.sessionStorage.setItem(key,encoded)}catch{/* The durable cache below can still prevent a reload gap. */}
 try{window.localStorage.setItem(key,encoded)}catch{/* Memory/session caching still covers this visit. */}
}

export function lastKnownResultMemberContent(uid:string,id:string):ResultMemberContent|null{
 const key=cacheKey(uid,id);let entry=memoryCache.get(key)||null;
 if(!entry&&typeof window!=='undefined'){
  for(const storage of [window.sessionStorage,window.localStorage])try{
   const stored=JSON.parse(storage.getItem(key)||'null');
   if(stored&&Number.isFinite(stored.cachedAt)&&validResultMemberContent(stored.value)){
    entry={value:stored.value,cachedAt:stored.cachedAt};memoryCache.set(key,entry);break;
   }
  }catch{/* Ignore corrupt or unavailable browser storage. */}
 }
 if(!entry||!accessStillValid(entry.value)){forgetResultMemberContent(uid,id);return null}
 return entry.value;
}

export function clearResultMemberContent(uid:string,id:string){forgetResultMemberContent(uid,id)}

export async function fetchResultMemberContent(uid:string,id:string):Promise<ResultMemberContent>{
 const auth=await getSiteAuth();
 if(auth.currentUser?.uid!==uid)throw new Error('Account changed');
 const {getFunctions,httpsCallable}=await import('firebase/functions');
 const call=httpsCallable<{resultId:string},ResultMemberContent>(getFunctions(auth.app,'us-central1'),'getWebsiteResultContent',{timeout:35000});
 const response=await call({resultId:id});
 if(auth.currentUser?.uid!==uid)throw new Error('Account changed');
 const value=response.data;
 if(!validResultMemberContent(value))throw new Error('Invalid results response');
 if(!accessStillValid(value)){forgetResultMemberContent(uid,id);return value}
 rememberResultMemberContent(uid,id,value);
 return value;
}
