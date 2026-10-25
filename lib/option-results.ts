import saved from '../data/option-result-previews.json';
import type full from '../data/option-results.json';
export type OptionResult=Omit<(typeof full)[number], 'quickTake'|'stock'|'graphStock'|'moves'> & {moves:((typeof full)[number]['moves'][number] & {optionType?:string;priceSelection?:{label:string}})[];quickTake?:string;graphStock?:{price:number;previousClose:number;movePct:number;asOf:string;basis:string;approximate:boolean;note:string;source:string};stock?:{movePct:number;price:number;previousClose?:number|null;asOf:string;basis:string}|null};
export type OptionResultPreviewData=Omit<OptionResult,'recap'|'quickTake'|'text'> & {previewSummary:string};
export const optionResults:OptionResultPreviewData[]=saved;
const canonical=(symbol:string)=>symbol.trim().toUpperCase().replace(/\./g,'-');
export function latestOptionResult(symbol:string,reports:OptionResultPreviewData[]=optionResults):OptionResultPreviewData|null{
 const ticker=canonical(symbol);
 return reports.filter(r=>canonical(r.symbol)===ticker).sort((a,b)=>b.sessionDay.localeCompare(a.sessionDay)||b.id.localeCompare(a.id))[0]||null;
}

export const optionResultSlug=(result:Pick<OptionResult,'id'>)=>result.id.toLowerCase().replace(/_/g,'-');
export const optionResultUrl=(result:Pick<OptionResult,'id'>)=>'/results/'+optionResultSlug(result)+'/';
export function optionResultHighlight(result:Pick<OptionResult,'moves'|'images'>){
 // Images and moves share the publisher's order; keep the highlighted contract
 // and its picture together even when the strongest move is not first.
 const index=result.moves.reduce((best,move,i)=>move.sessionPct>result.moves[best].sessionPct?i:best,0);
 return {move:result.moves[index],image:result.images[index]||result.images[0]};
}
export function findOptionResult(slug:string,reports:OptionResultPreviewData[]=optionResults){
 return reports.find(result=>optionResultSlug(result)===slug);
}
