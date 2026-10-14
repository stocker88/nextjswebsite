export function marketEventIcon(category: string, title: string): string {
 if (category === 'filings') return '📄';
 if (category === 'indices') return '⚖️';
 if (category === 'fed') return '🏛️';
 if (category === 'trading') return '📅';
 if (/cpi|ppi|inflation|pce/i.test(title)) return '🏷️';
 if (/jobs|employment|payroll|claims|labor/i.test(title)) return '👥';
 if (/retail|consumer|spending/i.test(title)) return '🛒';
 if (/gdp|manufactur|industrial|ism|pmi/i.test(title)) return '🏭';
 if (/housing|home|mortgage/i.test(title)) return '🏠';
 return '📊';
}
