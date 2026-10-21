import saved from '../data/extended-hours.json';
import {heatmapEndpoint} from './market-heatmap';
import {ExtendedSession,SessionKind,validSession} from './extended-hours';
export async function loadExtendedSession(kind:SessionKind):Promise<ExtendedSession|null>{
 try{const response=await fetch(heatmapEndpoint,{signal:AbortSignal.timeout(12000)});if(!response.ok)throw Error('Feed unavailable');const data=await response.json();if(validSession(data[kind],kind))return data[kind];}catch{/* Keep the dated build fallback. */}
 const fallback:unknown=saved[kind];return validSession(fallback,kind)?fallback:null;
}
