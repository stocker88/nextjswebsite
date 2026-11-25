const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'out');
const config = JSON.parse(fs.readFileSync(path.join(root, 'wrangler.jsonc'), 'utf8'));
assert.equal(config.assets.directory, './out');
assert.equal(config.assets.not_found_handling, '404-page');
assert.equal(config.assets.html_handling, 'auto-trailing-slash');
assert.ok(!config.main, 'Static assets must not invoke paid Worker compute');
let files = 0, bytes = 0;
function walk(dir) {
  for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
    const p = path.join(dir, e.name);
    assert.ok(!e.isSymbolicLink(), `Unexpected symlink: ${p}`);
    if (e.isDirectory()) { walk(p); continue; }
    const size = fs.statSync(p).size;
    assert.ok(size <= 25 * 1024 * 1024, `Cloudflare asset exceeds 25 MiB: ${p}`);
    assert.ok(!/^\.env(?:\.|$)/.test(e.name), `Environment file in export: ${p}`);
    files++; bytes += size;
  }
}
walk(out);
assert.ok(files <= 100000, `Paid static asset file limit exceeded: ${files}`);
for (const p of ['index.html','404.html','robots.txt','sitemap.xml','tools/index.html'])
  assert.ok(fs.existsSync(path.join(out, p)), `Missing required asset: ${p}`);
const headers = fs.readFileSync(path.join(out, '_headers'), 'utf8');
assert.match(headers, /https:\/\/:worker\.:account\.workers\.dev\/\*\s+X-Robots-Tag: noindex/);
assert.ok(!/^\/\*\s+X-Robots-Tag: noindex/m.test(headers), 'Production must remain indexable');
console.log(JSON.stringify({files, bytes, paidAssetLimit:100000, status:'passed'}, null, 2));
