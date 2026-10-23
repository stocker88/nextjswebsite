import saved from '../data/option-results.json';
export type OptionResult=Omit<(typeof saved)[number], 'quickTake'|'stock'> & {quickTake?:string;stock?:{movePct:number;price:number;previousClose?:number|null;asOf:string;basis:string}|null};
export const optionResults:OptionResult[]=saved;
const canonical=(symbol:string)=>symbol.trim().toUpperCase().replace(/\./g,'-');
export function latestOptionResult(symbol:string,reports:OptionResult[]=optionResults):OptionResult|null{
 const ticker=canonical(symbol);
 return reports.filter(r=>canonical(r.symbol)===ticker).sort((a,b)=>b.sessionDay.localeCompare(a.sessionDay)||b.id.localeCompare(a.id))[0]||null;
}
