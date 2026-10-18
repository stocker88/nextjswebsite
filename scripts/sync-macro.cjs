// One public snapshot for the website and app. No provider key on devices.
const fs = require('node:fs');
const path = require('node:path');
const DAY = 86400000;
const SERIES = [
  ['WALCL', 'Fed balance sheet', 'Millions of USD', 'Weekly', 7],
  ['BOGMBASE', 'U.S. monetary base', 'Billions of USD', 'Monthly', 30],
  ['W068RCQ027SBEA', 'Government current expenditures', 'Billions of USD, SAAR', 'Quarterly', 30],
  ...['3MO', '2', '5', '10', '30'].map(term => ['DGS' + term, `${term === '3MO' ? '3-month' : term + '-year'} Treasury yield`, 'Percent', 'Daily', 1]),
];
const read = file => { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return null; } };
function write(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file + '.tmp', JSON.stringify(value) + '\n');
  fs.renameSync(file + '.tmp', file);
}
function parseCsv(body, id, now = Date.now()) {
  const lines = body.trim().split(/\r?\n/);
  if (!['observation_date,' + id, 'DATE,' + id].includes(lines.shift()?.replace(/^\uFEFF/, ''))) throw Error('Unexpected CSV header');
  const points = new Map();
  const today = new Date(now).toISOString().slice(0, 10);
  for (const line of lines) {
    const [date, raw] = line.split(',');
    if (!raw || raw === '.') continue; // Holiday/missing observation, never zero.
    const value = Number(raw);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || date > today || !Number.isFinite(value)) throw Error('Invalid observation');
    points.set(date, value);
  }
  const result = [...points].sort(([a], [b]) => a.localeCompare(b));
  if (result.length < 3) throw Error('Insufficient history');
  return result;
}
function mergeSeries(older, newer) {
  if (!older) return newer;
  if (older.points.at(-1)[0] > newer.points.at(-1)[0] || (older.points.at(-1)[0] === newer.points.at(-1)[0] && Date.parse(older.fetchedAt) > Date.parse(newer.fetchedAt))) return mergeSeries(newer, older);
  return { ...newer, points: [...new Map([...older.points, ...newer.points])].sort(([a], [b]) => a.localeCompare(b)) };
}
function validSnapshot(value) {
  return value?.version === 1 && value.series && SERIES.every(([id]) => {
    const item = value.series[id];
    return item?.points?.length >= 3 && Number.isFinite(Date.parse(item.fetchedAt)) && item.points.every(p => Array.isArray(p) && /^\d{4}-\d{2}-\d{2}$/.test(p[0]) && typeof p[1] === 'number' && Number.isFinite(p[1]));
  });
}
async function sync({ root = path.join(__dirname, '..'), fetcher = fetch, now = Date.now(), force = false, log = console.log } = {}) {
  const cache = path.join(root, '.cache/macro');
  const sources = [read(path.join(root, 'data/macro-series.json')), read(path.join(cache, 'snapshot.json'))].filter(validSnapshot);
  const snapshot = { version: 1, generatedAt: new Date(now).toISOString(), series: {} };
  for (const source of sources) for (const [id, value] of Object.entries(source.series)) snapshot.series[id] = mergeSeries(snapshot.series[id], value);
  // Recover published history if the ephemeral CI cache is evicted.
  try {
    const response = await fetcher('https://www.stockstobuynow.ai/data/macro-series.json', { signal: AbortSignal.timeout(12000) });
    if (response.ok) {
      const published = await response.json();
      if (validSnapshot(published)) for (const [id, value] of Object.entries(published.series)) {
        const old = snapshot.series[id];
        snapshot.series[id] = old && Date.parse(old.fetchedAt) > Date.parse(value.fetchedAt) ? mergeSeries(value, old) : mergeSeries(old, value);
      }
    }
  } catch { /* The durable checked-in baseline is also available. */ }
  const state = read(path.join(cache, 'state.json')) || {};
  const failures = [];
  const month = new Date(now).toISOString().slice(0, 7);
  for (const [id, title, units, frequency, days] of SERIES) {
    const old = snapshot.series[id];
    const status = state[id] || {};
    const full = force || !old || (status.fullMonth || old.fullMonth) !== month;
    const due = force || !old || full || now - Date.parse(old.fetchedAt) >= days * DAY;
    if (!due || (!force && status.lastAttempt && now - status.lastAttempt < 6 * 3600000)) continue;
    state[id] = { ...status, lastAttempt: now };
    try {
      const start = full ? '2000-01-01' : new Date(now - 400 * DAY).toISOString().slice(0, 10);
      const url = `https://fred.stlouisfed.org/graph/fredgraph.csv?id=${id}&cosd=${start}`;
      const response = await fetcher(url, { signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw Error(`HTTP ${response.status}`);
      const points = parseCsv(await response.text(), id, now);
      if (old && points.at(-1)[0] < old.points.at(-1)[0]) throw Error('Upstream history regressed');
      snapshot.series[id] = mergeSeries(old, {
        id, title, units, frequency,
        source: id === 'W068RCQ027SBEA' ? 'BEA via FRED' : 'Federal Reserve via FRED',
        sourceUrl: `https://fred.stlouisfed.org/series/${id}`,
        fetchedAt: new Date(now).toISOString(), fullMonth: full ? month : old.fullMonth,
        points,
      });
      state[id] = { lastAttempt: now, fullMonth: full ? month : status.fullMonth };
      log(`${id}: ${snapshot.series[id].points.length} observations; latest ${points.at(-1).join(' = ')}`);
    } catch (error) {
      failures.push(id);
      state[id].lastError = String(error.message).slice(0, 200);
      log(`${id}: retained saved history (${error.message})`);
    }
  }
  write(path.join(cache, 'state.json'), state);
  if (!validSnapshot(snapshot)) throw Error('Incomplete macro snapshot; not publishing');
  write(path.join(cache, 'snapshot.json'), snapshot);
  write(path.join(root, 'data/macro-series.json'), snapshot);
  write(path.join(root, 'public/data/macro-series.json'), snapshot);
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, 'updated=true\n');
  if (failures.length) log(`::warning::Macro refresh failed for ${failures.join(', ')}; saved observations preserved.`);
  return { snapshot, failures };
}
module.exports = { SERIES, parseCsv, mergeSeries, validSnapshot, sync };
if (require.main === module) sync({ force: process.argv.includes('--force') }).catch(error => { console.error(error.message); process.exitCode = 1; });
