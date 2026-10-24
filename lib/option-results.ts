import saved from '../data/option-results.json';
export type OptionResult=Omit<(typeof saved)[number], 'quickTake'|'stock'|'graphStock'|'moves'> & {moves:((typeof saved)[number]['moves'][number] & {optionType?:'call'|'put';priceSelection?:{label:string}})[];quickTake?:string;graphStock?:{price:number;previousClose:number;movePct:number;asOf:string;basis:string;approximate:boolean;note:string;source:string};stock?:{movePct:number;price:number;previousClose?:number|null;asOf:string;basis:string}|null};
export const optionResults:OptionResult[]=saved;
const canonical=(symbol:string)=>symbol.trim().toUpperCase().replace(/\./g,'-');
export function latestOptionResult(symbol:string,reports:OptionResult[]=optionResults):OptionResult|null{
 const ticker=canonical(symbol);
 return reports.filter(r=>canonical(r.symbol)===ticker).sort((a,b)=>b.sessionDay.localeCompare(a.sessionDay)||b.id.localeCompare(a.id))[0]||null;
}

export const optionResultSlug=(result:Pick<OptionResult,'id'>)=>result.id.toLowerCase().replace(/_/g,'-');
export const optionResultUrl=(result:Pick<OptionResult,'id'>)=>'/results/'+optionResultSlug(result)+'/';
export function optionResultHighlight(result:OptionResult){
 // Images and moves share the publisher's order; keep the highlighted contract
 // and its picture together even when the strongest move is not first.
 const index=result.moves.reduce((best,move,i)=>move.sessionPct>result.moves[best].sessionPct?i:best,0);
 return {move:result.moves[index],image:result.images[index]||result.images[0]};
}
export function findOptionResult(slug:string,reports:OptionResult[]=optionResults){
 return reports.find(result=>optionResultSlug(result)===slug);
}
