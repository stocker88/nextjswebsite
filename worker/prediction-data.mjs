// HTML remains fully static and crawlable. Reuse its exact Next navigation data.
export default {
 async fetch(request,env){
  const url=new URL(request.url);
  const match=url.pathname.match(/^\/_next\/data\/([A-Za-z0-9_-]+)\/prediction\/([a-z0-9/-]+)\.json$/);
  if(!match)return env.ASSETS.fetch(request);
  if(!['GET','HEAD'].includes(request.method))return new Response(null,{status:405,headers:{Allow:'GET, HEAD'}});
  const [,build,route]=match;
  if(route.split('/').some(s=>!s))return new Response(null,{status:404});
  const target=new URL('/prediction/'+route+'/',url.origin);
  const response=await env.ASSETS.fetch(new Request(target,{method:'GET'}));
  if(response.status!==200)return new Response(null,{status:404});
  const html=await response.text();
  const embedded=html.match(/<script\b[^>]*\bid="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if(!embedded)return new Response(null,{status:404});
  try{
   const data=JSON.parse(embedded[1]);
   // Old tabs must reload instead of mixing HTML from different deployments.
   if(data.buildId!==build||!data.props?.__N_SSG)return new Response(null,{status:404});
   return new Response(request.method==='HEAD'?null:JSON.stringify(data.props),{headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'public, max-age=0, must-revalidate','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex'}});
  }catch{return new Response(null,{status:500});}
 }
};
