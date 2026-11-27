// Each public URL serves its saved pre-rendered HTML, including translated SEO.
async function pageResponse(request,env){
 const url=new URL(request.url);
 const match=url.pathname.match(/^\/(es|de|fr|ja|ko)\/prediction\/([a-z0-9-]+)\/(today|tomorrow|next-week|next-month|2026|2027|2028|2029|2030)\/?$/);
 if(!match)return env.ASSETS.fetch(request);
 if(!['GET','HEAD'].includes(request.method))return new Response(null,{status:405,headers:{Allow:'GET, HEAD'}});
 if(!url.pathname.endsWith('/')){url.pathname+='/';return Response.redirect(url.toString(),308);}
 const [,locale,stock,period]=match;
 const packUrl=new URL('/__localized/'+locale+'/'+stock+'.json',url.origin);
 const pack=await env.ASSETS.fetch(new Request(packUrl));
 if(pack.status!==200)return new Response(null,{status:404});
 const pages=await pack.json(),html=pages[period];
 if(typeof html!=='string')return new Response(null,{status:404});
 return new Response(request.method==='HEAD'?null:html,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'public, max-age=0, must-revalidate','X-Content-Type-Options':'nosniff'}});
}
export default {
 async fetch(request,env){
  const url=new URL(request.url);
  const match=url.pathname.match(/^\/_next\/data\/([A-Za-z0-9_-]+)\/((?:(?:es|de|fr|ja|ko)\/)?prediction)\/([a-z0-9/-]+)\.json$/);
  if(!match)return pageResponse(request,env);
  if(!['GET','HEAD'].includes(request.method))return new Response(null,{status:405,headers:{Allow:'GET, HEAD'}});
  const [,build,section,route]=match;
  if(route.split('/').some(s=>!s))return new Response(null,{status:404});
  const response=await pageResponse(new Request(new URL('/'+section+'/'+route+'/',url.origin)),env);
  if(response.status!==200)return new Response(null,{status:404});
  const html=await response.text();
  const embedded=html.match(/<script\b[^>]*\bid="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if(!embedded)return new Response(null,{status:404});
  try{
   const data=JSON.parse(embedded[1]);
   if(data.buildId!==build||!data.props?.__N_SSG)return new Response(null,{status:404});
   return new Response(request.method==='HEAD'?null:JSON.stringify(data.props),{headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'public, max-age=0, must-revalidate','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex'}});
  }catch{return new Response(null,{status:500});}
 }
};
