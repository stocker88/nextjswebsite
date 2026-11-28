// Server-only: compare page inputs and client assets before expensive HTML rendering.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const hash=value=>crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const normalize=file=>decodeURIComponent(file).replace(/^\/_next\//,'').replace(/^\/+/, '');
const relevant=file=>/\.(?:js|css)$/.test(file)&&!/(?:^|\/)webpack-|\/(?:_buildManifest|_ssgManifest)\.js$|(?:^|\/)polyfills-/.test(file);
function assetsFromHtml(html){return [...new Set([...html.matchAll(/(?:src|href)="(\/_next\/[^"?#]+)(?:[?#][^"]*)?"/g)].map(m=>normalize(m[1])).filter(relevant))].sort();}
function currentAssets(root,page){const m=JSON.parse(fs.readFileSync(path.join(root,'.next/build-manifest.json'),'utf8'));return [...new Set([...(m.pages['/_app']||[]),...(m.pages[page]||[])].map(normalize).filter(relevant))].sort();}
function routeFor(template,entry){if(typeof entry==='string')return entry.replace(/\/$/,'')||'/';return template.replace(/\[\[?\.\.\.([^\]]+)\]\]?|\[([^\]]+)\]/g,(_,catchall,single)=>{const value=entry.params?.[catchall||single];return (Array.isArray(value)?value:[value]).filter(x=>x!==undefined).map(x=>encodeURIComponent(x)).join('/');}).replace(/\/$/,'')||'/';}
function embedded(html){const m=html.match(/<script\b[^>]*\bid="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);return m?JSON.parse(m[1]):null;}
async function select(template,result,getProps,root=process.cwd()){
 const baseline=process.env.WEBSITE_PREVIOUS_EXPORT;if(!baseline)return result;
 const assets=currentAssets(root,template),selected=[],reused=[],valid=[];
 let sameLocale=false;
 const signatures=path.join(root,'.incremental-signatures.json'),metadata=path.join(baseline,'__deployment.json');
 if(fs.existsSync(signatures)&&fs.existsSync(metadata))sameLocale=require('./signatures.cjs').sameLanguage(JSON.parse(fs.readFileSync(signatures,'utf8')),JSON.parse(fs.readFileSync(metadata,'utf8')).signatures,template);
 for(const entry of result.paths){
  const route=routeFor(template,entry);valid.push(route);
  if(valid.length%5000===0)console.log(`Checking ${template}: ${valid.length}/${result.paths.length} page inputs`);
  const file=path.join(baseline,decodeURIComponent(route),'index.html');let old=null,html='';
  if(fs.existsSync(file)){html=fs.readFileSync(file,'utf8');try{old=embedded(html);}catch{}}
  if(!old||old.page!==template||(!sameLocale&&hash(assetsFromHtml(html))!==hash(assets))){selected.push(entry);continue;}
  // Only pageProps are compared: build IDs and router metadata belong to the release.
  const params=typeof entry==='string'?null:entry.params;
  if(!params){selected.push(entry);continue;}
  const next=await getProps({params,locale:entry.locale,locales:undefined,defaultLocale:undefined});
  if(next.notFound||next.redirect||hash(next.props)!==hash(old.props?.pageProps)){selected.push(entry);continue;}
  reused.push(route);
 }
 const dir=path.join(root,'.incremental-routes');fs.mkdirSync(dir,{recursive:true});
 fs.writeFileSync(path.join(dir,encodeURIComponent(template)+'.json'),JSON.stringify({template,valid,reused,rendered:selected.map(e=>routeFor(template,e))}));
 console.log(`Incremental ${template}: render ${selected.length}, reuse ${reused.length}, total ${valid.length}`);
 return {...result,paths:selected,fallback:false};
}
module.exports={select,routeFor,embedded,assetsFromHtml,currentAssets};
