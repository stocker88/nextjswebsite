const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const ts = require(root + '/node_modules/typescript');
const source = ts.transpileModule(fs.readFileSync(root + '/lib/safari-chrome.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const mod = { exports: {} };
vm.runInNewContext(source, { module: mod, exports: mod.exports });
const { usesLegacySafariChrome } = mod.exports;
const iphone = version => `Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${version} Mobile/15E148 Safari/604.1`;
const ipadDesktop = version => `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${version} Safari/605.1.15`;
const cases = [
  ['Safari 17', iphone('17.6'), 5, true],
  ['Safari 18', iphone('18.6'), 5, true],
  ['Safari 26 with frozen iOS 18 token', iphone('26.0'), 5, false],
  ['Safari 26.1 frozen iOS 18.7', iphone('26.1').replace('18_6','18_7'), 5, false],
  ['Future Safari', iphone('27.0'), 5, false],
  ['Older iPad desktop mode', ipadDesktop('18.6'), 5, true],
  ['New iPad desktop mode', ipadDesktop('26.0'), 5, false],
  ['Mac Safari', ipadDesktop('18.6'), 0, false],
  ['iPad mobile mode', iphone('18.6').replaceAll('iPhone', 'iPad'), 5, true],
  ['Chrome iOS', iphone('18.6').replace('Version/18.6', 'CriOS/140.0.0'), 5, false],
  ['Firefox iOS compatibility version', iphone('18.6') + ' FxiOS/140', 5, false],
  ['Embedded webview without Safari version', iphone('18.6').replace('Version/18.6 ', ''), 5, false],
  ['Android', 'Mozilla/5.0 (Linux; Android 16) AppleWebKit/537.36 Chrome/140.0 Mobile Safari/537.36', 5, false],
  ['Unknown browser', '', 0, false],
];
for (const [label, ua, touches, expected] of cases) {
  assert.equal(usesLegacySafariChrome(ua, touches), expected, label);
}
console.log(`PASS: ${cases.length} browser/version cases, including Safari 26 frozen OS tokens.`);
