const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020}}).outputText, f);
const {activityText, activityPath, trackerForActivity, fundActivityIds} = require('../lib/investor-activity.ts');
const snapshot = require('../public/smart-money-snapshot.json');
for (const [tracker, id] of Object.entries(fundActivityIds)) {
  assert.equal(trackerForActivity(id), tracker);
  assert.ok(snapshot.items.some(r => r.investorId === id));
  assert.equal(new URL(activityPath(tracker), 'https://example.com').searchParams.get('investor'), id);
}
assert.equal(trackerForActivity('unknown'), undefined);
const row = {...snapshot.items.find(r => r.investorId === fundActivityIds.berkshire), symbol: 'KR', company: 'Kroger', shares: 39000000, value: 2170000000, amount: null, weight: 0.72, action: 'reduced'};
const output = activityText([row]);
assert.match(output, /Berkshire Hathaway · Disclosed activity/);
assert.match(output, /\$KR Kroger · Reduced · 39,000,000 shares/);
assert.match(output, /holding · 0.72% weight/);
assert.ok(output.endsWith('Source: StocksToBuyNow.ai'));
assert.equal(output.split('\n').filter(l => l.startsWith('$')).length, 1);
assert.match(activityText([{...row, shares: null, value: null, weight: null}]), /Quantity not disclosed/);
assert.ok(!activityText([]).includes('undefined'));
console.log('Investor activity navigation and export checks passed');
