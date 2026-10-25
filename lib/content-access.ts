// Public previews stay accessible. The archive and full article readers ask for sign-in.
export function signInContentKind(path:string):'article'|'results'|null{
 const pathname=path.split(/[?#]/)[0].replace(/\/$/,'');
 if(pathname==='/results')return 'results';
 return /^\/(?:stock-market-news|market-news|catalysts|research|stock-movers|news\/briefings|news)\/[^/]+$/.test(pathname)&&!/^\/stock-market-news\/page$/.test(pathname)?'article':null;
}
