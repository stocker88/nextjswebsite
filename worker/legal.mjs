const origin='https://www.stockstobuynow.ai';
export default {async fetch(request,env){
 const url=new URL(request.url);
 if(url.pathname==='/sitemap.xml'){
  // Route fetch continues to the existing origin, retaining its current sitemap.
  const response=await fetch(request);if(response.status!==200)return response;
  let xml=await response.text();const legal=origin+'/sitemaps/legal.xml';
  if(xml.includes('</sitemapindex>')){if(!xml.includes('<loc>'+legal+'</loc>'))xml=xml.replace('</sitemapindex>','<sitemap><loc>'+legal+'</loc></sitemap></sitemapindex>');}
  else if(xml.includes('</urlset>')){const extra=await env.ASSETS.fetch(new Request(origin+'/sitemaps/legal.xml'));const entries=[...(await extra.text()).matchAll(/<url>.*?<\/url>/g)].map(m=>m[0]).filter(entry=>!xml.includes(entry.match(/<loc>(.*?)<\/loc>/)[1]));xml=xml.replace('</urlset>',entries.join('')+'</urlset>');}
  else return new Response(xml,{status:response.status,headers:response.headers});
  const headers=new Headers(response.headers);for(const name of ['content-length','content-encoding','etag','last-modified'])headers.delete(name);headers.set('Content-Type','application/xml; charset=utf-8');headers.set('Cache-Control','public, max-age=0, must-revalidate');return new Response(request.method==='HEAD'?null:xml,{headers});
 }
 if(url.pathname==='/legal'||url.pathname.startsWith('/legal/')||url.pathname.startsWith('/_legal-assets/')||url.pathname==='/sitemaps/legal.xml')return env.ASSETS.fetch(request);
 return fetch(request);
}};
