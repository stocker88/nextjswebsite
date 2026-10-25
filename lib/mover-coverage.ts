import saved from '../data/mover-context.json';
import signals from '../data/mover-signals.json';
import {researchUrl} from './research';
import type {MoverContextArticle} from './mover-context';
export const moverCoverageEndpoint='https://us-central1-stocker-fcda2.cloudfunctions.net/moverThreadCoverage';
export const savedCoverage=[...saved,...signals] as MoverContextArticle[];
let latest=savedCoverage,lastCheck=0,flight:Promise<MoverContextArticle[]>|undefined;
export function loadMoverCoverage():Promise<MoverContextArticle[]> {
 if(flight)return flight;if(Date.now()-lastCheck<300000)return Promise.resolve(latest);
 flight=(async()=>{try{
   const r=await fetch(moverCoverageEndpoint,{signal:AbortSignal.timeout(15000)});if(!r.ok)throw Error();
   const data=await r.json();if(data.version!==1||!Array.isArray(data.items))throw Error();
   const known=new Map(savedCoverage.filter(a=>a.postId).map(a=>[a.postId,a.href]));
   latest=data.items.filter((a:any)=>a.kind!=='options_result'&&a.postId&&a.title&&a.symbol).map((a:any)=>({...a,href:known.get(a.postId)||researchUrl(a.postId,a.title)+'/'}));
 }catch{/* Keep the last available shared coverage. */}finally{lastCheck=Date.now();}return latest;})().finally(()=>{flight=undefined;});return flight;
}
