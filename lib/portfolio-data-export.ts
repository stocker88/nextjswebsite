import type {TrackerDetail, TrackerRow} from './investor-tracker';

// Quote every cell and neutralize spreadsheet formulas in source text.
function cell(value: unknown): string {
  let text = value == null ? '' : String(value);
  if (typeof value === 'string' && /^[\s]*[=+@-]/.test(text)) text = "'" + text;
  return '"' + text.replace(/"/g, '""') + '"';
}

export function portfolioDataCsv(data: TrackerDetail, rows: TrackerRow[], period: string): string {
  const headers = ['Investor', 'Type', 'Selected period', 'Symbol', 'Company', 'Reported value (USD)', 'Shares', 'Weight (%)', 'Amount range', 'Action', 'Owner', 'Security type', 'Period', 'Filed date', 'Trade date', 'Source filing', 'Disclosure'];
  const records = rows.map(row => [data.name, data.kind, period, row.symbol, row.company,
    row.value, row.shares, row.weight, row.amount, row.rawAction, row.owner,
    row.securityType, row.period, row.filedDate, row.eventDate, row.sourceUrl, data.disclosure]);
  return '\uFEFF' + [headers, ...records].map(record => record.map(cell).join(',')).join('\r\n') + '\r\n';
}

export function portfolioDataFilename(id: string, period: string): string {
  return `investor-tracker-${id}-${period || 'all-disclosures'}.csv`.replace(/[^a-zA-Z0-9._-]/g, '-');
}
