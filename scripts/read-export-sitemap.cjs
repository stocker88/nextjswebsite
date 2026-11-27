const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
module.exports=function readSitemap(out){
 const index=fs.readFileSync(path.join(out,'sitemap.xml'),'utf8');
 if(!index.includes('<sitemapindex'))return index;
 const parts=[...index.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]));
 assert(parts.length>0,'Empty sitemap index');
 return parts.map(url=>{assert.equal(url.origin,'https://www.stockstobuynow.ai');assert.match(url.pathname,/^\/sitemaps\/(en|es|de|fr|ja|ko)-[1-9][0-9]*\.xml$/);const xml=fs.readFileSync(path.join(out,url.pathname),'utf8');assert(xml.includes('<urlset'),'Invalid sitemap part');assert((xml.match(/<url>/g)||[]).length<=50000);assert(Buffer.byteLength(xml)<=50*1024*1024);return xml;}).join('\n');
};
