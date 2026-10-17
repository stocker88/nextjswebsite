import saved from '../data/market-heatmap.json';
import {HeatSnapshot,heatmapEndpoint,validSnapshot} from './market-heatmap';
export async function loadHeatmap():Promise<HeatSnapshot>{
 try{const response=await fetch(heatmapEndpoint,{signal:AbortSignal.timeout(12000)});if(!response.ok)throw Error('Feed unavailable');const data=await response.json();if(!validSnapshot(data))throw Error('Invalid snapshot');return data;}catch{return {...saved,stale:true} as HeatSnapshot;}
}
