import type {TrackerDetail, TrackerRow} from './investor-tracker';

// Match the app's trackerPortfolioExport: all selected rows, never just the image's top ten.
export function portfolioDataText(data: TrackerDetail, rows: TrackerRow[], period: string): string {
  const line = (value: unknown) => String(value ?? '').replace(/\s+/g, ' ').trim();
  const fund = data.kind === 'funds';
  const number = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);
  const money = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', notation: 'compact', minimumFractionDigits: 0, maximumFractionDigits: 1});
  return [
    `${line(data.name)} — ${fund ? 'Portfolio disclosure' : 'Transaction disclosures'}`,
    ...(period ? [`${fund ? 'Quarter ending' : 'Filed in'} ${period}`] : []),
    '',
    ...(line(data.disclosure) ? [`Disclosure: ${line(data.disclosure)}`] : []),
    '',
    ...rows.map(row => [
      `$${line(row.symbol).replace(/^\$/, '')}`,
      line(row.company),
      number(row.value) ? money.format(row.value) : line(row.amount) || 'Value not disclosed',
      number(row.weight) ? `${row.weight.toFixed(1)}%` : 'Weight not disclosed',
      ...(!fund && line(row.rawAction) ? [line(row.rawAction)] : []),
    ].join(' · ')),
    '',
    'Source: StocksToBuyNow.ai',
  ].join('\n');
}

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
