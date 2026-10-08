import catalog from '../data/app-stock-catalog.json';
export {catalog};
export function searchCatalog(query:string) {
 const q=query.trim().replace(/^\$/, '').toLowerCase();
 return catalog.filter(i=>[i.symbol,i.name,i.sector,i.industry].some(v=>v.toLowerCase().includes(q))).sort((a,b)=>
   Number(b.symbol.toLowerCase()===q)-Number(a.symbol.toLowerCase()===q) ||
   Number(b.type==='EQUITY')-Number(a.type==='EQUITY') ||
   (b.marketCap || 0)-(a.marketCap || 0) ||
   a.symbol.localeCompare(b.symbol));
}
