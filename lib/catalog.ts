import appCatalog from '../data/app-stock-catalog.json';
import heatmapProfiles from '../data/heatmap-stock-profiles.json';
// Include every saved heatmap company in the statically generated stock pages.
const catalog=[...appCatalog,...heatmapProfiles.filter(row=>!appCatalog.some(item=>item.symbol===row.symbol))];
export {catalog};
const aliases:Record<string,string[]>={GOOGL:['google','goog'],META:['facebook'],TSM:['tsmc','taiwan semiconductor'],JPM:['jpmorgan','jp morgan','chase']};
const normalize=(value:string)=>value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
export function searchCatalog(query:string) {
 const q=normalize(query),words=q.split(/\s+/).filter(Boolean);
 const rank=(item:typeof catalog[number])=>{const symbol=normalize(item.symbol),name=normalize(item.name),other=(aliases[item.symbol]||[]).map(normalize);return symbol===q?100:name===q?90:name.startsWith(q)?80:other.some(a=>a===q||a.startsWith(q))?75:symbol.startsWith(q)?70:name.includes(q)?60:words.every(w=>name.includes(w))?50:10;};
 return catalog.filter(i=>{const text=normalize([i.symbol,i.name,i.sector,i.industry,...aliases[i.symbol]||[]].join(' '));return words.every(w=>text.includes(w));}).sort((a,b)=>
   (q?rank(b)-rank(a):0)||Number(b.type==='EQUITY')-Number(a.type==='EQUITY')||(b.marketCap||0)-(a.marketCap||0)||a.symbol.localeCompare(b.symbol));
}
