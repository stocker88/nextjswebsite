const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,f);
const {publicInvestors,investorPath}=require('../lib/public-investors.ts');
const sitemap=fs.readFileSync('out/sitemap.xml','utf8');
assert.equal(publicInvestors.length,10);
for(const p of publicInvestors){
 const route=investorPath(p.id),html=fs.readFileSync('out'+route+'index.html','utf8');
 assert.ok(sitemap.includes('https://www.stockstobuynow.ai'+route),route+' missing sitemap entry');
 assert.ok(html.includes('rel="canonical" href="https://www.stockstobuynow.ai'+route+'"'));
 assert.ok(html.includes('content="index,follow"'));
 const snapshot=JSON.parse(fs.readFileSync('public/investor-tracker/'+p.id+'.json','utf8'));
 assert.ok(snapshot.rows.length>0);assert.ok(html.includes(snapshot.rows[0].symbol),'Missing server-rendered stock');
 assert.ok(!html.includes('http-equiv="refresh"'),'Unexpected redirect');
 assert.equal(snapshot.following,undefined);assert.equal(snapshot.uid,undefined);
}
console.log('PASS all 10 public investor HTML pages, canonical URLs, sitemap entries and saved filings');
