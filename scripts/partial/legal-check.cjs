const assert=require('node:assert/strict');
(async()=>{
 const worker=(await import('../../worker/legal.mjs')).default,previous=global.fetch;
 const base='<sitemapindex><sitemap><loc>https://www.stockstobuynow.ai/sitemaps/en-1.xml</loc></sitemap></sitemapindex>';
 global.fetch=async()=>new Response(base,{headers:{etag:'old','content-type':'application/xml'}});
 const env={ASSETS:{fetch:async()=>new Response('legal asset')}};
 const response=await worker.fetch(new Request('https://www.stockstobuynow.ai/sitemap.xml'),env),xml=await response.text();
 assert(xml.includes('/sitemaps/en-1.xml'));assert.equal((xml.match(/sitemaps\/legal.xml/g)||[]).length,1);assert.equal(response.headers.get('etag'),null);
 assert.equal(await (await worker.fetch(new Request('https://www.stockstobuynow.ai/legal/'),env)).text(),'legal asset');
 assert.equal(await (await worker.fetch(new Request('https://www.stockstobuynow.ai/unrelated/'),env)).text(),base);
 global.fetch=previous;console.log('PASS isolated legal routing, original sitemap preservation, no unrelated page replacement');
})().catch(e=>{console.error(e);process.exitCode=1});
