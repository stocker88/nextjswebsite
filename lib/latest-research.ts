import type {ResearchPreview} from './research';
import {optionResults,optionResultUrl} from './option-results';
const tags = new Set(['SIGNALS','EARNINGS','MARKET','NEWS','EDUCATION','OPTIONS','RESEARCH','AI','INSIDERS','FUNDS']);
export function isMarketResearch(item:ResearchPreview) {
 return item.cardKind==='market'||/^(ai_market_recap_|briefing_premarket_)/.test(item.id)||item.symbols.some(s=>s.toLowerCase()==='market');
}
export function companySymbol(item:ResearchPreview) {
 if(isMarketResearch(item))return '';
 const explicit=item.companySymbol || item.researchSessionSnapshot?.symbol;
 if(explicit && /^[A-Z0-9][A-Z0-9.\-]{0,14}$/.test(explicit))return explicit;
 if(/^(ai_market_recap_|briefing_(premarket|earnings_\d|weekly))/.test(item.id))return '';
 const symbols=Array.from(new Set(item.symbols.map(s=>s.trim().replace(/^[#$]/,'').toUpperCase()).filter(s=>/^[A-Z0-9][A-Z0-9.\-]{0,14}$/.test(s)&&!tags.has(s))));
 return symbols.length===1?symbols[0]:'';
}
export function sessionLabel(item:ResearchPreview) {
 const s=item.researchSessionSnapshot;
 if(!s || s.symbol!==(isMarketResearch(item)?'SPY':companySymbol(item)) || !Number.isFinite(s.move) || !/^\d{4}-\d{2}-\d{2}$/.test(s.sessionDate) || !Number.isFinite(Date.parse(s.quoteAsOf)))return null;
 const date=new Date(s.sessionDate+'T12:00:00Z');
 if(!Number.isFinite(date.getTime())||date.toISOString().slice(0,10)!==s.sessionDate)return null;
 const day=date.toLocaleDateString('en-US',{month:'short',day:'numeric',timeZone:'America/New_York'});

 return {move:s.move,change:`${s.move>0?'+':''}${s.move.toFixed(2)}%`,label:[isMarketResearch(item)?'SPY':'',day].filter(Boolean).join(' · ')};
}

export const isOptionsResearch=(item:ResearchPreview)=>item.cardKind==='options'||item.category==='Options results'||item.id.startsWith('options_results_');
export function researchCardTone(item:ResearchPreview) {
 if(isOptionsResearch(item))return 'options';
 if(isMarketResearch(item))return 'market';
 const snapshot=sessionLabel(item);
 return !snapshot||snapshot.move===0?'flat':snapshot.move>0?'gain':'loss';
}

export function ribbonHeadline(title:string) {
 return title.replace(/\bpre[- ]?market\s+(report|recap|update)/gi,'Market $1')
  .replace(/\b(?:during trading|after[- ]?hours|after market|pre[- ]?market|before (?:the )?open|after (?:the )?close|at (?:the )?open|at (?:the )?close|regular[- ]session)\b/gi,'')
  .replace(/\s+/g,' ').replace(/\s+([,.;:])/g,'$1').trim();
}
export function withOptionResults(items:ResearchPreview[],now=Date.now()):ResearchPreview[] {
 const options:ResearchPreview[]=optionResults.map(result=>({id:result.id,title:result.title,time:result.publishedAt,companySymbol:result.symbol,symbols:[result.symbol],cardKind:'options',category:'Options results',href:optionResultUrl(result),likes:0,comments:0,shares:0}));
 const stamp=(n:number|null)=>n==null?0:n<1e12?n*1000:n;
 const recent=(rows:ResearchPreview[])=>rows.filter(item=>stamp(item.time)>=now-7*86400000&&stamp(item.time)<=now).sort((a,b)=>stamp(b.time)-stamp(a.time));
 const news=recent(items.filter(item=>!isOptionsResearch(item))).slice(0,16),gold=recent(options).slice(0,4),seen=new Set<string>(),out:ResearchPreview[]=[];
 for(let i=0;i<Math.max(news.length,1);i+=3){for(const item of [...news.slice(i,i+3),...(gold[i/3]?[gold[i/3]]:[])])if(!seen.has(item.id)){seen.add(item.id);out.push(item)}}
 for(const item of gold)if(!seen.has(item.id)){seen.add(item.id);out.push(item)}
 return out;
}
