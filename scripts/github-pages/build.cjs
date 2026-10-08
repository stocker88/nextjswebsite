// Build a static copy of the current site; keep the Firebase/server sources intact.
const fs = require('node:fs');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const root = path.resolve(__dirname, '../..');
const stage = path.join(root, '.github-pages-build');
const ts = require('typescript');
function write(file, text) { const dest = path.join(stage, file); fs.mkdirSync(path.dirname(dest), {recursive:true}); fs.writeFileSync(dest,text); }
function replace(file, from, to) {
 const dest=path.join(stage,file); const source=fs.readFileSync(dest,'utf8');
 if(!source.includes(from)) throw new Error(`Static adapter needs updating: ${file}`);
 fs.writeFileSync(dest,source.replace(from,to));
}
function run(args) {
 const result=spawnSync(process.execPath,args,{cwd:stage,stdio:'inherit',env:{...process.env,NEXT_TELEMETRY_DISABLED:'1'}});
 if(result.status!==0) throw new Error(`Build command failed: ${args.join(' ')}`);
}
async function main(){
 fs.rmSync(stage,{recursive:true,force:true}); fs.mkdirSync(stage);
 const ignored = new Set(['.git','.next','node_modules','out','.github-pages-build','.DS_Store']);
 for(const entry of fs.readdirSync(root)) {
  if(ignored.has(entry)||entry.startsWith('.env')||entry.endsWith('.tsbuildinfo'))continue;
  fs.cpSync(path.join(root,entry),path.join(stage,entry),{recursive:true});
 }
 fs.symlinkSync(path.join(root,'node_modules'),path.join(stage,'node_modules'),'dir');
 // Fetch once. Every generated page uses the same archive and timestamps.
 if(!process.argv.includes('--snapshot'))run(['scripts/sync-research.js']);
 write('lib/research-server.ts',`import data from '../data/research.json';\nimport type {ResearchPreview} from './research';\nexport async function fetchResearch():Promise<ResearchPreview[]>{return data as ResearchPreview[];}\n`);
 write('next.config.js',`module.exports={output:'export',trailingSlash:true,poweredByHeader:false,images:{unoptimized:true},experimental:{cpus:2}};\n`);
 replace('pages/stock-market-news/[id].tsx','return { paths: [], fallback: "blocking" };',`const items = await fetchResearch(); return {paths:items.map(item=>({params:{id:decodeURIComponent(researchUrl(item.id,item.title).split('/').pop()!)}})),fallback:false};`);
 replace('pages/stock-market-news/page/[page].tsx',"export function getStaticPaths() {return {paths:[],fallback:'blocking'};}","export async function getStaticPaths() {const all=await fetchResearch();return {paths:Array.from({length:Math.max(0,Math.ceil(all.length/40)-1)},(_,i)=>({params:{page:String(i+2)}})),fallback:false};}");
 replace('pages/instruments/[symbol].tsx',"return {paths:[],fallback:'blocking'};","return {paths:catalog.map(item=>({params:{symbol:item.symbol}})),fallback:false};");
 replace('pages/web-app/financial/[ticker].tsx','fallback: true,','fallback: false,');
 // ISR has no runtime on Pages. Rebuilds publish refreshed HTML instead.
 function staticPages(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())staticPages(file);else if(/\.[jt]sx?$/.test(entry.name)){fs.writeFileSync(file,fs.readFileSync(file,'utf8').replace(/\brevalidate:\s*\d+\s*,?/g,''));}}}
 staticPages(path.join(stage,'pages'));
 // Stock directory: crawlable static pagination, browser-side query filtering.
 replace('pages/stocks/index.tsx',"import fs from 'fs';", "import fs from 'fs';\nimport {useRouter} from 'next/router';");
 const stockFile=path.join(stage,'pages/stocks/index.tsx');
 let stocks=fs.readFileSync(stockFile,'utf8');
 const start=stocks.indexOf('export default function Stocks('), end=stocks.indexOf(' const url=',start);
 if(start<0||end<0)throw new Error('Stock directory adapter needs updating');
 stocks=stocks.slice(0,start)+`export default function Stocks({items:initialItems,total:initialTotal,page:initialPage,count,logos}:any) {
 const router=useRouter();
 const query=router.isReady&&typeof router.query.q==='string'?router.query.q.slice(0,100):'';
 const requestedPage=Number(router.query.page||initialPage);
 const matching=query?searchCatalog(query):null;
 const total=matching?matching.length:initialTotal;
 const page=query?Math.max(1,Math.min(Number.isSafeInteger(requestedPage)?requestedPage:1,Math.max(1,Math.ceil(total/SIZE)))):initialPage;
 const items=matching?matching.slice((page-1)*SIZE,page*SIZE).map(i=>({...i,logo:logos[i.symbol]||null})):initialItems;
`+stocks.slice(end);
 stocks=stocks.replace("const url=(n:number)=>'/stocks?'+new URLSearchParams({...query?{q:query}:{},page:String(n)});", "const url=(n:number)=>query?'/stocks?'+new URLSearchParams({q:query,page:String(n)}):(n===1?'/stocks':`/stocks/page/${n}`);");
 stocks=stocks.replace('`/stocks?page=${page}`','`/stocks/page/${page}`');
 stocks=stocks.slice(0,stocks.indexOf('export function getServerSideProps'))+`export function getStaticProps({params}:any){
 const page=Number(params?.page||1);const all=searchCatalog('');
 const logos=Object.fromEntries(catalog.map(i=>[i.symbol,fs.existsSync(path.join(process.cwd(),'public/assets/logo',i.symbol+'.webp'))?'/assets/logo/'+encodeURIComponent(i.symbol)+'.webp':null]));
 return {props:{items:all.slice((page-1)*SIZE,page*SIZE).map(i=>({...i,logo:logos[i.symbol]})),total:all.length,page,count:catalog.length,logos}};
}\n`;
 fs.writeFileSync(stockFile,stocks);
 write('pages/stocks/page/[page].tsx',`export {default,getStaticProps} from '../index';\nimport {catalog} from '../../../lib/catalog';\nexport function getStaticPaths(){return {paths:Array.from({length:Math.ceil(catalog.length/48)-1},(_,i)=>({params:{page:String(i+2)}})),fallback:false};}\n`);
 // Reuse the canonical server sitemap generator at build time.
 replace('pages/sitemap.xml.tsx','`/stocks?page=${page}`','`/stocks/page/${page}`');
 require.extensions['.ts']=require.extensions['.tsx']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.React,esModuleInterop:true}}).outputText,filename);
 process.chdir(stage);
 await require(path.join(stage,'pages/sitemap.xml.tsx')).getServerSideProps({res:{setHeader(){},end(xml){write('public/sitemap.xml',xml);}}});
 fs.unlinkSync(path.join(stage,'pages/sitemap.xml.tsx'));
 run([path.join(root,'node_modules/next/dist/bin/next'),'build']);
 // Pages cannot send HTTP 301s. Preserve old URLs with canonical HTML redirects.
 const {researchUrl}=require(path.join(stage,'lib/research.ts'));
 const articles=require(path.join(stage,'data/research.json'));
 const escape=s=>s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
 function redirect(from,to){
  const dest=path.join(stage,'out',from,'index.html');fs.mkdirSync(path.dirname(dest),{recursive:true});
  fs.writeFileSync(dest,`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><link rel="canonical" href="https://www.stockstobuynow.ai${escape(to)}"><meta http-equiv="refresh" content="0;url=${escape(to)}"><title>Page moved</title></head><body><a href="${escape(to)}">Continue to Stock Market News</a></body></html>`);
 }
 redirect('stocks-to-buy-now','/stock-market-news/');
 for(const item of articles){const target=researchUrl(item.id,item.title)+'/';redirect('stocks-to-buy-now/'+item.id,target);redirect('stock-market-news/'+item.id,target);}
 for(const stock of require(path.join(stage,'data/stocks.json')))redirect('web-app/financial/'+stock.ticker,'/stocks/'+stock.slug+'/');
 write('out/.nojekyll','');
 const out=path.join(root,'out');fs.rmSync(out,{recursive:true,force:true});fs.cpSync(path.join(stage,'out'),out,{recursive:true});
 console.log('GitHub Pages artifact ready in out/');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
