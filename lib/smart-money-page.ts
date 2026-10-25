import snapshot from '../data/smart-money.json';
import data from '../data/research.json';
import {researchPages,ResearchPreview} from './research';
export function smartMoneyProps(category='all'){
 const tags=category==='politicians'?['politician']:category==='funds'?['13f','hedgefund']:category==='insiders'?['insider']:['politician','13f','hedgefund','insider'];
 const research=researchPages(data as ResearchPreview[]).filter(r=>r.symbols.some(s=>tags.includes(s.replace(/^[#$]/,'').toLowerCase()))).sort((a,b)=>(b.time||0)-(a.time||0)).slice(0,3);
 const rows=snapshot.items.filter(r=>category==='all'||r.category===category);
 const initial={...snapshot,items:rows.slice(0,50),sampleOnly:true,totals:{records:rows.length,investors:new Set(rows.map(r=>r.investorId)).size}};
 return {props:{initial,category,research}};
}
