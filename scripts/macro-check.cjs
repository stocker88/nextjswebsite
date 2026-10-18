const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { SERIES, parseCsv, mergeSeries, sync, validSnapshot } = require('./sync-macro.cjs');
const now = Date.parse('2026-10-18T12:00:00Z');
const points = [['2026-10-13', 4], ['2026-10-14', 4.1], ['2026-10-15', 4.2]];
const csv = id => `observation_date,${id}\n2026-10-12,.\n2026-10-13,4\n2026-10-14,4.1\n2026-10-15,4.2\n`;
assert.deepEqual(parseCsv(csv('DGS2'), 'DGS2', now), points);
assert.throws(() => parseCsv('<html>error</html>', 'DGS2', now));
assert.throws(() => parseCsv(csv('DGS2') + '2026-10-19,5\n', 'DGS2', now));
const merged = mergeSeries({points: [['2020-01-01',1], ...points]}, {points: [['2026-10-14',9], ['2026-10-15',4.3]]});
assert.equal(merged.points[0][0], '2020-01-01');
assert.equal(merged.points.at(-2)[1], 9);
async function main() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(),'macro-check-'));
  let calls = [];
  const fetcher = async url => {
    if (!url.includes('fredgraph.csv')) return {ok:false};
    const id = new URL(url).searchParams.get('id'); calls.push(id);
    return {ok:true, text:async () => csv(id)};
  };
  try {
    const first = await sync({root, fetcher, now, log:()=>{}});
    assert(validSnapshot(first.snapshot)); assert.equal(calls.length, 8);
    calls=[]; await sync({root, fetcher, now:now+3600000, log:()=>{}}); assert.equal(calls.length,0);
    calls=[]; await sync({root, fetcher, now:now+86400000, log:()=>{}}); assert.deepEqual(calls.sort(), SERIES.filter(s=>s[3]==='Daily').map(s=>s[0]).sort());
    calls=[]; await sync({root, fetcher, now:Date.parse('2026-11-01T12:00:00Z'), log:()=>{}}); assert.equal(calls.length,8);
    const failed = await sync({root, fetcher:async()=>{throw Error('offline');}, now:Date.parse('2026-11-02T12:00:00Z'), force:true,log:()=>{}});
    assert.equal(failed.failures.length,8); assert.deepEqual(failed.snapshot.series.DGS2.points,points);
    // A successful HTTP response with regressed observations cannot truncate history.
    const regressed = await sync({root, fetcher:async url => url.includes('fredgraph.csv') ? {ok:true,text:async()=>`observation_date,${new URL(url).searchParams.get('id')}\n2020-01-01,1\n2020-01-02,2\n2020-01-03,3`} : {ok:false}, now:Date.parse('2026-11-03T12:00:00Z'), force:true, log:()=>{}});
    assert.equal(regressed.failures.length,8); assert.deepEqual(regressed.snapshot.series.DGS2.points,points);
    console.log('Macro checks passed: parsing, missing observations, revisions, preservation, daily/monthly cadence, failures and regressions.');
  } finally { fs.rmSync(root,{recursive:true,force:true}); }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
