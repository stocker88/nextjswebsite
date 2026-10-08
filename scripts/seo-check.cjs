const assert=require('node:assert/strict');
const fs=require('fs');
const {validateArticle}=require('./publish-public-article.cjs');
const valid={postId:'test',summary:'Public summary',paragraphs:['Evidence.','Interpretation.'],sources:[{title:'Company release',url:'https://example.com/release'}],author:{name:'Author',url:'https://example.com/author'},reviewer:'Reviewer',publishedAt:'2025-01-01T00:00:00Z',updatedAt:'2025-01-01T00:00:00Z',aiAssisted:true,disclosure:'No position.',approved:true};
assert.equal(validateArticle(valid).summary,'Public summary');
assert.throws(()=>validateArticle({...valid,approved:false}));assert.throws(()=>validateArticle({...valid,sources:[]}));assert.throws(()=>validateArticle({...valid,updatedAt:'2039-01-01'}));
assert(!fs.existsSync('public/sitemap.xml'),'Static file conflicts with dynamic sitemap');
const hub=fs.readFileSync('pages/stock-market-news/index.tsx','utf8');assert(hub.includes('.slice(0,40)'));assert(hub.includes('/stock-market-news/page/'));
assert(!fs.readFileSync('lib/research.ts','utf8').includes('data/research.json'),'Archive must stay server-side');
for(const f of ['pages/stock-market-news/index.tsx','pages/stock-market-news/[id].tsx']) assert(!/\* [37]/.test(fs.readFileSync(f,'utf8')),'Real engagement only');
const stocks=JSON.parse(fs.readFileSync('data/stocks.json','utf8'));assert.equal(new Set(stocks.map(s=>s.slug)).size,stocks.length);
console.log('SEO regression checks passed');

const config = require("../next.config");
config.redirects().then(rules => assert(rules.some(r => r.source === "/stocks-to-buy-now/:path*" && r.destination === "/stock-market-news/:path*" && r.permanent)));
