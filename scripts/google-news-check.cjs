const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => module._compile(
  ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true},
  }).outputText,
  filename,
);

const {currentNewsEntries, newsSitemapXml} = require('../lib/news-sitemap.ts');
const now = Date.parse('2026-10-27T12:00:00Z');
const sample = [
  {path:'/news/new/', title:'New & useful <story>', publishedAt:'2026-10-27T11:00:00Z'},
  {path:'/news/duplicate/', title:'Older duplicate', publishedAt:'2026-10-26T11:00:00Z'},
  {path:'/news/duplicate/', title:'Newer duplicate', publishedAt:'2026-10-27T10:00:00Z'},
  {path:'/news/too-old/', title:'Too old', publishedAt:'2026-10-25T11:59:59Z'},
  {path:'/news/future/', title:'Future', publishedAt:'2026-10-27T12:06:00Z'},
  {path:'https://bad.example/', title:'Bad path', publishedAt:'2026-10-27T09:00:00Z'},
];
const current = currentNewsEntries(sample, now);
assert.deepEqual(current.map(entry => entry.path), ['/news/new/', '/news/duplicate/']);
assert.equal(current[1].title, 'Newer duplicate');
const xml = newsSitemapXml(sample, now);
assert.match(xml, /xmlns:news="http:\/\/www\.google\.com\/schemas\/sitemap-news\/0\.9"/);
assert.match(xml, /<news:name>Stocks To Buy Now AI<\/news:name>/);
assert.match(xml, /<news:language>en<\/news:language>/);
assert.match(xml, /New &amp; useful &lt;story&gt;/);
assert.doesNotMatch(xml, /Too old|Future|Bad path/);
const capped = currentNewsEntries(Array.from({length:1005}, (_, index) => ({
  path:`/news/story-${index}/`,
  title:`Story ${index}`,
  publishedAt:new Date(now - index * 1000).toISOString(),
})), now);
assert.equal(capped.length, 1000);

const page = fs.readFileSync('pages/news-sitemap.xml.tsx', 'utf8');
for (const expected of ['moverArticles', 'briefings', 'insiderArticles', 'publicArticles', 'getAllPosts', "article => !article.noActivity", "post.slug !== 'privacypolicy'"]) {
  assert.ok(page.includes(expected), `News sitemap is missing coverage guard: ${expected}`);
}
const robots = fs.readFileSync('public/robots.txt', 'utf8');
assert.match(robots, /Sitemap: https:\/\/www\.stockstobuynow\.ai\/news-sitemap\.xml/);

for (const filename of ['lib/mover-research.ts','lib/market-briefings.ts','lib/insider-news.ts','lib/public-articles.ts']) {
  const source = fs.readFileSync(filename, 'utf8');
  for (const expected of ['NewsArticle', 'NEWS_PUBLISHER', 'isAccessibleForFree:true']) {
    const normalized = source.replace(/\s+/g, '');
    assert.ok(normalized.includes(expected.replace(/\s+/g, '')), `${filename} is missing ${expected}`);
  }
}
console.log('PASS rolling 48-hour Google News sitemap, source coverage, XML escaping, discovery and NewsArticle metadata');
