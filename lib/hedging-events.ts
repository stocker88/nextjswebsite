import {marketToday} from './calendar-period';
// Keep parity with the app's macro_event_hedging.dart classification.
export function hedgingAhead(event:{title:string;date:string;category?:string;status?:string},today=marketToday()):boolean {
 if(event.date<today || (event.category && !['macro','fed'].includes(event.category)) || /cancelled|canceled|completed|released/i.test(event.status||'')) return false;
 return /\b(cpi|ppi|pce|gdp|nfp)\b|consumer price index|producer price index|personal consumption expenditures|jobless claims|unemployment claims|jobs report|non.?farm payroll|employment cost index|fomc.*(decision|meeting|minutes)|fed.*(rate decision|press conference)/i.test(event.title);
}
