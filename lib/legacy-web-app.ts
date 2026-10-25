import stocks from '../data/stocks.json';
export function websiteResearchPath(symbol: string): string {
 const ticker = symbol.trim().toUpperCase();
 const stock = stocks.find(item => item.ticker.toUpperCase() === ticker);
 return stock ? `/stocks/${stock.slug}/` : `/instruments/${encodeURIComponent(ticker)}/`;
}
export function legacyWebAppDestination(hash: string): string {
 const match = /^#\/?financial\/([^/?#]+)/i.exec(hash);
 if (!match) return '/';
 try { return websiteResearchPath(decodeURIComponent(match[1])); } catch { return '/'; }
}
