// These are click prompts, not route restrictions. Direct URLs and server HTML
// stay public; no crawler/user-agent exceptions are needed.
export function signInContentKind(path:string):'article'|'results'|null{
 const pathname=path.split(/[?#]/)[0].replace(/\/$/,'');
 if(/^\/results(?:\/[^/]+)?$/.test(pathname))return 'results';
 if(/^\/posts\/(?:privacypolicy|privacy-policy|terms|terms-of-service|termsofservice|refund|refund-policy|cancellation|purchase-terms)$/i.test(pathname))return null;
 return /^\/(?:posts|insider-news|stock-market-news|market-news|catalysts|research|stock-movers|news\/briefings|news)\/[^/]+$/.test(pathname)&&!/^\/(?:stock-market-news|insider-news)\/page$/.test(pathname)?'article':null;
}
export function contentClickDestination(href:string,origin:string,currentHref?:string,accountRequired=false):string|null{
 try{
  const target=new URL(href,origin),current=currentHref?new URL(currentHref,origin):null;
  if(target.origin!==origin||!['https:','http:'].includes(target.protocol))return null;
  // A table-of-contents link on an already-open article is not a new reader.
  if(current&&target.pathname===current.pathname&&target.search===current.search&&target.hash)return null;
  if(!accountRequired&&!signInContentKind(target.pathname))return null;
  return target.pathname+target.search;
 }catch{return null;}
}
