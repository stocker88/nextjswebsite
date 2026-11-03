const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const mod = {exports: {}};
new Function('exports', ts.transpileModule(read('lib/legacy-membership-link.ts'), {
 compilerOptions: {module: ts.ModuleKind.CommonJS},
}).outputText)(mod.exports);
const {legacyMembershipDestination} = mod.exports;
for (const hash of ['#memberships', '#membership']) {
 assert.equal(legacyMembershipDestination(hash, ''), '/membership/');
 assert.equal(legacyMembershipDestination(hash, '?ref=example&utm_source=x'), '/membership/?ref=example&utm_source=x');
}
for (const hash of ['', '#product-reveal', '#how-it-works', '#watch-and-learn', '#about-aness']) {
 assert.equal(legacyMembershipDestination(hash, ''), null);
}
assert.match(read('components/DesktopProductIntro.tsx'), /href="\/membership\/">Explore membership/);
assert.match(read('pages/membership.tsx'), /MembershipStatusPage/);
assert.match(read('pages/index.tsx'), /router\.replace\(destination\)/);
assert.match(read('pages/index.tsx'), /addEventListener\('hashchange'/);
// Cover shared components and every page, including JS/TS homepage views.
function scan(dir) {
 for (const entry of fs.readdirSync(path.join(root, dir), {withFileTypes: true})) {
  const file = path.join(dir, entry.name);
  if (entry.isDirectory()) scan(file);
  else if (/\.[jt]sx?$/.test(file)) {
   assert.doesNotMatch(read(file), /(?:href\s*[=:]\s*["'])(?:\/)?#memberships?\b/, `Obsolete membership anchor in ${file}`);
  }
 }
}
for (const dir of ['components', 'pages', 'views', 'lib']) scan(dir);
console.log('Membership navigation passed: direct route, legacy hashes, preserved query, unrelated anchors, and site-wide stale-link scan.');
