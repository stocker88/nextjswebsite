const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const out=path.resolve(process.argv[2]||'out');
const xml=require('../read-export-sitemap.cjs')(process.argv[3]||out);
const urls=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
const site='https://www.stockstobuynow.ai';
const pageFile=route=>{const normal=path.join(out,route,'index.html');return process.argv[3]&&!fs.existsSync(normal)?path.join(out,route.replace(/\/$/,'')+'.html'):normal};
for(const lang of ['en','es','de','fr','ja','ko']){
 const prefix=lang==='en'?'':'/'+lang;
 const predictionUrls=urls.filter(u=>u.startsWith(site+prefix+'/prediction/'));
 assert(predictionUrls.length>100,'Missing prediction sitemap coverage for '+lang);
 for(const route of ['/prediction/','/prediction/microsoft-stock-price-prediction/2030/','/fear-and-greed-index/','/pentagon-pizza-index/']){
  const file=pageFile(prefix+route);const html=fs.readFileSync(file,'utf8');
  assert(html.includes('<html lang="'+lang+'"'),'Wrong HTML language: '+file);
  assert(html.includes('rel="canonical" href="'+site+prefix+route+'"'),'Wrong canonical: '+file);
  assert(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html),'Page is noindex: '+file);
  assert(html.includes('hrefLang="'+lang+'"')||html.includes('hreflang="'+lang+'"'),'Missing self hreflang: '+file);
  for(const alt of ['es','de','fr','ja','ko'])assert(html.includes(site+'/'+alt+route),'Missing alternate '+alt+': '+file);
  assert(urls.includes(site+prefix+route),'Missing sitemap entry: '+file);
  const title=html.match(/<title[^>]*>(.*?)<\/title>/)?.[1];assert(title,'Missing title: '+file);
  if(lang!=='en'){const english=fs.readFileSync(pageFile(route),'utf8').match(/<title[^>]*>(.*?)<\/title>/)?.[1];assert.notEqual(title,english,'Untranslated title: '+title);}
 }
 console.log(lang+': '+predictionUrls.length+' prediction URLs; rendered language, canonical, metadata and alternates verified.');
}
