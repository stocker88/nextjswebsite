const assert = require('node:assert/strict');
const base = process.argv[2];
if (!base || !/^https?:\/\//.test(base)) throw Error('Usage: node scripts/check-deployment.cjs https://HOST');
async function check() {
  for (const path of ['/', '/stock-market-news', '/stock-market-news/page/2', '/stocks/nvda', '/stocks-to-buy']) {
    const response = await fetch(new URL(path, base), {signal: AbortSignal.timeout(60000)});
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert(html.includes('https://www.stockstobuynow.ai' + (path === '/' ? '/' : path)), 'Canonical missing: ' + path);
    for (const match of html.matchAll(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)) JSON.parse(match[1]);
    console.log('OK', path);
  }
  for (const path of ['/stocks-to-buy-now', '/stocks-to-buy-now/page/2', '/stocks-to-buy-now/example?utm_source=test']) {
    const response = await fetch(new URL(path, base), {redirect:'manual'});
    assert.equal(response.status, 308, path);
    const target = new URL(response.headers.get('location'), base);
    assert.equal(target.pathname + target.search, path.replace('/stocks-to-buy-now', '/stock-market-news'));
    console.log('OK redirect', path);
  }
  assert.equal((await fetch(new URL('/stocks/not-a-stock', base))).status, 404);
  const sitemap = await fetch(new URL('/sitemap.xml', base));
  assert.equal(sitemap.status, 200);
  const xml = await sitemap.text();
  assert(xml.includes('/stocks/nvda</loc>'));
  assert(xml.includes('/stock-market-news</loc>'));
  assert(!xml.includes('/stocks-to-buy-now'));
  console.log('OK sitemap and 404');
}
check().catch(error => {console.error(error); process.exitCode=1;});
